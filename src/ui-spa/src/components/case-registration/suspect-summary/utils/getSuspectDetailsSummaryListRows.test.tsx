import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { getSuspectDetailsSummaryListRows } from "./getSuspectDetailsSummaryListRows";
import type { SuspectFormData } from "../../../../common/reducers/caseRegistrationReducer";

const renderRows = (
  rows: ReturnType<typeof getSuspectDetailsSummaryListRows>,
) => {
  const flat = rows.flat();
  const nodes = flat.map((r, i) => (
    <div key={i} data-testid={`row-${i}`}>
      <div data-testid={`row-${i}-key`}>{r.key.children}</div>
      <div data-testid={`row-${i}-value`}>{r.value.children}</div>
    </div>
  ));
  render(<div>{nodes}</div>);
};

describe("getSuspectDetailsSummaryListRows", () => {
  it("returns empty array when no suspects provided", () => {
    const rows = getSuspectDetailsSummaryListRows([]);
    expect(rows).toEqual([]);
  });

  it("shows no default values for missing fields", () => {
    const suspect: SuspectFormData = {
      suspectId: "suspect-1",
      addSuspectRadio: "",
      suspectFirstNameText: "",
      suspectLastNameText: "",
      suspectAdditionalDetailsCheckboxes: [],
      suspectGenderRadio: { shortCode: "", description: "" },
      suspectDisabilityRadio: "",
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

    const rows = getSuspectDetailsSummaryListRows([suspect]);
    expect(rows).toEqual([[]]);
  });

  it("shows correct values for all fields", () => {
    const suspect: SuspectFormData = {
      suspectId: "suspect-1",
      addSuspectRadio: "person",
      suspectFirstNameText: "John",
      suspectLastNameText: "Doe",
      suspectAdditionalDetailsCheckboxes: ["Gender", "Disability"],
      suspectGenderRadio: { shortCode: "M", description: "Male" },
      suspectDisabilityRadio: "no",
      suspectReligionRadio: { shortCode: "ch", description: "Christian" },
      suspectEthnicityRadio: { shortCode: "BR", description: "British" },
      suspectAliases: [
        {
          firstName: "Johnny",
          lastName: "Doe",
        },
        {
          firstName: "Jane",
          lastName: "Doe",
        },
      ],
      suspectASNText: "r123456",
      suspectOffenderTypesRadio: {
        shortCode: "YO",
        display: "Youth offender",
        arrestDate: "2020-02-12",
      },
      suspectCompanyNameText: "",
      suspectDOBDayText: "12",
      suspectDOBMonthText: "12",
      suspectDOBYearText: "2000",
      charges: [],
    };

    const rows = getSuspectDetailsSummaryListRows([suspect]);
    renderRows(rows);
    expect(screen.getByTestId(`row-0-key`)).toHaveTextContent(/Date of birth/i);
    expect(screen.getByTestId(`row-0-value`)).toHaveTextContent("12/12/2000");
    expect(screen.getByTestId(`row-1-key`)).toHaveTextContent(
      /Type of offender/i,
    );
    expect(screen.getByTestId(`row-1-value`)).toHaveTextContent(
      "Youth offender",
    );
    expect(screen.getByTestId(`row-2-key`)).toHaveTextContent(/Arrest Date/i);
    expect(screen.getByTestId(`row-2-value`)).toHaveTextContent(
      "12 February 2020",
    );
    expect(screen.getByTestId(`row-3-key`)).toHaveTextContent(/Gender/i);
    expect(screen.getByTestId(`row-3-value`)).toHaveTextContent("Male");
    expect(screen.getByTestId(`row-4-key`)).toHaveTextContent(/Disability/i);
    expect(screen.getByTestId(`row-4-value`)).toHaveTextContent("no");
    expect(screen.getByTestId(`row-5-key`)).toHaveTextContent(/Religion/i);
    expect(screen.getByTestId(`row-5-value`)).toHaveTextContent("Christian");
    expect(screen.getByTestId(`row-6-key`)).toHaveTextContent(/Ethnicity/i);
    expect(screen.getByTestId(`row-6-value`)).toHaveTextContent("British");
    expect(screen.getByTestId(`row-7-key`)).toHaveTextContent(/Alias/i);
    expect(screen.getByTestId(`row-7-value`)).toHaveTextContent("DOE, Johnny");
    expect(screen.getByTestId(`row-8-key`)).toHaveTextContent(/Alias/i);
    expect(screen.getByTestId(`row-8-value`)).toHaveTextContent("DOE, Jane");
    expect(screen.getByTestId(`row-9-key`)).toHaveTextContent(
      /Arrest summons/i,
    );
    expect(screen.getByTestId(`row-9-value`)).toHaveTextContent("r123456");
  });

  it("omits Arrest Date entry for PP offender type", () => {
    const suspect: SuspectFormData = {
      suspectId: "suspect-1",
      addSuspectRadio: "",
      suspectFirstNameText: "",
      suspectLastNameText: "",
      suspectAdditionalDetailsCheckboxes: [],
      suspectGenderRadio: { shortCode: "", description: "" },
      suspectDisabilityRadio: "",
      suspectReligionRadio: { shortCode: "", description: "" },
      suspectEthnicityRadio: { shortCode: "", description: "" },
      suspectAliases: [],
      suspectASNText: "",
      suspectOffenderTypesRadio: {
        shortCode: "PP",
        display: "PPO Display",
        arrestDate: "",
      },
      suspectCompanyNameText: "",
      suspectDOBDayText: "1",
      suspectDOBMonthText: "1",
      suspectDOBYearText: "2000",
      charges: [],
    };

    const rows = getSuspectDetailsSummaryListRows([suspect]);
    renderRows(rows);
    expect(screen.getByTestId(`row-0-key`)).toHaveTextContent(/Date of birth/i);
    expect(screen.getByTestId(`row-0-value`)).toHaveTextContent("1/1/2000");
    expect(screen.getByTestId(`row-1-key`)).toHaveTextContent(
      /Type of offender/i,
    );
    expect(screen.getByTestId(`row-1-value`)).toHaveTextContent("PPO Display");
    expect(screen.queryByTestId(`row-2-key`)).not.toBeInTheDocument();
    expect(screen.queryByTestId(`row-2-value`)).not.toBeInTheDocument();
  });
});
