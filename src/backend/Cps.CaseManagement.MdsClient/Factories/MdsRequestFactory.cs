namespace Cps.CaseManagement.MdsClient.Factories;

using System.Text;
using System.Text.Json;
using Cps.CaseManagement.MdsClient.Models.Args;
using Cps.CaseManagement.MdsClient.Models.Constants;
using Microsoft.AspNetCore.WebUtilities;

public class MdsRequestFactory : IMdsRequestFactory
{
    private const string CorrelationId = "Correlation-Id";
    private const string CmsAuthValues = "Cms-Auth-Values";

    public HttpRequestMessage CreateGetTitlesRequest(MdsBaseArgDto arg) =>
        BuildRequest(HttpMethod.Get, "api/titles", arg);

    public HttpRequestMessage CreateGetReligionsRequest(MdsBaseArgDto arg) =>
        BuildRequest(HttpMethod.Get, "api/religions", arg);

    public HttpRequestMessage CreateGetGendersRequest(MdsBaseArgDto arg) =>
        BuildRequest(HttpMethod.Get, "api/genders", arg);

    public HttpRequestMessage CreateGetEthnicitesRequest(MdsBaseArgDto arg) =>
        BuildRequest(HttpMethod.Get, "api/ethnicities", arg);

    public HttpRequestMessage CreateGetMonitoringCodesRequest(MdsBaseArgDto arg) =>
        BuildRequest(HttpMethod.Get, "api/monitoring-codes", arg);

    public HttpRequestMessage CreateGetComplexitiesRequest(MdsBaseArgDto arg) =>
        BuildRequest(HttpMethod.Get, "api/complexities", arg);

    public HttpRequestMessage CreateGetOffenderCategoriesRequest(MdsBaseArgDto arg) =>
        BuildRequest(HttpMethod.Get, "api/offender-categories", arg);

    public HttpRequestMessage CreateGetProsecutorsRequest(MdsUnitIdArg arg) =>
        BuildRequest(HttpMethod.Get, $"api/prosecutors/{arg.UnitId}", arg);

    public HttpRequestMessage CreateGetCaseworkersRequest(MdsUnitIdArg arg) =>
        BuildRequest(HttpMethod.Get, $"api/caseworkers/{arg.UnitId}", arg);

    public HttpRequestMessage CreateGetCourtsRequest(MdsUnitIdArg arg) =>
        BuildRequest(HttpMethod.Get, $"api/courts/{arg.UnitId}", arg);

    public HttpRequestMessage CreateGetUnitsRequest(MdsBaseArgDto arg) =>
        BuildRequest(HttpMethod.Get, "api/units", arg);

    public HttpRequestMessage CreateGetWMSUnitsRequest(MdsBaseArgDto arg) =>
        BuildRequest(HttpMethod.Get, "api/wms-units", arg);

    public HttpRequestMessage CreateListCasesByUrnRequest(MdsUrnArg arg) =>
        BuildRequest(HttpMethod.Get, $"api/urns/{arg.Urn}/case-identifiers", arg);

    public HttpRequestMessage CreateUserDataRequest(MdsBaseArgDto arg) =>
        BuildRequest(HttpMethod.Get, "api/user-data", arg);

    public HttpRequestMessage CreateGetCmsModernTokenRequest(MdsBaseArgDto arg) =>
        BuildRequest(HttpMethod.Get, "api/user/cms-modern-token", arg);

    public HttpRequestMessage CreateRegisterCaseRequest(MdsRegisterCaseArg arg)
    {
        var request = BuildRequest(HttpMethod.Post, "api/cases", arg);
        request.Content = new StringContent(JsonSerializer.Serialize(arg.CaseDetails), Encoding.UTF8, "application/json");
        return request;
    }

    public HttpRequestMessage CreateGetPoliceUnitsRequest(MdsBaseArgDto arg) =>
        BuildRequest(HttpMethod.Get, "api/police-units", arg);

    public HttpRequestMessage CreateSearchOffencesRequest(MdsOffenceSearchArg arg)
    {
        var queryParams = new Dictionary<string, string?>
        {
            [OffenceSearchQueryParameters.Code] = arg.Code,
            [OffenceSearchQueryParameters.Legislation] = arg.Legislation,
            [OffenceSearchQueryParameters.LegislationPartialSearch] = arg.LegislationPartialSearch?.ToString().ToLower(),
            [OffenceSearchQueryParameters.Description] = arg.Description,
            [OffenceSearchQueryParameters.DescriptionPartialSearch] = arg.DescriptionPartialSearch?.ToString().ToLower(),
            [OffenceSearchQueryParameters.Keywords] = arg.Keywords?.Length > 0 ? string.Join(",", arg.Keywords) : null,
            [OffenceSearchQueryParameters.FromDate] = arg.FromDate?.ToString("yyyy-MM-dd"),
            [OffenceSearchQueryParameters.ToDate] = arg.ToDate?.ToString("yyyy-MM-dd"),
            [OffenceSearchQueryParameters.Page] = arg.Page?.ToString(),
            [OffenceSearchQueryParameters.ItemsPerPage] = arg.ItemsPerPage?.ToString(),
            [OffenceSearchQueryParameters.OrderBy] = arg.Order?.ToString(),
            [OffenceSearchQueryParameters.IsAscendingOrder] = arg.IsAscending?.ToString().ToLower(),
            [OffenceSearchQueryParameters.Multisearch] = arg.Multisearch,
            [OffenceSearchQueryParameters.MultisearchPartialSearch] = arg.MultisearchPartialSearch?.ToString().ToLower()
        };

        var path = QueryHelpers.AddQueryString("api/case/offences",
            queryParams.Where(p => !string.IsNullOrWhiteSpace(p.Value)));

        return BuildRequest(HttpMethod.Get, path, arg);
    }

    private HttpRequestMessage BuildRequest(HttpMethod method, string path, MdsBaseArgDto arg)
    {
        var request = new HttpRequestMessage(method, path);
        request.Headers.Add(CorrelationId, arg.CorrelationId.ToString());
        request.Headers.Add(CmsAuthValues, arg.CmsAuthValues);
        return request;
    }
}
