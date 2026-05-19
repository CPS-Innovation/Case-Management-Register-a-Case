import { type SuspectFormData } from "../reducers/caseRegistrationReducer";

export const getSuspectsWithNoCharges = (
  suspects: SuspectFormData[],
): SuspectFormData[] => {
  return suspects.filter((suspect) => suspect.charges.length === 0);
};
