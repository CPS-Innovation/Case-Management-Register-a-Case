import { expect, type Page } from "@playwright/test";
import { CaseRegistrationSummaryPage } from "../../integration-tests/pages/caseRegistrationSummaryPage";
import { CaseAreasPage } from "../../integration-tests/pages/caseAreasPage";
import { ChangeAreaConfirmationPage } from "../../integration-tests/pages/changeAreaConfirmation";
import { CaseDetailsPage } from "../../integration-tests/pages/caseDetailsPage";
import { generateUniqueUrn } from "../utils/generateUrn";
import { expectStep } from "../utils/expectStep";
import {
  AREA,
  REGISTERING_UNIT,
  WITNESS_CARE_UNIT,
  startAtHomePage,
  enterAreasAndCaseDetails,
  completeMonitoringAndAssignee,
  verifySummaryAndSubmit,
  watchAssigneeLookups,
  fillAssignee,
} from "./steps";

const CHANGE_AREA = process.env.E2E_CHANGE_AREA ?? "Cheshire";
const CHANGE_REGISTERING_UNIT =
  process.env.E2E_CHANGE_REGISTERING_UNIT ?? "Chester MCU";
const CHANGE_WITNESS_CARE_UNIT =
  process.env.E2E_CHANGE_WITNESS_CARE_UNIT ?? "Chester Business WCU";

export interface ShortPathChangeAreaOptions {
  operationName: string;
}

export async function completeShortPathWithAreaChange(
  page: Page,
  { operationName }: ShortPathChangeAreaOptions,
): Promise<void> {
  const urn = generateUniqueUrn();

  await startAtHomePage(page, { operationName, hasSuspect: false });
  await enterAreasAndCaseDetails(page, urn);
  await completeMonitoringAndAssignee(page);

  const summaryPage = new CaseRegistrationSummaryPage(page);
  await expectStep(page, "/case-registration/case-summary");
  await summaryPage.verifyCaseDetailsElements({
    area: AREA,
    urn: urn.formatted,
    registeringUnit: REGISTERING_UNIT,
    wcu: WITNESS_CARE_UNIT,
    operationName,
  });

  await summaryPage.changeAreaLinkClick();
  const areasPage = new CaseAreasPage(page);
  await expectStep(page, "/case-registration/areas");
  await areasPage.enterAreaOrDivision(CHANGE_AREA);
  await areasPage.saveAndContinue();

  const changeAreaConfirmationPage = new ChangeAreaConfirmationPage(page);
  await expectStep(page, "/case-registration/change-area-confirmation");
  await expect(
    page.getByRole("heading", {
      name: "Changing the area means you must update other case details",
    }),
  ).toBeVisible();
  await changeAreaConfirmationPage.saveAndContinue();

  const detailsPage = new CaseDetailsPage(page);
  await expectStep(page, "/case-registration/case-details");
  await expect(page.locator("#urn-unique-reference-text")).toHaveValue(
    urn.uniqueReference,
  );
  await expect(page.locator("#registering-unit-text")).toHaveValue("");
  await expect(page.locator("#witness-care-unit-text")).toHaveValue("");

  await detailsPage.saveAndContinue();
  await expect(
    page.getByTestId("registering-unit-error-text-link"),
  ).toBeVisible();
  await expect(
    page.getByTestId("witness-care-unit-error-text-link"),
  ).toBeVisible();

  await detailsPage.enterRegisteringUnit(CHANGE_REGISTERING_UNIT);
  await detailsPage.enterWitnessCareUnit(CHANGE_WITNESS_CARE_UNIT);
  const lookups = watchAssigneeLookups(page);
  await detailsPage.saveAndContinue();
  await fillAssignee(page, lookups, { ignoreNameOverrides: true });

  await verifySummaryAndSubmit(page, urn, {
    area: CHANGE_AREA,
    registeringUnit: CHANGE_REGISTERING_UNIT,
    wcu: CHANGE_WITNESS_CARE_UNIT,
    operationName,
  });
}
