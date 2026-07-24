namespace Cps.CaseManagement.Infrastructure.Telemetry;

using Microsoft.ApplicationInsights.Channel;
using Microsoft.ApplicationInsights.Extensibility;

public class TelemetryInitializer : ITelemetryInitializer
{
    public const string Version = "0.1";

    public void Initialize(ITelemetry telemetry)
    {
        telemetry.Context.GlobalProperties["telemetryVersion"] = Version;
        telemetry.Context.GlobalProperties["environment"] = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Unknown";
        telemetry.Context.GlobalProperties["appName"] = "Cps.RegisterCase";

        var username = TelemetryRequestContext.Username;
        if (!string.IsNullOrEmpty(username))
        {
            telemetry.Context.GlobalProperties["username"] = username;
        }

        var correlationId = TelemetryRequestContext.CorrelationId;
        if (correlationId != Guid.Empty)
        {
            telemetry.Context.GlobalProperties["correlationId"] = correlationId.ToString();
        }
    }
}
