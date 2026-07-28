namespace Cps.CaseManagement.Api.Tests.Unit.Validators;

using Cps.CaseManagement.Api.Constants;
using Cps.CaseManagement.Api.Validators;
using Cps.CaseManagement.MdsClient.Models.Entities;
using FluentValidation.TestHelper;

public class CaseRegistrationRequestValidatorTests
{
    private readonly CaseRegistrationRequestValidator _validator = new();

    private CaseRegistrationRequest GetValidRequest()
    {
        return new CaseRegistrationRequest
        {
            Urn = new CaseRegistrationUrn
            {
                UniqueRef = "12345",
                Year = 30,
                PoliceForce = "00",
                PoliceUnit = "BB"
            },
            RegisteringAreaId = 1,
            RegisteringUnitId = 2,
            Defendants = new List<CaseRegistrationDefendant>
            {
                new CaseRegistrationDefendant
                {
                    IsDefendant = true,
                    Surname = "Smith",
                    Charges = new List<CaseRegistrationCharge>
                    {
                        new CaseRegistrationCharge
                        {
                            OffenceCode = "CODE1",
                            OffenceDescription = "Description",
                            OffenceId = "ID1",
                            DateFrom = DateTime.Today,
                            Comment = "Comment"
                        }
                    }
                }
            },
            MonitoringCodes = new List<CaseRegistrationMonitoringCode>
            {
                new CaseRegistrationMonitoringCode("MON1", true)
            }
        };
    }

    [Fact]
    public void Valid_Request_ShouldPass()
    {
        var result = _validator.TestValidate(GetValidRequest());
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Missing_Urn_ShouldFail()
    {
        var req = GetValidRequest();
        req.Urn = null!;
        var result = _validator.TestValidate(req);
        result.ShouldHaveValidationErrorFor(x => x.Urn);
    }

    [Fact]
    public void Urn_UniqueRef_Empty_ShouldFail()
    {
        var req = GetValidRequest();
        var urn = new CaseRegistrationUrn
        {
            PoliceForce = "12",
            PoliceUnit = "EL",
            UniqueRef = "",
            Year = 25
        };
        req.Urn = urn;
        var result = _validator.TestValidate(req);

        Assert.Contains(result.Errors, e => e.PropertyName == "Urn.UniqueRef"
                                                    && e.ErrorMessage.Contains("UniqueRef is required"));
    }

    [Fact]
    public void Urn_PoliceForce_Empty_ShouldFail()
    {
        var req = GetValidRequest();
        var urn = new CaseRegistrationUrn
        {
            PoliceForce = "",
            PoliceUnit = "EL",
            UniqueRef = "00001",
            Year = 25
        };
        req.Urn = urn;
        var result = _validator.TestValidate(req);

        Assert.Contains(result.Errors, e => e.PropertyName == "Urn.PoliceForce"
                                                    && e.ErrorMessage.Contains("PoliceForce is required"));
    }

    [Fact]
    public void Urn_PoliceUnit_Empty_ShouldFail()
    {
        var req = GetValidRequest();
        var urn = new CaseRegistrationUrn
        {
            PoliceForce = "12",
            PoliceUnit = "",
            UniqueRef = "00001",
            Year = 25
        };
        req.Urn = urn;
        var result = _validator.TestValidate(req);

        Assert.Contains(result.Errors, e => e.PropertyName == "Urn.PoliceUnit"
                                            && e.ErrorMessage.Contains("PoliceUnit is required"));
    }

    [Fact]
    public void Valid_AllFieldsAreValid_IsValid()
    {
        var req = GetValidRequest();
        var urn = new CaseRegistrationUrn
        {
            PoliceForce = "12",
            PoliceUnit = "EL",
            UniqueRef = "00001",
            Year = 25
        };
        req.Urn = urn;

        var result = _validator.TestValidate(req);

        Assert.True(result.IsValid);
    }

    [Fact]
    public void Valid_WhitespaceAndLowercase_Accepted()
    {
        var req = GetValidRequest();
        var urn = new CaseRegistrationUrn
        {
            PoliceForce = " 12 ",
            PoliceUnit = "el",
            UniqueRef = " 00001 ",
            Year = 0
        };
        req.Urn = urn;

        var result = _validator.TestValidate(req);

        Assert.True(result.IsValid);
    }

    [Fact]
    public void Invalid_PoliceForce_TooShort_Fails()
    {
        var req = GetValidRequest();
        var urn = new CaseRegistrationUrn
        {
            PoliceForce = "1",
            PoliceUnit = "EL",
            UniqueRef = "12345",
            Year = 25
        };
        req.Urn = urn;

        var result = _validator.TestValidate(req);

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == "Urn.PoliceForce"
                                            && e.ErrorMessage.Contains("PoliceForce must be exactly 2 digits"));
    }

