namespace Cps.CaseManagement.Api.Validators;

using Cps.CaseManagement.Api.Constants;
using Cps.CaseManagement.MdsClient.Models.Entities;
using FluentValidation;

public class CaseRegistrationMonitoringCodeValidator : AbstractValidator<CaseRegistrationMonitoringCode>
{
    public CaseRegistrationMonitoringCodeValidator()
    {
        this.RuleFor(x => x.Code).NotEmpty().MaximumLength(CaseRegistrationDefaults.MonitoringCodeMaxLength);
    }
}
