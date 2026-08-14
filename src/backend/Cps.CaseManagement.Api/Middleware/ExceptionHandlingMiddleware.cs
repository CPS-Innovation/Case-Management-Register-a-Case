using System.Net;
using Cps.CaseManagement.Api.Context;
using Cps.CaseManagement.Api.Exceptions;
using Cps.CaseManagement.MdsClient.Exceptions;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.Functions.Worker.Middleware;
using Microsoft.Extensions.Logging;

namespace Cps.CaseManagement.Api.Middleware;

public class ExceptionHandlingMiddleware : IFunctionsWorkerMiddleware
{
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(ILogger<ExceptionHandlingMiddleware> logger)
    {
        _logger = logger;
    }

    public async Task Invoke(FunctionContext context, FunctionExecutionDelegate next)
    {
        try
        {
            await next(context);
        }
        catch (Exception exception)
        {
            var statusCode = exception switch
            {
                ArgumentNullException or BadRequestException _ => HttpStatusCode.BadRequest,
                CmsUnauthorizedException or CpsAuthenticationException or CmsAuthValuesException _ => HttpStatusCode.Unauthorized,
                MdsClientException mds => mds.StatusCode,
                _ => HttpStatusCode.InternalServerError,
            };

            var httpRequestData = await context.GetHttpRequestDataAsync();

            if (httpRequestData != null)
            {
                var correlationId = Guid.NewGuid();
                try
                {
                    correlationId = context.GetRequestContext().CorrelationId;
                }
                catch
                {
                    _logger.LogTrace("Using fallback CorrelationId: {CorrelationId}", correlationId);
                }

                _logger.LogError(exception, "Unhandled exception. CorrelationId: {CorrelationId}", correlationId);

                var response = httpRequestData.CreateResponse(statusCode);
                await response.WriteAsJsonAsync(new
                {
                    ErrorMessage = "An unexpected error occurred. Please contact support with the CorrelationId.",
                    CorrelationId = correlationId
                });

                var invocationResult = context.GetInvocationResult();
                var httpOutputBinding = GetHttpOutputBindingFromMultipleOutputBinding(context);

                if (httpOutputBinding is not null)
                {
                    httpOutputBinding.Value = response;
                }
                else
                {
                    invocationResult.Value = response;
                }
            }
            else
            {
                // If no HTTP request context exists, still log safely
                _logger.LogError(exception, "Unhandled exception outside HTTP context.");
            }
        }
    }

    private static OutputBindingData<HttpResponseData>? GetHttpOutputBindingFromMultipleOutputBinding(FunctionContext context)
    {
        // The output binding entry name will be "$return" only when the function return type is HttpResponseData
        return context.GetOutputBindings<HttpResponseData>()
            .FirstOrDefault(b => b.BindingType == "http" && b.Name != "$return");
    }
}
