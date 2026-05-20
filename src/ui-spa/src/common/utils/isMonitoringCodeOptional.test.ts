import { isMonitoringCodeOptional } from "./isMonitoringCodeOptional";

describe("isMonitoringCodeOptional", () => {
  it("returns false when given no suspects", () => {
    const res = isMonitoringCodeOptional([]);
    expect(res).toEqual(false);
  });

  it("returns false when at least one  of the suspects has no charges", () => {
    const suspects = [
      { suspectId: "s1", charges: [{ chargeId: "c1" }] },
      { suspectId: "s2", charges: [{ chargeId: "c2" }] },
      { suspectId: "s3", charges: [] },
    ] as any[];

    const res = isMonitoringCodeOptional(suspects);
    expect(res).toEqual(false);
  });

  it("returns false when multiple suspects have no charges", () => {
    const suspects = [
      { suspectId: "s1", charges: [] },
      { suspectId: "s2", charges: [{ chargeId: "c1" }] },
      { suspectId: "s3", charges: [] },
    ] as any[];

    const res = isMonitoringCodeOptional(suspects);
    expect(res).toEqual(false);
  });

  it("returns true when all of the suspects have charges", () => {
    const suspects = [
      { suspectId: "s1", charges: [{ chargeId: "c1" }] },
      { suspectId: "s2", charges: [{ chargeId: "c2" }] },
      { suspectId: "s3", charges: [{ chargeId: "c3" }] },
    ] as any[];

    const res = isMonitoringCodeOptional(suspects);
    expect(res).toEqual(true);
  });
});
