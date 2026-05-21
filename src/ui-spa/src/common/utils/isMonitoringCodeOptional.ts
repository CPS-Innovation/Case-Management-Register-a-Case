import { type SuspectFormData } from "../reducers/caseRegistrationReducer";

export const isMonitoringCodeOptional = (
  suspects: SuspectFormData[],
): boolean => {
  if (!suspects.length) return false;

  return suspects.every((suspect) => suspect.charges.length);
};
