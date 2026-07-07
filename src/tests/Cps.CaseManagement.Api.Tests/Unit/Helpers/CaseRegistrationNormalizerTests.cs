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
                    IsDefendant = true,
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
    public void NormalizeDefendants_WithCompanyDefendant_DoesNotApplyDemographicDefaults()
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
                    IsDefendant = false,
                    CompanyName = "Test Ltd",
                    Gender = string.Empty,
                    Ethnicity = string.Empty,
                    Religion = string.Empty,
                    Type = string.Empty,
                }
            }
        };

        CaseRegistrationNormalizer.NormalizeDefendants(request);

        var defendant = Assert.Single(request.Defendants!);
        Assert.Equal(string.Empty, defendant.Gender);
        Assert.Equal(string.Empty, defendant.Ethnicity);
        Assert.Equal(string.Empty, defendant.Religion);
        Assert.Equal(string.Empty, defendant.Type);
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

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public void NormalizeDefendants_WithNoDefendantsAndBlankOperationName_UsesFallbackSurname(string operationName)
    {
        var request = new CaseRegistrationRequest
        {
            Urn = new CaseRegistrationUrn(),
            RegisteringAreaId = 1,
            RegisteringUnitId = 2,
            OperationName = operationName,
            Defendants = new List<CaseRegistrationDefendant>()
        };

        CaseRegistrationNormalizer.NormalizeDefendants(request);

        var defendant = Assert.Single(request.Defendants!);
        Assert.Equal(CaseRegistrationDefaults.PlaceholderSurname, defendant.Surname);
        Assert.False(string.IsNullOrWhiteSpace(defendant.Surname));
    }

    [Fact]
    public void NormalizeDefendants_WithNoDefendantsAndOverlongOperationName_TruncatesSurname()
    {
        var operationName = new string('A', CaseRegistrationDefaults.SurnameMaxLength + 10);
        var request = new CaseRegistrationRequest
        {
            Urn = new CaseRegistrationUrn(),
            RegisteringAreaId = 1,
            RegisteringUnitId = 2,
            OperationName = operationName,
            Defendants = new List<CaseRegistrationDefendant>()
        };

        CaseRegistrationNormalizer.NormalizeDefendants(request);

        var defendant = Assert.Single(request.Defendants!);
        Assert.Equal(CaseRegistrationDefaults.SurnameMaxLength, defendant.Surname!.Length);
        Assert.Equal(operationName[..CaseRegistrationDefaults.SurnameMaxLength], defendant.Surname);
    }

    [Fact]
    public void NormalizeDefendants_WithNoDefendantsAndSurrogatePairOnBoundary_DoesNotSplitSurrogate()
    {
        const string emoji = "\U0001F600";
        var operationName = new string('A', CaseRegistrationDefaults.SurnameMaxLength - 1) + emoji;

        var request = new CaseRegistrationRequest
        {
            Urn = new CaseRegistrationUrn(),
            RegisteringAreaId = 1,
            RegisteringUnitId = 2,
            OperationName = operationName,
            Defendants = new List<CaseRegistrationDefendant>()
        };

        CaseRegistrationNormalizer.NormalizeDefendants(request);

        var defendant = Assert.Single(request.Defendants!);
        var surname = defendant.Surname!;

        // The emoji cannot fit whole within the limit, so it is dropped entirely rather than split.
        Assert.Equal(CaseRegistrationDefaults.SurnameMaxLength - 1, surname.Length);
        Assert.Equal(new string('A', CaseRegistrationDefaults.SurnameMaxLength - 1), surname);
        Assert.DoesNotContain(surname, c => char.IsSurrogate(c));
    }

    [Fact]
    public void NormalizeDefendants_WithNoDefendantsAndSingleOverlongGrapheme_FallsBackToPlaceholderSurname()
    {
        // A base character followed by a long run of combining marks forms one grapheme cluster
        // longer than the max length. Truncating on a text-element boundary would otherwise yield
        // an empty surname, so the normalizer must fall back to the placeholder.
        var operationName = "e" + new string('\u0301', CaseRegistrationDefaults.SurnameMaxLength + 5);

        var request = new CaseRegistrationRequest
        {
            Urn = new CaseRegistrationUrn(),
            RegisteringAreaId = 1,
            RegisteringUnitId = 2,
            OperationName = operationName,
            Defendants = new List<CaseRegistrationDefendant>()
        };

        CaseRegistrationNormalizer.NormalizeDefendants(request);

        var defendant = Assert.Single(request.Defendants!);
        Assert.Equal(CaseRegistrationDefaults.PlaceholderSurname, defendant.Surname);
        Assert.False(string.IsNullOrWhiteSpace(defendant.Surname));
    }

    [Fact]
    public void NormalizeDefendants_WithNoDefendantsAndPaddedOperationName_TrimsSurname()
    {
        var request = new CaseRegistrationRequest
        {
            Urn = new CaseRegistrationUrn(),
            RegisteringAreaId = 1,
            RegisteringUnitId = 2,
            OperationName = "  Operation Nightingale  ",
            Defendants = new List<CaseRegistrationDefendant>()
        };

        CaseRegistrationNormalizer.NormalizeDefendants(request);

        var defendant = Assert.Single(request.Defendants!);
        Assert.Equal("Operation Nightingale", defendant.Surname);
    }
}
