namespace Cps.CaseManagement.MdsClient.Client;

using System.Net;
using System.Text.Json;
using Cps.CaseManagement.MdsClient.Exceptions;
using Cps.CaseManagement.MdsClient.Factories;
using Cps.CaseManagement.MdsClient.Models.Args;
using Cps.CaseManagement.MdsClient.Models.Entities;
using Cps.CaseManagement.MdsClient.Tactical.Client;
using Cps.CaseManagement.MdsClient.Tactical.Factories;
using Cps.CaseManagement.MdsClient.Tactical.Models.Response;

public class MdsClient(HttpClient httpClient,
    IMdsRequestFactory mdsRequestFactory, 
    IMdsRequestFactoryTactical mdsRequestFactoryTactical) : IMdsClient, IMdsClientTactical
{
    private readonly HttpClient _httpClient = httpClient;
    private readonly IMdsRequestFactory _mdsRequestFactory = mdsRequestFactory;
    private readonly IMdsRequestFactoryTactical _mdsRequestFactoryTactical = mdsRequestFactoryTactical;

    public async Task<IEnumerable<TitleEntity>> GetTitlesAsync(MdsBaseArgDto arg)
    {
        var request = _mdsRequestFactory.CreateGetTitlesRequest(arg);
        return await CallMds<IEnumerable<TitleEntity>>(request);
    }

    public async Task<IEnumerable<ReligionEntity>> GetReligionsAsync(MdsBaseArgDto arg)
    {
        var request = _mdsRequestFactory.CreateGetReligionsRequest(arg);
        return await CallMds<IEnumerable<ReligionEntity>>(request);
    }

    public async Task<IEnumerable<GenderEntity>> GetGendersAsync(MdsBaseArgDto arg)
    {
        var request = _mdsRequestFactory.CreateGetGendersRequest(arg);
        return await CallMds<IEnumerable<GenderEntity>>(request);
    }

    public async Task<IEnumerable<EthnicityEntity>> GetEthnicitiesAsync(MdsBaseArgDto arg)
    {
        var request = _mdsRequestFactory.CreateGetEthnicitesRequest(arg);
        return await CallMds<IEnumerable<EthnicityEntity>>(request);
    }

    public async Task<IEnumerable<MonitoringCodeEntity>> GetMonitoringCodesAsync(MdsBaseArgDto arg)
    {
        var request = _mdsRequestFactory.CreateGetMonitoringCodesRequest(arg);
        return await CallMds<IEnumerable<MonitoringCodeEntity>>(request);
    }

    public async Task<IEnumerable<ComplexitityEntity>> GetComplexityCodesAsync(MdsBaseArgDto arg)
    {
        var request = _mdsRequestFactory.CreateGetComplexitiesRequest(arg);
        return await CallMds<IEnumerable<ComplexitityEntity>>(request);
    }

    public async Task<IEnumerable<OffenderCategoryEntity>> GetOffenderCategoriesAsync(MdsBaseArgDto arg)
    {
        var request = _mdsRequestFactory.CreateGetOffenderCategoriesRequest(arg);
        return await CallMds<IEnumerable<OffenderCategoryEntity>>(request);
    }

    public async Task<IEnumerable<ProsecutorOrCaseworkerEntity>> GetProsecutorsAsync(MdsUnitIdArg arg)
    {
        var request = _mdsRequestFactory.CreateGetProsecutorsRequest(arg);
        return await CallMds<IEnumerable<ProsecutorOrCaseworkerEntity>>(request);
    }

    public async Task<IEnumerable<ProsecutorOrCaseworkerEntity>> GetCaseworkersAsync(MdsUnitIdArg arg)
    {
        var request = _mdsRequestFactory.CreateGetCaseworkersRequest(arg);
        return await CallMds<IEnumerable<ProsecutorOrCaseworkerEntity>>(request);
    }

    public async Task<IEnumerable<CourtEntity>> GetCourtsAsync(MdsUnitIdArg arg)
    {
        var request = _mdsRequestFactory.CreateGetCourtsRequest(arg);
        return await CallMds<IEnumerable<CourtEntity>>(request);
    }

    public async Task<IEnumerable<UnitEntity>> GetUnitsAsync(MdsBaseArgDto arg)
    {
        ArgumentNullException.ThrowIfNull(arg);
        var request = _mdsRequestFactory.CreateGetUnitsRequest(arg);
        return await CallMds<IEnumerable<UnitEntity>>(request);
    }

    public async Task<UserDataEntity> GetUserDataAsync(MdsBaseArgDto arg)
    {
        ArgumentNullException.ThrowIfNull(arg);
        var request = _mdsRequestFactory.CreateUserDataRequest(arg);
        return await CallMds<UserDataEntity>(request);
    }

    public async Task<IEnumerable<WMSUnitEntity>> GetWMSUnitsAsync(MdsBaseArgDto arg)
    {
        var request = _mdsRequestFactory.CreateGetWMSUnitsRequest(arg);
        return await CallMds<IEnumerable<WMSUnitEntity>>(request);
    }

    public async Task<IEnumerable<CaseInfoEntity>> ListCasesByUrnAsync(MdsUrnArg arg)
    {
        var request = _mdsRequestFactory.CreateListCasesByUrnRequest(arg);
        return await CallMds<IEnumerable<CaseInfoEntity>>(request);
    }

    public async Task<string?> GetCmsModernTokenAsync(MdsBaseArgDto arg)
    {
        var response = await CallMds<CmsModernTokenEntity>(_mdsRequestFactory.CreateGetCmsModernTokenRequest(arg));
        return response.CmsModernToken;
    }

    public async Task<CaseRegistrationEntity> RegisterCaseAsync(MdsRegisterCaseArg arg)
    {
        var response = await CallMds<CaseRegistrationEntity>(
            _mdsRequestFactory.CreateRegisterCaseRequest(arg));
        return response;
    }

    public async Task<IEnumerable<PoliceUnitEntity>> GetPoliceUnitsAsync(MdsBaseArgDto arg)
    {
        var request = _mdsRequestFactory.CreateGetPoliceUnitsRequest(arg);
        return await CallMds<IEnumerable<PoliceUnitEntity>>(request);
    }

    public async Task<OffencesEntity> SearchOffences(MdsOffenceSearchArg arg)
    {
        var request = _mdsRequestFactory.CreateSearchOffencesRequest(arg);
        return await CallMds<OffencesEntity>(request);
    }

    public async Task<AuthenticationResponse> AuthenticateAsync(string username, string password)
    {
        var response = await CallMds<AuthenticationResponse>(_mdsRequestFactoryTactical.CreateAuthenticateRequest(username, password));
        return response;
    }

    private async Task<T> CallMds<T>(HttpRequestMessage request)
    {
        using var response = await CallMds(request);
        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<T>(content) ?? throw new InvalidOperationException("Deserialization returned null.");
        return result;
    }

    private async Task<HttpResponseMessage> CallMds(HttpRequestMessage request, params HttpStatusCode[] expectedUnhappyStatusCodes)
    {
        var response = await _httpClient.SendAsync(request);
        try
        {
            if (response.IsSuccessStatusCode || expectedUnhappyStatusCodes.Contains(response.StatusCode))
            {
                return response;
            }

            if (response.StatusCode == HttpStatusCode.Unauthorized)
            {
                throw new CmsUnauthorizedException();
            }

            var content = await response.Content.ReadAsStringAsync();
            throw new HttpRequestException(content);
        }
        catch (HttpRequestException exception)
        {
            throw new MdsClientException(response.StatusCode, exception);
        }
    }
}