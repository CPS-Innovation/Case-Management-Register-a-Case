import {
  type CaseMonitoringCode,
  type PoliceUnit,
  type CaseRegistrationRequestData,
  caseRegistrationRequestDataSchema,
} from "../../schemas";
import {
  type CaseRegistrationFormData,
  type GeneralRadioValue,
  type SuspectFormData,
  type Victim,
} from "../reducers/caseRegistrationReducer";

export const getCaseRegistrationRequestData = (
  formData: CaseRegistrationFormData,
  monitoringCodesData: CaseMonitoringCode[],
  policeUnit?: PoliceUnit,
): CaseRegistrationRequestData => {
  const monitoringCodes = monitoringCodesData
    .filter((mCode) =>
      formData.caseMonitoringCodesCheckboxes.includes(mCode.code),
    )
    .map((mCode) => {
      return {
        code: mCode.code,
        selected: true,
      };
    });

  const requestData: CaseRegistrationRequestData = {
    urn: {
      policeForce: formData.urnPoliceForceText,
      policeUnit: formData.urnPoliceUnitText,
      uniqueRef: formData.urnUniqueReferenceText,
      year: Number.parseInt(formData.urnYearReferenceText),
    },
    registeringAreaId: formData.areaOrDivisionText.id!,
    registeringUnitId: formData.registeringUnitText.id!,
    allocatedWcuId: formData.witnessCareUnitText.id! ?? 0,
    operationName: formData.operationNameText,
    courtLocationId: formData.firstHearingCourtLocationText.id ?? 0,
    courtLocationName: formData.firstHearingCourtLocationText.description,
    hearingDate: formData.firstHearingDateText
      ? formData.firstHearingDateText
      : null,
    complexity: formData.caseComplexityRadio.shortCode,
    monitoringCodes,
    prosecutorId: formData.caseProsecutorText.id! ?? 0,
    caseWorker: formData.caseCaseworkerText.id
      ? `${formData.caseCaseworkerText.id}`
      : "",
    oicRank: formData.caseInvestigatorTitleSelect.shortCode ?? "",
    oicSurname: formData.caseInvestigatorLastNameText,
    oicFirstnames: formData.caseInvestigatorFirstNameText,
    oicShoulderNumber: formData.caseInvestigatorShoulderNumberText,
    oicPoliceUnit: policeUnit ? policeUnit.code : "",
    defendants: getSuspectRequestData(formData.suspects, formData.victimsList),
    victims: getVictimRequestData(formData.victimsList),
  };

  const validatedData =
    caseRegistrationRequestDataSchema.safeParse(requestData);

  if (!validatedData.success) {
    console.warn(
      `Invalid case registration request data: ${JSON.stringify(validatedData.error)}`,
    );
  }

  return requestData;
};

const getVictimRequestData = (victims: Victim[]) => {
  return victims.map((victim) => ({
    forename: victim.victimFirstNameText,
    surname: victim.victimLastNameText,
    isVulnerable:
      victim.victimAdditionalDetailsCheckboxes.includes("Vulnerable"),
    isIntimidated:
      victim.victimAdditionalDetailsCheckboxes.includes("Intimidated"),
    isWitness: victim.victimAdditionalDetailsCheckboxes.includes("Witness"),
  }));
};

const getSuspectRequestData = (
  suspects: SuspectFormData[],
  victims: Victim[],
) => {
  const disability = (suspectDisabilityRadio: GeneralRadioValue) => {
    if (!suspectDisabilityRadio) return "";
    return suspectDisabilityRadio === "yes" ? "Y" : "N";
  };

  const getDOBString = (day: string, month: string, year: string) => {
    if (!day || !month || !year) return null;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  const getVictimIndex = (victim: { victimId: string }) => {
    return victims.findIndex(({ victimId }) => victim.victimId === victimId);
  };

  return suspects.map((suspect) => ({
    isDefendant: suspect.addSuspectRadio === "person",
    firstname: suspect.suspectFirstNameText,
    surname: suspect.suspectLastNameText,
    companyName: suspect.suspectCompanyNameText,
    dateOfBirth: getDOBString(
      suspect.suspectDOBDayText,
      suspect.suspectDOBMonthText,
      suspect.suspectDOBYearText,
    ),
    gender: suspect.suspectGenderRadio.shortCode,
    disability: disability(suspect.suspectDisabilityRadio),
    ethnicity: suspect.suspectEthnicityRadio.shortCode,
    religion: suspect.suspectReligionRadio.shortCode,
    type: suspect.suspectOffenderTypesRadio.shortCode,
    arrestDate: suspect.suspectOffenderTypesRadio.arrestDate
      ? suspect.suspectOffenderTypesRadio.arrestDate
      : null,
    arrestSummonsNumber: suspect.suspectASNText,
    seriousDangerousOffender: false,
    isNotYetCharged: suspect.charges.length === 0,
    aliases: suspect.suspectAliases.map((alias, index) => ({
      listOrder: index,
      firstNames: alias.firstName,
      surname: alias.lastName,
    })),
    charges: suspect.charges.map((charge) => ({
      offenceId: `${charge.selectedOffence.cmsId}`,
      offenceCode: charge.selectedOffence.code,
      offenceDescription: charge.selectedOffence.description,
      modeOfTrial: charge.selectedOffence.cmsModeOfTrialShortCode,
      dateFrom: charge.offenceFromDate,
      dateTo: charge.offenceToDate ? charge.offenceToDate : null,
      victimIndexId: charge.victim ? getVictimIndex(charge.victim) : -1,
      chargedWithAdult: charge.chargedWithAdultRadio === "yes",
    })),
  }));
};
