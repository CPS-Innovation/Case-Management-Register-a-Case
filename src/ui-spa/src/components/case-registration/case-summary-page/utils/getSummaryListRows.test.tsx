/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { render, cleanup } from "@testing-library/react";
import { afterEach, describe, it, expect, vi } from "vitest";
import {
  type CaseRegistrationFormData,
  type CaseRegistrationActions,
} from "../../../../common/reducers/caseRegistrationReducer";
import {
  getCaseDetailsSummaryListRows,
  getFirstHearingSummaryRows,
  getCaseComplexityAndMonitoringCodesSummaryListRows,
  getInvestigatorSummaryText,
  getWhosIsWorkingOnTheCaseSummaryListRows,
} from "./getSummaryListRows";
import type { PoliceUnit } from "../../../../schemas";

afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});
const renderText = (node: React.ReactNode) => {
  const { container } = render(<div>{node}</div>);
  return (container.textContent ?? "").trim();
};

// helper to reuse the assertion logic across tests
function assertRowsMatch(
  rows: any[],
  expectedByIndex: Array<{
    key: string;
    value: string;
    actionText: string;
    actionTo?: string;
  }>,
) {
  expect(rows.length).toBeGreaterThanOrEqual(expectedByIndex.length);

  expectedByIndex.forEach((exp, index) => {
    const row = rows[index];
    expect(row).toBeDefined();

    const keyText = renderText(row.key.children);
    expect(keyText).toBe(exp.key);

    const valueText = renderText(row.value?.children ?? "");
    expect(valueText).toBe(exp.value);

    const items = row.actions?.items ?? [];
    expect(items.length).toBeGreaterThanOrEqual(1);

    const firstAction = items[0];
    const actionInnerText = renderText(firstAction.children);
    expect(actionInnerText).toBe(exp.actionText);

    if (exp.actionTo !== undefined) {
      expect(firstAction.to).toBe(exp.actionTo);
    }
  });
}
const formData: CaseRegistrationFormData = {
  operationNameRadio: "",
  suspectDetailsRadio: "",
  operationNameText: "",
  areaOrDivisionText: { id: null, description: "" },
  urnPoliceForceText: "",
  urnPoliceUnitText: "",
  urnUniqueReferenceText: "",
  urnYearReferenceText: "",
  registeringUnitText: { id: null, description: "" },
  witnessCareUnitText: { id: null, description: "" },
  firstHearingRadio: "",
  firstHearingCourtLocationText: { id: null, description: "" },
  firstHearingDateText: "",
  caseComplexityRadio: { shortCode: "", description: "" },
  caseMonitoringCodesCheckboxes: [],
  caseInvestigatorRadio: "",
  caseProsecutorRadio: "",
  caseProsecutorText: { id: null, description: "" },
  caseCaseworkerText: { id: null, description: "" },
  caseInvestigatorTitleSelect: { shortCode: null, display: "" },
  caseInvestigatorFirstNameText: "",
  caseInvestigatorLastNameText: "",
  caseInvestigatorShoulderNameText: "",
  caseInvestigatorShoulderNumberText: "",
  suspects: [],
  wantToAddChargesRadio: "",
  victimsList: [],
  navigation: {
    fromCaseSummaryPage: false,
    fromChargeSummaryPage: false,
    fromSuspectSummaryPage: false,
    changeCaseArea: false,
    changeCaseDetails: false,
    changeCaseSuspects: false,
    changeCaseCharges: false,
  },
};
describe("getCaseDetailsSummaryListRows", () => {
  it("Should return correct row values, when there are values", () => {
    const dispatch = vi.fn();
    const navigate = vi.fn();

    const caseDetailsValue = {
      operationNameRadio: "yes",
      suspectDetailsRadio: "yes",
      operationNameText: "op_1",
      areaOrDivisionText: { id: 1, description: "area_1" },
      urnPoliceForceText: "11",
      urnPoliceUnitText: "12",
      urnUniqueReferenceText: "0001",
      urnYearReferenceText: "26",
      registeringUnitText: { id: 2, description: "ru_1" },
      witnessCareUnitText: { id: 3, description: "wcu_1" },
      suspects: [
        { id: 1, name: "Suspect 1" },
        { id: 2, name: "Suspect 2" },
      ] as unknown,
    };

    const modifiedFormData = {
      ...formData,
      ...caseDetailsValue,
    } as CaseRegistrationFormData;

    const rows = getCaseDetailsSummaryListRows(
      dispatch,
      navigate,
      modifiedFormData,
      false,
      false,
    );

    const expectedValues = [
      {
        key: "Area",
        value: "area_1",
        actionText: "Change",
        actionTo: "/case-registration/areas",
      },
      {
        key: "URN",
        value: "1112000126",
        actionText: "Change",
        actionTo: "/case-registration/case-details",
      },
      {
        key: "Registering unit",
        value: "ru_1",
        actionText: "Change",
        actionTo: "/case-registration/case-details",
      },
      {
        key: "WCU",
        value: "wcu_1",
        actionText: "Change",
        actionTo: "/case-registration/case-details",
      },
      {
        key: "Operation name",
        value: "op_1",
        actionText: "Change",
        actionTo: "/case-registration",
      },
      {
        key: "Suspects",
        value: "2 suspects added",
        actionText: "Add a suspect",
        actionTo: "/case-registration/suspect-2/add-suspect",
      },
    ];

    expect(rows.length).toBeGreaterThanOrEqual(expectedValues.length);
    assertRowsMatch(rows, expectedValues);
  });
  it("Should return correct row values, when there are default values", () => {
    const dispatch = vi.fn();
    const navigate = vi.fn();

    const caseDetailsValue = {
      operationNameRadio: "no",
      suspectDetailsRadio: "no",
      operationNameText: "",
      areaOrDivisionText: { id: 1, description: "area_1" },
      urnPoliceForceText: "11",
      urnPoliceUnitText: "12",
      urnUniqueReferenceText: "0001",
      urnYearReferenceText: "26",
      registeringUnitText: { id: 2, description: "ru_1" },
      witnessCareUnitText: { id: 3, description: "wcu_1" },
      suspects: [] as unknown,
    };

    const modifiedFormData = {
      ...formData,
      ...caseDetailsValue,
    } as CaseRegistrationFormData;

    const rows = getCaseDetailsSummaryListRows(
      dispatch,
      navigate,
      modifiedFormData,
      false,
      false,
    );

    const expectedValues = [
      {
        key: "Area",
        value: "area_1",
        actionText: "Change",
        actionTo: "/case-registration/areas",
      },
      {
        key: "URN",
        value: "1112000126",
        actionText: "Change",
        actionTo: "/case-registration/case-details",
      },
      {
        key: "Registering unit",
        value: "ru_1",
        actionText: "Change",
        actionTo: "/case-registration/case-details",
      },
      {
        key: "WCU",
        value: "wcu_1",
        actionText: "Change",
        actionTo: "/case-registration/case-details",
      },
      {
        key: "Operation name",
        value: "Not entered",
        actionText: "Change",
        actionTo: "/case-registration",
      },
      {
        key: "Suspects",
        value: "Not entered",
        actionText: "Add a suspect",
        actionTo: "/case-registration/suspect-0/add-suspect",
      },
    ];

    expect(rows.length).toBeGreaterThanOrEqual(expectedValues.length);
    assertRowsMatch(rows, expectedValues);
  });

  it("returns no action items when hideActions is true", () => {
    const dispatch = vi.fn();
    const navigate = vi.fn();

    const rows = getCaseDetailsSummaryListRows(
      dispatch,
      navigate,
      formData,
      true,
      false,
    );
    for (const r of rows) {
      expect(r.actions?.items).toEqual([]);
    }
  });
  it("Should return correct row values for the sensitive cases, it should not show the change links for area and registering units (empty actions)", () => {
    const dispatch = vi.fn();
    const navigate = vi.fn();

    const caseDetailsValue = {
      operationNameRadio: "yes",
      suspectDetailsRadio: "yes",
      operationNameText: "op_1",
      areaOrDivisionText: { id: 1, description: "area_1" },
      urnPoliceForceText: "11",
      urnPoliceUnitText: "12",
      urnUniqueReferenceText: "0001",
      urnYearReferenceText: "26",
      registeringUnitText: { id: 2, description: "ru_1" },
      witnessCareUnitText: { id: 3, description: "wcu_1" },
      suspects: [
        { id: 1, name: "Suspect 1" },
        { id: 2, name: "Suspect 2" },
      ] as unknown,
    };

    const modifiedFormData = {
      ...formData,
      ...caseDetailsValue,
    } as CaseRegistrationFormData;

    const rows = getCaseDetailsSummaryListRows(
      dispatch,
      navigate,
      modifiedFormData,
      false,
      true,
    );

    expect(rows.length).toBeGreaterThanOrEqual(6);
    expect(rows[0].key.children).toEqual(<span>Area</span>);
    expect(rows[0].value.children).toEqual(<span>area_1</span>);
    expect(rows[0].actions?.items).toEqual([]);

    expect(rows[2].key.children).toEqual(<span>Registering unit</span>);
    expect(rows[2].value.children).toEqual(<span>ru_1</span>);
    expect(rows[2].actions?.items).toEqual([]);
  });
});
describe("getFirstHearingSummaryRows", () => {
  it("renders first hearing date and court location with change actions", () => {
    const dispatch =
      vi.fn() as unknown as React.Dispatch<CaseRegistrationActions>;
    const navigate = vi.fn();

    const formWithHearing: CaseRegistrationFormData = {
      ...formData,
      firstHearingRadio: "yes",
      firstHearingCourtLocationText: { id: null, description: "Central Court" },
      firstHearingDateText: new Date(2023, 0, 2).toISOString(), // ISO string accepted by util
    };

    const rows = getFirstHearingSummaryRows(
      dispatch,
      navigate,
      formWithHearing,
      false,
    );

    const expected = [
      {
        key: "First hearing court location",
        value: "Central Court",
        actionText: "Change",
        actionTo: "/case-registration/first-hearing",
      },
      {
        key: "First hearing date",
        value: "02 January 2023",
        actionText: "Change",
        actionTo: "/case-registration/first-hearing",
      },
    ];

    expect(rows.length).toBeGreaterThanOrEqual(expected.length);
    assertRowsMatch(rows, expected);
  });

  it("hides actions when hideActions is true", () => {
    const dispatch =
      vi.fn() as unknown as React.Dispatch<CaseRegistrationActions>;
    const navigate = vi.fn();

    const formWithHearing: CaseRegistrationFormData = {
      ...formData,
      firstHearingRadio: "yes",
      firstHearingCourtLocationText: { id: null, description: "Central Court" },
      firstHearingDateText: new Date(2023, 0, 2).toISOString(),
    };

    const rows = getFirstHearingSummaryRows(
      dispatch,
      navigate,
      formWithHearing,
      true,
    );

    for (const r of rows) {
      expect(r.actions?.items).toEqual([]);
    }
  });
});
describe("getCaseComplexityAndMonitoringCodesSummaryListRows", () => {
  it("renders complexity and sorted monitoring codes, action triggers dispatch/navigate", () => {
    const dispatch =
      vi.fn() as unknown as React.Dispatch<CaseRegistrationActions>;
    const navigate = vi.fn();

    const formWithCodes: CaseRegistrationFormData = {
      ...formData,
      caseComplexityRadio: { shortCode: "M", description: "Medium" },
      caseMonitoringCodesCheckboxes: ["B", "A"],
    };

    const caseMonitoringCodes = [
      { code: "A", display: "Alpha", description: "Description for Alpha" },
      { code: "B", display: "Beta", description: "Description for Beta" },
    ];

    const rows = getCaseComplexityAndMonitoringCodesSummaryListRows(
      dispatch,
      navigate,
      formWithCodes,
      caseMonitoringCodes,
      false,
    );

    // complexity row
    const complexityRow = rows[0];
    expect(renderText(complexityRow.key.children)).toBe("Case complexity");
    expect(renderText(complexityRow.value!.children)).toBe("Medium");
    const complexityAction = complexityRow.actions!.items[0] as any;
    expect(renderText(complexityAction.children)).toBe("Change");
    expect(complexityAction.to).toBe("/case-registration/case-complexity");

    const monitoringRow = rows[1];
    expect(renderText(monitoringRow.key.children)).toBe("Monitoring codes");

    const { container } = render(<div>{monitoringRow.value!.children}</div>);
    const listItems = container.querySelectorAll("li");
    const texts = Array.from(listItems).map(
      (li) => li.textContent?.trim() ?? "",
    );
    expect(texts).toEqual(["Alpha", "Beta"]);

    const monitoringAction = monitoringRow.actions!.items[0] as any;
    expect(renderText(monitoringAction.children)).toBe("Change");
    expect(monitoringAction.to).toBe(
      "/case-registration/case-monitoring-codes",
    );

    const preventDefault = vi.fn();
    monitoringAction.onClick?.({
      preventDefault,
    } as unknown as React.MouseEvent<HTMLAnchorElement>);
    expect(preventDefault).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith({
      type: "SET_NAVIGATION_DATA",
      payload: { fromCaseSummaryPage: true },
    });
    expect(navigate).toHaveBeenCalledWith(
      "/case-registration/case-monitoring-codes",
    );
  });

  it("hides actions when hideActions is true", () => {
    const dispatch =
      vi.fn() as unknown as React.Dispatch<CaseRegistrationActions>;
    const navigate = vi.fn();

    const formWithCodes: CaseRegistrationFormData = {
      ...formData,
      caseComplexityRadio: {
        shortCode: "L",
        description: "Description for Low Complexity",
      },
      caseMonitoringCodesCheckboxes: ["X"],
    };

    const caseMonitoringCodes = [
      { code: "X", display: "X-ray", description: "Description for X-ray" },
    ];

    const rows = getCaseComplexityAndMonitoringCodesSummaryListRows(
      dispatch,
      navigate,
      formWithCodes,
      caseMonitoringCodes,
      true,
    );

    for (const r of rows) {
      expect(r.actions?.items).toEqual([]);
    }
  });
});
describe("getInvestigatorSummaryText", () => {
  const baseForm = {
    caseInvestigatorTitleSelect: { shortCode: null, display: "" },
    caseInvestigatorFirstNameText: "",
    caseInvestigatorLastNameText: "",
  } as unknown as CaseRegistrationFormData;

  it("returns fragment with Tag + last, first when title.display is present", () => {
    const form = {
      ...baseForm,
      caseInvestigatorTitleSelect: { shortCode: null, display: "Inspector" },
      caseInvestigatorFirstNameText: "John",
      caseInvestigatorLastNameText: "Doe",
    } as CaseRegistrationFormData;

    const node = getInvestigatorSummaryText(form);
    const { container } = render(<div>{node}</div>);
    const text = (container.textContent ?? "").trim();

    expect(text).toContain("Inspector");
    expect(text).toContain("Doe");
    expect(text).toContain("John");
    expect(text).toMatch("Inspector - Doe, John");
  });

  it("returns 'Last, First' string when title.display is empty but first name present", () => {
    const form = {
      ...baseForm,
      caseInvestigatorTitleSelect: { shortCode: null, display: "" },
      caseInvestigatorFirstNameText: "Jane",
      caseInvestigatorLastNameText: "Roe",
    } as CaseRegistrationFormData;

    const node = getInvestigatorSummaryText(form);
    const { container } = render(<div>{node}</div>);
    const text = (container.textContent ?? "").trim();

    expect(text).toBe("Roe, Jane");
  });

  it("returns last name only when first name and title are absent", () => {
    const form = {
      ...baseForm,
      caseInvestigatorTitleSelect: { shortCode: null, display: "" },
      caseInvestigatorFirstNameText: "",
      caseInvestigatorLastNameText: "Solo",
    } as CaseRegistrationFormData;

    const node = getInvestigatorSummaryText(form);
    const { container } = render(<div>{node}</div>);
    const text = (container.textContent ?? "").trim();

    expect(text).toBe("Solo");
  });
});
describe("getWhosIsWorkingOnTheCaseSummaryListRows", () => {
  it("renders prosecutor/caseworker and 'Not entered' investigator when none set; actions work", () => {
    const dispatch =
      vi.fn() as unknown as React.Dispatch<CaseRegistrationActions>;
    const navigate = vi.fn();

    const form: CaseRegistrationFormData = {
      ...formData,
      caseProsecutorText: { id: null, description: "" },
      caseCaseworkerText: { id: null, description: "" },
      caseInvestigatorRadio: "no",
    };

    const rows = getWhosIsWorkingOnTheCaseSummaryListRows(
      dispatch,
      navigate,
      form,
      false,
    );

    expect(renderText(rows[0].key.children)).toBe("Prosecutor");
    expect(renderText(rows[0].value!.children)).toBe("Not entered");
    const procAction = rows[0].actions!.items[0] as any;
    expect(renderText(procAction.children)).toBe("Change");
    expect(procAction.to).toBe("/case-registration/case-assignee");

    const preventDefault1 = vi.fn();
    procAction.onClick?.({
      preventDefault: preventDefault1,
    } as unknown as React.MouseEvent<HTMLAnchorElement>);
    expect(preventDefault1).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith({
      type: "SET_NAVIGATION_DATA",
      payload: { fromCaseSummaryPage: true },
    });
    expect(navigate).toHaveBeenCalledWith("/case-registration/case-assignee");

    expect(renderText(rows[1].key.children)).toBe("Caseworker");
    expect(renderText(rows[1].value!.children)).toBe("Not entered");

    expect(renderText(rows[2].key.children)).toBe(
      "Police officer or investigator",
    );
    expect(renderText(rows[2].value!.children)).toBe("Not entered");
    const invAction = rows[2].actions!.items[0] as any;
    expect(renderText(invAction.children)).toBe("Change");
    expect(invAction.to).toBe("/case-registration/case-assignee");
  });

  it("renders investigator details, shoulder number and police unit when caseInvestigatorRadio === 'yes' and policeUnit provided", () => {
    const dispatch =
      vi.fn() as unknown as React.Dispatch<CaseRegistrationActions>;
    const navigate = vi.fn();

    const form: CaseRegistrationFormData = {
      ...formData,
      caseProsecutorText: { id: null, description: "Proc Name" },
      caseCaseworkerText: { id: null, description: "CW Name" },
      caseInvestigatorRadio: "yes",
      caseInvestigatorTitleSelect: { shortCode: null, display: "Inspector" },
      caseInvestigatorFirstNameText: "John",
      caseInvestigatorLastNameText: "Doe",
      caseInvestigatorShoulderNumberText: "SH123",
    };

    const policeUnit: PoliceUnit = {
      code: "P1",
      description: "Unit One",
    } as PoliceUnit;

    const rows = getWhosIsWorkingOnTheCaseSummaryListRows(
      dispatch,
      navigate,
      form,
      false,
      policeUnit,
    );

    expect(renderText(rows[0].key.children)).toBe("Prosecutor");
    expect(renderText(rows[0].value!.children)).toBe("Proc Name");
    expect(renderText(rows[1].key.children)).toBe("Caseworker");
    expect(renderText(rows[1].value!.children)).toBe("CW Name");

    expect(renderText(rows[2].key.children)).toBe(
      "Police officer or investigator",
    );
    const invText = renderText(rows[2].value!.children);

    expect(invText).toContain("Inspector");
    expect(invText).toContain("Doe");
    expect(invText).toContain("John");
    const invAction = rows[2].actions!.items[0] as any;
    expect(renderText(invAction.children)).toBe("Change");
    expect(invAction.to).toBe("/case-registration/case-assignee");

    const preventDefault2 = vi.fn();
    invAction.onClick?.({
      preventDefault: preventDefault2,
    } as unknown as React.MouseEvent<HTMLAnchorElement>);
    expect(preventDefault2).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith({
      type: "SET_NAVIGATION_DATA",
      payload: { fromCaseSummaryPage: true },
    });
    expect(navigate).toHaveBeenCalledWith("/case-registration/case-assignee");

    expect(renderText(rows[3].key.children)).toBe("Shoulder number");
    expect(renderText(rows[3].value!.children)).toBe("SH123");
    const shoulderAction = rows[3].actions!.items[0] as any;
    expect(renderText(shoulderAction.children)).toBe("Change");

    expect(renderText(rows[4].key.children)).toBe("Police unit");
    expect(renderText(rows[4].value!.children)).toBe("Unit One");
    expect(rows[4].actions!.items).toEqual([]);
  });

  it("hides all actions when hideActions is true", () => {
    const dispatch =
      vi.fn() as unknown as React.Dispatch<CaseRegistrationActions>;
    const navigate = vi.fn();

    const form: CaseRegistrationFormData = {
      ...formData,
      caseInvestigatorRadio: "yes",
      caseInvestigatorTitleSelect: { shortCode: null, display: "Inspector" },
      caseInvestigatorFirstNameText: "John",
      caseInvestigatorLastNameText: "Doe",
      caseInvestigatorShoulderNumberText: "SH123",
    };

    const policeUnit: PoliceUnit = {
      code: "P1",
      description: "Unit One",
    } as PoliceUnit;

    const rows = getWhosIsWorkingOnTheCaseSummaryListRows(
      dispatch,
      navigate,
      form,
      true,
      policeUnit,
    );

    rows.forEach((r) => {
      expect(r.actions?.items).toEqual([]);
    });
  });

  it("includes Police unit row when investigator === 'yes' and policeUnit.description is provided and should not have actions", () => {
    const dispatch =
      vi.fn() as unknown as React.Dispatch<CaseRegistrationActions>;
    const navigate = vi.fn();

    const policeUnit: PoliceUnit = {
      code: "P1",
      description: "Unit One",
    } as PoliceUnit;
    const newFormData: CaseRegistrationFormData = {
      ...formData,
      caseInvestigatorRadio: "yes",
    };

    const rows = getWhosIsWorkingOnTheCaseSummaryListRows(
      dispatch,
      navigate,
      newFormData,
      false,
      policeUnit,
    );

    const policeUnitRow = rows.find(
      (r) => renderText(r.key.children) === "Police unit",
    );
    expect(policeUnitRow).toBeDefined();
    expect(renderText(policeUnitRow!.value!.children)).toBe("Unit One");

    expect(policeUnitRow!.actions!.items).toEqual([]);
  });

  it("does not include Police unit row when policeUnit is not provided", () => {
    const dispatch =
      vi.fn() as unknown as React.Dispatch<CaseRegistrationActions>;
    const navigate = vi.fn();

    const emptyPoliceUnit: PoliceUnit = {} as PoliceUnit;
    const rows = getWhosIsWorkingOnTheCaseSummaryListRows(
      dispatch,
      navigate,
      formData,
      false,
      emptyPoliceUnit,
    );
    expect(rows.some((r) => renderText(r.key.children) === "Police unit")).toBe(
      false,
    );
  });
});
