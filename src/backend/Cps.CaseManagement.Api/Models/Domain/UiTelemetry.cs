namespace Cps.CaseManagement.Api.Models.Domain;

using System.Text.Json.Serialization;
using Cps.CaseManagement.Api.Constants;

public class UiTelemetry
{
    [JsonPropertyName("telemetryType")]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public TelemetryType TelemetryType { get; set; }
    [JsonPropertyName("eventTimestamp")]
    public DateTime EventTimestamp { get; set; }
    [JsonPropertyName("properties")]
    public List<Dictionary<string, object>>? Properties { get; set; } = new();
}
