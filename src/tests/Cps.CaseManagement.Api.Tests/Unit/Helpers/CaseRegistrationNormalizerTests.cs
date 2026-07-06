using Cps.CaseManagement.Api.Constants;
using Cps.CaseManagement.Api.Helpers;
using Cps.CaseManagement.MdsClient.Models.Entities;

namespace Cps.CaseManagement.Api.Tests.Unit.Helpers;

public class CaseRegistrationNormalizerTests
{
    [Fact]
    public void NormalizeDefendants_WithBlankDetails_AppliesCmsDefaults()
    {
        var request = new CaseRegistrationRequest
        {
            Urn = new CaseRegistrationUrn(),
            RegisteringAreaId = 1,
            RegisteringUnitId = 2,
            Defendants = new List<CaseRegistrationDefendant>
            {
                new CaseRegistrationDefendant
                {
                    Surname = "Smith",
                    Gender = string.Empty,
                    Ethnicity = " ",
                    Religion = string.Empty,
                    Type = string.Empty,
                }
            }
        };

        CaseRegistrationNormalizer.NormalizeDefendants(request);

        var defendant = Assert.Single(request.Defendants!);
        Assert.Equal(CaseRegistrationDefaults.Gender, defendant.Gender);
        Assert.Equal(CaseRegistrationDefaults.Ethnicity, defendant.Ethnicity);
        Assert.Equal(CaseRegistrationDefaults.Religion, defendant.Religion);
        Assert.Equal(CaseRegistrationDefaults.Type, defendant.Type);
    }

    [Fact]
    public void NormalizeDefendants_WithPopulatedDetails_LeavesValuesUnchanged()
    {
        var request = new CaseRegistrationRequest
        {
            Urn = new CaseRegistrationUrn(),
            RegisteringAreaId = 1,
            RegisteringUnitId = 2,
            Defendants = new List<CaseRegistrationDefendant>
            {
                new CaseRegistrationDefendant
                {
                    Surname = "Smith",
                    Gender = "M",
                    Ethnicity = "M3",
                    Religion = "CH",
                    Type = "PP",
                }
            }
        };

        CaseRegistrationNormalizer.NormalizeDefendants(request);

        var defendant = Assert.Single(request.Defendants!);
        Assert.Equal("M", defendant.Gender);
        Assert.Equal("M3", defendant.Ethnicity);
        Assert.Equal("CH", defendant.Religion);
        Assert.Equal("PP", defendant.Type);
    }

    [Fact]
    public void NormalizeDefendants_WithNoDefendants_AddsPlaceholderWithOperationName()
    {
        var request = new CaseRegistrationRequest
        {
            Urn = new CaseRegistrationUrn(),
            RegisteringAreaId = 1,
            RegisteringUnitId = 2,
            OperationName = "Operation Nightingale",
            Defendants = new List<CaseRegistrationDefendant>()
        };

        CaseRegistrationNormalizer.NormalizeDefendants(request);

        var defendant = Assert.Single(request.Defendants!);
        Assert.True(defendant.IsDefendant);
        Assert.True(defendant.IsNotYetCharged);
        Assert.Equal("Operation Nightingale", defendant.Surname);
        Assert.Equal(CaseRegistrationDefaults.Gender, defendant.Gender);
        Assert.Equal(CaseRegistrationDefaults.Ethnicity, defendant.Ethnicity);
        Assert.Equal(CaseRegistrationDefaults.Religion, defendant.Religion);
        Assert.Equal(CaseRegistrationDefaults.Type, defendant.Type);
    }

    [Fact]
    public void NormalizeDefendants_WithNullDefendants_AddsPlaceholder()
    {
        var request = new CaseRegistrationRequest
        {
            Urn = new CaseRegistrationUrn(),
            RegisteringAreaId = 1,
            RegisteringUnitId = 2,
            OperationName = "Operation Nightingale",
            Defendants = null
        };

        CaseRegistrationNormalizer.NormalizeDefendants(request);

        var defendant = Assert.Single(request.Defendants!);
        Assert.Equal("Operation Nightingale", defendant.Surname);
    }
}
