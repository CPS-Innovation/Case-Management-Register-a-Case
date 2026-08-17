namespace Cps.CaseManagement.MdsClient.Models.Args;

public class MdsBaseArgDto
{
    public required string CmsAuthValues { get; set; }
    public Guid CorrelationId { get; set; }
}
