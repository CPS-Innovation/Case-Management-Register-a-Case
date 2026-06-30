import { expect, type Page } from "@playwright/test";
import { CaseDetailsPage } from "../../integration-tests/pages/caseDetailsPage";
import { generateUniqueUrn } from "../utils/generateUrn";
import { expectStep } from "../utils/expectStep";
import {
  AREA,
  REGISTERING_UNIT,
  WITNESS_CARE_UNIT,
  startAtHomePage,
  enterAreasAndCaseDetails,
  completeAssigneeAndSubmit,
  completeMonitoringAndAssignee,
  verifySummaryAndSubmit,
} from "./steps";

export interface ShortPathDuplicateUrnOptions {
  operationName?: string;
}

export async function completeShortPathDuplicateUrn(
  page: Page,
  { operationName }: ShortPathDuplicateUrnOptions = {},
): Promise<void> {
  const existingUrn = generateUniqueUrn();
  const freeUrn = generateUniqueUrn();

  await startAtHomePage(page, { operationName, hasSuspect: false });
  await enterAreasAndCaseDetails(page, existingUrn);
  await completeAssigneeAndSubmit(page, existingUrn, operationName);

  await startAtHomePage(page, { operationName, hasSuspect: false });
  await enterAreasAndCaseDetails(page, existingUrn);

  const detailsPage = new CaseDetailsPage(page);
  await expectStep(page, "/case-registration/case-details");
  await expect(page.getByTestId("case-details-error-summary")).toBeVisible();
  await expect(page.getByTestId("urn-error-text-link")).toHaveText(
    "URN already exists, please change reference text and try again",
  );

  await detailsPage.enterUrnUniqueReference(freeUrn.uniqueReference);
  await detailsPage.saveAndContinue();

  await completeMonitoringAndAssignee(page);
  await verifySummaryAndSubmit(page, freeUrn, {
    area: AREA,
    registeringUnit: REGISTERING_UNIT,
    wcu: WITNESS_CARE_UNIT,
    operationName,
  });
}
