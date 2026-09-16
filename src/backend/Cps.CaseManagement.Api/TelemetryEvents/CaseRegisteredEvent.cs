namespace Cps.CaseManagement.Api.TelemetryEvents;

using Cps.CaseManagement.Infrastructure.Telemetry;

public class CaseRegisteredEvent : BaseTelemetryEvent
{
    public string Urn { get; set; } = string.Empty;

    public long CaseId { get; set; }

    public string Username { get; set; } = string.Empty;

    public string? JourneyId { get; set; }

    public string? AreaOrDivisionText { get; set; }

    public override (IDictionary<string, string> Properties, IDictionary<string, double?> Metrics) ToTelemetryEventProps()
    {
        return (
            new Dictionary<string, string>
            {
                ["urn"] = Urn,
                ["caseId"] = CaseId.ToString(),
                ["username"] = Username,
                ["journeyId"] = JourneyId ?? string.Empty,
                ["areaOrDivisionText"] = AreaOrDivisionText ?? string.Empty
            },
            new Dictionary<string, double?>());
    }
}
