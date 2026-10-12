import { PRE_CHARGE_DECISION_CODE } from "../../common/constants/general";
import { showFirstHearing } from "./showFirstHearing";

describe("showFirstHearing", () => {
  it("should return false if pre-charge decision monitoring code is present", () => {
    const caseMonitoringCodesCheckboxes = [
      "firstHearing",
      PRE_CHARGE_DECISION_CODE,
    ];
    expect(showFirstHearing(caseMonitoringCodesCheckboxes)).toBe(false);
  });

  it("should return true if pre-charge decision monitoring code is not present", () => {
    const caseMonitoringCodesCheckboxes = ["otherCode"];
    expect(showFirstHearing(caseMonitoringCodesCheckboxes)).toBe(true);
  });
});
