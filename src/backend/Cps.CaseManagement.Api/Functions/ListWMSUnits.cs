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

public class ListWMSUnits(
  IMdsService mdsService,
  IMdsArgFactory mdsArgFactory)
{
    private readonly IMdsService _mdsService = mdsService;
    private readonly IMdsArgFactory _mdsArgFactory = mdsArgFactory;
    private const string IsWcuQueryParameter = "IsWCU";

    [Function(nameof(ListWMSUnits))]
    [OpenApiOperation(operationId: nameof(ListWMSUnits), tags: ["MDS"], Description = "Gets the list of WMS units from CMS.")]
    [CmsAuthValuesAuth]
    [BearerTokenAuth]
    [OpenApiParameter(name: IsWcuQueryParameter, In = Microsoft.OpenApi.Models.ParameterLocation.Query, Required = false, Type = typeof(bool), Description = "Filter WMS units by WCU flag. If not provided, returns all WMS units.")]
    [OpenApiParameter(name: HttpHeaderKeys.CorrelationId, In = Microsoft.OpenApi.Models.ParameterLocation.Header, Required = true, Type = typeof(string), Description = "Correlation identifier for tracking the request.")]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: ContentType.ApplicationJson, bodyType: typeof(WMSUnitEntity[]), Description = ApiResponseDescriptions.Success)]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.BadRequest, contentType: ContentType.TextPlain, typeof(string), Description = ApiResponseDescriptions.BadRequest)]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.Unauthorized, contentType: ContentType.TextPlain, typeof(string), Description = ApiResponseDescriptions.Unauthorized)]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.Forbidden, contentType: ContentType.TextPlain, typeof(string), Description = ApiResponseDescriptions.Forbidden)]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.InternalServerError, contentType: ContentType.TextPlain, typeof(string), Description = ApiResponseDescriptions.InternalServerError)]
    public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v1/wms-units")] HttpRequest req, FunctionContext functionContext)
    {
        var context = functionContext.GetRequestContext();

        bool? isWCU = null;
        if (req.Query.TryGetValue(IsWcuQueryParameter, out var isWcuValue) &&
            bool.TryParse(isWcuValue.FirstOrDefault(), out var parsed))
        {
            isWCU = parsed;
        }

        var result = await _mdsService.GetWMSUnitsAsync(_mdsArgFactory.CreateBaseArg(context.CmsAuthValues, context.CorrelationId), isWCU);

        return new OkObjectResult(result);
    }
}
