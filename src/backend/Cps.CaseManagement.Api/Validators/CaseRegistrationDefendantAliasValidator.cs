namespace Cps.CaseManagement.Api.Validators;

using Cps.CaseManagement.Api.Constants;
using Cps.CaseManagement.MdsClient.Models.Entities;
using FluentValidation;

public class CaseRegistrationDefendantAliasValidator : AbstractValidator<CaseRegistrationDefendantAlias>
{
    public CaseRegistrationDefendantAliasValidator()
    {
        this.RuleFor(x => x.ListOrder).GreaterThanOrEqualTo(0);
        this.RuleFor(x => x.Surname)
            .MaximumLength(CaseRegistrationDefaults.SurnameMaxLength)
            .Matches(CaseRegistrationInputPatterns.PersonName)
            .WithMessage($"Surname {CaseRegistrationInputPatterns.PersonNameMessage}");
        this.RuleFor(x => x.FirstNames)
            .MaximumLength(CaseRegistrationDefaults.NameMaxLength)
            .Matches(CaseRegistrationInputPatterns.PersonName)
            .WithMessage($"FirstNames {CaseRegistrationInputPatterns.PersonNameMessage}");
    }
}
