namespace Cps.CaseManagement.Api.Constants;

/// <summary>
/// Default values applied to defendant details when none are supplied,
/// matching the values CMS itself would otherwise fall back to.
/// Also holds validation limits for case registration requests.
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

    public const int NameMaxLength = 50;
    public const int CompanyNameMaxLength = 100;
    public const int OperationNameMaxLength = 50;
    public const int AsnMaxLength = 30;
    public const int OffenceCodeMaxLength = 10;
    public const int OffenceDescriptionMaxLength = 255;
    public const int CommentMaxLength = 255;
    public const int MonitoringCodeMaxLength = 20;
    public const int ShortCodeMaxLength = 10;
    public const int ShortTextMaxLength = 100;
    public const int FreeTextMaxLength = 255;
    public const int AddressLineMaxLength = 100;
    public const int PostcodeMaxLength = 10;
    public const int ModeOfTrialMaxLength = 50;

    /// <summary>
    /// Upper bound for positive int IDs (area, unit, court, prosecutor, WCU).
    /// MDS/CMS identifiers can exceed 6 digits.
    /// </summary>
    public const int IdMaxValue = int.MaxValue;

    public const int MinAgeYears = 10;
    public const int MaxAgeYears = 120;

    public const int HearingDateYearsWindow = 2;
}
