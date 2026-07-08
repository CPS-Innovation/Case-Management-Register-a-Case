using System.Net;
using System.Net.Http.Headers;
using Cps.CaseManagement.MdsClient.Factories;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Http.Resilience;
using Microsoft.Extensions.Options;
using Polly;

namespace Cps.CaseManagement.MdsClient.Extensions;

public static class IServiceCollectionExtension
{
    private const int RetryAttempts = 1;
    private const int FirstRetryDelaySeconds = 1;

    public static void AddMdsClient(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<MdsOptions>(configuration.GetSection(nameof(MdsOptions)));
        services.AddHttpClient<MdsClient.Client.IMdsClient, MdsClient.Client.MdsClient>(AddMdsClient)
          .SetHandlerLifetime(TimeSpan.FromMinutes(5))
          .AddResilienceHandler("mds-retry", ConfigureRetryHandler);
        services.AddTransient<IMdsRequestFactory, MdsRequestFactory>();
        services.AddTransient<IMdsArgFactory, MdsArgFactory>();

    }

    internal static void AddMdsClient(IServiceProvider configuration, HttpClient client)
    {
        var opts = configuration.GetService<IOptions<MdsOptions>>()?.Value ?? throw new ArgumentNullException(nameof(MdsOptions));
        client.BaseAddress = new Uri(opts.BaseUrl);
        client.DefaultRequestHeaders.Add(MdsOptions.FunctionKey, opts.AccessKey);
        client.DefaultRequestHeaders.CacheControl = new CacheControlHeaderValue { NoCache = true };

        if (opts.BaseUrl.Contains(MdsOptions.DevtunnelUrlFragment) && !string.IsNullOrWhiteSpace(MdsOptions.DevtunnelTokenKey))
        {
            client.DefaultRequestHeaders.Add(MdsOptions.DevtunnelTokenKey, opts.DevtunnelToken);
        }
    }

    private static void ConfigureRetryHandler(ResiliencePipelineBuilder<HttpResponseMessage> builder)
    {
        // Exponential backoff with jitter uses Polly's DecorrelatedJitterBackoffV2 algorithm.
        // https://www.pollydocs.org/strategies/retry.html
        builder.AddRetry(new HttpRetryStrategyOptions
        {
            MaxRetryAttempts = RetryAttempts,
            Delay = TimeSpan.FromSeconds(FirstRetryDelaySeconds),
            BackoffType = DelayBackoffType.Exponential,
            UseJitter = true,
            ShouldHandle = args => ValueTask.FromResult(ShouldRetry(args.Outcome.Result))
        });
    }

    private static bool ShouldRetry(HttpResponseMessage? response)
    {
        if (response is null)
        {
            return false;
        }

        var responseStatusCodeMatch =
            response.StatusCode >= HttpStatusCode.InternalServerError
            || response.StatusCode == HttpStatusCode.NotFound;

        var methodMatch =
            response.RequestMessage?.Method != HttpMethod.Post
            && response.RequestMessage?.Method != HttpMethod.Put;

        return responseStatusCodeMatch && methodMatch;
    }
}