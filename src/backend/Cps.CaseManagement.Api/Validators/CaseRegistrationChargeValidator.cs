namespace Cps.CaseManagement.Api.Validators;

using Cps.CaseManagement.Api.Constants;
using Cps.CaseManagement.MdsClient.Models.Entities;
using FluentValidation;

public class CaseRegistrationChargeValidator : AbstractValidator<CaseRegistrationCharge>
{
    public CaseRegistrationChargeValidator()
    {
        this.RuleFor(x => x.OffenceCode).NotEmpty().MaximumLength(CaseRegistrationDefaults.OffenceCodeMaxLength);
        this.RuleFor(x => x.OffenceDescription).NotEmpty().MaximumLength(CaseRegistrationDefaults.OffenceDescriptionMaxLength);
        this.RuleFor(x => x.OffenceId).NotEmpty().MaximumLength(CaseRegistrationDefaults.OffenceCodeMaxLength);
        this.RuleFor(x => x.DateFrom).NotNull().LessThanOrEqualTo(DateTime.Today);
        this.RuleFor(x => x.DateTo)
            .LessThanOrEqualTo(DateTime.Today)
            .GreaterThanOrEqualTo(x => x.DateFrom)
            .When(x => x.DateTo.HasValue);
        this.RuleFor(x => x.Comment).MaximumLength(CaseRegistrationDefaults.CommentMaxLength);
        this.RuleFor(x => x.ChargeDetailsSummary).MaximumLength(CaseRegistrationDefaults.FreeTextMaxLength);
        this.RuleFor(x => x.ModeOfTrial).MaximumLength(CaseRegistrationDefaults.ModeOfTrialMaxLength);
        this.RuleFor(x => x.VictimIndexId).GreaterThanOrEqualTo(-1);
        this.RuleFor(x => x.OffenceLocation).SetValidator(new CaseRegistrationOffenceLocationValidator());
    }
}
