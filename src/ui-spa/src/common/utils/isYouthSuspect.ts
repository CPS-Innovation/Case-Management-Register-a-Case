import { type SuspectFormData } from "../reducers/caseRegistrationReducer";
import { offenderTypeShortCodes } from "../constants/offenderTypeShortCodes";
import { getCurrentAge } from "./getCurrentAge";
export const isYouthSuspect = (suspect: SuspectFormData): boolean => {
  if (
    suspect.suspectOffenderTypesRadio.shortCode ===
      offenderTypeShortCodes.PROLIFIC_YOUTH_OFFENDER ||
    suspect.suspectOffenderTypesRadio.shortCode ===
      offenderTypeShortCodes.YOUTH_OFFENDER
  ) {
    return true;
  }

  return isUnder18({
    suspectDOBDayText: suspect.suspectDOBDayText,
    suspectDOBMonthText: suspect.suspectDOBMonthText,
    suspectDOBYearText: suspect.suspectDOBYearText,
  });
};

export const isUnder18 = (dobData: {
  suspectDOBDayText: string;
  suspectDOBMonthText: string;
  suspectDOBYearText: string;
}): boolean => {
  const day = dobData.suspectDOBDayText.padStart(2, "0");
  const month = dobData.suspectDOBMonthText.padStart(2, "0");
  const year = dobData.suspectDOBYearText;
  const suspectDateOfBirth = `${year}-${month}-${day}`;
  const age = getCurrentAge(suspectDateOfBirth);
  if (!age) {
    return false;
  }
  return age < 18;
};
