import { getChargesSummaryList } from "./getChargesSummaryList";

describe("getChargesSummaryList", () => {
  it("should return an empty array when there are no suspects", () => {
    const result = getChargesSummaryList([]);
    expect(result).toEqual([]);
  });
  it("should return an empty array when suspects have no charges", () => {
    const suspects = [
      {
        suspectId: "suspect-1",
        addSuspectRadio: "person" as const,
        suspectFirstNameText: "",
        suspectLastNameText: "",
        suspectAdditionalDetailsCheckboxes: [],
        suspectGenderRadio: { shortCode: "", description: "" },
        suspectDisabilityRadio: "" as const,
        suspectReligionRadio: { shortCode: "", description: "" },
        suspectEthnicityRadio: { shortCode: "", description: "" },
        suspectAliases: [],
        suspectASNText: "",
        suspectOffenderTypesRadio: {
          shortCode: "",
          display: "",
          arrestDate: "",
        },
        suspectCompanyNameText: "",
        suspectDOBDayText: "",
        suspectDOBMonthText: "",
        suspectDOBYearText: "",
        charges: [],
      },
    ];
    const result = getChargesSummaryList(suspects);
    expect(result).toEqual([]);
  });

  it("should return an array when suspects that have charges", () => {
    const sampleSuspect = {
      suspectId: "suspect-1",
      addSuspectRadio: "person" as const,
      suspectFirstNameText: "steve",
      suspectLastNameText: "smith",
      suspectAdditionalDetailsCheckboxes: [],
      suspectGenderRadio: { shortCode: "", description: "" },
      suspectDisabilityRadio: "" as const,
      suspectReligionRadio: { shortCode: "", description: "" },
      suspectEthnicityRadio: { shortCode: "", description: "" },
      suspectAliases: [],
      suspectASNText: "",
      suspectOffenderTypesRadio: {
        shortCode: "",
        display: "",
        arrestDate: "",
      },
      suspectCompanyNameText: "",
      suspectDOBDayText: "",
      suspectDOBMonthText: "",
      suspectDOBYearText: "",
      charges: [],
    };
    const sampleCHarge = {
      chargeId: "charge-1",
      offenceSearchText: "Theft",
      selectedOffence: {
        cmsId: 10001,
        code: "offence-1",
        description: "Theft",
        legislation: "Theft Act",
        effectiveFromDate: "2022-01-01",
        effectiveToDate: "2022-12-31",
        modeOfTrial: "abc",
        cmsModeOfTrialShortCode: "NYC",
      },
      offenceFromDate: "2022-01-01",
      offenceToDate: "2022-12-31",
      addVictimRadio: "yes" as const,
      chargedWithAdultRadio: "no" as const,
      victim: null,
    };
    const suspects = [
      {
        ...sampleSuspect,
        charges: [sampleCHarge],
      },
      {
        ...sampleSuspect,
        suspectFirstNameText: "steve1",
        suspectLastNameText: "smith1",
        charges: [sampleCHarge],
      },
      {
        ...sampleSuspect,
        suspectFirstNameText: "",
        suspectCompanyNameText: "abc",
        suspectLastNameText: "",
        charges: [sampleCHarge],
      },
      {
        ...sampleSuspect,
        suspectFirstNameText: "",
        suspectCompanyNameText: "rrr",
        suspectLastNameText: "",
        charges: [],
      },
    ];
    const result = getChargesSummaryList(suspects);
    expect(result).toEqual([
      {
        suspectId: "suspect-1",
        suspectFirstNameText: "steve",
        suspectLastNameText: "smith",
        suspectCompanyNameText: "",
        charges: [sampleCHarge],
      },
      {
        suspectId: "suspect-1",
        suspectFirstNameText: "steve1",
        suspectLastNameText: "smith1",
        suspectCompanyNameText: "",
        charges: [sampleCHarge],
      },
      {
        suspectId: "suspect-1",
        suspectFirstNameText: "",
        suspectLastNameText: "",
        suspectCompanyNameText: "abc",
        charges: [sampleCHarge],
      },
    ]);
  });
});
