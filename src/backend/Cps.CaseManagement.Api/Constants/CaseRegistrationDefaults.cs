namespace Cps.CaseManagement.Api.Constants;

/// <summary>
/// Default values applied to defendant details when none are supplied,
/// matching the values CMS itself would otherwise fall back to.
/// </summary>
public static class CaseRegistrationDefaults
{
    public const string Gender = "U";
    public const string Ethnicity = "NS";
    public const string Religion = "NS";
    public const string Type = "UN";

    /// <summary>
    /// Fallback surname for the placeholder defendant injected when a case is
    /// registered without defendants and no operation name is supplied. CMS
    /// rejects a blank surname, so a non-empty value must always be provided.
    /// </summary>
    public const string PlaceholderSurname = "Unknown";

    /// <summary>
    /// Maximum length CMS accepts for a defendant surname.
    /// </summary>
    public const int SurnameMaxLength = 35;
}
