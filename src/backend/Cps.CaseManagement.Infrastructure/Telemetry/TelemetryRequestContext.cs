namespace Cps.CaseManagement.Infrastructure.Telemetry;

public static class TelemetryRequestContext
{
    private static readonly AsyncLocal<ContextData?> Current = new();

    public static string? Username => Current.Value?.Username;

    public static Guid CorrelationId => Current.Value?.CorrelationId ?? Guid.Empty;

    public static void Set(string? username, Guid correlationId)
    {
        Current.Value = new ContextData(username, correlationId);
    }

    public static void Clear()
    {
        Current.Value = null;
    }

    private sealed record ContextData(string? Username, Guid CorrelationId);
}
