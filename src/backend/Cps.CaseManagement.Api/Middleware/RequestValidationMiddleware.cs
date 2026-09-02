using System.Net;
using Cps.CaseManagement.Api.Constants;
using Cps.CaseManagement.Api.Context;
using Cps.CaseManagement.Api.Exceptions;
using Cps.CaseManagement.Api.Helpers;
using Cps.CaseManagement.Api.Validators;
using Cps.CaseManagement.Infrastructure.Telemetry;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.Functions.Worker.Middleware;

namespace Cps.CaseManagement.Api.Middleware;

public sealed partial class RequestValidationMiddleware(IAuthorizationValidator authorizationValidator) : IFunctionsWorkerMiddleware
{
    private readonly string[] _unauthenticatedRoutes = ["/api/status", "/api/tactical/login", "/api/swagger/ui", "/api/swagger.json", "/api/v1/init"];
    private readonly string[] _cmsAuthOptionalRoutes = ["/api/v1/telemetry"];

    public async Task Invoke(FunctionContext context, FunctionExecutionDelegate next)
    {
        var httpRequestData = await context.GetHttpRequestDataAsync() ?? throw new ArgumentNullException(nameof(context), "Context does not contains HttpRequestData");

        // Only block Swagger in production
        if (RouteBlockerHelper.IsProduction && RouteBlockerHelper.IsBlockedRoute(httpRequestData.Url.AbsolutePath))
        {
            var response = httpRequestData.CreateResponse(HttpStatusCode.NotFound);
            await response.WriteStringAsync("Not Found", context.CancellationToken);
            context.GetInvocationResult().Value = response;
            return;
        }

        var path = httpRequestData.Url.AbsolutePath;
        var isUnauthenticatedRoute = _unauthenticatedRoutes.Contains(path);
        var requiresCmsAuth = !isUnauthenticatedRoute && !_cmsAuthOptionalRoutes.Contains(path);

        var correlationId = EstablishCorrelation(httpRequestData, requireNonEmpty: !isUnauthenticatedRoute);
        var cmsAuthValues = EstablishCmsAuthValues(httpRequestData);

        if (requiresCmsAuth)
        {
            CmsAuthValuesValidator.Validate(cmsAuthValues);
        }

        var (isAuthenticated, username) = await Authenticate(httpRequestData);

        context.SetRequestContext(correlationId, cmsAuthValues, username);
        TelemetryRequestContext.Set(username, correlationId);

        try
        {
            if (!isAuthenticated && !isUnauthenticatedRoute)
            {
                throw new CpsAuthenticationException();
            }

            await next(context);
        }
        finally
        {
            TelemetryRequestContext.Clear();
        }
    }

    private static Guid EstablishCorrelation(HttpRequestData httpRequestData, bool requireNonEmpty)
    {
        if (httpRequestData.Headers.TryGetValues(HttpHeaderKeys.CorrelationId, out var correlationIds)
            && correlationIds.Any()
            && Guid.TryParse(correlationIds.First(), out var parsedCorrelationId)
            && parsedCorrelationId != Guid.Empty)
        {
            return parsedCorrelationId;
        }

        if (requireNonEmpty)
        {
            throw new BadRequestException("Correlation-Id header is required and must be a non-empty GUID.", HttpHeaderKeys.CorrelationId);
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
