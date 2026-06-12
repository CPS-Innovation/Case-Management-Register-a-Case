import { expect, type Page } from "@playwright/test";
import { CaseRegistrationSummaryPage } from "../../integration-tests/pages/caseRegistrationSummaryPage";
import { CaseDetailsPage } from "../../integration-tests/pages/caseDetailsPage";
import { generateUniqueUrn } from "../utils/generateUrn";
import { expectStep } from "../utils/expectStep";
import {
  startAtHomePage,
  enterAreasAndCaseDetails,
  completeAssigneeAndSubmit,
  completeMonitoringAndAssignee,
  verifyCaseSummary,
  submitCaseFromSummary,
} from "./steps";

export interface ShortPathDuplicateUrnOptions {
  operationName?: string;
}

export async function completeShortPathDuplicateUrn(
  page: Page,
  { operationName }: ShortPathDuplicateUrnOptions = {},
): Promise<void> {
  const existingUrn = generateUniqueUrn();
  await startAtHomePage(page, { operationName, hasSuspect: false });
  await enterAreasAndCaseDetails(page, existingUrn);
  await completeAssigneeAndSubmit(page, existingUrn, operationName);

  await startAtHomePage(page, { operationName, hasSuspect: false });
  await enterAreasAndCaseDetails(page, existingUrn);
  await completeMonitoringAndAssignee(page);

  const summaryPage = new CaseRegistrationSummaryPage(page);
  await summaryPage.clickCreateCaseButton();

  const errorSummary = page.getByTestId("case-summary-error-summary");
  await expect(errorSummary).toBeVisible();
  await expect(errorSummary).toContainText(
    "Failed to register a case, please try again",
  );
  await expectStep(page, "/case-registration/case-summary");

  const freeUrn = generateUniqueUrn();
  await summaryPage.changeUrnLinkClick();
  const detailsPage = new CaseDetailsPage(page);
  await expectStep(page, "/case-registration/case-details");
  await detailsPage.enterUrnUniqueReference(freeUrn.uniqueReference);
  await detailsPage.saveAndContinue();

  await verifyCaseSummary(page, freeUrn, operationName);
  await submitCaseFromSummary(page, freeUrn);
}
