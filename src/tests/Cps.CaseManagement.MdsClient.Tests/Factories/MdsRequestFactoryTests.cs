using System.Text.Json;
using Cps.CaseManagement.MdsClient.Factories;
using Cps.CaseManagement.MdsClient.Models.Args;
using Cps.CaseManagement.MdsClient.Models.Entities;

namespace Cps.CaseManagement.MdsClient.Tests.Factories;

public class MdsRequestFactoryTests
{
    [Fact]
    public async Task CreateRegisterCaseRequest_ExcludesTelemetryFieldsFromMdsPayload()
    {
        var factory = new MdsRequestFactory();
        var request = factory.CreateRegisterCaseRequest(new MdsRegisterCaseArg
        {
            CmsAuthValues = "cms-auth",
            CorrelationId = Guid.NewGuid(),
            CaseDetails = new CaseRegistrationRequest
            {
                Urn = new CaseRegistrationUrn
                {
                    UniqueRef = "12345",
                    Year = 30,
                    PoliceForce = "AA",
                    PoliceUnit = "BB"
                },
                RegisteringAreaId = 1,
                RegisteringUnitId = 2,
                JourneyId = "journey-123",
                AreaOrDivisionText = "London"
            }
        });

        var json = await request.Content!.ReadAsStringAsync();
        using var document = JsonDocument.Parse(json);
        var root = document.RootElement;

        Assert.False(root.TryGetProperty("journeyId", out _));
        Assert.False(root.TryGetProperty("areaOrDivisionText", out _));
        Assert.Equal(1, root.GetProperty("registeringAreaId").GetInt32());
        Assert.Equal(2, root.GetProperty("registeringUnitId").GetInt32());
    }

    [Fact]
    public void CaseRegistrationRequest_DeserializesOptionalTelemetryFields()
    {
        const string json = """
            {
              "urn": { "policeForce": "AA", "policeUnit": "BB", "uniqueRef": "12345", "year": 30 },
              "registeringAreaId": 1,
              "registeringUnitId": 2,
              "journeyId": "journey-123",
              "areaOrDivisionText": "London"
            }
            """;

        var request = JsonSerializer.Deserialize<CaseRegistrationRequest>(json);

        Assert.NotNull(request);
        Assert.Equal("journey-123", request!.JourneyId);
        Assert.Equal("London", request.AreaOrDivisionText);
    }
}
