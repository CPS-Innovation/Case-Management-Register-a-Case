using Cps.CaseManagement.Infrastructure.Telemetry;
using Microsoft.ApplicationInsights.DataContracts;
using Xunit;

namespace Cps.CaseManagement.Infrastructure.Tests.Unit.Telemetry;

public class TelemetryInitializerTests : IDisposable
{
    private readonly TelemetryInitializer _initializer = new();

    public void Dispose()
    {
        TelemetryRequestContext.Clear();
    }

    [Fact]
    public void Initialize_AlwaysStampsBaseProperties()
    {
        var telemetry = new TraceTelemetry();

        _initializer.Initialize(telemetry);

        Assert.Equal(TelemetryInitializer.Version, telemetry.Context.GlobalProperties["telemetryVersion"]);
        Assert.Equal("Cps.RegisterCase", telemetry.Context.GlobalProperties["appName"]);
        Assert.True(telemetry.Context.GlobalProperties.ContainsKey("environment"));
    }

    [Fact]
    public void Initialize_WithUsernameAndCorrelationId_StampsCustomDimensions()
    {
        var username = "user@example.com";
        var correlationId = Guid.NewGuid();
        TelemetryRequestContext.Set(username, correlationId);
        var telemetry = new TraceTelemetry();

        _initializer.Initialize(telemetry);

        Assert.Equal(username, telemetry.Context.GlobalProperties["username"]);
        Assert.Equal(correlationId.ToString(), telemetry.Context.GlobalProperties["correlationId"]);
    }

    [Fact]
    public void Initialize_WithoutUsername_DoesNotStampUsername()
    {
        TelemetryRequestContext.Set(null, Guid.NewGuid());
        var telemetry = new TraceTelemetry();

        _initializer.Initialize(telemetry);

        Assert.False(telemetry.Context.GlobalProperties.ContainsKey("username"));
        Assert.True(telemetry.Context.GlobalProperties.ContainsKey("correlationId"));
    }

    [Fact]
    public void Initialize_WithEmptyCorrelationId_DoesNotStampCorrelationId()
    {
        TelemetryRequestContext.Set("user@example.com", Guid.Empty);
        var telemetry = new TraceTelemetry();

        _initializer.Initialize(telemetry);

        Assert.Equal("user@example.com", telemetry.Context.GlobalProperties["username"]);
        Assert.False(telemetry.Context.GlobalProperties.ContainsKey("correlationId"));
    }

    [Fact]
    public void Initialize_AfterClear_DoesNotStampUsernameOrCorrelationId()
    {
        TelemetryRequestContext.Set("user@example.com", Guid.NewGuid());
        TelemetryRequestContext.Clear();
        var telemetry = new TraceTelemetry();

        _initializer.Initialize(telemetry);

        Assert.False(telemetry.Context.GlobalProperties.ContainsKey("username"));
        Assert.False(telemetry.Context.GlobalProperties.ContainsKey("correlationId"));
    }
}
