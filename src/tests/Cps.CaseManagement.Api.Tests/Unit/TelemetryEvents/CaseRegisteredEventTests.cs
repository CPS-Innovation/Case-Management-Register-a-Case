using Cps.CaseManagement.Api.TelemetryEvents;
using Xunit;

namespace Cps.CaseManagement.Api.Tests.Unit.TelemetryEvents;

public class CaseRegisteredEventTests
{
    [Fact]
    public void ToTelemetryEventProps_ReturnsUrnCaseIdUsernameJourneyIdAndAreaOrDivisionText()
    {
        var telemetryEvent = new CaseRegisteredEvent
        {
            Urn = "12AB1234567",
            CaseId = 98765,
            Username = "user@example.com",
            JourneyId = "journey-123",
            AreaOrDivisionText = "London",
            CorrelationId = Guid.NewGuid(),
            EventTimestamp = DateTime.UtcNow
        };

        var (properties, metrics) = telemetryEvent.ToTelemetryEventProps();

        Assert.Equal(5, properties.Count);
        Assert.Equal("12AB1234567", properties["urn"]);
        Assert.Equal("98765", properties["caseId"]);
        Assert.Equal("user@example.com", properties["username"]);
        Assert.Equal("journey-123", properties["journeyId"]);
        Assert.Equal("London", properties["areaOrDivisionText"]);
        Assert.Empty(metrics);
    }

    [Fact]
    public void EventName_IsCaseRegisteredEvent()
    {
        var telemetryEvent = new CaseRegisteredEvent();

        Assert.Equal(nameof(CaseRegisteredEvent), telemetryEvent.EventName);
    }

    [Fact]
    public void ToTelemetryEventProps_WhenJourneyIdAndAreaAreNull_ReturnsEmptyStrings()
    {
        var telemetryEvent = new CaseRegisteredEvent
        {
            Urn = "12AB1234567",
            CaseId = 98765,
            Username = "user@example.com"
        };

        var (properties, _) = telemetryEvent.ToTelemetryEventProps();

        Assert.Equal(string.Empty, properties["journeyId"]);
        Assert.Equal(string.Empty, properties["areaOrDivisionText"]);
    }
}
