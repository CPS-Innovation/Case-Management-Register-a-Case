namespace Cps.CaseManagement.Api.Validators;

using Cps.CaseManagement.Api.Constants;
using Cps.CaseManagement.MdsClient.Models.Entities;
using FluentValidation;

public class CaseRegistrationDefendantValidator : AbstractValidator<CaseRegistrationDefendant>
{
    public CaseRegistrationDefendantValidator()
    {
        this.RuleFor(x => x.Surname).NotEmpty().MaximumLength(CaseRegistrationDefaults.SurnameMaxLength).When(x => x.IsDefendant);
        this.RuleFor(x => x.Firstname).MaximumLength(CaseRegistrationDefaults.NameMaxLength).When(x => x.IsDefendant);
        this.RuleFor(x => x.CompanyName).NotEmpty().MaximumLength(CaseRegistrationDefaults.CompanyNameMaxLength).When(x => !x.IsDefendant);
        this.RuleFor(x => x.DateOfBirth)
            .LessThanOrEqualTo(DateTime.Today)
            .Must(BeWithinAgeRange)
            .WithMessage($"Date of birth must correspond to an age between {CaseRegistrationDefaults.MinAgeYears} and {CaseRegistrationDefaults.MaxAgeYears} years.")
            .When(x => x.DateOfBirth.HasValue);
        this.RuleFor(x => x.ArrestDate)
            .LessThanOrEqualTo(DateTime.Today)
            .When(x => x.ArrestDate.HasValue);
        this.RuleFor(x => x.JsonPropertyNameArrestSummonsNumber).MaximumLength(CaseRegistrationDefaults.AsnMaxLength);
        this.RuleFor(x => x.Gender).MaximumLength(CaseRegistrationDefaults.ShortCodeMaxLength);
        this.RuleFor(x => x.Disability).MaximumLength(CaseRegistrationDefaults.ShortCodeMaxLength);
        this.RuleFor(x => x.Ethnicity).MaximumLength(CaseRegistrationDefaults.ShortCodeMaxLength);
        this.RuleFor(x => x.Religion).MaximumLength(CaseRegistrationDefaults.ShortCodeMaxLength);
        this.RuleFor(x => x.Type).MaximumLength(CaseRegistrationDefaults.ShortCodeMaxLength);
        this.RuleFor(x => x.Charges).NotEmpty().When(x => !x.IsNotYetCharged);
        this.RuleForEach(x => x.Charges).SetValidator(new CaseRegistrationChargeValidator());
        this.RuleForEach(x => x.Aliases).SetValidator(new CaseRegistrationDefendantAliasValidator());
    }

    private static bool BeWithinAgeRange(DateTime? dateOfBirth)
    {
        if (!dateOfBirth.HasValue)
        {
            return true;
        }

        var today = DateTime.Today;
        var age = today.Year - dateOfBirth.Value.Year;
        if (dateOfBirth.Value.Date > today.AddYears(-age))
        {
            age--;
        }

        return age >= CaseRegistrationDefaults.MinAgeYears && age <= CaseRegistrationDefaults.MaxAgeYears;
    }
}
