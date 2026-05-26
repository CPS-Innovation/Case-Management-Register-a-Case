import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { type Mock } from "vitest";
import { getChargesSummaryListRows } from "./getChargesSummaryListRows";
import { isChargedWithAdultWarningActive } from "../../../../common/utils/isChargedWithAdultWarningActive";
import {
  type ChargesFormData,
  suspectInitialState,
} from "../../../../common/reducers/caseRegistrationReducer";

vi.mock("../../../../common/utils/isChargedWithAdultWarningActive", () => ({
  isChargedWithAdultWarningActive: vi.fn(),
}));

const renderRows = (rows: ReturnType<typeof getChargesSummaryListRows>) => {
  const flat = rows.flat();
  const nodes = flat.map((r, i) => (
    <div key={i} data-testid={`row-${i}`}>
      <div data-testid={`row-${i}-key`}>{r.key.children}</div>
      <div data-testid={`row-${i}-value`}>{r.value.children}</div>
    </div>
  ));
  render(<div>{nodes}</div>);
};

describe("getChargesSummaryListRows", () => {
  it("shows correct values for the victim charge fields represented in rows", () => {
    (isChargedWithAdultWarningActive as Mock).mockReturnValueOnce(true);
    const charge: ChargesFormData = {
      chargeId: "charge-1",
      offenceSearchText: "theft",
      selectedOffence: {
        cmsId: 10001,
        code: "offence-code-1",
        description: "Theft description",
        legislation: "Theft Act 1968",
        effectiveFromDate: "20-03-1990",
        effectiveToDate: "20-06-1990",
        modeOfTrial: "abc",
        cmsModeOfTrialShortCode: "NYC",
      },

      offenceFromDate: "1990-03-23",
      offenceToDate: "1990-06-26",
      addVictimRadio: "yes",
      chargedWithAdultRadio: "yes",
      victim: {
        victimId: "victim-1",
      },
    };

    const victimList = [
      {
        victimId: "victim-1",
        victimFirstNameText: "John",
        victimLastNameText: "Doe",
        victimAdditionalDetailsCheckboxes: [
          "Vulnerable" as const,
          "Intimidated" as const,
          "Witness" as const,
        ],
      },
    ];

    const suspects = [
      {
        ...suspectInitialState,
        suspectId: "suspect-1",
        suspectOffenderTypesRadio: {
          shortCode: "YO",
          display: "Youth Offender",
          arrestDate: "2023-01-01",
        },
      },
    ];

    const rows = getChargesSummaryListRows(
      charge,
      victimList,
      true,
      "suspect-1",
      "charge-1",
      suspects,
    );
    renderRows(rows);
    expect(screen.getByTestId(`row-0-key`)).toHaveTextContent("offence-code-1");
    expect(screen.getByTestId(`row-0-value`)).toHaveTextContent(
      "Theft description",
    );
    expect(screen.getByTestId(`row-1-key`)).toHaveTextContent(
      "Date of offence",
    );
    expect(screen.getByTestId(`row-1-value`)).toHaveTextContent(
      "23 March 1990 to 26 June 1990",
    );
    expect(screen.getByTestId(`row-2-key`)).toHaveTextContent("Victim");
    expect(screen.getByTestId(`row-2-value`)).toHaveTextContent("DOE, John");
    expect(screen.getByTestId(`row-2-value`)).toHaveTextContent("Vulnerable");
    expect(screen.getByTestId(`row-2-value`)).toHaveTextContent("Witness");
    expect(screen.getByTestId(`row-2-value`)).toHaveTextContent("Intimidated");
    expect(screen.getByTestId(`row-3-key`)).toHaveTextContent(
      "Charged with an adult",
    );
    expect(screen.getByTestId(`row-3-value`)).toHaveTextContent("Yes");
    expect(isChargedWithAdultWarningActive).toHaveBeenCalledWith("YO");
  });

  it("shows correct values for the victim charge fields, when offenceToDate is not provided", () => {
    const charge: ChargesFormData = {
      chargeId: "charge-1",
      offenceSearchText: "theft",
      selectedOffence: {
        cmsId: 10001,
        code: "offence-code-1",
        description: "Theft description",
        legislation: "Theft Act 1968",
        effectiveFromDate: "20-03-1990",
        effectiveToDate: "20-06-1990",
        modeOfTrial: "abc",
        cmsModeOfTrialShortCode: "NYC",
      },

      offenceFromDate: "1990-03-23",
      offenceToDate: "",
      addVictimRadio: "yes",
      chargedWithAdultRadio: "no",
      victim: {
        victimId: "victim-1",
      },
    };
    const victimList = [
      {
        victimId: "victim-1",
        victimFirstNameText: "John",
        victimLastNameText: "Doe",
        victimAdditionalDetailsCheckboxes: [
          "Vulnerable" as const,
          "Witness" as const,
        ],
      },
    ];

    const rows = getChargesSummaryListRows(
      charge,
      victimList,
      true,
      "suspect-1",
      "charge-1",
      [],
    );

    renderRows(rows);
    expect(screen.getByTestId(`row-0-key`)).toHaveTextContent("offence-code-1");
    expect(screen.getByTestId(`row-0-value`)).toHaveTextContent(
      "Theft description",
    );
    expect(screen.getByTestId(`row-1-key`)).toHaveTextContent(
      "Date of offence",
    );
    expect(screen.getByTestId(`row-1-value`)).toHaveTextContent(
      "23 March 1990",
    );
    expect(screen.getByTestId(`row-2-key`)).toHaveTextContent("Victim");
    expect(screen.getByTestId(`row-2-value`)).toHaveTextContent("DOE, John");
    expect(screen.getByTestId(`row-2-value`)).toHaveTextContent("Vulnerable");
    expect(screen.getByTestId(`row-2-value`)).toHaveTextContent("Witness");
    expect(screen.getByTestId(`row-2-value`)).not.toHaveTextContent(
      "Intimidated",
    );
  });

  it("should not show the charge row if the isCaseSummaryPage  parameter is false ", () => {
    const charge: ChargesFormData = {
      chargeId: "charge-1",
      offenceSearchText: "theft",
      selectedOffence: {
        cmsId: 10001,
        code: "offence-code-1",
        description: "Theft description",
        legislation: "Theft Act 1968",
        effectiveFromDate: "20-03-1990",
        effectiveToDate: "20-06-1990",
        modeOfTrial: "abc",
        cmsModeOfTrialShortCode: "NYC",
      },

      offenceFromDate: "1990-03-23",
      offenceToDate: "",
      addVictimRadio: "yes",
      chargedWithAdultRadio: "no",
      victim: { victimId: "victim-1" },
    };

    const victimList = [
      {
        victimId: "victim-1",
        victimFirstNameText: "John",
        victimLastNameText: "Doe",
        victimAdditionalDetailsCheckboxes: [
          "Vulnerable" as const,
          "Witness" as const,
        ],
      },
    ];

    const rows = getChargesSummaryListRows(
      charge,
      victimList,
      false,
      "suspect-1",
      "charge-1",
      [],
    );

    renderRows(rows);

    expect(screen.getByTestId(`row-0-key`)).toHaveTextContent(
      "Date of offence",
    );
    expect(screen.getByTestId(`row-0-value`)).toHaveTextContent(
      "23 March 1990",
    );
    expect(screen.getByTestId(`row-1-key`)).toHaveTextContent("Victim");
    expect(screen.getByTestId(`row-1-value`)).toHaveTextContent("DOE, John");
    expect(screen.getByTestId(`row-1-value`)).toHaveTextContent("Vulnerable");
    expect(screen.getByTestId(`row-1-value`)).toHaveTextContent("Witness");
    expect(screen.getByTestId(`row-1-value`)).not.toHaveTextContent(
      "Intimidated",
    );
  });

  it("should not show the charged with Adult property if the suspects if the isAdultChargeActive return false", () => {
    const charge: ChargesFormData = {
      chargeId: "charge-1",
      offenceSearchText: "theft",
      selectedOffence: {
        cmsId: 10001,
        code: "offence-code-1",
        description: "Theft description",
        legislation: "Theft Act 1968",
        effectiveFromDate: "20-03-1990",
        effectiveToDate: "20-06-1990",
        modeOfTrial: "abc",
        cmsModeOfTrialShortCode: "NYC",
      },

      offenceFromDate: "1990-03-23",
      offenceToDate: "",
      addVictimRadio: "yes",
      chargedWithAdultRadio: "no",
      victim: { victimId: "victim-1" },
    };

    const victimList = [
      {
        victimId: "victim-1",
        victimFirstNameText: "John",
        victimLastNameText: "Doe",
        victimAdditionalDetailsCheckboxes: [
          "Vulnerable" as const,
          "Witness" as const,
        ],
      },
    ];

    const rows = getChargesSummaryListRows(
      charge,
      victimList,
      false,
      "suspect-1",
      "charge-1",
      [],
    );

    renderRows(rows);

    expect(screen.getByTestId(`row-0-key`)).toHaveTextContent(
      "Date of offence",
    );
    expect(screen.getByTestId(`row-0-value`)).toHaveTextContent(
      "23 March 1990",
    );
    expect(screen.getByTestId(`row-1-key`)).toHaveTextContent("Victim");
    expect(screen.getByTestId(`row-1-value`)).toHaveTextContent("DOE, John");
    expect(screen.getByTestId(`row-1-value`)).toHaveTextContent("Vulnerable");
    expect(screen.getByTestId(`row-1-value`)).toHaveTextContent("Witness");
    expect(screen.getByTestId(`row-1-value`)).not.toHaveTextContent(
      "Intimidated",
    );
  });

  it("Should not show the charged with an adult property if the isChargedWithAdultWarningActive returns false", () => {
    (isChargedWithAdultWarningActive as Mock).mockReturnValueOnce(false);
    const charge: ChargesFormData = {
      chargeId: "charge-1",
      offenceSearchText: "theft",
      selectedOffence: {
        cmsId: 10001,
        code: "offence-code-1",
        description: "Theft description",
        legislation: "Theft Act 1968",
        effectiveFromDate: "20-03-1990",
        effectiveToDate: "20-06-1990",
        modeOfTrial: "abc",
        cmsModeOfTrialShortCode: "NYC",
      },

      offenceFromDate: "1990-03-23",
      offenceToDate: "1990-06-26",
      addVictimRadio: "yes",
      chargedWithAdultRadio: "yes",
      victim: {
        victimId: "victim-1",
      },
    };

    const victimList = [
      {
        victimId: "victim-1",
        victimFirstNameText: "John",
        victimLastNameText: "Doe",
        victimAdditionalDetailsCheckboxes: [
          "Vulnerable" as const,
          "Intimidated" as const,
          "Witness" as const,
        ],
      },
    ];

    const suspects = [
      {
        ...suspectInitialState,
        suspectId: "suspect-1",
        suspectOffenderTypesRadio: {
          shortCode: "YO",
          display: "Youth Offender",
          arrestDate: "2023-01-01",
        },
      },
    ];

    const rows = getChargesSummaryListRows(
      charge,
      victimList,
      true,
      "suspect-1",
      "charge-1",
      suspects,
    );
    renderRows(rows);
    expect(screen.getByTestId(`row-0-key`)).toHaveTextContent("offence-code-1");
    expect(screen.getByTestId(`row-0-value`)).toHaveTextContent(
      "Theft description",
    );
    expect(screen.getByTestId(`row-1-key`)).toHaveTextContent(
      "Date of offence",
    );
    expect(screen.getByTestId(`row-1-value`)).toHaveTextContent(
      "23 March 1990 to 26 June 1990",
    );
    expect(screen.getByTestId(`row-2-key`)).toHaveTextContent("Victim");
    expect(screen.getByTestId(`row-2-value`)).toHaveTextContent("DOE, John");
    expect(screen.getByTestId(`row-2-value`)).toHaveTextContent("Vulnerable");
    expect(screen.getByTestId(`row-2-value`)).toHaveTextContent("Witness");
    expect(screen.getByTestId(`row-2-value`)).toHaveTextContent("Intimidated");
    expect(screen.queryByTestId(`row-3-key`)).not.toBeInTheDocument();
    expect(screen.queryByTestId(`row-3-value`)).not.toBeInTheDocument();
    expect(isChargedWithAdultWarningActive).toHaveBeenCalledWith("YO");
  });
});
