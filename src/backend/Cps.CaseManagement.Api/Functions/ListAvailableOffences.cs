namespace Cps.CaseManagement.Api.Functions;

using System.Net;
using Cps.CaseManagement.Api.Attributes;
using Cps.CaseManagement.Api.Constants;
using Cps.CaseManagement.Api.Context;
using Cps.CaseManagement.Api.Services;
using Cps.CaseManagement.MdsClient.Factories;
using Cps.CaseManagement.MdsClient.Models.Constants;
using Cps.CaseManagement.MdsClient.Models.Entities;
using Cps.CaseManagement.MdsClient.Models.Enums;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.OpenApi.Models;

public class ListAvailableOffences(
  IMdsService mdsService,
  IMdsArgFactory mdsArgFactory)
{
    private readonly IMdsService _mdsService = mdsService;
    private readonly IMdsArgFactory _mdsArgFactory = mdsArgFactory;

    [Function(nameof(ListAvailableOffences))]
    [OpenApiOperation(operationId: nameof(ListAvailableOffences), tags: ["MDS"], Description = "List all available offences")]
    [CmsAuthValuesAuth]
    [BearerTokenAuth]
    [OpenApiParameter(name: HttpHeaderKeys.CorrelationId, In = ParameterLocation.Header, Required = true, Type = typeof(string), Description = "Correlation identifier for tracking the request.")]
    [OpenApiParameter(OffenceSearchQueryParameters.Code, In = ParameterLocation.Query, Type = typeof(string), Description = "The Code of the charge.", Required = false)]
    [OpenApiParameter(OffenceSearchQueryParameters.Legislation, In = ParameterLocation.Query, Type = typeof(string), Description = "The Legisation of the charge.", Required = false)]
    [OpenApiParameter(OffenceSearchQueryParameters.LegislationPartialSearch, In = ParameterLocation.Query, Type = typeof(bool), Description = "Whether the \"word-by-word\" search by Legislation is partial (words match partially).", Required = true)]
    [OpenApiParameter(OffenceSearchQueryParameters.Description, In = ParameterLocation.Query, Type = typeof(string), Description = "The Description of the charge.", Required = false)]
    [OpenApiParameter(OffenceSearchQueryParameters.DescriptionPartialSearch, In = ParameterLocation.Query, Type = typeof(bool), Description = "Whether the \"word-by-word\" search by Description is partial (words match partially).", Required = true)]
    [OpenApiParameter(OffenceSearchQueryParameters.Keywords, In = ParameterLocation.Query, Type = typeof(string[]), Description = "The Keywords of the charge.", Required = false)]
    [OpenApiParameter(OffenceSearchQueryParameters.FromDate, In = ParameterLocation.Query, Type = typeof(DateOnly), Description = "The Effective Date From of the charge.", Required = false)]
    [OpenApiParameter(OffenceSearchQueryParameters.ToDate, In = ParameterLocation.Query, Type = typeof(DateOnly), Description = "The Effective Date To of the charge.", Required = false)]
    [OpenApiParameter(OffenceSearchQueryParameters.Page, In = ParameterLocation.Query, Type = typeof(int), Description = "Page number.", Required = false)]
    [OpenApiParameter(OffenceSearchQueryParameters.ItemsPerPage, In = ParameterLocation.Query, Type = typeof(int), Description = "How many items per page.", Required = false)]
    [OpenApiParameter(OffenceSearchQueryParameters.OrderBy, In = ParameterLocation.Query, Type = typeof(OffenceSearchResultOrder), Description = "The field to order by. [0 - Code / 1 - Legislation / 2 - Description]", Required = false)]
    [OpenApiParameter(OffenceSearchQueryParameters.IsAscendingOrder, In = ParameterLocation.Query, Type = typeof(bool), Description = "Whether to sort in ascending order.", Required = false)]
    [OpenApiParameter(OffenceSearchQueryParameters.Multisearch, In = ParameterLocation.Query, Type = typeof(string), Description = "A multi-search parameter which searches in Code, Legislation and Description simultaneously.", Required = false)]
    [OpenApiParameter(OffenceSearchQueryParameters.MultisearchPartialSearch, In = ParameterLocation.Query, Type = typeof(bool), Description = "Whether the \"word-by-word\" search by Multisearch is partial (words match partially).", Required = true)]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: ContentType.ApplicationJson, bodyType: typeof(OffencesEntity), Description = ApiResponseDescriptions.Success)]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.BadRequest, contentType: ContentType.TextPlain, typeof(string), Description = ApiResponseDescriptions.BadRequest)]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.Unauthorized, contentType: ContentType.TextPlain, typeof(string), Description = ApiResponseDescriptions.Unauthorized)]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.Forbidden, contentType: ContentType.TextPlain, typeof(string), Description = ApiResponseDescriptions.Forbidden)]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.InternalServerError, contentType: ContentType.TextPlain, typeof(string), Description = ApiResponseDescriptions.InternalServerError)]
    public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v1/offences")] HttpRequest req, FunctionContext functionContext)
    {
        var context = functionContext.GetRequestContext();

        var from = req.Query[OffenceSearchQueryParameters.FromDate];
        var to = req.Query[OffenceSearchQueryParameters.ToDate];

        var arg = _mdsArgFactory.CreateOffenceSearchArg(
            context.CmsAuthValues,
            context.CorrelationId,
            req.Query[OffenceSearchQueryParameters.Code],
            req.Query[OffenceSearchQueryParameters.Legislation],
            bool.TryParse(req.Query[OffenceSearchQueryParameters.LegislationPartialSearch], out var legislationPartial) ? legislationPartial : false,
            req.Query[OffenceSearchQueryParameters.Description],
            bool.TryParse(req.Query[OffenceSearchQueryParameters.DescriptionPartialSearch], out var descriptionPartial) ? descriptionPartial : false,
            req.Query[OffenceSearchQueryParameters.Keywords].ToString().Split(',', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries),
            !string.IsNullOrWhiteSpace(from) ? DateOnly.ParseExact(from!, "yyyy-MM-dd") : null,
            !string.IsNullOrWhiteSpace(to) ? DateOnly.ParseExact(to!, "yyyy-MM-dd") : null,
            int.TryParse(req.Query[OffenceSearchQueryParameters.Page], out var page) ? page : null,
            int.TryParse(req.Query[OffenceSearchQueryParameters.ItemsPerPage], out var itemsPerPage) ? itemsPerPage : null,
            !string.IsNullOrEmpty(req.Query[OffenceSearchQueryParameters.OrderBy]) ? Enum.Parse<OffenceSearchResultOrder>(req.Query[OffenceSearchQueryParameters.OrderBy].ToString()) : null,
            bool.TryParse(req.Query[OffenceSearchQueryParameters.IsAscendingOrder], out var isAscending) ? isAscending : false,
            req.Query[OffenceSearchQueryParameters.Multisearch],
            bool.TryParse(req.Query[OffenceSearchQueryParameters.MultisearchPartialSearch], out var multisearchPartial) ? multisearchPartial : false
        );

        var result = await _mdsService.SearchOffences(arg);

        return new OkObjectResult(result);
    }
}