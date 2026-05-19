import { getSuspectsWithNoCharges } from "./getSuspectsWithNoCharges";

describe("getSuspectsWithNoCharges", () => {
  it("returns empty array when given no suspects", () => {
    const res = getSuspectsWithNoCharges([]);
    expect(res).toEqual([]);
  });

  it("returns suspects that have an empty charges array", () => {
    const suspects = [
      { suspectId: "s1", charges: [] },
      { suspectId: "s2", charges: [{ chargeId: "c1" }] },
      { suspectId: "s3", charges: [] },
    ] as any[];

    const res = getSuspectsWithNoCharges(suspects);
    expect(res.map((s) => s.suspectId)).toEqual(["s1", "s3"]);
  });

  it("returns empty array when all the suspects have charges", () => {
    const suspects = [
      { suspectId: "s1", charges: [{ chargeId: "c1" }] },
      { suspectId: "s2", charges: [{ chargeId: "c2" }] },
      { suspectId: "s3", charges: [{ chargeId: "c3" }] },
    ] as any[];

    const res = getSuspectsWithNoCharges(suspects);
    expect(res).toEqual([]);
  });
});
