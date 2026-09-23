namespace Cps.CaseManagement.MdsClient.Models.Entities;

using System.Text.Json.Serialization;

public class CaseRegistrationRequest
{
    [JsonPropertyName("urn")]
    public required CaseRegistrationUrn Urn { get; set; } = new();

    [JsonPropertyName("registeringAreaId")]
    public required int RegisteringAreaId { get; set; }

    [JsonPropertyName("registeringUnitId")]
    public required int RegisteringUnitId { get; set; }

    [JsonPropertyName("allocatedWcuId")]
    public int AllocatedWcuId { get; set; }

    [JsonPropertyName("crest")]
    public string Crest { get; set; } = string.Empty;

    [JsonPropertyName("operationName")]
    public string OperationName { get; set; } = string.Empty;

    [JsonPropertyName("courtLocationId")]
    public int CourtLocationId { get; set; }

    [JsonPropertyName("courtLocationName")]
    public string CourtLocationName { get; set; } = string.Empty;

    [JsonPropertyName("hearingDate")]
    public DateTime? HearingDate { get; set; }

    [JsonPropertyName("defendants")]
    public ICollection<CaseRegistrationDefendant>? Defendants { get; set; } = [];

    [JsonPropertyName("victims")]
    public ICollection<CaseRegistrationVictim>? Victims { get; set; } = [];

    [JsonPropertyName("complexity")]
    public string Complexity { get; set; } = string.Empty;

    [JsonPropertyName("caseWeight")]
    public string CaseWeight { get; set; } = string.Empty;

    [JsonPropertyName("monitoringCodes")]
    public ICollection<CaseRegistrationMonitoringCode> MonitoringCodes { get; set; } = [];

    [JsonPropertyName("prosecutorId")]
    public int ProsecutorId { get; set; }

    [JsonPropertyName("caseWorker")]
    public string CaseWorker { get; set; } = string.Empty;

    [JsonPropertyName("oicRank")]
    public string OicRank { get; set; } = string.Empty;

    [JsonPropertyName("oicSurname")]
    public string OicSurname { get; set; } = string.Empty;

    [JsonPropertyName("oicFirstnames")]
    public string OicFirstnames { get; set; } = string.Empty;

    [JsonPropertyName("oicShoulderNumber")]
    public string OicShoulderNumber { get; set; } = string.Empty;

    [JsonPropertyName("oicPoliceUnit")]
    public string OicPoliceUnit { get; set; } = string.Empty;

    [JsonPropertyName("journeyId")]
    public string? JourneyId { get; set; }

    [JsonPropertyName("areaOrDivisionText")]
    public string? AreaOrDivisionText { get; set; }
}