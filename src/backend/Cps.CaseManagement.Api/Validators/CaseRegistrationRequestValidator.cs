namespace Cps.CaseManagement.Api.Validators;

using Cps.CaseManagement.Api.Constants;
using Cps.CaseManagement.MdsClient.Models.Entities;
using FluentValidation;

public class CaseRegistrationRequestValidator : AbstractValidator<CaseRegistrationRequest>
{
    public CaseRegistrationRequestValidator()
    {
        this.RuleFor(x => x.Urn).NotNull().SetValidator(new CaseRegistrationUrnValidator());
        this.RuleFor(x => x.RegisteringAreaId).InclusiveBetween(1, CaseRegistrationDefaults.IdMaxValue);
        this.RuleFor(x => x.RegisteringUnitId).InclusiveBetween(1, CaseRegistrationDefaults.IdMaxValue);
        this.RuleFor(x => x.AllocatedWcuId)
            .InclusiveBetween(1, CaseRegistrationDefaults.IdMaxValue)
            .When(x => x.AllocatedWcuId != 0);
        this.RuleFor(x => x.CourtLocationId)
            .InclusiveBetween(1, CaseRegistrationDefaults.IdMaxValue)
            .When(x => x.CourtLocationId != 0);
        this.RuleFor(x => x.ProsecutorId)
            .InclusiveBetween(1, CaseRegistrationDefaults.IdMaxValue)
            .When(x => x.ProsecutorId != 0);

        this.RuleFor(x => x.Crest).MaximumLength(CaseRegistrationDefaults.ShortTextMaxLength);
        this.RuleFor(x => x.OperationName).MaximumLength(CaseRegistrationDefaults.OperationNameMaxLength);
        this.RuleFor(x => x.CourtLocationName).MaximumLength(CaseRegistrationDefaults.ShortTextMaxLength);
        this.RuleFor(x => x.Complexity).MaximumLength(CaseRegistrationDefaults.ShortTextMaxLength);
        this.RuleFor(x => x.CaseWeight).MaximumLength(CaseRegistrationDefaults.ShortTextMaxLength);
        this.RuleFor(x => x.CaseWorker).MaximumLength(CaseRegistrationDefaults.NameMaxLength);
        this.RuleFor(x => x.OicRank).MaximumLength(CaseRegistrationDefaults.ShortTextMaxLength);
        this.RuleFor(x => x.OicSurname)
            .MaximumLength(CaseRegistrationDefaults.SurnameMaxLength)
            .Matches(CaseRegistrationInputPatterns.LettersOnly)
            .WithMessage($"OicSurname {CaseRegistrationInputPatterns.LettersOnlyMessage}");
        this.RuleFor(x => x.OicFirstnames)
            .MaximumLength(CaseRegistrationDefaults.NameMaxLength)
            .Matches(CaseRegistrationInputPatterns.LettersOnly)
            .WithMessage($"OicFirstnames {CaseRegistrationInputPatterns.LettersOnlyMessage}");
        this.RuleFor(x => x.OicShoulderNumber)
            .MaximumLength(CaseRegistrationDefaults.ShortTextMaxLength)
            .Matches(CaseRegistrationInputPatterns.Alphanumeric)
            .WithMessage($"OicShoulderNumber {CaseRegistrationInputPatterns.AlphanumericMessage}");
        this.RuleFor(x => x.OicPoliceUnit).MaximumLength(CaseRegistrationDefaults.ShortTextMaxLength);

        this.RuleFor(x => x.HearingDate)
            .GreaterThanOrEqualTo(DateTime.Today.AddYears(-CaseRegistrationDefaults.HearingDateYearsWindow))
            .LessThanOrEqualTo(DateTime.Today.AddYears(CaseRegistrationDefaults.HearingDateYearsWindow))
            .When(x => x.HearingDate.HasValue);

        this.RuleFor(x => x.MonitoringCodes)
            .Must(codes => codes != null && codes.Any(c => c.Code == "CSEA" && c.Selected))
            .When(x => x.Defendants == null || x.Defendants.Count == 0 || x.Defendants.Any(d => d.Charges == null || d.Charges.Count == 0))
            .WithMessage("The 'Pre-Charge Decision' monitoring code must be selected when there are defendants who are not yet charged or have no charges.");
        this.RuleForEach(x => x.Defendants).SetValidator(new CaseRegistrationDefendantValidator());
        this.RuleForEach(x => x.Victims).SetValidator(new CaseRegistrationVictimValidator());
        this.RuleForEach(x => x.MonitoringCodes).SetValidator(new CaseRegistrationMonitoringCodeValidator());
    }
}
