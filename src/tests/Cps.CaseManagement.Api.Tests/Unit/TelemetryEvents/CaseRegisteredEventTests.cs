using Cps.CaseManagement.Api.TelemetryEvents;
using Xunit;

namespace Cps.CaseManagement.Api.Tests.Unit.TelemetryEvents;

public class CaseRegisteredEventTests
{
    [Fact]
    public void ToTelemetryEventProps_ReturnsOnlyUrnCaseIdAndUsername()
    {
        var telemetryEvent = new CaseRegisteredEvent
        {
            Urn = "12AB1234567",
            CaseId = 98765,
            Username = "user@example.com",
            CorrelationId = Guid.NewGuid(),
            EventTimestamp = DateTime.UtcNow
        };

        var (properties, metrics) = telemetryEvent.ToTelemetryEventProps();

        Assert.Equal(3, properties.Count);
        Assert.Equal("12AB1234567", properties["urn"]);
        Assert.Equal("98765", properties["caseId"]);
        Assert.Equal("user@example.com", properties["username"]);
        Assert.Empty(metrics);
    }

    [Fact]
    public void EventName_IsCaseRegisteredEvent()
    {
        var telemetryEvent = new CaseRegisteredEvent();

        Assert.Equal(nameof(CaseRegisteredEvent), telemetryEvent.EventName);
    }
}
