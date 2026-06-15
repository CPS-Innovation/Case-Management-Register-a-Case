import { expect, type Page } from "@playwright/test";
import { CaseRegistrationHomePage } from "../../integration-tests/pages/caseRegistrationHomePage";
import { CaseAreasPage } from "../../integration-tests/pages/caseAreasPage";
import { CaseDetailsPage } from "../../integration-tests/pages/caseDetailsPage";
import { CaseMonitoringPage } from "../../integration-tests/pages/caseMonitoringPage";
import { CaseAssigneePage } from "../../integration-tests/pages/caseAssigneePage";
import { CaseRegistrationSummaryPage } from "../../integration-tests/pages/caseRegistrationSummaryPage";
import { expectStep } from "../utils/expectStep";
import { startRegistration } from "../utils/startRegistration";
import type { UrnParts } from "../utils/generateUrn";

export const AREA = process.env.E2E_AREA ?? "CAMBRIDGESHIRE";
export const REGISTERING_UNIT =
  process.env.E2E_REGISTERING_UNIT ?? "NORTHERN CJU (Peterborough)";
export const WITNESS_CARE_UNIT =
  process.env.E2E_WITNESS_CARE_UNIT ?? "Cambridgeshire Non Operational WCU";

const PROSECUTOR = process.env.E2E_PROSECUTOR;
const CASEWORKER = process.env.E2E_CASEWORKER;
const INVESTIGATOR_FIRST_NAME =
  process.env.E2E_INVESTIGATOR_FIRST_NAME ?? "InvestigatorF";
const INVESTIGATOR_LAST_NAME =
  process.env.E2E_INVESTIGATOR_LAST_NAME ?? "InvestigatorL";
const INVESTIGATOR_SHOULDER_NUMBER =
  process.env.E2E_INVESTIGATOR_SHOULDER_NUMBER ?? "12345";

export interface HomePageOptions {
  operationName?: string;
  hasSuspect: boolean;
}

export async function startAtHomePage(
  page: Page,
  { operationName, hasSuspect }: HomePageOptions,
): Promise<void> {
  await startRegistration(page);
  await expect(page).toHaveTitle(/Home - Register A Case/);

  const homePage = new CaseRegistrationHomePage(page);
  await expectStep(page, "/case-registration");
  if (operationName) {
    await homePage.addOperationName(operationName);
  } else {
    await homePage.addNoOperationName();
  }
  if (hasSuspect) {
    await homePage.addSuspect();
  } else {
    await homePage.addNoSuspect();
  }
  await homePage.saveAndContinue();
}

export async function enterAreasAndCaseDetails(
  page: Page,
  urn: UrnParts,
): Promise<void> {
  const areasPage = new CaseAreasPage(page);
  await expectStep(page, "/case-registration/areas");
  await areasPage.enterAreaOrDivision(AREA);
  await areasPage.saveAndContinue();

  const detailsPage = new CaseDetailsPage(page);
  await expectStep(page, "/case-registration/case-details");
  await detailsPage.enterUrnPoliceForce(urn.policeForce);
  await detailsPage.enterUrnPoliceUnit(urn.policeUnit);
  await detailsPage.enterUrnUniqueReference(urn.uniqueReference);
  await detailsPage.enterUrnYearReference(urn.yearReference);
  await detailsPage.enterRegisteringUnit(REGISTERING_UNIT);
  await detailsPage.enterWitnessCareUnit(WITNESS_CARE_UNIT);
  await detailsPage.saveAndContinue();
}

export function watchAssigneeLookups(page: Page) {
  const prosecutors = page.waitForResponse(
    (r) => /\/api\/v1\/prosecutors\//.test(r.url()) && r.ok(),
    { timeout: 30_000 },
  );
  const caseworkers = page.waitForResponse(
    (r) => /\/api\/v1\/caseworkers\//.test(r.url()) && r.ok(),
    { timeout: 30_000 },
  );
  // If an intermediate step fails before fillAssignee awaits these, swallow the
  // standalone 30s timeout rejection so it doesn't obscure the real failure.
  prosecutors.catch(() => {});
  caseworkers.catch(() => {});
  return { prosecutors, caseworkers };
}

