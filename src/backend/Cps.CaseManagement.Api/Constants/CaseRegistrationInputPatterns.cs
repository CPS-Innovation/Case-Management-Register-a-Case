namespace Cps.CaseManagement.Api.Constants;

/// <summary>
/// Regex patterns for case registration input validation, matching SPA sanitisation rules.
/// </summary>
public static class CaseRegistrationInputPatterns
{
    /// <summary>
    /// Person names: Unicode letters, apostrophes, full stops, spaces and hyphens.
    /// Matches ui-spa sanitizeNameText.
    /// </summary>
    public const string PersonName = @"^[\p{L}.' \-]*$";

    /// <summary>
    /// OIC first/surname after case-assignee sanitisation: ASCII letters only.
    /// </summary>
    public const string LettersOnly = @"^[A-Za-z]*$";

    /// <summary>
    /// ASN and OIC shoulder number: ASCII alphanumeric.
    /// Matches ui-spa sanitizeASNText / case-assignee shoulder number.
    /// </summary>
    public const string Alphanumeric = @"^[A-Za-z0-9]*$";

    public const string PersonNameMessage = "must contain only letters, apostrophes, full stops, spaces and hyphens.";
    public const string LettersOnlyMessage = "must contain only letters.";
    public const string AlphanumericMessage = "must contain only letters and numbers.";
}
