using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.Functions.Worker.Middleware;
using Cps.CaseManagement.Api.Constants;
using Cps.CaseManagement.Api.Context;
using Cps.CaseManagement.Api.Exceptions;
using Cps.CaseManagement.Api.Helpers;
using Cps.CaseManagement.Api.Validators;

namespace Cps.CaseManagement.Api.Middleware;

public sealed partial class RequestValidationMiddleware(IAuthorizationValidator authorizationValidator) : IFunctionsWorkerMiddleware
{
    private readonly string[] _unauthenticatedRoutes = ["/api/status", "/api/tactical/login", "/api/swagger/ui", "/api/swagger.json", "/api/v1/init"];

    public async Task Invoke(FunctionContext context, FunctionExecutionDelegate next)
    {
        var httpRequestData = await context.GetHttpRequestDataAsync() ?? throw new ArgumentNullException(nameof(context), "Context does not contains HttpRequestData");

        // Only block Swagger in production
        if (RouteBlockerHelper.IsProduction && RouteBlockerHelper.IsBlockedRoute(httpRequestData.Url.AbsolutePath))
        {
            var response = httpRequestData.CreateResponse(HttpStatusCode.NotFound);
            await response.WriteStringAsync("Not Found");
            context.GetInvocationResult().Value = response;
            return;
        }

        var correlationId = EstablishCorrelation(httpRequestData);
        var cmsAuthValues = EstablishCmsAuthValues(httpRequestData);
        var (isAuthenticated, username) = await Authenticate(httpRequestData);

        context.SetRequestContext(correlationId, cmsAuthValues, username);

        if (!isAuthenticated && !_unauthenticatedRoutes.Contains(httpRequestData.Url.AbsolutePath))
        {
            throw new CpsAuthenticationException();
        }

        await next(context);
    }

    private static Guid EstablishCorrelation(HttpRequestData httpRequestData)
    {
        if (httpRequestData.Headers.TryGetValues(HttpHeaderKeys.CorrelationId, out var correlationIds)
            && correlationIds.Any()
            && Guid.TryParse(correlationIds.First(), out var parsedCorrelationId))
        {
            return parsedCorrelationId;
        }

        return Guid.Empty;
    }

    private static string? EstablishCmsAuthValues(HttpRequestData httpRequestData)
    {
        var cmsAuthValues = httpRequestData.Cookies.FirstOrDefault(cookie => cookie.Name == HttpHeaderKeys.CmsAuthValues);
        return cmsAuthValues?.Value;
    }

    private async Task<(bool, string?)> Authenticate(HttpRequestData req)
    {
        try
        {
            if (!req.Headers.TryGetValues(HttpHeaderKeys.Authorization, out var accessTokenValues) ||
                string.IsNullOrWhiteSpace(accessTokenValues.First()))
            {
                return (false, null);
            }

            var validateTokenResult = await authorizationValidator.ValidateTokenAsync(accessTokenValues.First(), "user_impersonation");

            if (validateTokenResult == null || validateTokenResult.Username == null)
            {
                return (false, null);
            }

            return validateTokenResult.IsValid
                ? (true, validateTokenResult.Username)
                : (false, null);
        }
        catch (Exception)
        {
            throw new CpsAuthenticationException();
        }
    }
}