import { PRE_CHARGE_DECISION_CODE } from "../../common/constants/general";
export const showFirstHearing = (caseMonitoringCodesCheckboxes: string[]) => {
  return !caseMonitoringCodesCheckboxes?.includes(PRE_CHARGE_DECISION_CODE);
};
