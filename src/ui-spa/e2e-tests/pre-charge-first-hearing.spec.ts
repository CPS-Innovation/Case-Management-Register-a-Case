import { expect, test, type Page } from "@playwright/test";
import { CaseMonitoringPage } from "../integration-tests/pages/caseMonitoringPage";
import { CaseRegistrationSummaryPage } from "../integration-tests/pages/caseRegistrationSummaryPage";
import { ChargesSummaryPage } from "../integration-tests/pages/chargesSummaryPage";
import { ChargeRemoveConfirmationPage } from "../integration-tests/pages/chargeRemoveConfirmationPage";
import { SuspectRemoveConfirmationPage } from "../integration-tests/pages/suspectRemoveConfirmationPage";
import { AddPreChargeConfirmationPage } from "../integration-tests/pages/addPreChargeConfirmationPage";
import {
  AREA,
  REGISTERING_UNIT,
  WITNESS_CARE_UNIT,
  watchAssigneeLookups,
  fillAssignee,
  verifySummaryAndSubmit,
} from "./journeys/steps";
import {
  addCharge,
  chargeDates,
  completeMonitoringFirstHearingAndAssignee,
  isoDate,
  personName,
  startSingleSuspectUpToCharges,
  type FirstHearingDetails,
} from "./journeys/suspectChargeSteps";
import { expectStep } from "./utils/expectStep";
import { generateUniqueUrn, type UrnParts } from "./utils/generateUrn";

const OPERATION_NAME = process.env.E2E_OPERATION_NAME ?? "thunderstruck";
const OFFENCE_CODE = process.env.E2E_OFFENCE_CODE ?? "TH68040";
const PRE_CHARGE = "Pre-Charge Decision";
const PRE_CHARGE_CODE = "CSEA";
const SUMMARY_STEP = "/case-registration/case-summary";
const FIRST_HEARING_STEP = "/case-registration/first-hearing";

interface CaseRegistrationPayload {
  monitoringCodes: { code: string; selected: boolean }[];
  courtLocationId: number;
  courtLocationName: string;
  hearingDate: string | null;
  defendants: unknown[];
}

const hearingDateText = (date: Date): string =>
  date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

const summaryMonitoringCodes = (page: Page) =>
  page
    .getByTestId("case-complexity-and-monitoring-codes-summary")
    .locator(".govuk-summary-list__row")
    .nth(1)
    .locator("dd")
    .first()
    .locator("li");

const recordVisitedSteps = (page: Page): string[] => {
  const visited: string[] = [];
  page.on("framenavigated", (frame) => {
    if (frame === page.mainFrame()) {
      visited.push(new URL(frame.url()).pathname.replace(/\/$/, ""));
    }
  });
  return visited;
};

async function startChargedCase(page: Page): Promise<UrnParts> {
  const urn = generateUniqueUrn();
  const { offence, arrestDate } = chargeDates();
  await startSingleSuspectUpToCharges(page, {
    operationName: OPERATION_NAME,
    urn,
    arrestDate,
  });
  await addCharge(page, {
    suspectIndex: 0,
    chargeIndex: 0,
    offenceCode: OFFENCE_CODE,
    dates: offence,
    chargedWithAdult: true,
    victim: { mode: "new", name: personName() },
    hasExistingVictims: false,
  });

  const chargesSummaryPage = new ChargesSummaryPage(page);
  await expectStep(page, "/case-registration/charges-summary");
  await chargesSummaryPage.selectAddMoreChargesNo();
  await chargesSummaryPage.saveAndContinue();
  return urn;
}

async function startChargedCaseWithFirstHearing(
  page: Page,
): Promise<{ urn: UrnParts; firstHearing: FirstHearingDetails }> {
  const urn = await startChargedCase(page);
  const firstHearing = await completeMonitoringFirstHearingAndAssignee(page);

  const summaryPage = new CaseRegistrationSummaryPage(page);
  await expectStep(page, SUMMARY_STEP);
  await summaryPage.verifyFirstHearingElements({
    courtLocation: firstHearing.courtName,
    firstHearingDate: hearingDateText(firstHearing.hearingDate),
  });
  await expect(summaryMonitoringCodes(page)).toHaveCount(0);
  return { urn, firstHearing };
}

async function expectPreChargeWithoutFirstHearing(page: Page): Promise<void> {
  await expectStep(page, SUMMARY_STEP);
  await expect(summaryMonitoringCodes(page)).toHaveText([PRE_CHARGE]);
  await new CaseRegistrationSummaryPage(page).verifyNoFirstHearingElements();
}

