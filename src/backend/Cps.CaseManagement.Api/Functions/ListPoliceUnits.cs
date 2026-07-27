namespace Cps.CaseManagement.Api.Functions;

using System.Net;
using Cps.CaseManagement.Api.Attributes;
using Cps.CaseManagement.Api.Constants;
using Cps.CaseManagement.Api.Context;
using Cps.CaseManagement.Api.Services;
using Cps.CaseManagement.MdsClient.Factories;
using Cps.CaseManagement.MdsClient.Models.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;

public class ListPoliceUnits(
  IMdsService mdsService,
  IMdsArgFactory mdsArgFactory)
{
  private readonly IMdsService _mdsService = mdsService;
  private readonly IMdsArgFactory _mdsArgFactory = mdsArgFactory;

  [Function(nameof(ListPoliceUnits))]
  [OpenApiOperation(operationId: nameof(ListPoliceUnits), tags: ["MDS"], Description = "Gets the list of Police units from CMS.")]
  [CmsAuthValuesAuth]
  [BearerTokenAuth]
  [OpenApiParameter(name: HttpHeaderKeys.CorrelationId, In = Microsoft.OpenApi.Models.ParameterLocation.Header, Required = true, Type = typeof(string), Description = "Correlation identifier for tracking the request.")]
  [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: ContentType.ApplicationJson, bodyType: typeof(PoliceUnitEntity[]), Description = ApiResponseDescriptions.Success)]
  [OpenApiResponseWithBody(statusCode: HttpStatusCode.BadRequest, contentType: ContentType.TextPlain, typeof(string), Description = ApiResponseDescriptions.BadRequest)]
  [OpenApiResponseWithBody(statusCode: HttpStatusCode.Unauthorized, contentType: ContentType.TextPlain, typeof(string), Description = ApiResponseDescriptions.Unauthorized)]
  [OpenApiResponseWithBody(statusCode: HttpStatusCode.Forbidden, contentType: ContentType.TextPlain, typeof(string), Description = ApiResponseDescriptions.Forbidden)]
  [OpenApiResponseWithBody(statusCode: HttpStatusCode.InternalServerError, contentType: ContentType.TextPlain, typeof(string), Description = ApiResponseDescriptions.InternalServerError)]
  public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v1/police-units")] HttpRequest req, FunctionContext functionContext)
  {
    var context = functionContext.GetRequestContext();

    var result = await _mdsService.GetPoliceUnitsAsync(_mdsArgFactory.CreateBaseArg(context.CmsAuthValues, context.CorrelationId));

    return new OkObjectResult(result);
  }
}