import { PRE_CHARGE_DECISION_CODE } from "../../common/constants/general";
import { showFirstHearing } from "./showFirstHearing";

describe("showFirstHearing", () => {
  it("should return false if the first hearing checkbox is checked", () => {
    const caseMonitoringCodesCheckboxes = [
      "firstHearing",
      PRE_CHARGE_DECISION_CODE,
    ];
    expect(showFirstHearing(caseMonitoringCodesCheckboxes)).toBe(false);
  });

  it("should return true if the first hearing checkbox is not checked", () => {
    const caseMonitoringCodesCheckboxes = ["otherCode"];
    expect(showFirstHearing(caseMonitoringCodesCheckboxes)).toBe(true);
  });
});
