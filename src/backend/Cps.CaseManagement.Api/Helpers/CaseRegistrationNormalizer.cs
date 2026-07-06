namespace Cps.CaseManagement.Api.Helpers;

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
                    Surname = request.OperationName,
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
