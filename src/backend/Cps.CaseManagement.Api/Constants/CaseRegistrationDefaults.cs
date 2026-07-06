namespace Cps.CaseManagement.Api.Constants;

/// <summary>
/// Default CMS short codes applied to defendant details when none are supplied,
/// matching the values CMS itself would otherwise fall back to.
/// </summary>
public static class CaseRegistrationDefaults
{
    public const string Gender = "U";
    public const string Ethnicity = "NS";
    public const string Religion = "NS";
    public const string Type = "UN";
}
