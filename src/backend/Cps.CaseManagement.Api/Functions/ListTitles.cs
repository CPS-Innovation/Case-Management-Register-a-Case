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

public class ListTitles(
  IMdsService mdsService,
  IMdsArgFactory mdsArgFactory)
{
  private readonly IMdsService _mdsService = mdsService;
  private readonly IMdsArgFactory _mdsArgFactory = mdsArgFactory;
  private const string IsPoliceTitleQueryParameter = "isPoliceTitle";

  [Function(nameof(ListTitles))]
  [OpenApiOperation(operationId: nameof(ListTitles), tags: ["MDS"], Description = "Gets the list of titles from CMS.")]
  [CmsAuthValuesAuth]
  [BearerTokenAuth]
  [OpenApiParameter(name: HttpHeaderKeys.CorrelationId, In = Microsoft.OpenApi.Models.ParameterLocation.Header, Required = true, Type = typeof(string), Description = "Correlation identifier for tracking the request.")]
  [OpenApiParameter(name: IsPoliceTitleQueryParameter, In = Microsoft.OpenApi.Models.ParameterLocation.Query, Required = false, Type = typeof(bool), Description = "Filter titles by police title flag. If not provided, returns all titles.")]
  [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: ContentType.ApplicationJson, bodyType: typeof(TitleEntity[]), Description = ApiResponseDescriptions.Success)]
  [OpenApiResponseWithBody(statusCode: HttpStatusCode.BadRequest, contentType: ContentType.TextPlain, typeof(string), Description = ApiResponseDescriptions.BadRequest)]
  [OpenApiResponseWithBody(statusCode: HttpStatusCode.Unauthorized, contentType: ContentType.TextPlain, typeof(string), Description = ApiResponseDescriptions.Unauthorized)]
  [OpenApiResponseWithBody(statusCode: HttpStatusCode.Forbidden, contentType: ContentType.TextPlain, typeof(string), Description = ApiResponseDescriptions.Forbidden)]
  [OpenApiResponseWithBody(statusCode: HttpStatusCode.InternalServerError, contentType: ContentType.TextPlain, typeof(string), Description = ApiResponseDescriptions.InternalServerError)]
  public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v1/titles")] HttpRequest req, FunctionContext functionContext)
  {
    var context = functionContext.GetRequestContext();

    bool? isPoliceTitle = null;
    if (req.Query.TryGetValue(IsPoliceTitleQueryParameter, out var policeTitleValue) &&
        bool.TryParse(policeTitleValue.FirstOrDefault(), out var parsed))
    {
      isPoliceTitle = parsed;
    }

    var result = await _mdsService.GetTitlesAsync(_mdsArgFactory.CreateBaseArg(context.CmsAuthValues, context.CorrelationId), isPoliceTitle);

    return new OkObjectResult(result);
  }
}