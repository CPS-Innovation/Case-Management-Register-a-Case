namespace Cps.CaseManagement.Api.Validators;

using System.Text.Json;
using Cps.CaseManagement.Api.Exceptions;
using Cps.CaseManagement.Api.Models;

/// <summary>
/// Validates Cms-Auth-Values using the same rules as MDS HeaderToAuthRecordTranslator.
/// </summary>
public static class CmsAuthValuesValidator
{
    private static readonly string[] CmsTokens =
    [
        "ASP.NET_SessionId=",
        "CMSUSER",
        ".CMSAUTH=",
    ];

    public static CmsAuthRecord Validate(string? source)
    {
        if (string.IsNullOrWhiteSpace(source))
        {
            throw new CmsAuthValuesException();
        }

        var cmsAuthRecord = DeserializeCmsAuthRecord(source);
        ValidateCookies(cmsAuthRecord.Cookies);
        ValidateToken(cmsAuthRecord.Token);
        return cmsAuthRecord;
    }

    private static CmsAuthRecord DeserializeCmsAuthRecord(string source)
    {
        CmsAuthRecord? cmsAuthRecord;
        try
        {
            cmsAuthRecord = JsonSerializer.Deserialize<CmsAuthRecord>(source);
        }
        catch (JsonException)
        {
            throw new CmsAuthValuesException();
        }

        if (cmsAuthRecord == null)
        {
            throw new CmsAuthValuesException();
        }

        return cmsAuthRecord;
    }

    private static void ValidateCookies(string? cookies)
    {
        if (string.IsNullOrWhiteSpace(cookies))
        {
            throw new CmsAuthValuesException();
        }

        foreach (var token in CmsTokens)
        {
            if (!cookies.Contains(token, StringComparison.Ordinal))
            {
                throw new CmsAuthValuesException();
            }
        }
    }

    private static void ValidateToken(string? token)
    {
        if (string.IsNullOrWhiteSpace(token))
        {
            throw new CmsAuthValuesException();
        }

        if (!Guid.TryParse(token, out var id))
        {
            throw new CmsAuthValuesException();
        }

        if (id == Guid.Empty)
        {
            throw new CmsAuthValuesException();
        }
    }
}
