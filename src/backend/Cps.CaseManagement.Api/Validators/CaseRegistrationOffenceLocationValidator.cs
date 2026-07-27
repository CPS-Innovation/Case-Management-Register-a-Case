namespace Cps.CaseManagement.Api.Validators;

using Cps.CaseManagement.Api.Constants;
using Cps.CaseManagement.MdsClient.Models.Entities;
using FluentValidation;

public class CaseRegistrationOffenceLocationValidator : AbstractValidator<CaseRegistrationOffenceLocation>
{
    public CaseRegistrationOffenceLocationValidator()
    {
        this.RuleFor(x => x.AddressLine1).MaximumLength(CaseRegistrationDefaults.AddressLineMaxLength);
        this.RuleFor(x => x.AddressLine2).MaximumLength(CaseRegistrationDefaults.AddressLineMaxLength);
        this.RuleFor(x => x.TownCity).MaximumLength(CaseRegistrationDefaults.AddressLineMaxLength);
        this.RuleFor(x => x.Postcode).MaximumLength(CaseRegistrationDefaults.PostcodeMaxLength);
    }
}
