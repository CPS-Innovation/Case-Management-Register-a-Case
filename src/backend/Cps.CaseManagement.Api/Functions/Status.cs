using System.Net;
using System.Reflection;
using Cps.CaseManagement.Api.Constants;
using Cps.CaseManagement.Api.Extensions;
using Cps.CaseManagement.Api.Models.Domain;
using Cps.CaseManagement.Api.OpenApi.Filters;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;

namespace Cps.CaseManagement.Api.Functions;

public static class Status
{
    [Function(nameof(Status))]
    [OpenApiOperation(operationId: nameof(Status), tags: ["Health"], Description = "Gets the current status of the function app.")]
    [OpenApiNoSecurity]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: ContentType.ApplicationJson, bodyType: typeof(AssemblyStatus), Description = ApiResponseDescriptions.Success)]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.BadRequest, contentType: ContentType.TextPlain, typeof(string), Description = ApiResponseDescriptions.BadRequest)]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.InternalServerError, contentType: ContentType.TextPlain, typeof(string), Description = ApiResponseDescriptions.InternalServerError)]
    public static IActionResult Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "status")] HttpRequest req)
    {
        return Assembly.GetExecutingAssembly().CurrentStatus();
    }
}
