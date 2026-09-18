using System.Collections.Generic;
using Cps.CaseManagement.Infrastructure.Telemetry;
using Microsoft.ApplicationInsights.Channel;
using Microsoft.ApplicationInsights.DataContracts;
using Microsoft.ApplicationInsights.Extensibility;
using Xunit;
using AppInsights = Microsoft.ApplicationInsights;

namespace Cps.CaseManagement.Infrastructure.Tests.Unit.Telemetry;

public class AppInsightsTelemetryClientTests
{
    [Fact]
    public void TrackPageView_WithPropertiesAndMetrics_PopulatesPageViewTelemetry()
    {
        // Arrange
        var channel = new StubTelemetryChannel();
        using var configuration = new TelemetryConfiguration
        {
            ConnectionString = "InstrumentationKey=",
            TelemetryChannel = channel
        };
        var wrapper = new AppInsightsTelemetryClientWrapper(new AppInsights.TelemetryClient(configuration));

        var properties = new Dictionary<string, string>
        {
            { "pageName", "CaseSummary" },
            { "journeyId", "journey-123" }
        };
        var metrics = new Dictionary<string, double>
        {
            { "duration", 1.5 }
        };

        // Act
        wrapper.TrackPageView("CaseSummary", properties, metrics);

        // Assert
        var pageView = Assert.Single(channel.Items.OfType<PageViewTelemetry>());
        Assert.Equal("CaseSummary", pageView.Name);
        Assert.Equal("journey-123", pageView.Properties["journeyId"]);
        Assert.Equal("CaseSummary", pageView.Properties["pageName"]);
        Assert.Equal(1.5, pageView.Metrics["duration"]);
    }

    [Fact]
    public void TrackPageView_WithNullPropertiesAndMetrics_DoesNotThrow()
    {
        // Arrange
        var channel = new StubTelemetryChannel();
        using var configuration = new TelemetryConfiguration
        {
            ConnectionString = "InstrumentationKey=",
            TelemetryChannel = channel
        };
        var wrapper = new AppInsightsTelemetryClientWrapper(new AppInsights.TelemetryClient(configuration));

        // Act
        var exception = Record.Exception(() => wrapper.TrackPageView("CaseSummary", null, null));

        // Assert
        Assert.Null(exception);
        var pageView = Assert.Single(channel.Items.OfType<PageViewTelemetry>());
        Assert.Equal("CaseSummary", pageView.Name);
        Assert.Empty(pageView.Properties);
        Assert.Empty(pageView.Metrics);
    }

    private sealed class StubTelemetryChannel : ITelemetryChannel
    {
        public IList<ITelemetry> Items { get; } = new List<ITelemetry>();

        public bool? DeveloperMode { get; set; }

        public string? EndpointAddress { get; set; }

        public void Send(ITelemetry item) => Items.Add(item);

        public void Flush()
        {
        }

        public void Dispose()
        {
        }
    }
}
