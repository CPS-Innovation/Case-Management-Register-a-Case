import { z } from "zod";

export const caseRegistrationRequestDataSchema = z.object({
  urn: z.object({
    policeForce: z.string(),
    policeUnit: z.string(),
    uniqueRef: z.string(),
    year: z.number(),
  }),
  journeyId: z.string(),
  areaOrDivisionText: z.string(),
  registeringAreaId: z.number(),
  registeringUnitId: z.number(),
  allocatedWcuId: z.number(),
  operationName: z.string(),
  courtLocationId: z.number(),
  courtLocationName: z.string(),
  hearingDate: z.string().nullable(),
  complexity: z.string(),
  monitoringCodes: z.array(
    z.object({ code: z.string(), selected: z.boolean() }),
  ),
  prosecutorId: z.number(),
  caseWorker: z.string(),
  oicRank: z.string(),
  oicSurname: z.string(),
  oicFirstnames: z.string(),
  oicShoulderNumber: z.string(),
  oicPoliceUnit: z.string(),
  victims: z.array(
    z.object({
      forename: z.string(),
      surname: z.string(),
      isVulnerable: z.boolean(),
      isIntimidated: z.boolean(),
      isWitness: z.boolean(),
    }),
  ),
  defendants: z.array(
    z.object({
      isDefendant: z.boolean(),
      firstname: z.string(),
      surname: z.string(),
      companyName: z.string(),
      dateOfBirth: z.string().nullable(),
      gender: z.string(),
      disability: z.string(),
      ethnicity: z.string(),
      religion: z.string(),
      type: z.string(),
      arrestDate: z.string().nullable(),
      arrestSummonsNumber: z.string(),
      isNotYetCharged: z.boolean(),
      seriousDangerousOffender: z.boolean(),
      aliases: z.array(
        z.object({
          listOrder: z.number(),
          firstNames: z.string(),
          surname: z.string(),
        }),
      ),
      charges: z.array(
        z.object({
          offenceId: z.string(),
          offenceCode: z.string(),
          offenceDescription: z.string(),
          dateFrom: z.string().nullable(),
          dateTo: z.string().nullable(),
          victimIndexId: z.number().default(-1),
          modeOfTrial: z.string(),
          chargedWithAdult: z.boolean().default(false),
        }),
      ),
    }),
  ),
});

export type CaseRegistrationRequestData = z.infer<
  typeof caseRegistrationRequestDataSchema
>;
