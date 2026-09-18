using System.Collections.Generic;
using Cps.CaseManagement.Infrastructure.Telemetry;
using Xunit;

namespace Cps.CaseManagement.Infrastructure.Tests.Unit.Telemetry;

public class BaseUiTelemetryEventTests
{
    [Fact]
    public void ToTelemetryEventProps_WithDuplicateKeys_LaterEntriesOverwriteEarlierOnes()
    {
        var telemetryEvent = new BaseUiTelemetryEvent
        {
            Properties = new List<Dictionary<string, object>>
            {
                new() { { "pageName", "FirstPage" }, { "journeyId", "journey-1" } },
                new() { { "pageName", "CaseSummary" }, { "journeyId", "journey-123" } }
            }
        };

        var (properties, _) = telemetryEvent.ToTelemetryEventProps();

        Assert.Equal("CaseSummary", properties["pageName"]);
        Assert.Equal("journey-123", properties["journeyId"]);
    }

    [Fact]
    public void ToTelemetryEventProps_WithNullProperties_ReturnsEmptyDictionaries()
    {
        var telemetryEvent = new BaseUiTelemetryEvent
        {
            Properties = null!
        };

        var exception = Record.Exception(() => telemetryEvent.ToTelemetryEventProps());

        Assert.Null(exception);
        var (properties, metrics) = telemetryEvent.ToTelemetryEventProps();
        Assert.Empty(properties);
        Assert.Empty(metrics);
    }

    [Fact]
    public void ToTelemetryEventProps_WithNullDictionaryInCollection_IgnoresNullEntry()
    {
        var telemetryEvent = new BaseUiTelemetryEvent
        {
            Properties = new List<Dictionary<string, object>>
            {
                null!,
                new() { { "journeyId", "journey-123" } }
            }
        };

        var (properties, _) = telemetryEvent.ToTelemetryEventProps();

        Assert.Equal("journey-123", properties["journeyId"]);
    }
}
