namespace Cps.CaseManagement.Api.Validators;

using Cps.CaseManagement.Api.Constants;
using Cps.CaseManagement.MdsClient.Models.Entities;
using FluentValidation;

public class CaseRegistrationDefendantValidator : AbstractValidator<CaseRegistrationDefendant>
{
    public CaseRegistrationDefendantValidator()
    {
        this.RuleFor(x => x.Surname).NotEmpty().MaximumLength(CaseRegistrationDefaults.SurnameMaxLength).When(x => x.IsDefendant);
        this.RuleFor(x => x.CompanyName).NotEmpty().MaximumLength(100).When(x => !x.IsDefendant);
        this.RuleFor(x => x.Charges).NotEmpty().When(x => !x.IsNotYetCharged);
        this.RuleForEach(x => x.Charges).SetValidator(new CaseRegistrationChargeValidator());
    }
}