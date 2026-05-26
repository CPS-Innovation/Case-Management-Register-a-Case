import { getCaseRegistrationRequestData } from "./getCaseRegistrationRequestData";
import { type CaseRegistrationFormData } from "../reducers/caseRegistrationReducer";
import {
  type CaseMonitoringCode,
  type CaseRegistrationRequestData,
} from "../../schemas";
describe("getCaseRegistrationRequestData", () => {
  it("returns correct case registration request data for non suspect cases", () => {
    const formData: CaseRegistrationFormData = {
      operationNameRadio: "yes",
      suspectDetailsRadio: "no",
      operationNameText: "Operation Name",
      areaOrDivisionText: { id: 1, description: "Area 1" },
      urnPoliceForceText: "PF001",
      urnPoliceUnitText: "PU001",
      urnUniqueReferenceText: "URN001",
      urnYearReferenceText: "21",
      registeringUnitText: { id: 1, description: "Registering Unit 1" },
      witnessCareUnitText: { id: 1, description: "Witness Care Unit 1" },
      firstHearingRadio: "yes",
      firstHearingCourtLocationText: { id: 1, description: "Court Location 1" },
      firstHearingDateText: "2021-11-26",
      caseComplexityRadio: { shortCode: "HIGH", description: "High" },
      caseMonitoringCodesCheckboxes: ["MC001", "MC002"],
      caseProsecutorRadio: "yes",
      caseInvestigatorRadio: "yes",
      caseProsecutorText: { id: 1, description: "Prosecutor 1" },
      caseCaseworkerText: { id: 1, description: "Caseworker 1" },
      caseInvestigatorTitleSelect: {
        shortCode: "INV001",
        display: "Investigator 1",
      },
      caseInvestigatorFirstNameText: "Investigator",
      caseInvestigatorLastNameText: "One",
      caseInvestigatorShoulderNameText: "Shoulder Name",
      caseInvestigatorShoulderNumberText: "Shoulder Number",
      suspects: [],
      victimsList: [],
      wantToAddChargesRadio: "",
      navigation: {
        fromCaseSummaryPage: false,
        fromChargeSummaryPage: false,
        fromSuspectSummaryPage: false,
        changeCaseArea: false,
        changeCaseDetails: false,
      },
    };
    const monitoringCodesData: CaseMonitoringCode[] = [
      {
        code: "MC001",
        description: "Monitoring Code 1",
        display: "Monitoring Code 1",
      },
      {
        code: "MC002",
        description: "Monitoring Code 2",
        display: "Monitoring Code 2",
      },
      {
        code: "MC003",
        description: "Monitoring Code 3",
        display: "Monitoring Code 3",
      },
    ];

    const expectedResult: CaseRegistrationRequestData = {
      allocatedWcuId: 1,
      caseWorker: "1",
      courtLocationId: 1,
      courtLocationName: "Court Location 1",
      hearingDate: "2021-11-26",
      monitoringCodes: [
        {
          code: "MC001",
          selected: true,
        },
        {
          code: "MC002",
          selected: true,
        },
      ],
      complexity: "HIGH",
      oicFirstnames: "Investigator",
      oicPoliceUnit: "",
      oicRank: "INV001",
      oicShoulderNumber: "Shoulder Number",
      oicSurname: "One",
      operationName: "Operation Name",
      prosecutorId: 1,
      registeringAreaId: 1,
      registeringUnitId: 1,
      urn: {
        policeForce: "PF001",
        policeUnit: "PU001",
        uniqueRef: "URN001",
        year: 21,
      },
      defendants: [],
      victims: [],
    };
    const result = getCaseRegistrationRequestData(
      formData,
      monitoringCodesData,
    );
    expect(result).toEqual(expectedResult);
  });

  it("Should return the correct default values if some of the values are not present for no suspect journey", () => {
    const formData: CaseRegistrationFormData = {
      operationNameRadio: "yes",
      suspectDetailsRadio: "yes",
      operationNameText: "Operation Name",
      areaOrDivisionText: { id: 1, description: "Area 1" },
      urnPoliceForceText: "PF001",
      urnPoliceUnitText: "PU001",
      urnUniqueReferenceText: "URN001",
      urnYearReferenceText: "21",
      registeringUnitText: { id: 1, description: "Registering Unit 1" },
      witnessCareUnitText: { id: null, description: "" },
      firstHearingRadio: "no",
      firstHearingCourtLocationText: { id: null, description: "" },
      firstHearingDateText: "",
      caseComplexityRadio: { shortCode: "HIGH", description: "High" },
      caseMonitoringCodesCheckboxes: ["MC001", "MC002"],
      caseProsecutorRadio: "no",
      caseInvestigatorRadio: "no",
      caseProsecutorText: { id: null, description: "" },
      caseCaseworkerText: { id: null, description: "" },
      caseInvestigatorTitleSelect: {
        shortCode: null,
        display: "",
      },
      caseInvestigatorFirstNameText: "",
      caseInvestigatorLastNameText: "",
      caseInvestigatorShoulderNameText: "",
      caseInvestigatorShoulderNumberText: "",
      suspects: [],
      victimsList: [],
      wantToAddChargesRadio: "",
      navigation: {
        fromCaseSummaryPage: false,
        fromChargeSummaryPage: false,
        fromSuspectSummaryPage: false,
        changeCaseArea: false,
        changeCaseDetails: false,
      },
    };
    const monitoringCodesData: CaseMonitoringCode[] = [
      {
        code: "MC001",
        description: "Monitoring Code 1",
        display: "Monitoring Code 1",
      },
      {
        code: "MC002",
        description: "Monitoring Code 2",
        display: "Monitoring Code 2",
      },
      {
        code: "MC003",
        description: "Monitoring Code 3",
        display: "Monitoring Code 3",
      },
    ];

    const expectedResult: CaseRegistrationRequestData = {
      allocatedWcuId: 0,
      caseWorker: "",
      courtLocationId: 0,
      courtLocationName: "",
      hearingDate: null,
      monitoringCodes: [
        {
          code: "MC001",
          selected: true,
        },
        {
          code: "MC002",
          selected: true,
        },
      ],
      complexity: "HIGH",
      oicFirstnames: "",
      oicPoliceUnit: "AC",
      oicRank: "",
      oicShoulderNumber: "",
      oicSurname: "",
      operationName: "Operation Name",
      prosecutorId: 0,
      registeringAreaId: 1,
      registeringUnitId: 1,
      urn: {
        policeForce: "PF001",
        policeUnit: "PU001",
        uniqueRef: "URN001",
        year: 21,
      },
      defendants: [],
      victims: [],
    };
    const result = getCaseRegistrationRequestData(
      formData,
      monitoringCodesData,
      {
        unitId: 2091,
        unitDescription: "Plymouth Magistrates Court Unit",
        code: "AC",
        description: "CJU - Cornwall",
      },
    );
    expect(result).toEqual(expectedResult);
  });

  it("returns correct case registration request data when there are suspects with no additional details and no charges", () => {
    const formData: CaseRegistrationFormData = {
      operationNameRadio: "yes",
      suspectDetailsRadio: "yes",
      operationNameText: "abc",
      areaOrDivisionText: {
        id: 1008,
        description: "CAMBRIDGESHIRE",
      },
      urnPoliceForceText: "11",
      urnPoliceUnitText: "12",
      urnUniqueReferenceText: "12121",
      urnYearReferenceText: "26",
      registeringUnitText: {
        id: 2032,
        description: "NORTHERN CJU (Peterborough)",
      },
      witnessCareUnitText: {
        id: 2029012,
        description: "Cambridgeshire Non Operational WCU",
      },
      firstHearingRadio: "",
      firstHearingCourtLocationText: {
        id: null,
        description: "",
      },
      firstHearingDateText: "",
      caseComplexityRadio: {
        shortCode: "1",
        description: "Basic",
      },
      caseMonitoringCodesCheckboxes: ["CSEA", "ATRY"],
      caseInvestigatorRadio: "yes",
      caseProsecutorRadio: "yes",
      caseProsecutorText: {
        id: 1,
        description: "Prosecutor A",
      },
      caseCaseworkerText: {
        id: 1,
        description: "Caseworker A",
      },
      caseInvestigatorTitleSelect: {
        shortCode: "PC",
        display: "Police Constable",
      },
      caseInvestigatorFirstNameText: "bob",
      caseInvestigatorLastNameText: "last",
      caseInvestigatorShoulderNameText: "",
      caseInvestigatorShoulderNumberText: "12",
      suspects: [
        {
          suspectId: "a475538a-ebfd-4be1-9025-a5ed224ed5c6",
          addSuspectRadio: "person",
          suspectFirstNameText: "harry",
          suspectLastNameText: "potter",
          suspectAdditionalDetailsCheckboxes: [],
          suspectGenderRadio: {
            shortCode: "",
            description: "",
          },
          suspectDisabilityRadio: "",
          suspectReligionRadio: {
            shortCode: "",
            description: "",
          },
          suspectEthnicityRadio: {
            shortCode: "",
            description: "",
          },
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
      ],
      wantToAddChargesRadio: "no",
      victimsList: [],
      navigation: {
        fromCaseSummaryPage: false,
        fromChargeSummaryPage: false,
        fromSuspectSummaryPage: true,
        changeCaseArea: false,
        changeCaseDetails: false,
      },
    };

    const monitoringCodesData: CaseMonitoringCode[] = [
      {
        code: "CSEA",
        description: "Monitoring Code 1",
        display: "Monitoring Code 1",
      },
      {
        code: "ATRY",
        description: "Monitoring Code 2",
        display: "Monitoring Code 2",
      },
      {
        code: "MC003",
        description: "Monitoring Code 3",
        display: "Monitoring Code 3",
      },
    ];

    const expectedResult: CaseRegistrationRequestData = {
      operationName: "abc",
      registeringAreaId: 1008,
      urn: {
        policeForce: "11",
        policeUnit: "12",
        uniqueRef: "12121",
        year: 26,
      },
      registeringUnitId: 2032,
      allocatedWcuId: 2029012,
      defendants: [
        {
          aliases: [],
          arrestDate: null,
          arrestSummonsNumber: "",
          charges: [],
          companyName: "",
          dateOfBirth: null,
          disability: "",
          ethnicity: "",
          firstname: "harry",
          gender: "",
          isDefendant: true,
          isNotYetCharged: true,
          religion: "",
          seriousDangerousOffender: false,
          surname: "potter",
          type: "",
        },
      ],
      victims: [],
      complexity: "1",
      courtLocationId: 0,
      courtLocationName: "",
      hearingDate: null,
      monitoringCodes: [
        {
          code: "CSEA",
          selected: true,
        },
        {
          code: "ATRY",
          selected: true,
        },
      ],
      caseWorker: "1",
      prosecutorId: 1,
      oicFirstnames: "bob",
      oicPoliceUnit: "",
      oicRank: "PC",
      oicShoulderNumber: "12",
      oicSurname: "last",
    };

    const result = getCaseRegistrationRequestData(
      formData,
      monitoringCodesData,
    );
    expect(result).toEqual(expectedResult);
  });

  it("returns correct case registration request data when there are suspects with all the additional details and charges and victim list", () => {
    const formData: CaseRegistrationFormData = {
      operationNameRadio: "yes",
      suspectDetailsRadio: "yes",
      operationNameText: "abc",
      areaOrDivisionText: {
        id: 1008,
        description: "CAMBRIDGESHIRE",
      },
      urnPoliceForceText: "11",
      urnPoliceUnitText: "12",
      urnUniqueReferenceText: "12121",
      urnYearReferenceText: "26",
      registeringUnitText: {
        id: 2032,
        description: "NORTHERN CJU (Peterborough)",
      },
      witnessCareUnitText: {
        id: 2029012,
        description: "Cambridgeshire Non Operational WCU",
      },
      firstHearingRadio: "",
      firstHearingCourtLocationText: {
        id: null,
        description: "",
      },
      firstHearingDateText: "",
      caseComplexityRadio: {
        shortCode: "1",
        description: "Basic",
      },
      caseMonitoringCodesCheckboxes: ["CSEA", "ATRY"],
      caseInvestigatorRadio: "yes",
      caseProsecutorRadio: "yes",
      caseProsecutorText: {
        id: 1,
        description: "Prosecutor A",
      },
      caseCaseworkerText: {
        id: 1,
        description: "Caseworker A",
      },
      caseInvestigatorTitleSelect: {
        shortCode: "PC",
        display: "Police Constable",
      },
      caseInvestigatorFirstNameText: "bob",
      caseInvestigatorLastNameText: "last",
      caseInvestigatorShoulderNameText: "",
      caseInvestigatorShoulderNumberText: "12",
      suspects: [
        {
          suspectId: "a475538a-ebfd-4be1-9025-a5ed224ed5c6",
          addSuspectRadio: "person",
          suspectFirstNameText: "harry",
          suspectLastNameText: "potter",
          suspectAdditionalDetailsCheckboxes: [
            "Date of birth",
            "Gender",
            "Disability",
            "Religion",
            "Ethnicity",
            "Alias details",
            "Arrest Summons Number (ASN)",
            "Type of offender",
          ],
          suspectGenderRadio: {
            shortCode: "male",
            description: "Male",
          },
          suspectDisabilityRadio: "no",
          suspectReligionRadio: {
            shortCode: "christianity",
            description: "Christianity",
          },
          suspectEthnicityRadio: {
            shortCode: "asian",
            description: "Asian",
          },
          suspectAliases: [
            {
              firstName: "steve",
              lastName: "smith",
            },
            {
              firstName: "steve",
              lastName: "smitha",
            },
          ],
          suspectASNText: "123",
          suspectOffenderTypesRadio: {
            shortCode: "PY",
            display: "Prolific youth offender (PYO)",
            arrestDate: "2026-02-02",
          },
          suspectCompanyNameText: "",
          suspectDOBDayText: "11",
          suspectDOBMonthText: "11",
          suspectDOBYearText: "1990",
          charges: [
            {
              chargeId: "442a804b-c6d3-44e4-afb2-d98019be5945",
              offenceSearchText: "theft",
              selectedOffence: {
                cmsId: 10001,
                code: "WC81229",
                description:
                  "Permit to be set trap etc - cause injury to wild bird",
                legislation:
                  "Contrary to sections 5(1)(f) and 21(1) of the Wildlife and Countryside Act 1981.",
                effectiveFromDate: "1998-03-17T00:00:00",
                effectiveToDate: "1998-04-17T00:00:00",
                modeOfTrial: "abc",
                cmsModeOfTrialShortCode: "NYC",
              },
              offenceFromDate: "2026-03-02",
              offenceToDate: "2026-03-02",
              addVictimRadio: "yes",
              chargedWithAdultRadio: "yes",
              victim: {
                victimId: "123",
              },
            },
            {
              chargeId: "442a804b-c6d3-44e4-afb2-d98019be5945",
              offenceSearchText: "theft",
              selectedOffence: {
                cmsId: 10001,
                code: "WC81229",
                description:
                  "Permit to be set trap etc - cause injury to wild bird",
                legislation:
                  "Contrary to sections 5(1)(f) and 21(1) of the Wildlife and Countryside Act 1981.",
                effectiveFromDate: "1998-03-17T00:00:00",
                effectiveToDate: "",
                modeOfTrial: "abc",
                cmsModeOfTrialShortCode: "NYC",
              },
              offenceFromDate: "2026-03-02",
              offenceToDate: "",
              addVictimRadio: "no",
              chargedWithAdultRadio: "no",
              victim: null,
            },
          ],
        },
        {
          suspectId: "a6112",
          addSuspectRadio: "person",
          suspectFirstNameText: "steven",
          suspectLastNameText: "smith",
          suspectAdditionalDetailsCheckboxes: [
            "Date of birth",
            "Gender",
            "Disability",
            "Religion",
            "Ethnicity",
            "Alias details",
            "Arrest Summons Number (ASN)",
            "Type of offender",
          ],
          suspectGenderRadio: {
            shortCode: "male",
            description: "Male",
          },
          suspectDisabilityRadio: "yes",
          suspectReligionRadio: {
            shortCode: "christianity",
            description: "Christianity",
          },
          suspectEthnicityRadio: {
            shortCode: "asian",
            description: "Asian",
          },
          suspectAliases: [
            {
              firstName: "steve",
              lastName: "smith",
            },
            {
              firstName: "steve",
              lastName: "smitha",
            },
          ],
          suspectASNText: "123",
          suspectOffenderTypesRadio: {
            shortCode: "PY",
            display: "Prolific youth offender (PYO)",
            arrestDate: "2026-02-02",
          },
          suspectCompanyNameText: "",
          suspectDOBDayText: "11",
          suspectDOBMonthText: "11",
          suspectDOBYearText: "1990",
          charges: [],
        },
      ],
      wantToAddChargesRadio: "no",
      victimsList: [
        {
          victimId: "123",
          victimFirstNameText: "victimfirst",
          victimLastNameText: "victimlast",
          victimAdditionalDetailsCheckboxes: [
            "Vulnerable",
            "Intimidated",
            "Witness",
          ],
        },
      ],
      navigation: {
        fromCaseSummaryPage: false,
        fromChargeSummaryPage: false,
        fromSuspectSummaryPage: true,
        changeCaseArea: false,
        changeCaseDetails: false,
      },
    };

    const monitoringCodesData: CaseMonitoringCode[] = [
      {
        code: "CSEA",
        description: "Monitoring Code 1",
        display: "Monitoring Code 1",
      },
      {
        code: "ATRY",
        description: "Monitoring Code 2",
        display: "Monitoring Code 2",
      },
      {
        code: "MC003",
        description: "Monitoring Code 3",
        display: "Monitoring Code 3",
      },
    ];

    const expectedResult: CaseRegistrationRequestData = {
      operationName: "abc",
      registeringAreaId: 1008,
      urn: {
        policeForce: "11",
        policeUnit: "12",
        uniqueRef: "12121",
        year: 26,
      },
      registeringUnitId: 2032,
      allocatedWcuId: 2029012,
      defendants: [
        {
          charges: [
            {
              dateFrom: "2026-03-02",
              dateTo: "2026-03-02",
              modeOfTrial: "NYC",
              offenceId: "10001",
              offenceCode: "WC81229",
              offenceDescription:
                "Permit to be set trap etc - cause injury to wild bird",
              victimIndexId: 0,
              chargedWithAdult: true,
            },
            {
              dateFrom: "2026-03-02",
              dateTo: null,
              modeOfTrial: "NYC",
              offenceId: "10001",
              offenceCode: "WC81229",
              offenceDescription:
                "Permit to be set trap etc - cause injury to wild bird",
              victimIndexId: -1,
              chargedWithAdult: false,
            },
          ],
          aliases: [
            {
              firstNames: "steve",
              listOrder: 0,
              surname: "smith",
            },
            {
              firstNames: "steve",
              listOrder: 1,
              surname: "smitha",
            },
          ],
          arrestDate: "2026-02-02",
          arrestSummonsNumber: "123",
          companyName: "",
          dateOfBirth: "1990-11-11",
          disability: "N",
          ethnicity: "asian",
          firstname: "harry",
          gender: "male",
          isDefendant: true,
          isNotYetCharged: false,
          religion: "christianity",
          seriousDangerousOffender: false,
          surname: "potter",
          type: "PY",
        },
        {
          aliases: [
            {
              firstNames: "steve",
              listOrder: 0,
              surname: "smith",
            },
            {
              firstNames: "steve",
              listOrder: 1,
              surname: "smitha",
            },
          ],
          arrestDate: "2026-02-02",
          arrestSummonsNumber: "123",
          companyName: "",
          dateOfBirth: "1990-11-11",
          disability: "Y",
          ethnicity: "asian",
          firstname: "steven",
          gender: "male",
          isDefendant: true,
          isNotYetCharged: true,
          religion: "christianity",
          seriousDangerousOffender: false,
          surname: "smith",
          type: "PY",
          charges: [],
        },
      ],
      victims: [
        {
          forename: "victimfirst",
          isIntimidated: true,
          isVulnerable: true,
          isWitness: true,
          surname: "victimlast",
        },
      ],
      complexity: "1",
      courtLocationId: 0,
      courtLocationName: "",
      hearingDate: null,
      monitoringCodes: [
        {
          code: "CSEA",
          selected: true,
        },
        {
          code: "ATRY",
          selected: true,
        },
      ],
      caseWorker: "1",
      prosecutorId: 1,
      oicFirstnames: "bob",
      oicPoliceUnit: "",
      oicRank: "PC",
      oicShoulderNumber: "12",
      oicSurname: "last",
    };

    const result = getCaseRegistrationRequestData(
      formData,
      monitoringCodesData,
    );
    expect(result).toEqual(expectedResult);
  });

  it("should calls console.warn when schema validation fails", () => {
    const formData: CaseRegistrationFormData = {
      operationNameRadio: "yes",
      suspectDetailsRadio: "yes",
      operationNameText: "Operation Name",
      areaOrDivisionText: { id: 1, description: "Area 1" },
      urnPoliceForceText: "PF001",
      urnPoliceUnitText: "PU001",
      urnUniqueReferenceText: "URN001",
      urnYearReferenceText: "21",
      registeringUnitText: { id: 1, description: "Registering Unit 1" },
      witnessCareUnitText: { id: null, description: "" },
      firstHearingRadio: "no",
      firstHearingCourtLocationText: { id: null, description: "" },
      firstHearingDateText: "",
      caseComplexityRadio: { shortCode: "HIGH", description: "High" },
      caseMonitoringCodesCheckboxes: ["MC001", "MC002"],
      caseProsecutorRadio: "no",
      caseInvestigatorRadio: "no",
      caseProsecutorText: { id: null, description: "" },
      caseCaseworkerText: { id: null, description: "" },
      caseInvestigatorTitleSelect: {
        shortCode: null,
        display: "",
      },
      caseInvestigatorFirstNameText: "",
      caseInvestigatorLastNameText: "",
      caseInvestigatorShoulderNameText: "",
      caseInvestigatorShoulderNumberText: "",
      suspects: [],
      victimsList: [],
      wantToAddChargesRadio: "",
      navigation: {
        fromCaseSummaryPage: false,
        fromChargeSummaryPage: false,
        fromSuspectSummaryPage: false,
        changeCaseArea: false,
        changeCaseDetails: false,
      },
    };

    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    // Act
    getCaseRegistrationRequestData(formData, [], {
      code: 123,
      description: "Police Force 1",
    } as any);

    // Assert
    expect(warnSpy).toHaveBeenCalledOnce();
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringMatching(/^Invalid case registration request data:/),
    );

    warnSpy.mockRestore();
  });
});
