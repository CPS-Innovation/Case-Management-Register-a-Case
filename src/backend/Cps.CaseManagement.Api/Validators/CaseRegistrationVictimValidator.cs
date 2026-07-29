namespace Cps.CaseManagement.Api.Validators;

using Cps.CaseManagement.Api.Constants;
using Cps.CaseManagement.MdsClient.Models.Entities;
using FluentValidation;

public class CaseRegistrationVictimValidator : AbstractValidator<CaseRegistrationVictim>
{
    public CaseRegistrationVictimValidator()
    {
        this.RuleFor(x => x.Surname)
            .MaximumLength(CaseRegistrationDefaults.SurnameMaxLength)
            .Matches(CaseRegistrationInputPatterns.PersonName)
            .WithMessage($"Surname {CaseRegistrationInputPatterns.PersonNameMessage}");
        this.RuleFor(x => x.Forename)
            .MaximumLength(CaseRegistrationDefaults.NameMaxLength)
            .Matches(CaseRegistrationInputPatterns.PersonName)
            .WithMessage($"Forename {CaseRegistrationInputPatterns.PersonNameMessage}");
    }
}
