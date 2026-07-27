namespace Cps.CaseManagement.Api.Functions;

using System.Net;
using Cps.CaseManagement.Api.Attributes;
using Cps.CaseManagement.Api.Constants;
using Cps.CaseManagement.Api.Context;
using Cps.CaseManagement.Api.Services;
using Cps.CaseManagement.MdsClient.Factories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;

public class GetUrnExists(
  IMdsService mdsService,
  IMdsArgFactory mdsArgFactory)
{
  private readonly IMdsService _mdsService = mdsService;
  private readonly IMdsArgFactory _mdsArgFactory = mdsArgFactory;

  [Function(nameof(GetUrnExists))]
  [OpenApiOperation(operationId: nameof(GetUrnExists), tags: ["MDS"], Description = "Check if a URN exists.")]
  [CmsAuthValuesAuth]
  [BearerTokenAuth]
  [OpenApiParameter(name: "urn", In = Microsoft.OpenApi.Models.ParameterLocation.Path, Required = true, Type = typeof(string), Description = "The URN to check for existence.")]
  [OpenApiParameter(name: HttpHeaderKeys.CorrelationId, In = Microsoft.OpenApi.Models.ParameterLocation.Header, Required = true, Type = typeof(string), Description = "Correlation identifier for tracking the request.")]
  [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: ContentType.ApplicationJson, bodyType: typeof(bool), Description = ApiResponseDescriptions.Success)]
  [OpenApiResponseWithBody(statusCode: HttpStatusCode.BadRequest, contentType: ContentType.TextPlain, typeof(string), Description = ApiResponseDescriptions.BadRequest)]
  [OpenApiResponseWithBody(statusCode: HttpStatusCode.Unauthorized, contentType: ContentType.TextPlain, typeof(string), Description = ApiResponseDescriptions.Unauthorized)]
  [OpenApiResponseWithBody(statusCode: HttpStatusCode.Forbidden, contentType: ContentType.TextPlain, typeof(string), Description = ApiResponseDescriptions.Forbidden)]
  [OpenApiResponseWithBody(statusCode: HttpStatusCode.InternalServerError, contentType: ContentType.TextPlain, typeof(string), Description = ApiResponseDescriptions.InternalServerError)]
  public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v1/urns/{urn}/exists")] HttpRequest req, FunctionContext functionContext, string urn)
  {
    var context = functionContext.GetRequestContext();

    var arg = _mdsArgFactory.CreateGetByUrnArg(context.CmsAuthValues, context.CorrelationId, urn);

    var result = await _mdsService.ListCasesByUrnAsync(arg);

    var isExistingUrn = result != null && result.Any();

    return new OkObjectResult(isExistingUrn);
  }
}