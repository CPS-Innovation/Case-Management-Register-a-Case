import { expect, type Page } from "@playwright/test";
import { CaseRegistrationSummaryPage } from "../../integration-tests/pages/caseRegistrationSummaryPage";
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
} from "./steps";

export interface SubmitServerErrorOptions {
  operationName: string;
}

async function buildCaseUpToSummary(
  page: Page,
  urn: ReturnType<typeof generateUniqueUrn>,
  operationName: string,
): Promise<void> {
  await startAtHomePage(page, { operationName, hasSuspect: false });
  await enterAreasAndCaseDetails(page, urn);
  await completeMonitoringAndAssignee(page);
  await expectStep(page, "/case-registration/case-summary");
}

export async function completeSubmitServerError(
  page: Page,
  { operationName }: SubmitServerErrorOptions,
): Promise<void> {
  const urn = generateUniqueUrn();
  const recoveryUrn = generateUniqueUrn();

  let failedOnce = false;
  await page.route("**/api/v1/cases", async (route) => {
    if (route.request().method() === "POST" && !failedOnce) {
      failedOnce = true;
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "simulated server error" }),
      });
      return;
    }
    await route.continue();
  });

  await buildCaseUpToSummary(page, urn, operationName);

  const summaryPage = new CaseRegistrationSummaryPage(page);
  await summaryPage.verifyCaseDetailsElements({
    area: AREA,
    urn: urn.formatted,
    registeringUnit: REGISTERING_UNIT,
    wcu: WITNESS_CARE_UNIT,
    operationName,
  });
  const failedResponse = page.waitForResponse(
    (r) => r.url().endsWith("/api/v1/cases") && r.request().method() === "POST",
  );
  await summaryPage.clickCreateCaseButton();
  expect((await failedResponse).status()).toBe(500);
  await expect(page.getByTestId("txt-error-page-heading")).toHaveText(
    "Sorry, there is a problem with the service",
  );

  await buildCaseUpToSummary(page, recoveryUrn, operationName);
  await verifySummaryAndSubmit(page, recoveryUrn, {
    area: AREA,
    registeringUnit: REGISTERING_UNIT,
    wcu: WITNESS_CARE_UNIT,
    operationName,
  });
}
