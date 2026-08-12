import { test, expect, type Page } from "@playwright/test";
import { generateUniqueUrn } from "./utils/generateUrn";
import { expectStep } from "./utils/expectStep";
import {
  startAtHomePage,
  enterAreasAndCaseDetails,
  completeMonitoringAndAssignee,
} from "./journeys/steps";

// The URN's second section is matched against PoliceUnit.code by getPoliceUnit(), which uses
// Array.find() and so yields undefined when nothing matches. These two codes come from dev's
// /api/v1/police-units; override them if the reference data changes.
const MATCHING_POLICE_UNIT_CODE = process.env.E2E_POLICE_UNIT_CODE ?? "EL";
const UNMATCHED_POLICE_UNIT_CODE =
  process.env.E2E_UNKNOWN_POLICE_UNIT_CODE ?? "AA";

/** Walks the journey as far as the summary page, without submitting (so no case is created). */
async function goToSummary(page: Page, policeUnitCode: string) {
  const urn = generateUniqueUrn("12", policeUnitCode);
  await startAtHomePage(page, {
    operationName: "police unit check",
    hasSuspect: false,
  });
  await enterAreasAndCaseDetails(page, urn);
  await completeMonitoringAndAssignee(page);
  await expectStep(page, "/case-registration/case-summary");
}

const workingOnTheCaseRows = (page: Page) =>
  page.getByTestId("case-assignee-summary").locator(".govuk-summary-list__row");

const policeUnitRow = (page: Page) =>
  workingOnTheCaseRows(page).filter({
    has: page.getByText("Police unit", { exact: true }),
  });

test.describe("Check your answers - Police unit", () => {
  test("shows the police unit with no Change link when the URN matches a unit", async ({
    page,
  }) => {
    test.setTimeout(180_000);
    await goToSummary(page, MATCHING_POLICE_UNIT_CODE);

    const row = policeUnitRow(page);
    await expect(
      row,
      `expected a Police unit row for code "${MATCHING_POLICE_UNIT_CODE}" - if this fails the code may no longer be in /api/v1/police-units`,
    ).toHaveCount(1);

    // The value must be populated; the row is only rendered when a description exists.
    await expect(row.locator("dd").first()).not.toBeEmpty();

    await expect(
      row.getByRole("link", { name: "Change" }),
      "Police unit must not offer a Change link - it cannot be amended without changing the URN",
    ).toHaveCount(0);

    const prosecutorRow = workingOnTheCaseRows(page).filter({
      has: page.getByText("Prosecutor", { exact: true }),
    });
    await expect(
      prosecutorRow.getByRole("link", { name: "Change" }),
      "Prosecutor should still be changeable - if this is also missing the whole section is broken, not just Police unit",
    ).toHaveCount(1);
  });

  test("omits the police unit row entirely when the URN matches no unit", async ({
    page,
  }) => {
    test.setTimeout(180_000);
    await goToSummary(page, UNMATCHED_POLICE_UNIT_CODE);

    await expect(
      policeUnitRow(page),
      `expected no Police unit row for unmatched code "${UNMATCHED_POLICE_UNIT_CODE}" - it must be absent, not blank or "Not entered"`,
    ).toHaveCount(0);

    await expect(page.getByTestId("case-assignee-summary")).toBeVisible();
    await expect(workingOnTheCaseRows(page)).not.toHaveCount(0);
  });
});
