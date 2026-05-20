import {
  caseRegistrationReducer,
  initialState,
  suspectInitialState,
  chargeInitialState,
  getResetSuspectFieldValues,
  getResetFieldValues,
  type CaseRegistrationActions,
  type CaseRegistrationState,
  type SuspectFormData,
} from "./caseRegistrationReducer";
import { offenderTypeShortCodes } from "../constants/offenderTypeShortCodes";

vi.mock("uuid", () => ({
  v4: vi.fn(() => "test-uuid"),
}));
import { v4 as uuidv4 } from "uuid";

describe("caseRegistrationReducer", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  const sampleSuspectState: SuspectFormData = {
    suspectId: "suspect-1",
    addSuspectRadio: "company",
    suspectFirstNameText: "aa",
    suspectLastNameText: "bb",
    suspectAdditionalDetailsCheckboxes: [
      "Date of birth",
      "Disability",
      "Religion",
    ],
    suspectGenderRadio: { shortCode: "M", description: "male" },
    suspectDisabilityRadio: "no",
    suspectReligionRadio: { shortCode: "ch", description: "Christian" },
    suspectEthnicityRadio: { shortCode: "BR", description: "British" },
    suspectAliases: [{ firstName: "cc", lastName: "dd" }],
    suspectASNText: "122wws",
    suspectOffenderTypesRadio: {
      shortCode: "yo",
      display: "youth offender",
      arrestDate: "15/12/2024",
    },
    suspectCompanyNameText: "company1",
    suspectDOBDayText: "5",
    suspectDOBMonthText: "12",
    suspectDOBYearText: "2000",
    charges: [],
  };
  it("should set single formData using SET_FIELDS action", () => {
    const action: CaseRegistrationActions = {
      type: "SET_FIELDS",
      payload: { data: { operationNameRadio: "yes" } },
    };
    const state = caseRegistrationReducer(initialState, action);
    expect(state.formData.operationNameRadio).toBe("yes");
    expect(state.formData.suspectDetailsRadio).toBe("");
    expect(state.formData.operationNameText).toBe("");
  });

  it("should set multiple formData fields using SET_FIELDS action", () => {
    const action: CaseRegistrationActions = {
      type: "SET_FIELDS",
      payload: {
        data: {
          suspectDetailsRadio: "yes",
          operationNameRadio: "yes",
          operationNameText: "Operation Thunder",
        },
      },
    };
    const state = caseRegistrationReducer(initialState, action);
    expect(state.formData.suspectDetailsRadio).toBe("yes");
    expect(state.formData.operationNameRadio).toBe("yes");
    expect(state.formData.operationNameText).toBe("Operation Thunder");
  });

  it("should reset the form", () => {
    const apiData = {
      areasAndRegisteringUnits: {
        allUnits: [
          {
            areaId: 1,
            areaDescription: "Area 51",
            areaIsSensitive: false,
            id: 1,
            description: "Area 51",
          },
        ],

        homeUnit: {
          areaId: 1,
          areaDescription: "Area 51",
          areaIsSensitive: false,
          id: 1,
          description: "Area 51",
        },
      },
    };
    const modifiedState: CaseRegistrationState = {
      formData: {
        operationNameRadio: "yes",
        suspectDetailsRadio: "yes",
        operationNameText: "Operation Thunder",
        areaOrDivisionText: { id: 1, description: "Division A" },
        urnPoliceForceText: "Force X",
        urnPoliceUnitText: "Unit Y",
        urnUniqueReferenceText: "12345",
        urnYearReferenceText: "24",
        registeringUnitText: { id: 1, description: "Reg Unit 1" },
        witnessCareUnitText: { id: 1, description: "Witness Unit 1" },
        firstHearingRadio: "yes",
        firstHearingCourtLocationText: { id: null, description: "Court A" },
        firstHearingDateText: "2023-01-01",
        caseComplexityRadio: { shortCode: "HIGH", description: "High" },
        caseMonitoringCodesCheckboxes: ["code1", "code2"],
        caseProsecutorRadio: "yes",
        caseInvestigatorRadio: "yes",
        caseProsecutorText: { id: 1, description: "Prosecutor A" },
        caseCaseworkerText: { id: 1, description: "Caseworker A" },
        caseInvestigatorTitleSelect: {
          shortCode: "INV",
          display: "Investigator",
        },
        caseInvestigatorFirstNameText: "abc",
        caseInvestigatorLastNameText: "def",
        caseInvestigatorShoulderNameText: "GHI",
        caseInvestigatorShoulderNumberText: "123",

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
      },
      apiData: apiData,
    };
    const action: CaseRegistrationActions = { type: "RESET_FORM_DATA" };
    const state = caseRegistrationReducer(modifiedState, action);
    expect(state).toEqual({ ...initialState, apiData });
  });

  it("should return current state for unknown action", () => {
    // @ts-expect-error Testing unknown action type
    const state = caseRegistrationReducer(initialState, { type: "UNKNOWN" });
    expect(state).toBe(initialState);
  });

  it("should not allow to  set suspect data suspectFirstNameText data using SET_SUSPECT_FIELDS action if the payload index is greater than current suspect length", () => {
    const action: CaseRegistrationActions = {
      type: "SET_SUSPECT_FIELDS",
      payload: {
        index: 1,
        data: {
          suspectFirstNameText: "John",
        },
      },
    };
    const state = caseRegistrationReducer(initialState, action);

    expect(state.formData.suspects[0]).toEqual(
      initialState.formData.suspects[0],
    );
  });

  it("should set suspect data suspectFirstNameText data along with other fields initial value using SET_SUSPECT_FIELDS action", () => {
    const action: CaseRegistrationActions = {
      type: "SET_SUSPECT_FIELDS",
      payload: {
        index: 0,
        data: {
          suspectFirstNameText: "John",
        },
      },
    };
    const state = caseRegistrationReducer(initialState, action);
    const expectedResult = {
      ...suspectInitialState,
      suspectFirstNameText: "John",
      suspectId: "test-uuid",
    };
    expect(uuidv4).toHaveBeenCalledTimes(1);
    expect(state.formData.suspects[0]).toEqual(expectedResult);
  });

  it("should set suspect data suspectAliases data along with other fields initial value using SET_SUSPECT_FIELDS action", () => {
    const modifiedState: CaseRegistrationState = {
      ...initialState,
      formData: {
        ...initialState.formData,
        suspects: [
          { ...suspectInitialState },
          {
            ...suspectInitialState,
          },
        ],
      },
    };
    const action: CaseRegistrationActions = {
      type: "SET_SUSPECT_FIELDS",
      payload: {
        index: 0,
        data: {
          suspectAliases: [{ firstName: "John", lastName: "Doe" }],
        },
      },
    };
    const state = caseRegistrationReducer(modifiedState, action);
    const expectedResult = {
      ...suspectInitialState,
      suspectAliases: [
        {
          firstName: "John",
          lastName: "Doe",
        },
      ],
    };
    expect(state.formData.suspects[0]).toEqual(expectedResult);
    expect(state.formData.suspects[1]).toEqual(suspectInitialState);
  });

  it("should just set suspect data suspectFirstNameText  using SET_SUSPECT_FIELDS action, when suspect details are already available", () => {
    const action: CaseRegistrationActions = {
      type: "SET_SUSPECT_FIELDS",
      payload: {
        index: 0,
        data: {
          suspectFirstNameText: "Jacob",
        },
      },
    };

    const modifiedState: CaseRegistrationState = {
      ...initialState,
      formData: {
        ...initialState.formData,
        suspects: [
          {
            ...suspectInitialState,
            suspectFirstNameText: "John",
            suspectLastNameText: "Doe",
          },
        ],
      },
    };
    const state = caseRegistrationReducer(modifiedState, action);
    const expectedResult = {
      ...suspectInitialState,
      suspectLastNameText: "Doe",
      suspectFirstNameText: "Jacob",
    };
    expect(state.formData.suspects[0]).toEqual(expectedResult);
  });

  it("Should remove a suspect with a given suspectId using REMOVE_SUSPECT action", () => {
    const modifiedState: CaseRegistrationState = {
      ...initialState,
      formData: {
        ...initialState.formData,
        suspects: [
          { ...suspectInitialState, suspectId: "suspect-1" },
          {
            ...suspectInitialState,
            suspectId: "suspect-2",
            addSuspectRadio: "person",
            suspectLastNameText: "last",
          },
        ],
      },
    };
    const action: CaseRegistrationActions = {
      type: "REMOVE_SUSPECT",
      payload: {
        suspectId: "suspect-1",
      },
    };

    const state = caseRegistrationReducer(modifiedState, action);
    expect(state.formData.suspects.length).toEqual(1);
    expect(state.formData.suspects[0].suspectLastNameText).toEqual("last");
  });

  it("should not allow to set charge data for the suspect that does not exist using SET_CHARGE_FIELDS action ", () => {
    const action: CaseRegistrationActions = {
      type: "SET_CHARGE_FIELDS",
      payload: {
        suspectIndex: 1,
        chargeIndex: 0,
        data: { offenceSearchText: "theft" },
      },
    };

    const modifiedState: CaseRegistrationState = {
      ...initialState,
      formData: {
        ...initialState.formData,
        suspects: [{ ...suspectInitialState, suspectId: "suspect-1" }],
      },
    };
    const state = caseRegistrationReducer(modifiedState, action);

    expect(state.formData.suspects[0]).toEqual(
      modifiedState.formData.suspects[0],
    );

    expect(state.formData.suspects[0].charges.length).toEqual(0);
  });
  it("should not allow to set charge data ,with chargeIndex greater than existing charges length using SET_CHARGE_FIELDS action ", () => {
    const action: CaseRegistrationActions = {
      type: "SET_CHARGE_FIELDS",
      payload: {
        suspectIndex: 0,
        chargeIndex: 1,
        data: { offenceSearchText: "theft" },
      },
    };

    const modifiedState: CaseRegistrationState = {
      ...initialState,
      formData: {
        ...initialState.formData,
        suspects: [{ ...suspectInitialState, suspectId: "suspect-1" }],
      },
    };
    const state = caseRegistrationReducer(modifiedState, action);

    expect(state.formData.suspects[0]).toEqual(
      modifiedState.formData.suspects[0],
    );

    expect(state.formData.suspects[0].charges.length).toEqual(0);
  });

  it("should set new charge data for a given suspect data along with other fields initial value using SET_CHARGE_FIELDS action", () => {
    const action: CaseRegistrationActions = {
      type: "SET_CHARGE_FIELDS",
      payload: {
        suspectIndex: 0,
        chargeIndex: 0,
        data: { offenceSearchText: "theft", offenceFromDate: "2023-01-01" },
      },
    };

    const modifiedState: CaseRegistrationState = {
      ...initialState,
      formData: {
        ...initialState.formData,
        suspects: [{ ...suspectInitialState, suspectId: "suspect-1" }],
      },
    };
    const state = caseRegistrationReducer(modifiedState, action);
    const expectedResult = {
      ...suspectInitialState,
      suspectId: "suspect-1",
      charges: [
        {
          ...chargeInitialState,
          offenceSearchText: "theft",
          offenceFromDate: "2023-01-01",
          chargeId: "test-uuid",
        },
      ],
    };
    expect(uuidv4).toHaveBeenCalledTimes(1);
    expect(state.formData.suspects[0]).toEqual(expectedResult);
  });

  it("should be able to modify charge data for a given suspect data along with other values using SET_CHARGE_FIELDS action", () => {
    const action: CaseRegistrationActions = {
      type: "SET_CHARGE_FIELDS",
      payload: {
        suspectIndex: 1,
        chargeIndex: 1,
        data: { offenceSearchText: "robbery", offenceFromDate: "2023-02-02" },
      },
    };

    const modifiedState: CaseRegistrationState = {
      ...initialState,
      formData: {
        ...initialState.formData,
        suspects: [
          {
            ...suspectInitialState,
            suspectId: "suspect-1",
            charges: [
              { ...chargeInitialState, chargeId: "charge-1" },
              { ...chargeInitialState, chargeId: "charge-2" },
            ],
          },
          {
            ...suspectInitialState,
            suspectId: "suspect-2",
            charges: [
              { ...chargeInitialState, chargeId: "charge-3" },
              {
                ...chargeInitialState,
                chargeId: "charge-4",
                offenceSearchText: "theft",
                offenceFromDate: "2024-02-02",
              },
            ],
          },
        ],
      },
    };
    const state = caseRegistrationReducer(modifiedState, action);
    const expectedResult = {
      formData: {
        ...modifiedState.formData,
        suspects: [
          {
            ...modifiedState.formData.suspects[0],
          },
          {
            ...modifiedState.formData.suspects[1],
            charges: [
              { ...chargeInitialState, chargeId: "charge-3" },
              {
                ...chargeInitialState,
                chargeId: "charge-4",
                offenceSearchText: "robbery",
                offenceFromDate: "2023-02-02",
              },
            ],
          },
        ],
      },
    };
    expect(uuidv4).toHaveBeenCalledTimes(0);
    expect(state.formData).toEqual(expectedResult.formData);
  });

  it("Should SET_CHARGE_FIELDS action update the the charge fields for the given suspect and charge index", () => {
    const initialStateWithSuspectAndCharge: CaseRegistrationState = {
      ...initialState,
      formData: {
        ...initialState.formData,
        suspects: [
          {
            ...suspectInitialState,
          },
          {
            ...suspectInitialState,
          },
        ],
      },
    };
    const action: CaseRegistrationActions = {
      type: "SET_CHARGE_FIELDS",
      payload: {
        suspectIndex: 0,
        chargeIndex: 0,
        data: {
          offenceSearchText: "New Offence",
          selectedOffence: {
            cmsId: 10001,
            code: "ABC",
            description: "sample description",
            legislation: "sample legislation",
            effectiveFromDate: "2024-01-01",
            effectiveToDate: "2024-12-31",
            modeOfTrial: "abc",
            cmsModeOfTrialShortCode: "NYC",
          },
        },
      },
    };
    const state = caseRegistrationReducer(
      initialStateWithSuspectAndCharge,
      action,
    );
    expect(state.formData.suspects[0].charges[0]).toEqual({
      chargeId: "test-uuid",
      chargedWithAdultRadio: "",
      offenceSearchText: "New Offence",
      selectedOffence: {
        cmsId: 10001,
        code: "ABC",
        description: "sample description",
        legislation: "sample legislation",
        effectiveFromDate: "2024-01-01",
        effectiveToDate: "2024-12-31",
        modeOfTrial: "abc",
        cmsModeOfTrialShortCode: "NYC",
      },
      offenceFromDate: "",
      offenceToDate: "",
      addVictimRadio: "",
      victim: null,
    });
    expect(state.formData.suspects[1].charges).toEqual([]);
  });

  it("Should remove a suspect charge with given suspectId and chargeId using REMOVE_SUSPECT_CHARGE action", () => {
    const modifiedState: CaseRegistrationState = {
      ...initialState,
      formData: {
        ...initialState.formData,
        suspects: [
          {
            ...suspectInitialState,
            suspectId: "suspect-1",
            charges: [
              { ...chargeInitialState, chargeId: "charge-1" },
              { ...chargeInitialState, chargeId: "charge-2" },
            ],
          },
          {
            ...suspectInitialState,
            suspectId: "suspect-2",
            addSuspectRadio: "person",
            suspectLastNameText: "last",
            charges: [
              { ...chargeInitialState, chargeId: "charge-3" },
              { ...chargeInitialState, chargeId: "charge-4" },
            ],
          },
        ],
      },
    };
    const action: CaseRegistrationActions = {
      type: "REMOVE_SUSPECT_CHARGE",
      payload: {
        suspectId: "suspect-1",
        chargeId: "charge-1",
      },
    };

    const state = caseRegistrationReducer(modifiedState, action);
    expect(state.formData.suspects[0].charges.length).toEqual(1);
    expect(state.formData.suspects[0].charges[0]).toEqual({
      ...chargeInitialState,
      chargeId: "charge-2",
    });
    const newAction: CaseRegistrationActions = {
      type: "REMOVE_SUSPECT_CHARGE",
      payload: {
        suspectId: "suspect-2",
        chargeId: "charge-3",
      },
    };

    const newState = caseRegistrationReducer(modifiedState, newAction);
    expect(newState.formData.suspects[0].charges.length).toEqual(1);
    expect(newState.formData.suspects[1].charges.length).toEqual(1);
    expect(state.formData.suspects[1].charges[0]).toEqual({
      ...chargeInitialState,
      chargeId: "charge-4",
    });
    const newAction1: CaseRegistrationActions = {
      type: "REMOVE_SUSPECT_CHARGE",
      payload: {
        suspectId: "suspect-2",
        chargeId: "charge-4",
      },
    };
    const newState1 = caseRegistrationReducer(modifiedState, newAction1);
    expect(newState1.formData.suspects[0].charges.length).toEqual(1);
    expect(newState1.formData.suspects[1].charges.length).toEqual(0);
  });

  it("Should return the state unchanged for REMOVE_SUSPECT_CHARGE action, if a suspectId and chargeId do not match", () => {
    const modifiedState: CaseRegistrationState = {
      ...initialState,
      formData: {
        ...initialState.formData,
        suspects: [
          {
            ...suspectInitialState,
            suspectId: "suspect-1",
            charges: [
              { ...chargeInitialState, chargeId: "charge-1" },
              { ...chargeInitialState, chargeId: "charge-2" },
            ],
          },
          {
            ...suspectInitialState,
            suspectId: "suspect-2",
            addSuspectRadio: "person",
            suspectLastNameText: "last",
            charges: [
              { ...chargeInitialState, chargeId: "charge-3" },
              { ...chargeInitialState, chargeId: "charge-4" },
            ],
          },
        ],
      },
    };
    const action: CaseRegistrationActions = {
      type: "REMOVE_SUSPECT_CHARGE",
      payload: {
        suspectId: "suspect-3",
        chargeId: "charge-1",
      },
    };

    const state = caseRegistrationReducer(modifiedState, action);
    expect(state.formData.suspects).toEqual(modifiedState.formData.suspects);

    const action1: CaseRegistrationActions = {
      type: "REMOVE_SUSPECT_CHARGE",
      payload: {
        suspectId: "suspect-1",
        chargeId: "charge-5",
      },
    };

    const state1 = caseRegistrationReducer(modifiedState, action1);
    expect(state1.formData.suspects).toEqual(modifiedState.formData.suspects);
  });

  it("getResetSuspectFieldValues should reset person suspects values to initial state if the user switches from addSuspectRadio from person to company", () => {
    const state = {
      ...initialState,
      formData: {
        ...initialState.formData,
        suspects: [sampleSuspectState, sampleSuspectState],
      },
    };

    const resetValues = getResetSuspectFieldValues(state, 1);
    const {
      suspectCompanyNameText: _suspectCompanyNameText,
      addSuspectRadio: _addSuspectRadio,
      suspectId: _suspectId,
      ...rest
    } = suspectInitialState;
    expect(resetValues).toEqual({ ...rest });
  });
  it("getResetSuspectFieldValues should reset company suspects values and any other unselected additional fields  to initial state if the user switches from addSuspectRadio from company to person", () => {
    const suspectState: SuspectFormData = {
      ...sampleSuspectState,
      addSuspectRadio: "person",
    };
    const state = {
      ...initialState,
      formData: {
        ...initialState.formData,
        suspects: [suspectState, suspectState],
      },
    };
    const resetValues = getResetSuspectFieldValues(state, 0);

    expect(resetValues).toEqual({
      suspectCompanyNameText: "",
      suspectGenderRadio: { shortCode: "", description: "" },
      suspectEthnicityRadio: { shortCode: "", description: "" },
      suspectAliases: [],
      suspectASNText: "",
      suspectOffenderTypesRadio: {
        shortCode: "",
        display: "",
        arrestDate: "",
      },
    });
  });
  it("getResetSuspectFieldValues should return empty object if there are no suspect for the given index", () => {
    const state = {
      ...initialState,
      formData: {
        ...initialState.formData,
        suspects: [],
      },
    };

    expect(getResetSuspectFieldValues(state, 0)).toEqual({});
    expect(getResetSuspectFieldValues(state, 1)).toEqual({});
  });

  it("RESET_SUSPECT_FIELD should reset any unselected suspect additional data to initial values if the user updates the additional details checkboxes", () => {
    const suspectState: SuspectFormData = {
      ...sampleSuspectState,
      addSuspectRadio: "person",
    };
    const modifiedState: CaseRegistrationState = {
      ...initialState,
      formData: {
        ...initialState.formData,
        suspects: [
          suspectState,
          {
            ...suspectState,
            suspectAdditionalDetailsCheckboxes: ["Disability", "Gender"],
            suspectId: "suspect-2",
          },
        ],
      },
    };
    const action: CaseRegistrationActions = {
      type: "RESET_SUSPECT_FIELD",
      payload: {
        index: 1,
      },
    };
    const expectedResult = {
      ...modifiedState,
      formData: {
        ...modifiedState.formData,
        suspects: [
          {
            ...modifiedState.formData.suspects[0],
            suspectId: "suspect-1",
          },
          {
            ...suspectInitialState,
            addSuspectRadio: "person",
            suspectFirstNameText: "aa",
            suspectLastNameText: "bb",
            suspectAdditionalDetailsCheckboxes: ["Disability", "Gender"],
            suspectGenderRadio: { shortCode: "M", description: "male" },
            suspectDisabilityRadio: "no",
            suspectId: "suspect-2",
          },
        ],
      },
    };
    const state = caseRegistrationReducer(modifiedState, action);
    expect(state).toEqual(expectedResult);
  });
  it("RESET_SUSPECT_FIELD should reset all the  additional details data to initial values if the user has selected no additional details", () => {
    const suspectState: SuspectFormData = {
      ...sampleSuspectState,
      addSuspectRadio: "person",
    };
    const modifiedState: CaseRegistrationState = {
      ...initialState,
      formData: {
        ...initialState.formData,
        suspects: [
          {
            ...suspectState,
            suspectId: "suspect-1",
            suspectAdditionalDetailsCheckboxes: [],
          },
          {
            ...suspectState,
            suspectId: "suspect-2",
            suspectAdditionalDetailsCheckboxes: [],
          },
        ],
      },
    };
    const action: CaseRegistrationActions = {
      type: "RESET_SUSPECT_FIELD",
      payload: {
        index: 0,
      },
    };
    const state = caseRegistrationReducer(modifiedState, action);
    const expectedResult = {
      ...modifiedState,
      formData: {
        ...modifiedState.formData,
        suspects: [
          {
            ...suspectInitialState,
            suspectId: "suspect-1",
            addSuspectRadio: "person",
            suspectFirstNameText: "aa",
            suspectLastNameText: "bb",
            suspectAdditionalDetailsCheckboxes: [],
          },
          {
            ...modifiedState.formData.suspects[1],
          },
        ],
      },
    };

    expect(state).toEqual(expectedResult);
  });
  it("RESET_SUSPECT_FIELD should reset chargedWithAdultRadio property for the suspect charges, if the user updates the additional details checkboxes property and omits 'Type of offender'", () => {
    const suspectState: SuspectFormData = {
      ...sampleSuspectState,
      addSuspectRadio: "person",
    };
    const modifiedState: CaseRegistrationState = {
      ...initialState,
      formData: {
        ...initialState.formData,
        suspects: [
          suspectState,
          {
            ...suspectState,
            suspectAdditionalDetailsCheckboxes: ["Disability", "Gender"],
            suspectId: "suspect-2",
            charges: [
              {
                ...chargeInitialState,
                chargeId: "charge-1",
                chargedWithAdultRadio: "yes",
              },
              {
                ...chargeInitialState,
                chargeId: "charge-2",
                chargedWithAdultRadio: "no",
              },
            ],
          },
        ],
      },
    };
    const action: CaseRegistrationActions = {
      type: "RESET_SUSPECT_FIELD",
      payload: {
        index: 1,
      },
    };
    const expectedResult = {
      ...modifiedState,
      formData: {
        ...modifiedState.formData,
        suspects: [
          {
            ...modifiedState.formData.suspects[0],
            suspectId: "suspect-1",
          },
          {
            ...suspectInitialState,
            addSuspectRadio: "person",
            suspectFirstNameText: "aa",
            suspectLastNameText: "bb",
            suspectAdditionalDetailsCheckboxes: ["Disability", "Gender"],
            suspectGenderRadio: { shortCode: "M", description: "male" },
            suspectDisabilityRadio: "no",
            suspectId: "suspect-2",
            charges: [
              {
                ...chargeInitialState,
                chargeId: "charge-1",
                chargedWithAdultRadio: "",
              },
              {
                ...chargeInitialState,
                chargeId: "charge-2",
                chargedWithAdultRadio: "",
              },
            ],
          },
        ],
      },
    };
    const state = caseRegistrationReducer(modifiedState, action);
    expect(state).toEqual(expectedResult);
  });
  it("RESET_SUSPECT_FIELD should not reset chargedWithAdultRadio property for the suspect charges, if the user updates the additional details checkboxes property and has selected 'Type of offender'", () => {
    const suspectState: SuspectFormData = {
      ...sampleSuspectState,
      addSuspectRadio: "person",
    };
    const modifiedState: CaseRegistrationState = {
      ...initialState,
      formData: {
        ...initialState.formData,
        suspects: [
          suspectState,
          {
            ...suspectState,
            suspectAdditionalDetailsCheckboxes: [
              "Disability",
              "Gender",
              "Type of offender",
            ],
            suspectId: "suspect-2",
            charges: [
              {
                ...chargeInitialState,
                chargeId: "charge-1",
                chargedWithAdultRadio: "yes",
              },
              {
                ...chargeInitialState,
                chargeId: "charge-2",
                chargedWithAdultRadio: "no",
              },
            ],
          },
        ],
      },
    };
    const action: CaseRegistrationActions = {
      type: "RESET_SUSPECT_FIELD",
      payload: {
        index: 1,
      },
    };
    const expectedResult = {
      ...modifiedState,
      formData: {
        ...modifiedState.formData,
        suspects: [
          {
            ...modifiedState.formData.suspects[0],
            suspectId: "suspect-1",
          },
          {
            ...suspectInitialState,
            addSuspectRadio: "person",
            suspectFirstNameText: "aa",
            suspectLastNameText: "bb",
            suspectAdditionalDetailsCheckboxes: [
              "Disability",
              "Gender",
              "Type of offender",
            ],
            suspectGenderRadio: { shortCode: "M", description: "male" },
            suspectDisabilityRadio: "no",
            suspectId: "suspect-2",
            suspectOffenderTypesRadio: {
              shortCode: "yo",
              display: "youth offender",
              arrestDate: "15/12/2024",
            },
            charges: [
              {
                ...chargeInitialState,
                chargeId: "charge-1",
                chargedWithAdultRadio: "yes",
              },
              {
                ...chargeInitialState,
                chargeId: "charge-2",
                chargedWithAdultRadio: "no",
              },
            ],
          },
        ],
      },
    };
    const state = caseRegistrationReducer(modifiedState, action);
    expect(state).toEqual(expectedResult);
  });

  it("Should set apisData areasAndRegisteringUnits data using SET_AREAS_AND_REGISTERING_UNITS", () => {
    const action: CaseRegistrationActions = {
      type: "SET_AREAS_AND_REGISTERING_UNITS",
      payload: {
        areasAndRegisteringUnits: {
          allUnits: [
            {
              areaId: 1,
              areaDescription: "Area 51",
              areaIsSensitive: false,
              id: 1,
              description: "Area 51",
            },
          ],

          homeUnit: {
            areaId: 1,
            areaDescription: "Area 51",
            areaIsSensitive: false,
            id: 1,
            description: "Area 51",
          },
        },
      },
    };
    const state = caseRegistrationReducer(initialState, action);
    expect(state.apiData.areasAndRegisteringUnits).toEqual(
      action.payload.areasAndRegisteringUnits,
    );
  });

  it("Should set apiData areasAndWitnessCareUnits data using SET_AREAS_AND_WITNESS_CARE_UNITS", () => {
    const action: CaseRegistrationActions = {
      type: "SET_AREAS_AND_WITNESS_CARE_UNITS",
      payload: {
        areasAndWitnessCareUnits: [
          {
            areaId: 1,
            areaDescription: "Area 51",
            id: 1,
            description: "Area 51",
            isWCU: true,
          },
        ],
      },
    };
    const state = caseRegistrationReducer(initialState, action);
    expect(state.apiData.areasAndWitnessCareUnits).toEqual(
      action.payload.areasAndWitnessCareUnits,
    );
  });

  it("Should set apiData courtLocations data using SET_COURT_LOCATIONS", () => {
    const action: CaseRegistrationActions = {
      type: "SET_COURT_LOCATIONS",
      payload: {
        courtLocations: [
          {
            id: 1,
            description: "Court A",
          },
        ],
      },
    };
    const state = caseRegistrationReducer(initialState, action);
    expect(state.apiData.courtLocations).toEqual(action.payload.courtLocations);
  });
  it("Should set apiData caseComplexities data using SET_CASE_COMPLEXITIES", () => {
    const action: CaseRegistrationActions = {
      type: "SET_CASE_COMPLEXITIES",
      payload: {
        caseComplexities: [
          {
            shortCode: "HIGH",
            description: "High",
          },
        ],
      },
    };
    const state = caseRegistrationReducer(initialState, action);
    expect(state.apiData.caseComplexities).toEqual(
      action.payload.caseComplexities,
    );
  });
  it("Should set apiData caseMonitoringCodes data using SET_CASE_MONITORING_CODES", () => {
    const action: CaseRegistrationActions = {
      type: "SET_CASE_MONITORING_CODES",
      payload: {
        caseMonitoringCodes: [
          {
            code: "Ab",
            description: "abcdef",
            display: "abcdef",
          },
        ],
      },
    };
    const state = caseRegistrationReducer(initialState, action);
    expect(state.apiData.caseMonitoringCodes).toEqual(
      action.payload.caseMonitoringCodes,
    );
  });

  it("Should set apiData caseProsecutors data using SET_CASE_PROSECUTORS", () => {
    const action: CaseRegistrationActions = {
      type: "SET_CASE_PROSECUTORS",
      payload: {
        caseProsecutors: [
          {
            id: 1,
            description: "Prosecutor A",
          },
        ],
      },
    };
    const state = caseRegistrationReducer(initialState, action);
    expect(state.apiData.caseProsecutors).toEqual(
      action.payload.caseProsecutors,
    );
  });

  it("Should set apiData caseCaseworkers data using SET_CASE_CASEWORKERS", () => {
    const action: CaseRegistrationActions = {
      type: "SET_CASE_CASEWORKERS",
      payload: {
        caseCaseworkers: [
          {
            id: 1,
            description: "Caseworker A",
          },
        ],
      },
    };
    const state = caseRegistrationReducer(initialState, action);
    expect(state.apiData.caseCaseworkers).toEqual(
      action.payload.caseCaseworkers,
    );
  });
  it("Should set apiData caseInvestigatorTitles data using SET_CASE_INVESTIGATOR_TITLES", () => {
    const action: CaseRegistrationActions = {
      type: "SET_CASE_INVESTIGATOR_TITLES",
      payload: {
        caseInvestigatorTitles: [
          {
            shortCode: "INVESTIGATOR_A",
            description: "Investigator A",
            display: "Investigator A",
            isPoliceTitle: true,
          },
        ],
      },
    };
    const state = caseRegistrationReducer(initialState, action);
    expect(state.apiData.caseInvestigatorTitles).toEqual(
      action.payload.caseInvestigatorTitles,
    );
  });

  it("Should set apiData suspectGenders data using SET_CASE_SUSPECT_GENDERS", () => {
    const action: CaseRegistrationActions = {
      type: "SET_CASE_SUSPECT_GENDERS",
      payload: {
        suspectGenders: [
          { shortCode: "male", description: "Male" },
          { shortCode: "female", description: "Female" },
        ],
      },
    };
    const state = caseRegistrationReducer(initialState, action);
    expect(state.apiData.suspectGenders).toEqual(action.payload.suspectGenders);
  });

  it("Should set apiData suspectEthnicities data using SET_CASE_SUSPECT_ETHNICITIES", () => {
    const action: CaseRegistrationActions = {
      type: "SET_CASE_SUSPECT_ETHNICITIES",
      payload: {
        suspectEthnicities: [
          { shortCode: "black", description: "Black" },
          { shortCode: "white", description: "White" },
        ],
      },
    };
    const state = caseRegistrationReducer(initialState, action);
    expect(state.apiData.suspectEthnicities).toEqual(
      action.payload.suspectEthnicities,
    );
  });

  it("Should set apiData suspectReligions data using SET_CASE_SUSPECT_RELIGIONS", () => {
    const action: CaseRegistrationActions = {
      type: "SET_CASE_SUSPECT_RELIGIONS",
      payload: {
        suspectReligions: [
          { shortCode: "christian", description: "Christian" },
          { shortCode: "Buddhist", description: "Buddhist" },
        ],
      },
    };
    const state = caseRegistrationReducer(initialState, action);
    expect(state.apiData.suspectReligions).toEqual(
      action.payload.suspectReligions,
    );
  });

  it("Should set apiData suspectOffenderTypes data using SET_CASE_SUSPECT_OFFENDER_TYPE", () => {
    const action: CaseRegistrationActions = {
      type: "SET_CASE_SUSPECT_OFFENDER_TYPES",
      payload: {
        suspectOffenderTypes: [
          {
            shortCode: offenderTypeShortCodes.PROLIFIC_PRIORITY_OFFENDER,
            description: "Prolific priority offender",
            display: "Prolific priority offender (PPO)",
          },
          {
            shortCode: offenderTypeShortCodes.YOUTH_OFFENDER,
            description: "Prolific youth offender",
            display: "Prolific youth offender (PYO)",
          },
        ],
      },
    };
    const state = caseRegistrationReducer(initialState, action);
    expect(state.apiData.suspectOffenderTypes).toEqual(
      action.payload.suspectOffenderTypes,
    );
  });
  it("Should set apiData policeUnits data using SET_CASE_POLICE_UNITS", () => {
    const action: CaseRegistrationActions = {
      type: "SET_POLICE_UNITS",
      payload: {
        policeUnits: [
          {
            unitId: 2213,
            unitDescription: "Northern CJU (Bristol)",
            code: "SJ",
            description: "Avon & Somerset",
          },
          {
            unitId: 2067,
            unitDescription: "Barrow CJU",
            code: "NN",
            description: "British Police",
          },
        ],
      },
    };
    const state = caseRegistrationReducer(initialState, action);
    expect(state.apiData.policeUnits).toEqual(action.payload.policeUnits);
  });

  it("Should set apiData offencesSearchResults data using SET_OFFENCES_SEARCH_RESULTS", () => {
    const action: CaseRegistrationActions = {
      type: "SET_OFFENCES_SEARCH_RESULTS",
      payload: {
        offencesSearchResults: {
          offences: [
            {
              cmsId: 10000,
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
            {
              cmsId: 10002,
              code: "PB92005",
              description: "Attempt to injure a badger",
              legislation:
                "Contrary to sections 1(1) and 12 of the Protection of Badgers Act 1992.",
              effectiveFromDate: "1998-03-17T00:00:00",
              effectiveToDate: null,
              modeOfTrial: "abc",
              cmsModeOfTrialShortCode: "NYC",
            },
          ],
          total: 2,
        },
      },
    };
    const state = caseRegistrationReducer(initialState, action);
    expect(state.apiData.offencesSearchResults).toEqual(
      action.payload.offencesSearchResults,
    );
  });

  it("SET_NAVIGATION_DATA should update navigation data and preserve existing ones", () => {
    const startState = {
      ...initialState,
      formData: {
        ...initialState.formData,
        navigation: {
          ...initialState.formData.navigation,
          fromChargeSummaryPage: true,
        },
      },
    };

    const action = {
      type: "SET_NAVIGATION_DATA" as const,
      payload: { changeCaseArea: true, fromSuspectSummaryPage: true },
    };

    const next = caseRegistrationReducer(startState, action);

    expect(next.formData.navigation.changeCaseArea).toBe(true);
    expect(next.formData.navigation.fromSuspectSummaryPage).toBe(true);
    expect(next.formData.navigation.fromChargeSummaryPage).toBe(true);
    expect(next.apiData).toEqual(startState.apiData);
  });

  it("RESET_AREA_DEPENDENT_FIELDS should reset the depended fields", () => {
    const startState = {
      ...initialState,
      formData: {
        ...initialState.formData,
        registeringUnitText: { id: 1, description: "abc" },
        witnessCareUnitText: { id: 2, description: "def" },
        firstHearingDateText: "12/10/1999",
        firstHearingCourtLocationText: { id: 3, description: "ghi" },
        caseProsecutorText: { id: 4, description: "ddd" },
        caseCaseworkerText: { id: 5, description: "jkl" },
      },
    };

    const action = {
      type: "RESET_AREA_DEPENDENT_FIELDS" as const,
    };

    const next = caseRegistrationReducer(startState, action);

    expect(next.formData.registeringUnitText).toEqual({
      id: null,
      description: "",
    });
    expect(next.formData.witnessCareUnitText).toEqual({
      id: null,
      description: "",
    });
    expect(next.formData.firstHearingDateText).toBe("");
    expect(next.formData.firstHearingCourtLocationText).toEqual({
      id: null,
      description: "",
    });
    expect(next.formData.caseProsecutorText).toEqual({
      id: null,
      description: "",
    });
    expect(next.formData.caseCaseworkerText).toEqual({
      id: null,
      description: "",
    });
    expect(next.apiData).toEqual(startState.apiData);
  });

  it("RESET_RU_DEPENDENT_FIELDS should reset the depended fields", () => {
    const startState = {
      ...initialState,
      formData: {
        ...initialState.formData,
        registeringUnitText: { id: 1, description: "abc" },
        witnessCareUnitText: { id: 2, description: "def" },
        firstHearingDateText: "12/10/1999",
        firstHearingCourtLocationText: { id: 3, description: "ghi" },
        caseProsecutorText: { id: 4, description: "ddd" },
        caseCaseworkerText: { id: 5, description: "jkl" },
      },
    };

    const action = {
      type: "RESET_RU_DEPENDENT_FIELDS" as const,
    };

    const next = caseRegistrationReducer(startState, action);

    expect(next.formData.registeringUnitText).toEqual({
      id: 1,
      description: "abc",
    });
    expect(next.formData.witnessCareUnitText).toEqual({
      id: 2,
      description: "def",
    });
    expect(next.formData.firstHearingDateText).toBe("");
    expect(next.formData.firstHearingCourtLocationText).toEqual({
      id: null,
      description: "",
    });
    expect(next.formData.caseProsecutorText).toEqual({
      id: null,
      description: "",
    });
    expect(next.formData.caseCaseworkerText).toEqual({
      id: null,
      description: "",
    });
    expect(next.apiData).toEqual(startState.apiData);
  });

  it("REMOVE_INCOMPLETE_SUSPECT_CHARGES should remove incomplete charges for the given suspect", () => {
    const modifiedState: CaseRegistrationState = {
      ...initialState,
      formData: {
        ...initialState.formData,
        suspects: [
          {
            ...suspectInitialState,
            suspectId: "suspect-1",
            charges: [
              {
                ...chargeInitialState,
                chargeId: "charge-1",
                offenceFromDate: "",
              },
              {
                ...chargeInitialState,
                chargeId: "charge-2",
                offenceFromDate: "12/12/1999",
              },
              {
                ...chargeInitialState,
                chargeId: "charge-1",
                offenceFromDate: "12/12/1999",
                addVictimRadio: "yes",
                victim: null,
              },
            ],
          },

          {
            ...suspectInitialState,
            suspectId: "suspect-2",
            charges: [
              {
                ...chargeInitialState,
                chargeId: "charge-1",
                offenceFromDate: "",
              },
              { ...chargeInitialState, chargeId: "charge-2" },
              {
                ...chargeInitialState,
                chargeId: "charge-3",
                addVictimRadio: "yes",
                victim: null,
              },
            ],
          },
        ],
      },
    };
    const action: CaseRegistrationActions = {
      type: "REMOVE_INCOMPLETE_SUSPECT_CHARGES",
      payload: {
        suspectId: "suspect-1",
      },
    };
    const state = caseRegistrationReducer(modifiedState, action);
    expect(state.formData.suspects[0].charges.length).toEqual(1);
    expect(state.formData.suspects[1].charges.length).toEqual(3);
  });

  it("REMOVE_INCOMPLETE_SUSPECT_CHARGES should return the state if suspectId is not found", () => {
    const modifiedState: CaseRegistrationState = {
      ...initialState,
      formData: {
        ...initialState.formData,
        suspects: [
          {
            ...suspectInitialState,
            suspectId: "suspect-1",
            charges: [
              {
                ...chargeInitialState,
                chargeId: "charge-1",
                offenceFromDate: "",
              },
              {
                ...chargeInitialState,
                chargeId: "charge-2",
                offenceFromDate: "12/12/1999",
              },
              {
                ...chargeInitialState,
                chargeId: "charge-1",
                offenceFromDate: "12/12/1999",
                addVictimRadio: "yes",
                victim: null,
              },
            ],
          },

          {
            ...suspectInitialState,
            suspectId: "suspect-2",
            charges: [
              {
                ...chargeInitialState,
                chargeId: "charge-1",
                offenceFromDate: "",
              },
              { ...chargeInitialState, chargeId: "charge-2" },
              {
                ...chargeInitialState,
                chargeId: "charge-3",
                addVictimRadio: "yes",
                victim: null,
              },
            ],
          },
        ],
      },
    };
    const action: CaseRegistrationActions = {
      type: "REMOVE_INCOMPLETE_SUSPECT_CHARGES",
      payload: {
        suspectId: "suspect-3",
      },
    };
    const state = caseRegistrationReducer(modifiedState, action);
    expect(state).toEqual(modifiedState);
  });

  it("REMOVE_ALL_SUSPECTS should remove all the suspects", () => {
    const suspectState: SuspectFormData = {
      ...sampleSuspectState,
      addSuspectRadio: "person",
    };
    const modifiedState: CaseRegistrationState = {
      ...initialState,
      formData: {
        ...initialState.formData,
        suspects: [
          suspectState,
          {
            ...suspectState,
            suspectAdditionalDetailsCheckboxes: ["Disability", "Gender"],
            suspectId: "suspect-2",
          },
        ],
      },
    };
    const action: CaseRegistrationActions = {
      type: "REMOVE_ALL_SUSPECTS",
    };
    const expectedResult = {
      ...modifiedState,
      formData: {
        ...modifiedState.formData,
        suspects: [],
      },
    };
    const state = caseRegistrationReducer(modifiedState, action);
    expect(state).toEqual(expectedResult);
  });

  it("RESET_CHARGE_WITH_ADULT should reset chargedWithAdult field for the given suspect", () => {
    const modifiedState: CaseRegistrationState = {
      ...initialState,
      formData: {
        ...initialState.formData,
        suspects: [
          {
            ...suspectInitialState,
            suspectId: "suspect-1",
            charges: [
              {
                ...chargeInitialState,
                chargeId: "charge-1",
                chargedWithAdultRadio: "yes",
              },
              {
                ...chargeInitialState,
                chargeId: "charge-2",
                chargedWithAdultRadio: "no",
              },
            ],
          },
        ],
      },
    };
    const action: CaseRegistrationActions = {
      type: "RESET_CHARGE_WITH_ADULT",
      payload: { suspectIndex: 0 },
    };
    const expectedResult = {
      ...modifiedState,
      formData: {
        ...modifiedState.formData,
        suspects: [
          {
            ...modifiedState.formData.suspects[0],
            charges: [
              {
                ...chargeInitialState,
                chargeId: "charge-1",
                chargedWithAdultRadio: "",
              },
              {
                ...chargeInitialState,
                chargeId: "charge-2",
                chargedWithAdultRadio: "",
              },
            ],
          },
        ],
      },
    };
    const state = caseRegistrationReducer(modifiedState, action);
    expect(state).toEqual(expectedResult);
  });
  it("RESET_CHARGE_WITH_ADULT should return the current state if there is no suspect found based on the suspectIndex", () => {
    const modifiedState: CaseRegistrationState = {
      ...initialState,
      formData: {
        ...initialState.formData,
        suspects: [
          {
            ...suspectInitialState,
            suspectId: "suspect-1",
            charges: [
              {
                ...chargeInitialState,
                chargeId: "charge-1",
                chargedWithAdultRadio: "yes",
              },
              {
                ...chargeInitialState,
                chargeId: "charge-2",
                chargedWithAdultRadio: "no",
              },
            ],
          },
        ],
      },
    };
    const action: CaseRegistrationActions = {
      type: "RESET_CHARGE_WITH_ADULT",
      payload: { suspectIndex: 1 },
    };

    const state = caseRegistrationReducer(modifiedState, action);
    expect(state).toEqual(modifiedState);
  });
});
describe("getResetFieldValues", () => {
  it("should reset caseProsecutorText and caseCaseworkerText when caseProsecutorRadio is 'no'", () => {
    const result = getResetFieldValues({ caseProsecutorRadio: "no" });
    expect(result).toEqual({
      caseProsecutorText: { id: null, description: "" },
      caseCaseworkerText: { id: null, description: "" },
    });
  });
  it("should reset caseInvestigator fields when caseInvestigatorRadio is 'no'", () => {
    const result = getResetFieldValues({ caseInvestigatorRadio: "no" });
    expect(result).toEqual({
      caseInvestigatorTitleSelect: { shortCode: null, display: "" },
      caseInvestigatorFirstNameText: "",
      caseInvestigatorLastNameText: "",
      caseInvestigatorShoulderNameText: "",
      caseInvestigatorShoulderNumberText: "",
    });
  });
  it("should reset first hearing fields when firstHearingRadio is 'no'", () => {
    const result = getResetFieldValues({ firstHearingRadio: "no" });
    expect(result).toEqual({
      firstHearingCourtLocationText: { id: null, description: "" },
      firstHearingDateText: "",
    });
  });

  it("should return an empty object for other fields", () => {
    const result = getResetFieldValues({ operationNameRadio: "yes" });
    expect(result).toEqual({});
  });

  it("should reset more than one fields if the relevant radio is 'no'", () => {
    const result = getResetFieldValues({
      caseInvestigatorRadio: "no",
      caseProsecutorRadio: "no",
    });
    expect(result).toEqual({
      caseProsecutorText: { id: null, description: "" },
      caseCaseworkerText: { id: null, description: "" },
      caseInvestigatorTitleSelect: { shortCode: null, display: "" },
      caseInvestigatorFirstNameText: "",
      caseInvestigatorLastNameText: "",
      caseInvestigatorShoulderNameText: "",
      caseInvestigatorShoulderNumberText: "",
    });
  });
});
