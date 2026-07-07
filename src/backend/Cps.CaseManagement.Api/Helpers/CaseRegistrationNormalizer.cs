namespace Cps.CaseManagement.Api.Helpers;

using System.Globalization;
using Cps.CaseManagement.Api.Constants;
using Cps.CaseManagement.MdsClient.Models.Entities;

public static class CaseRegistrationNormalizer
{
    public static void NormalizeDefendants(CaseRegistrationRequest request)
    {
        if (request.Defendants is null || request.Defendants.Count == 0)
        {
            request.Defendants =
            [
                new CaseRegistrationDefendant
                {
                    IsDefendant = true,
                    Surname = BuildPlaceholderSurname(request.OperationName),
                    IsNotYetCharged = true,
                    Gender = CaseRegistrationDefaults.Gender,
                    Ethnicity = CaseRegistrationDefaults.Ethnicity,
                    Religion = CaseRegistrationDefaults.Religion,
                    Type = CaseRegistrationDefaults.Type,
                }
            ];
            return;
        }

        foreach (var defendant in request.Defendants)
        {
            if (defendant.IsDefendant)
            {
                if (string.IsNullOrWhiteSpace(defendant.Gender))
                {
                    defendant.Gender = CaseRegistrationDefaults.Gender;
                }

                if (string.IsNullOrWhiteSpace(defendant.Ethnicity))
                {
                    defendant.Ethnicity = CaseRegistrationDefaults.Ethnicity;
                }

                if (string.IsNullOrWhiteSpace(defendant.Religion))
                {
                    defendant.Religion = CaseRegistrationDefaults.Religion;
                }

                if (string.IsNullOrWhiteSpace(defendant.Type))
                {
                    defendant.Type = CaseRegistrationDefaults.Type;
                }
            }
        }
    }

    private static string BuildPlaceholderSurname(string? operationName)
    {
        var surname = string.IsNullOrWhiteSpace(operationName)
            ? CaseRegistrationDefaults.PlaceholderSurname
            : operationName.Trim();

        var truncated = TruncateToTextElements(surname, CaseRegistrationDefaults.SurnameMaxLength);

        // Fall back to the placeholder if the truncated surname is empty so we never emit a blank
        // surname that later validation would reject.
        return string.IsNullOrEmpty(truncated)
            ? CaseRegistrationDefaults.PlaceholderSurname
            : truncated;
    }

    // Truncate on a element boundary so we never split a character sequence
    private static string TruncateToTextElements(string value, int maxLength)
    {
        if (value.Length <= maxLength)
        {
            return value;
        }

        var enumerator = StringInfo.GetTextElementEnumerator(value);
        var length = 0;

        while (enumerator.MoveNext())
        {
            var element = (string)enumerator.Current;
            if (length + element.Length > maxLength)
            {
                break;
            }

            length += element.Length;
        }

        return value[..length];
    }
}