export async function fillAssignee(
  page: Page,
  lookups: ReturnType<typeof watchAssigneeLookups>,
  { ignoreNameOverrides = false }: { ignoreNameOverrides?: boolean } = {},
): Promise<void> {
  const assigneePage = new CaseAssigneePage(page);
  await expectStep(page, "/case-registration/case-assignee");
  await assigneePage.addProsecutorYes();
  await assigneePage.addInvestigatorYes();

  const prosecutors = (await (await lookups.prosecutors).json()) as {
    description: string;
  }[];
  const caseworkers = (await (await lookups.caseworkers).json()) as {
    description: string;
  }[];
  const prosecutorOverride = ignoreNameOverrides ? undefined : PROSECUTOR;
  const caseworkerOverride = ignoreNameOverrides ? undefined : CASEWORKER;
  const prosecutorName = prosecutorOverride ?? prosecutors[0]?.description;
  const caseworkerName = caseworkerOverride ?? caseworkers[0]?.description;
  expect(
    prosecutorName,
    "no prosecutors returned for the registering unit",
  ).toBeTruthy();
  expect(
    caseworkerName,
    "no caseworkers returned for the registering unit",
  ).toBeTruthy();

  await assigneePage.enterProsecutorName(prosecutorName);
  await assigneePage.enterCaseworkerName(caseworkerName);
  await assigneePage.addInvestigatorFirstName(INVESTIGATOR_FIRST_NAME);
  await assigneePage.addInvestigatorLastName(INVESTIGATOR_LAST_NAME);
  await assigneePage.addInvestigatorShoulderNumber(
    INVESTIGATOR_SHOULDER_NUMBER,
  );
  await assigneePage.saveAndContinue();
}

export async function completeMonitoringAndAssignee(
  page: Page,
  { preChargeChecked = true }: { preChargeChecked?: boolean } = {},
): Promise<void> {
  const monitoringPage = new CaseMonitoringPage(page);
  await expectStep(page, "/case-registration/case-monitoring-codes");
  if (preChargeChecked) {
    await monitoringPage.verifyPreChargeCheckboxChecked();
  } else {
    await monitoringPage.verifyPreChargeCheckboxNotChecked();
  }

  const lookups = watchAssigneeLookups(page);
  await monitoringPage.saveAndContinue();
  await fillAssignee(page, lookups);
}

export interface SummaryValues {
  area: string;
  registeringUnit: string;
  wcu: string;
  operationName?: string;
}

export async function verifySummaryAndSubmit(
  page: Page,
  urn: UrnParts,
  values: SummaryValues,
): Promise<void> {
  const summaryPage = new CaseRegistrationSummaryPage(page);
  await expectStep(page, "/case-registration/case-summary");
  await summaryPage.verifyCaseDetailsElements({
    area: values.area,
    urn: urn.formatted,
    registeringUnit: values.registeringUnit,
    wcu: values.wcu,
    operationName: values.operationName ?? "Not entered",
  });

  const registerCaseResponsePromise = page.waitForResponse(
    (response) =>
      response.url().endsWith("/api/v1/cases") &&
      response.request().method() === "POST",
  );

  await summaryPage.clickCreateCaseButton();

  const registerCaseResponse = await registerCaseResponsePromise;
  expect(
    registerCaseResponse.ok(),
    `POST /api/v1/cases returned ${registerCaseResponse.status()}`,
  ).toBe(true);

  await expectStep(page, "/case-registration/case-registration-confirmation");
  await expect(
    page.getByRole("heading", { name: "Case registered successfully" }),
  ).toBeVisible();
  await expect(page.getByText(urn.formatted, { exact: false })).toBeVisible();
}

export async function verifyCaseSummary(
  page: Page,
  urn: UrnParts,
  operationName?: string,
): Promise<void> {
  const summaryPage = new CaseRegistrationSummaryPage(page);
  await expectStep(page, "/case-registration/case-summary");
  await summaryPage.verifyCaseDetailsElements({
    area: AREA,
    urn: urn.formatted,
    registeringUnit: REGISTERING_UNIT,
    wcu: WITNESS_CARE_UNIT,
    operationName: operationName ?? "Not entered",
  });
}

export async function submitCaseFromSummary(
  page: Page,
  urn: UrnParts,
): Promise<void> {
  const summaryPage = new CaseRegistrationSummaryPage(page);

  const registerCaseResponsePromise = page.waitForResponse(
    (response) =>
      response.url().endsWith("/api/v1/cases") &&
      response.request().method() === "POST",
  );

  await summaryPage.clickCreateCaseButton();

  const registerCaseResponse = await registerCaseResponsePromise;
  expect(
    registerCaseResponse.ok(),
    `POST /api/v1/cases returned ${registerCaseResponse.status()}`,
  ).toBe(true);

  await expectStep(page, "/case-registration/case-registration-confirmation");
  await expect(
    page.getByRole("heading", { name: "Case registered successfully" }),
  ).toBeVisible();
  await expect(page.getByText(urn.formatted, { exact: false })).toBeVisible();
}

export async function completeAssigneeAndSubmitDuplicateUrn(
  page: Page,
  urn: UrnParts,
  operationName?: string,
): Promise<void> {
  await completeMonitoringAndAssignee(page);
  await verifyCaseSummary(page, urn, operationName);
  await submitCaseFromSummary(page, urn);
}

export async function completeAssigneeAndSubmit(
  page: Page,
  urn: UrnParts,
  operationName?: string,
): Promise<void> {
  await completeMonitoringAndAssignee(page);
  await verifySummaryAndSubmit(page, urn, {
    area: AREA,
    registeringUnit: REGISTERING_UNIT,
    wcu: WITNESS_CARE_UNIT,
    operationName,
  });
}