async function submit(
  page: Page,
  urn: UrnParts,
): Promise<CaseRegistrationPayload> {
  const casesRequest = page.waitForRequest(
    (request) =>
      request.url().endsWith("/api/v1/cases") && request.method() === "POST",
    { timeout: 120_000 },
  );
  await verifySummaryAndSubmit(page, urn, {
    area: AREA,
    registeringUnit: REGISTERING_UNIT,
    wcu: WITNESS_CARE_UNIT,
    operationName: OPERATION_NAME,
  });
  const postData = (await casesRequest).postData();
  expect(postData, "no POST /api/v1/cases payload was captured").toBeTruthy();
  return JSON.parse(postData!) as CaseRegistrationPayload;
}

const expectPreChargeWithoutHearingPayload = (
  payload: CaseRegistrationPayload,
): void => {
  expect(payload.monitoringCodes).toEqual([
    { code: PRE_CHARGE_CODE, selected: true },
  ]);
  expect(payload.hearingDate).toBeNull();
  expect(payload.courtLocationId).toBe(0);
  expect(payload.courtLocationName).toBe("");
};

test("Scenario 27: monitoring codes follow the charges, and selecting Pre-Charge Decision skips the first hearing", async ({
  page,
}) => {
  const visited = recordVisitedSteps(page);
  const urn = await startChargedCase(page);

  const monitoringPage = new CaseMonitoringPage(page);
  await expectStep(page, "/case-registration/case-monitoring-codes");
  await monitoringPage.verifyPreChargeCheckboxNotDisabled();
  await monitoringPage.verifyPreChargeCheckboxNotChecked();
  await monitoringPage.selectMonitoringCode(PRE_CHARGE);
  const lookups = watchAssigneeLookups(page);
  await monitoringPage.saveAndContinue();
  await fillAssignee(page, lookups);

  await expectPreChargeWithoutFirstHearing(page);
  expect(visited, "the first hearing page must not be shown").not.toContain(
    FIRST_HEARING_STEP,
  );
  expect(
    visited.indexOf("/case-registration/case-monitoring-codes"),
    "monitoring codes must come straight after the charges summary",
  ).toBe(visited.indexOf("/case-registration/charges-summary") + 1);

  expectPreChargeWithoutHearingPayload(await submit(page, urn));
});

test("Scenario 28: without Pre-Charge Decision the first hearing is shown after monitoring codes and submitted", async ({
  page,
}) => {
  const { urn, firstHearing } = await startChargedCaseWithFirstHearing(page);

  const payload = await submit(page, urn);
  expect(payload.monitoringCodes).toEqual([]);
  expect(payload.courtLocationName).toBe(firstHearing.courtName);
  expect(payload.courtLocationId).toBeGreaterThan(0);
  expect(payload.hearingDate).toBe(isoDate(firstHearing.hearingDate));
});

test("Scenario 29: removing the only charge from the summary removes the first hearing and adds Pre-Charge Decision", async ({
  page,
}) => {
  const { urn } = await startChargedCaseWithFirstHearing(page);

  await new CaseRegistrationSummaryPage(page).removeSuspectCharge(0, 0);
  await expectStep(page, "/case-registration/charge-remove-confirmation");
  await new ChargeRemoveConfirmationPage(page).saveAndContinue();

  await expectPreChargeWithoutFirstHearing(page);
  expectPreChargeWithoutHearingPayload(await submit(page, urn));
});

test("Scenario 30: removing the suspect from the summary removes the first hearing and adds Pre-Charge Decision", async ({
  page,
}) => {
  const { urn } = await startChargedCaseWithFirstHearing(page);

  await new CaseRegistrationSummaryPage(page).removeSuspect(0);
  await expectStep(page, "/case-registration/suspect-remove-confirmation");
  await new SuspectRemoveConfirmationPage(page).saveAndContinue();

  await expectPreChargeWithoutFirstHearing(page);
  const payload = await submit(page, urn);
  expectPreChargeWithoutHearingPayload(payload);
  expect(payload.defendants).toEqual([]);
});

test("Scenario 31: adding Pre-Charge Decision from the summary asks for confirmation, then removes the first hearing", async ({
  page,
}) => {
  const { urn } = await startChargedCaseWithFirstHearing(page);

  await new CaseRegistrationSummaryPage(page).changeMonitoringCodesLinkClick();
  const monitoringPage = new CaseMonitoringPage(page);
  await expectStep(page, "/case-registration/case-monitoring-codes");
  await monitoringPage.selectMonitoringCode(PRE_CHARGE);
  await monitoringPage.saveAndContinue();

  const confirmationPage = new AddPreChargeConfirmationPage(page);
  await expectStep(page, "/case-registration/add-pre-charge-confirmation");
  await confirmationPage.verifyPageElements();
  await confirmationPage.saveAndContinue();

  await expectPreChargeWithoutFirstHearing(page);
  expectPreChargeWithoutHearingPayload(await submit(page, urn));
});
