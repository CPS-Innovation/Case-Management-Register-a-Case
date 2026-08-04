namespace Cps.CaseManagement.Api.Models;

using System.Text.Json.Serialization;

/// <summary>
/// Deserialized Cms-Auth-Values cookie payload forwarded to MDS.
/// </summary>
public class CmsAuthRecord
{
    [JsonPropertyName(nameof(Cookies))]
    public string? Cookies { get; init; }

    [JsonPropertyName(nameof(Token))]
    public string? Token { get; init; }
}