    [Fact]
    public void Invalid_PoliceForce_NonDigits_Fails()
    {
        var req = GetValidRequest();
        var urn = new CaseRegistrationUrn
        {
            PoliceForce = "AA",
            PoliceUnit = "EL",
            UniqueRef = "12345",
            Year = 25
        };
        req.Urn = urn;

        var result = _validator.TestValidate(req);

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == "Urn.PoliceForce"
                                            && e.ErrorMessage.Contains("PoliceForce must be exactly 2 digits"));
    }

    [Fact]
    public void Invalid_PoliceUnit_InvalidChars_Fails()
    {
        var req = GetValidRequest();
        var urn = new CaseRegistrationUrn
        {
            PoliceForce = "12",
            PoliceUnit = "E!",
            UniqueRef = "12345",
            Year = 25
        };
        req.Urn = urn;

        var result = _validator.TestValidate(req);

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == "Urn.PoliceUnit"
                                            && e.ErrorMessage.Contains("PoliceUnit must be exactly 2 alphanumeric"));
    }

    [Fact]
    public void Invalid_PoliceUnit_TooLong_Fails()
    {
        var req = GetValidRequest();
        var urn = new CaseRegistrationUrn
        {
            PoliceForce = "12",
            PoliceUnit = "ELX",
            UniqueRef = "12345",
            Year = 25
        };
        req.Urn = urn;

        var result = _validator.TestValidate(req);

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == "Urn.PoliceUnit"
                                            && e.ErrorMessage.Contains("PoliceUnit must be exactly 2 alphanumeric"));
    }

    [Fact]
    public void Invalid_UniqueRef_TooShort_Fails()
    {
        var req = GetValidRequest();
        var urn = new CaseRegistrationUrn
        {
            PoliceForce = "12",
            PoliceUnit = "EL",
            UniqueRef = "1234",
            Year = 25
        };
        req.Urn = urn;

        var result = _validator.TestValidate(req);

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == "Urn.UniqueRef"
                                            && e.ErrorMessage.Contains("UniqueRef must be exactly 5 digits"));
    }

    [Fact]
    public void Invalid_UniqueRef_NonDigits_Fails()
    {
        var req = GetValidRequest();
        var urn = new CaseRegistrationUrn
        {
            PoliceForce = "12",
            PoliceUnit = "EL",
            UniqueRef = "12A45",
            Year = 25
        };
        req.Urn = urn;

        var result = _validator.TestValidate(req);

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == "Urn.UniqueRef"
                                            && e.ErrorMessage.Contains("UniqueRef must be exactly 5 digits"));
    }

    [Fact]
    public void Invalid_Year_BelowRange_Fails()
    {
        var req = GetValidRequest();
        var urn = new CaseRegistrationUrn
        {
            PoliceForce = "12",
            PoliceUnit = "EL",
            UniqueRef = "12345",
            Year = -1
        };
        req.Urn = urn;

        var result = _validator.TestValidate(req);

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == "Urn.Year"
                                            && e.ErrorMessage.Contains("Year must be a 2-digit value"));
    }

    [Fact]
    public void Invalid_Year_AboveRange_Fails()
    {
        var req = GetValidRequest();
        var urn = new CaseRegistrationUrn
        {
            PoliceForce = "12",
            PoliceUnit = "EL",
            UniqueRef = "12345",
            Year = 100
        };
        req.Urn = urn;

        var result = _validator.TestValidate(req);

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == "Urn.Year"
                                            && e.ErrorMessage.Contains("Year must be a 2-digit value"));
    }

    [Theory]
    [InlineData(0)]
    [InlineData(99)]
    public void Valid_Year_Boundaries_Accepted(int year)
    {
        var req = GetValidRequest();
        var urn = new CaseRegistrationUrn
        {
            PoliceForce = "12",
            PoliceUnit = "EL",
            UniqueRef = "12345",
            Year = year
        };
        req.Urn = urn;

        var result = _validator.TestValidate(req);

        Assert.True(result.IsValid);
    }

    [Fact]
    public void RegisteringAreaId_Zero_ShouldFail()
    {
        var req = GetValidRequest();
        req.RegisteringAreaId = 0;
        var result = _validator.TestValidate(req);
        result.ShouldHaveValidationErrorFor(x => x.RegisteringAreaId);
    }

    [Fact]
    public void RegisteringUnitId_Zero_ShouldFail()
    {
        var req = GetValidRequest();
        req.RegisteringUnitId = 0;
        var result = _validator.TestValidate(req);
        result.ShouldHaveValidationErrorFor(x => x.RegisteringUnitId);
    }

    [Fact]
    public void Defendant_Surname_Empty_ShouldFail()
    {
        var req = GetValidRequest();
        if (req.Defendants != null && req.Defendants.Count > 0)
        {
            var defendants = req.Defendants.ToList();
            defendants[0].Surname = "";
            req.Defendants = defendants;
        }
        var result = _validator.TestValidate(req);
        result.ShouldHaveValidationErrorFor("Defendants[0].Surname");
    }

    [Fact]
    public void Defendant_Surname_NotRequired_WhenNotDefendant_ShouldPass()
    {
        var req = GetValidRequest();
        if (req.Defendants != null && req.Defendants.Count > 0)
        {
            var defendants = req.Defendants.ToList();
            defendants[0].IsDefendant = false;
            defendants[0].Surname = "";
            defendants[0].CompanyName = "Acme Ltd";
            req.Defendants = defendants;
        }
        var result = _validator.TestValidate(req);
        result.ShouldNotHaveValidationErrorFor("Defendants[0].Surname");
    }

    [Fact]
    public void Defendant_CompanyName_Empty_WhenNotDefendant_ShouldFail()
    {
        var req = GetValidRequest();
        if (req.Defendants != null && req.Defendants.Count > 0)
        {
            var defendants = req.Defendants.ToList();
            defendants[0].IsDefendant = false;
            defendants[0].CompanyName = "";
            req.Defendants = defendants;
        }
        var result = _validator.TestValidate(req);
        result.ShouldHaveValidationErrorFor("Defendants[0].CompanyName");
    }

    [Fact]
    public void Defendant_CompanyName_Valid_WhenNotDefendant_ShouldPass()
    {
        var req = GetValidRequest();
        if (req.Defendants != null && req.Defendants.Count > 0)
        {
            var defendants = req.Defendants.ToList();
            defendants[0].IsDefendant = false;
            defendants[0].CompanyName = "Acme Ltd";
            req.Defendants = defendants;
        }
        var result = _validator.TestValidate(req);
        result.ShouldNotHaveValidationErrorFor("Defendants[0].CompanyName");
    }

    [Fact]
    public void Defendant_Charges_Empty_ShouldFail()
    {
        var req = GetValidRequest();
        if (req.Defendants != null && req.Defendants.Count > 0)
        {
            var defendants = req.Defendants.ToList();
            defendants[0].Charges = [];
            req.Defendants = defendants;
        }
        var result = _validator.TestValidate(req);
        result.ShouldHaveValidationErrorFor("Defendants[0].Charges");
    }

    [Fact]
    public void Defendant_Charges_Empty_AndNotYetCharged_ShouldNotFail()
    {
        var req = GetValidRequest();
        if (req.Defendants != null && req.Defendants.Count > 0)
        {
            var defendants = req.Defendants.ToList();
            defendants[0].Charges = [];
            defendants[0].IsNotYetCharged = true;
            req.Defendants = defendants;
        }
        var result = _validator.TestValidate(req);
        result.ShouldNotHaveValidationErrorFor("Defendants[0].Charges");
    }

    [Fact]
    public void Charge_OffenceCode_Empty_ShouldFail()
    {
        var req = GetValidRequest();
        if (req.Defendants != null && req.Defendants.Count > 0)
        {
            var defendants = req.Defendants.ToList();
            var charges = defendants[0].Charges?.ToList();
            if (charges != null && charges.Count > 0)
            {
                charges[0].OffenceCode = "";
                defendants[0].Charges = charges;
                req.Defendants = defendants;
            }
        }
        var result = _validator.TestValidate(req);
        result.ShouldHaveValidationErrorFor("Defendants[0].Charges[0].OffenceCode");
    }

    [Fact]
    public void Charge_OffenceDescription_Empty_ShouldFail()
    {
        var req = GetValidRequest();
        if (req.Defendants != null && req.Defendants.Count > 0)
        {
            var defendants = req.Defendants.ToList();
            var charges = defendants[0].Charges?.ToList();
            if (charges != null && charges.Count > 0)
            {
                charges[0].OffenceDescription = "";
                defendants[0].Charges = charges;
                req.Defendants = defendants;
            }
        }
        var result = _validator.TestValidate(req);
        result.ShouldHaveValidationErrorFor("Defendants[0].Charges[0].OffenceDescription");
    }

    [Fact]
    public void Charge_OffenceId_Empty_ShouldFail()
    {
        var req = GetValidRequest();
        if (req.Defendants != null && req.Defendants.Count > 0)
        {
            var defendants = req.Defendants.ToList();
            var charges = defendants[0].Charges?.ToList();
            if (charges != null && charges.Count > 0)
            {
                charges[0].OffenceId = "";
                defendants[0].Charges = charges;
                req.Defendants = defendants;
            }
        }
        var result = _validator.TestValidate(req);
        result.ShouldHaveValidationErrorFor("Defendants[0].Charges[0].OffenceId");
    }

    [Fact]
    public void Charge_DateFrom_Future_ShouldFail()
    {
        var req = GetValidRequest();
        if (req.Defendants != null && req.Defendants.Count > 0)
        {
            var defendants = req.Defendants.ToList();
            var charges = defendants[0].Charges?.ToList();
            if (charges != null && charges.Count > 0)
            {
                charges[0].DateFrom = DateTime.Today.AddDays(1);
                defendants[0].Charges = charges;
                req.Defendants = defendants;
            }
        }
        var result = _validator.TestValidate(req);
        result.ShouldHaveValidationErrorFor("Defendants[0].Charges[0].DateFrom");
    }

    [Fact]
    public void MonitoringCode_Code_Empty_ShouldFail()
    {
        var req = GetValidRequest();
        if (req.MonitoringCodes != null && req.MonitoringCodes.Count > 0)
        {
            var codes = req.MonitoringCodes.ToList();
            codes[0] = new CaseRegistrationMonitoringCode("", true);
            req.MonitoringCodes = codes;
        }
        var result = _validator.TestValidate(req);
        result.ShouldHaveValidationErrorFor("MonitoringCodes[0].Code");
    }

    [Fact]
    public void MonitoringCodes_MissingSelectedCsea_WhenDefendantIsNotYetCharged_ShouldFail()
    {
        var req = GetValidRequest();
        var defendants = req.Defendants!.ToList();
        defendants[0].Charges = [];
        defendants[0].IsNotYetCharged = true;
        req.Defendants = defendants;
        req.MonitoringCodes = [new CaseRegistrationMonitoringCode("MON1", true)];

        var result = _validator.TestValidate(req);

        result.ShouldHaveValidationErrorFor(x => x.MonitoringCodes);
    }

    [Fact]
    public void MonitoringCodes_CseaPresent_ButNotSelected_WhenDefendantIsNotYetCharged_ShouldFail()
    {
        var req = GetValidRequest();
        var defendants = req.Defendants!.ToList();
        defendants[0].Charges = [];
        defendants[0].IsNotYetCharged = true;
        req.Defendants = defendants;
        req.MonitoringCodes = [new CaseRegistrationMonitoringCode("CSEA", false)];

        var result = _validator.TestValidate(req);

        result.ShouldHaveValidationErrorFor(x => x.MonitoringCodes);
    }

    [Fact]
    public void MonitoringCodes_CseaSelectedPresent_WhenDefendantIsNotYetCharged_ShouldPass()
    {
        var req = GetValidRequest();
        var defendants = req.Defendants!.ToList();
        defendants[0].Charges = [];
        defendants[0].IsNotYetCharged = true;
        req.Defendants = defendants;
        req.MonitoringCodes = [new CaseRegistrationMonitoringCode("CSEA", true)];

        var result = _validator.TestValidate(req);

        result.ShouldNotHaveValidationErrorFor(x => x.MonitoringCodes);
    }

    [Fact]
    public void MonitoringCodes_CseaSelectedPresent_WithMultipleDefendants_WhenOneDefendantIsNotYetCharged_ShouldPass()
    {
        var req = GetValidRequest();
        var defendants = req.Defendants!.ToList();
        var secondDefendant = new CaseRegistrationDefendant
        {
            IsDefendant = true,
            Surname = "Doe",
            Charges = [],
            IsNotYetCharged = true
        };
        defendants.Add(secondDefendant);
        req.Defendants = defendants;
        req.MonitoringCodes = [new CaseRegistrationMonitoringCode("CSEA", true)];

        var result = _validator.TestValidate(req);

        result.ShouldNotHaveValidationErrorFor(x => x.MonitoringCodes);
    }

    [Fact]
    public void MonitoringCodes_CseaNotSelectedPresent_WithMultipleDefendants_WhenOneDefendantIsNotYetCharged_ShouldFail()
    {
        var req = GetValidRequest();
        var defendants = req.Defendants!.ToList();
        var secondDefendant = new CaseRegistrationDefendant
        {
            IsDefendant = true,
            Surname = "Doe",
            Charges = [],
            IsNotYetCharged = true
        };
        defendants.Add(secondDefendant);
        req.Defendants = defendants;
        req.MonitoringCodes = [new CaseRegistrationMonitoringCode("CSEA", false)];

        var result = _validator.TestValidate(req);

        result.ShouldHaveValidationErrorFor(x => x.MonitoringCodes);
        Assert.Contains(result.Errors, e => e.PropertyName == "MonitoringCodes"
                                            && e.ErrorMessage.Contains("The 'Pre-Charge Decision' monitoring code must be selected"));
    }

    [Fact]
    public void MonitoringCodes_CseaNotPresent_WithMultipleDefendants_WhenOneDefendantIsNotYetCharged_ShouldFail()
    {
        var req = GetValidRequest();
        var defendants = req.Defendants!.ToList();
        var secondDefendant = new CaseRegistrationDefendant
        {
            IsDefendant = true,
            Surname = "Doe",
            Charges = [],
            IsNotYetCharged = true
        };
        defendants.Add(secondDefendant);
        req.Defendants = defendants;
        req.MonitoringCodes = [];

        var result = _validator.TestValidate(req);

        result.ShouldHaveValidationErrorFor(x => x.MonitoringCodes);
        Assert.Contains(result.Errors, e => e.PropertyName == "MonitoringCodes"
                                            && e.ErrorMessage.Contains("The 'Pre-Charge Decision' monitoring code must be selected"));
    }

    [Fact]
    public void MonitoringCodes_MissingCsea_WhenDefendantHasNullCharges_ShouldFail()
    {
        var req = GetValidRequest();
        var defendants = req.Defendants!.ToList();
        defendants[0].Charges = null;
        req.Defendants = defendants;
        req.MonitoringCodes = [new CaseRegistrationMonitoringCode("MON1", true)];

        var result = _validator.TestValidate(req);

        result.ShouldHaveValidationErrorFor(x => x.MonitoringCodes);

    }

    [Fact]
    public void MonitoringCodes_NoCseaRequired_WhenAllDefendantsAreCharged_ShouldPass()
    {
        var req = GetValidRequest();
        req.MonitoringCodes = [new CaseRegistrationMonitoringCode("MON1", true)];

        var result = _validator.TestValidate(req);

        result.ShouldNotHaveValidationErrorFor(x => x.MonitoringCodes);
    }

    [Fact]
    public void MonitoringCodes_MissingCsea_WhenNoDefendantsAreAdded_ShouldFail()
    {
        var req = GetValidRequest();
        req.Defendants = [];
        req.MonitoringCodes = [];

        var result = _validator.TestValidate(req);

        result.ShouldHaveValidationErrorFor(x => x.MonitoringCodes);
    }

    [Fact]
    public void MonitoringCodes_MissingCsea_WhenDefendantsAreNull_ShouldFail()
    {
        var req = GetValidRequest();
        req.Defendants = null;
        req.MonitoringCodes = [];

        var result = _validator.TestValidate(req);

        result.ShouldHaveValidationErrorFor(x => x.MonitoringCodes);
    }

    
    [Fact]
    public void MonitoringCodes_CseaRequired_WhenNoDefendantsAreAdded_ShouldPass()
    {
        var req = GetValidRequest();
        req.Defendants = [];
        req.MonitoringCodes = [new CaseRegistrationMonitoringCode("CSEA", true)];

        var result = _validator.TestValidate(req);

        result.ShouldNotHaveValidationErrorFor(x => x.MonitoringCodes);
    }

    [Fact]
    public void RegisteringAreaId_LargeId_ShouldPass()
    {
        var req = GetValidRequest();
        req.RegisteringAreaId = 2_856_101;
        var result = _validator.TestValidate(req);
        result.ShouldNotHaveValidationErrorFor(x => x.RegisteringAreaId);
    }

    [Fact]
    public void RegisteringUnitId_LargeId_ShouldPass()
    {
        var req = GetValidRequest();
        req.RegisteringUnitId = 2_856_101;
        var result = _validator.TestValidate(req);
        result.ShouldNotHaveValidationErrorFor(x => x.RegisteringUnitId);
    }

    [Fact]
    public void RegisteringUnitId_Negative_ShouldFail()
    {
        var req = GetValidRequest();
        req.RegisteringUnitId = -1;
        var result = _validator.TestValidate(req);
        result.ShouldHaveValidationErrorFor(x => x.RegisteringUnitId);
    }

    [Fact]
    public void OptionalIds_Zero_ShouldPass()
    {
        var req = GetValidRequest();
        req.AllocatedWcuId = 0;
        req.CourtLocationId = 0;
        req.ProsecutorId = 0;
        var result = _validator.TestValidate(req);
        result.ShouldNotHaveValidationErrorFor(x => x.AllocatedWcuId);
        result.ShouldNotHaveValidationErrorFor(x => x.CourtLocationId);
        result.ShouldNotHaveValidationErrorFor(x => x.ProsecutorId);
    }

    [Fact]
    public void OptionalIds_LargeIds_ShouldPass()
    {
        var req = GetValidRequest();
        req.AllocatedWcuId = 2_856_101;
        req.CourtLocationId = 2_029_012;
        req.ProsecutorId = 2_856_101;
        var result = _validator.TestValidate(req);
        result.ShouldNotHaveValidationErrorFor(x => x.AllocatedWcuId);
        result.ShouldNotHaveValidationErrorFor(x => x.CourtLocationId);
        result.ShouldNotHaveValidationErrorFor(x => x.ProsecutorId);
    }

    [Fact]
    public void OperationName_TooLong_ShouldFail()
    {
        var req = GetValidRequest();
        req.OperationName = new string('A', CaseRegistrationDefaults.OperationNameMaxLength + 1);
        var result = _validator.TestValidate(req);
        result.ShouldHaveValidationErrorFor(x => x.OperationName);
    }

    [Fact]
    public void OicSurname_TooLong_ShouldFail()
    {
        var req = GetValidRequest();
        req.OicSurname = new string('A', CaseRegistrationDefaults.SurnameMaxLength + 1);
        var result = _validator.TestValidate(req);
        result.ShouldHaveValidationErrorFor(x => x.OicSurname);
    }

    [Fact]
    public void HearingDate_OutsideWindow_ShouldFail()
    {
        var req = GetValidRequest();
        req.HearingDate = DateTime.Today.AddYears(-(CaseRegistrationDefaults.HearingDateYearsWindow + 1));
        var result = _validator.TestValidate(req);
        result.ShouldHaveValidationErrorFor(x => x.HearingDate);
    }

    [Fact]
    public void Defendant_DateOfBirth_ThousandsOfYearsAgo_ShouldFail()
    {
        var req = GetValidRequest();
        var defendants = req.Defendants!.ToList();
        defendants[0].DateOfBirth = new DateTime(1, 1, 1);
        req.Defendants = defendants;
        var result = _validator.TestValidate(req);
        result.ShouldHaveValidationErrorFor("Defendants[0].DateOfBirth");
    }

    [Fact]
    public void Defendant_DateOfBirth_Future_ShouldFail()
    {
        var req = GetValidRequest();
        var defendants = req.Defendants!.ToList();
        defendants[0].DateOfBirth = DateTime.Today.AddDays(1);
        req.Defendants = defendants;
        var result = _validator.TestValidate(req);
        result.ShouldHaveValidationErrorFor("Defendants[0].DateOfBirth");
    }

    [Fact]
    public void Defendant_DateOfBirth_AgeBelowMinimum_ShouldFail()
    {
        var req = GetValidRequest();
        var defendants = req.Defendants!.ToList();
        defendants[0].DateOfBirth = DateTime.Today.AddYears(-(CaseRegistrationDefaults.MinAgeYears - 1));
        req.Defendants = defendants;
        var result = _validator.TestValidate(req);
        result.ShouldHaveValidationErrorFor("Defendants[0].DateOfBirth");
    }

    [Fact]
    public void Defendant_DateOfBirth_AgeAboveMaximum_ShouldFail()
    {
        var req = GetValidRequest();
        var defendants = req.Defendants!.ToList();
        defendants[0].DateOfBirth = DateTime.Today.AddYears(-(CaseRegistrationDefaults.MaxAgeYears + 1));
        req.Defendants = defendants;
        var result = _validator.TestValidate(req);
        result.ShouldHaveValidationErrorFor("Defendants[0].DateOfBirth");
    }

    [Fact]
    public void Defendant_DateOfBirth_ValidAge_ShouldPass()
    {
        var req = GetValidRequest();
        var defendants = req.Defendants!.ToList();
        defendants[0].DateOfBirth = DateTime.Today.AddYears(-30);
        req.Defendants = defendants;
        var result = _validator.TestValidate(req);
        result.ShouldNotHaveValidationErrorFor("Defendants[0].DateOfBirth");
    }

    [Fact]
    public void Defendant_Firstname_TooLong_ShouldFail()
    {
        var req = GetValidRequest();
        var defendants = req.Defendants!.ToList();
        defendants[0].Firstname = new string('A', CaseRegistrationDefaults.NameMaxLength + 1);
        req.Defendants = defendants;
        var result = _validator.TestValidate(req);
        result.ShouldHaveValidationErrorFor("Defendants[0].Firstname");
    }

    [Fact]
    public void Defendant_Asn_TooLong_ShouldFail()
    {
        var req = GetValidRequest();
        var defendants = req.Defendants!.ToList();
        defendants[0].JsonPropertyNameArrestSummonsNumber = new string('A', CaseRegistrationDefaults.AsnMaxLength + 1);
        req.Defendants = defendants;
        var result = _validator.TestValidate(req);
        result.ShouldHaveValidationErrorFor("Defendants[0].JsonPropertyNameArrestSummonsNumber");
    }

    [Fact]
    public void Defendant_Alias_SurnameTooLong_ShouldFail()
    {
        var req = GetValidRequest();
        var defendants = req.Defendants!.ToList();
        defendants[0].Aliases =
        [
            new CaseRegistrationDefendantAlias(0, new string('A', CaseRegistrationDefaults.SurnameMaxLength + 1), "John")
        ];
        req.Defendants = defendants;
        var result = _validator.TestValidate(req);
        result.ShouldHaveValidationErrorFor("Defendants[0].Aliases[0].Surname");
    }

    [Fact]
    public void Victim_SurnameTooLong_ShouldFail()
    {
        var req = GetValidRequest();
        req.Victims =
        [
            new CaseRegistrationVictim
            {
                Surname = new string('A', CaseRegistrationDefaults.SurnameMaxLength + 1),
                Forename = "Jane"
            }
        ];
        var result = _validator.TestValidate(req);
        result.ShouldHaveValidationErrorFor("Victims[0].Surname");
    }

    [Fact]
    public void Charge_DateTo_BeforeDateFrom_ShouldFail()
    {
        var req = GetValidRequest();
        var defendants = req.Defendants!.ToList();
        var charges = defendants[0].Charges!.ToList();
        charges[0].DateFrom = DateTime.Today.AddDays(-1);
        charges[0].DateTo = DateTime.Today.AddDays(-2);
        defendants[0].Charges = charges;
        req.Defendants = defendants;
        var result = _validator.TestValidate(req);
        result.ShouldHaveValidationErrorFor("Defendants[0].Charges[0].DateTo");
    }

    [Fact]
    public void Charge_OffenceLocation_AddressTooLong_ShouldFail()
    {
        var req = GetValidRequest();
        var defendants = req.Defendants!.ToList();
        var charges = defendants[0].Charges!.ToList();
        charges[0].OffenceLocation = new CaseRegistrationOffenceLocation
        {
            AddressLine1 = new string('A', CaseRegistrationDefaults.AddressLineMaxLength + 1)
        };
        defendants[0].Charges = charges;
        req.Defendants = defendants;
        var result = _validator.TestValidate(req);
        result.ShouldHaveValidationErrorFor("Defendants[0].Charges[0].OffenceLocation.AddressLine1");
    }

    [Fact]
    public void MonitoringCode_Code_TooLong_ShouldFail()
    {
        var req = GetValidRequest();
        req.MonitoringCodes = [new CaseRegistrationMonitoringCode(new string('A', CaseRegistrationDefaults.MonitoringCodeMaxLength + 1), true)];
        var result = _validator.TestValidate(req);
        result.ShouldHaveValidationErrorFor("MonitoringCodes[0].Code");
    }
}
