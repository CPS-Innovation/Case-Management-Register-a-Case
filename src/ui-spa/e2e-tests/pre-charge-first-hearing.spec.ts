import { expect, test, type Page } from "@playwright/test";
import { CaseMonitoringPage } from "../integration-tests/pages/caseMonitoringPage";
import { CaseRegistrationSummaryPage } from "../integration-tests/pages/caseRegistrationSummaryPage";
import { ChargesSummaryPage } from "../integration-tests/pages/chargesSummaryPage";
import { ChargeRemoveConfirmationPage } from "../integration-tests/pages/chargeRemoveConfirmationPage";
import { SuspectRemoveConfirmationPage } from "../integration-tests/pages/suspectRemoveConfirmationPage";
import { AddPreChargeConfirmationPage } from "../integration-tests/pages/addPreChargeConfirmationPage";
import { FirstHearingDetailsPage } from "../integration-tests/pages/firstHearingDetailsPage";
import { AddChargeSuspectPage } from "../integration-tests/pages/addChargeSuspectPage";
import { SuspectSummaryPage } from "../integration-tests/pages/suspectSummaryPage";
import { WantToAddChargesPage } from "../integration-tests/pages/wantToAddChargesPage";
import { CaseAreasPage } from "../integration-tests/pages/caseAreasPage";
import { ChangeAreaConfirmationPage } from "../integration-tests/pages/changeAreaConfirmation";
import { CaseDetailsPage } from "../integration-tests/pages/caseDetailsPage";
import {
  AREA,
  REGISTERING_UNIT,
  WITNESS_CARE_UNIT,
  startAtHomePage,
  enterAreasAndCaseDetails,
  watchAssigneeLookups,
  fillAssignee,
  verifySummaryAndSubmit,
} from "./journeys/steps";
import {
  addCharge,
  addPersonSuspectWithAllDetails,
  chargeDates,
  completeFirstHearing,
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
  new Date(`${isoDate(date)}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
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

const MONITORING_STEP = "/case-registration/case-monitoring-codes";
const ASSIGNEE_STEP = "/case-registration/case-assignee";
const CONFIRMATION_STEP = "/case-registration/add-pre-charge-confirmation";
const CHANGE_AREA = process.env.E2E_CHANGE_AREA ?? "Cheshire";
const CHANGE_REGISTERING_UNIT =
  process.env.E2E_CHANGE_REGISTERING_UNIT ?? "Chester MCU";
const CHANGE_WITNESS_CARE_UNIT =
  process.env.E2E_CHANGE_WITNESS_CARE_UNIT ?? "Chester Business WCU";

const clickBack = (page: Page) =>
  page.getByRole("link", { name: "Back", exact: true }).click();

async function fillFirstHearing(
  page: Page,
  { courtName, hearingDate }: FirstHearingDetails,
): Promise<void> {
  const firstHearingPage = new FirstHearingDetailsPage(page);
  await expectStep(page, FIRST_HEARING_STEP);
  await firstHearingPage.selectAddFirstHearingDetailsYes();
  await firstHearingPage.enterFirstHearingCourtLocation(courtName);
  await firstHearingPage.addFirstHearingDate(isoDate(hearingDate));
  await firstHearingPage.saveAndContinue();
}

async function expectFirstHearingOnSummary(
  page: Page,
  firstHearing: FirstHearingDetails,
): Promise<void> {
  await expectStep(page, SUMMARY_STEP);
  await new CaseRegistrationSummaryPage(page).verifyFirstHearingElements({
    courtLocation: firstHearing.courtName,
    firstHearingDate: hearingDateText(firstHearing.hearingDate),
  });
  await expect(summaryMonitoringCodes(page)).toHaveCount(0);
}

const expectHearingPayload = (
  payload: CaseRegistrationPayload,
  firstHearing: FirstHearingDetails,
): void => {
  expect(payload.monitoringCodes).toEqual([]);
  expect(payload.courtLocationName).toBe(firstHearing.courtName);
  expect(payload.courtLocationId).toBeGreaterThan(0);
  expect(payload.hearingDate).toBe(isoDate(firstHearing.hearingDate));
};

async function addPreChargeFromSummaryWithConfirmation(
  page: Page,
): Promise<void> {
  await new CaseRegistrationSummaryPage(page).changeMonitoringCodesLinkClick();
  const monitoringPage = new CaseMonitoringPage(page);
  await expectStep(page, MONITORING_STEP);
  await monitoringPage.selectMonitoringCode(PRE_CHARGE);
  await monitoringPage.saveAndContinue();
  await expectStep(page, CONFIRMATION_STEP);
  await new AddPreChargeConfirmationPage(page).saveAndContinue();
  await expectPreChargeWithoutFirstHearing(page);
}

async function startTwoSuspectCase(
  page: Page,
): Promise<{ urn: UrnParts; dates: { from: Date; to: Date } }> {
  const urn = generateUniqueUrn();
  const { offence, arrestDate } = chargeDates();
  await startAtHomePage(page, {
    operationName: OPERATION_NAME,
    hasSuspect: true,
  });
  await enterAreasAndCaseDetails(page, urn);

  const suspectSummaryPage = new SuspectSummaryPage(page);
  for (const index of [0, 1]) {
    await addPersonSuspectWithAllDetails(page, index, {
      name: personName(),
      alias: personName(),
      arrestDate,
    });
    await expectStep(page, "/case-registration/suspect-summary");
    if (index === 0) {
      await suspectSummaryPage.selectAddMoreSuspectYes();
    } else {
      await suspectSummaryPage.selectAddMoreSuspectNo();
    }
    await suspectSummaryPage.saveAndContinue();
  }

  const wantToAddChargesPage = new WantToAddChargesPage(page);
  await expectStep(page, "/case-registration/want-to-add-charges");
  await wantToAddChargesPage.selectAddChargesYes();
  await wantToAddChargesPage.saveAndContinue();
  return { urn, dates: offence };
}

async function chargeSuspect(
  page: Page,
  opts: {
    suspectIndex: number;
    chargeIndex: number;
    dates: { from: Date; to: Date };
    hasExistingVictims: boolean;
    addMore: boolean;
  },
): Promise<void> {
  const addChargeSuspectPage = new AddChargeSuspectPage(page);
  await expectStep(page, "/case-registration/add-charge-suspect");
  await addChargeSuspectPage.selectSuspectByIndex(opts.suspectIndex);
  await addChargeSuspectPage.saveAndContinue();
  await addCharge(page, {
    suspectIndex: opts.suspectIndex,
    chargeIndex: opts.chargeIndex,
    offenceCode: OFFENCE_CODE,
    dates: opts.dates,
    chargedWithAdult: true,
    victim: { mode: "new", name: personName() },
    hasExistingVictims: opts.hasExistingVictims,
  });
  const chargesSummaryPage = new ChargesSummaryPage(page);
  await expectStep(page, "/case-registration/charges-summary");
  if (opts.addMore) {
    await chargesSummaryPage.selectAddMoreChargesYes();
  } else {
    await chargesSummaryPage.selectAddMoreChargesNo();
  }
  await chargesSummaryPage.saveAndContinue();
}

async function submit(
  page: Page,
  urn: UrnParts,
  {
    area = AREA,
    registeringUnit = REGISTERING_UNIT,
    wcu = WITNESS_CARE_UNIT,
  }: { area?: string; registeringUnit?: string; wcu?: string } = {},
): Promise<CaseRegistrationPayload> {
  const casesRequest = page.waitForRequest(
    (request) =>
      request.url().endsWith("/api/v1/cases") && request.method() === "POST",
    { timeout: 120_000 },
  );
  await verifySummaryAndSubmit(page, urn, {
    area,
    registeringUnit,
    wcu,
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

async function changeAreaFromSummary(page: Page): Promise<CaseDetailsPage> {
  await new CaseRegistrationSummaryPage(page).changeAreaLinkClick();
  const areasPage = new CaseAreasPage(page);
  await expectStep(page, "/case-registration/areas");
  await areasPage.enterAreaOrDivision(CHANGE_AREA);
  await areasPage.saveAndContinue();
  await expectStep(page, "/case-registration/change-area-confirmation");
  await new ChangeAreaConfirmationPage(page).saveAndContinue();

  const detailsPage = new CaseDetailsPage(page);
  await expectStep(page, "/case-registration/case-details");
  await detailsPage.enterRegisteringUnit(CHANGE_REGISTERING_UNIT);
  await detailsPage.enterWitnessCareUnit(CHANGE_WITNESS_CARE_UNIT);
  return detailsPage;
}

const CHANGED_AREA_VALUES = {
  area: CHANGE_AREA,
  registeringUnit: CHANGE_REGISTERING_UNIT,
  wcu: CHANGE_WITNESS_CARE_UNIT,
};

test("Scenario 32: back links follow the new order of charges, monitoring codes, first hearing and assignee", async ({
  page,
}) => {
  await startChargedCase(page);

  const monitoringPage = new CaseMonitoringPage(page);
  await expectStep(page, MONITORING_STEP);
  await clickBack(page);
  await expectStep(page, "/case-registration/charges-summary");
  const chargesSummaryPage = new ChargesSummaryPage(page);
  await chargesSummaryPage.selectAddMoreChargesNo();
  await chargesSummaryPage.saveAndContinue();

  await expectStep(page, MONITORING_STEP);
  const courtsResponse = page.waitForResponse(
    (r) => /\/api\/v1\/courts\//.test(r.url()) && r.ok(),
    { timeout: 30_000 },
  );
  await monitoringPage.saveAndContinue();
  await expectStep(page, FIRST_HEARING_STEP);
  const courts = (await (await courtsResponse).json()) as {
    description: string;
  }[];
  const courtName = courts[0]?.description;
  expect(courtName, "no courts returned for the registering unit").toBeTruthy();
  await clickBack(page);
  await expectStep(page, MONITORING_STEP);
  await monitoringPage.saveAndContinue();

  const hearingDate = new Date();
  hearingDate.setDate(hearingDate.getDate() + 14);
  const firstHearing = { courtName: courtName!, hearingDate };
  const lookups = watchAssigneeLookups(page);
  await fillFirstHearing(page, firstHearing);
  await expectStep(page, ASSIGNEE_STEP);
  await clickBack(page);
  await expectStep(page, FIRST_HEARING_STEP);
  await new FirstHearingDetailsPage(page).saveAndContinue();
  await fillAssignee(page, lookups);

  await expectFirstHearingOnSummary(page, firstHearing);
});

test("Scenario 33: with Pre-Charge Decision selected, Back from case assignee returns to monitoring codes", async ({
  page,
}) => {
  await startChargedCase(page);

  const monitoringPage = new CaseMonitoringPage(page);
  await expectStep(page, MONITORING_STEP);
  await monitoringPage.selectMonitoringCode(PRE_CHARGE);
  await monitoringPage.saveAndContinue();
  await expectStep(page, ASSIGNEE_STEP);

  await clickBack(page);
  await expectStep(page, MONITORING_STEP);
  await monitoringPage.verifyPreChargeCheckboxChecked();
});

test("Scenario 34: Back or Cancel on the pre-charge confirmation keeps the first hearing", async ({
  page,
}) => {
  const { urn, firstHearing } = await startChargedCaseWithFirstHearing(page);
  const monitoringPage = new CaseMonitoringPage(page);
  const confirmationPage = new AddPreChargeConfirmationPage(page);

  await new CaseRegistrationSummaryPage(page).changeMonitoringCodesLinkClick();
  await expectStep(page, MONITORING_STEP);
  await monitoringPage.selectMonitoringCode(PRE_CHARGE);
  await monitoringPage.saveAndContinue();
  await expectStep(page, CONFIRMATION_STEP);
  await confirmationPage.backLinkClick();
  await expectStep(page, MONITORING_STEP);
  await monitoringPage.verifyPreChargeCheckboxNotChecked();

  await monitoringPage.selectMonitoringCode(PRE_CHARGE);
  await monitoringPage.saveAndContinue();
  await expectStep(page, CONFIRMATION_STEP);
  await confirmationPage.cancel();
  await expectStep(page, MONITORING_STEP);
  await monitoringPage.verifyPreChargeCheckboxNotChecked();
  await monitoringPage.saveAndContinue();

  await expectFirstHearingOnSummary(page, firstHearing);
  expectHearingPayload(await submit(page, urn), firstHearing);
});

test("Scenario 35: with first hearing answered No, adding Pre-Charge Decision from the summary skips the confirmation", async ({
  page,
}) => {
  const visited = recordVisitedSteps(page);
  const urn = await startChargedCase(page);

  const monitoringPage = new CaseMonitoringPage(page);
  await expectStep(page, MONITORING_STEP);
  await monitoringPage.saveAndContinue();
  const firstHearingPage = new FirstHearingDetailsPage(page);
  await expectStep(page, FIRST_HEARING_STEP);
  await firstHearingPage.selectAddFirstHearingDetailsNo();
  const lookups = watchAssigneeLookups(page);
  await firstHearingPage.saveAndContinue();
  await fillAssignee(page, lookups);
  await expectStep(page, SUMMARY_STEP);

  await new CaseRegistrationSummaryPage(page).changeMonitoringCodesLinkClick();
  await expectStep(page, MONITORING_STEP);
  await monitoringPage.selectMonitoringCode(PRE_CHARGE);
  await monitoringPage.saveAndContinue();

  await expectPreChargeWithoutFirstHearing(page);
  expect(
    visited,
    "the confirmation page must only show when first hearing details were entered",
  ).not.toContain(CONFIRMATION_STEP);
  expectPreChargeWithoutHearingPayload(await submit(page, urn));
});

test("Scenario 36: removing Pre-Charge Decision from the summary asks for the first hearing again", async ({
  page,
}) => {
  const { urn, firstHearing } = await startChargedCaseWithFirstHearing(page);
  await addPreChargeFromSummaryWithConfirmation(page);

  await new CaseRegistrationSummaryPage(page).changeMonitoringCodesLinkClick();
  const monitoringPage = new CaseMonitoringPage(page);
  await expectStep(page, MONITORING_STEP);
  await monitoringPage.deSelectMonitoringCode(PRE_CHARGE);
  await monitoringPage.saveAndContinue();
  await fillFirstHearing(page, firstHearing);

  await expectFirstHearingOnSummary(page, firstHearing);
  expectHearingPayload(await submit(page, urn), firstHearing);
});

test("Scenario 37: adding a charge back from the summary goes through monitoring codes to the first hearing", async ({
  page,
}) => {
  const { urn, firstHearing } = await startChargedCaseWithFirstHearing(page);
  const summaryPage = new CaseRegistrationSummaryPage(page);
  await summaryPage.removeSuspectCharge(0, 0);
  await expectStep(page, "/case-registration/charge-remove-confirmation");
  await new ChargeRemoveConfirmationPage(page).saveAndContinue();
  await expectPreChargeWithoutFirstHearing(page);

  await summaryPage.addSuspectCharge(0);
  await addCharge(page, {
    suspectIndex: 0,
    chargeIndex: 0,
    offenceCode: OFFENCE_CODE,
    dates: chargeDates().offence,
    chargedWithAdult: true,
    victim: { mode: "new", name: personName() },
    hasExistingVictims: true,
  });
  const chargesSummaryPage = new ChargesSummaryPage(page);
  await expectStep(page, "/case-registration/charges-summary");
  await chargesSummaryPage.selectAddMoreChargesNo();
  await chargesSummaryPage.saveAndContinue();

  const monitoringPage = new CaseMonitoringPage(page);
  await expectStep(page, MONITORING_STEP);
  await monitoringPage.verifyPreChargeCheckboxNotDisabled();
  await monitoringPage.verifyPreChargeCheckboxChecked();
  await monitoringPage.deSelectMonitoringCode(PRE_CHARGE);
  await monitoringPage.saveAndContinue();
  await fillFirstHearing(page, firstHearing);

  await expectFirstHearingOnSummary(page, firstHearing);
  expectHearingPayload(await submit(page, urn), firstHearing);
});

test("Scenario 38: when one suspect has no charges, Pre-Charge Decision is fixed and the first hearing is not shown", async ({
  page,
}) => {
  const visited = recordVisitedSteps(page);
  const { urn, dates } = await startTwoSuspectCase(page);
  await chargeSuspect(page, {
    suspectIndex: 0,
    chargeIndex: 0,
    dates,
    hasExistingVictims: false,
    addMore: false,
  });

  const monitoringPage = new CaseMonitoringPage(page);
  await expectStep(page, MONITORING_STEP);
  await monitoringPage.verifyPreChargeCheckboxChecked();
  await monitoringPage.verifyPreChargeCheckboxDisabled();
  const lookups = watchAssigneeLookups(page);
  await monitoringPage.saveAndContinue();
  await fillAssignee(page, lookups);

  await expectPreChargeWithoutFirstHearing(page);
  expect(visited, "the first hearing page must not be shown").not.toContain(
    FIRST_HEARING_STEP,
  );
  const payload = await submit(page, urn);
  expectPreChargeWithoutHearingPayload(payload);
  expect(payload.defendants).toHaveLength(2);
});

test("Scenario 39: removing one of two charges from the summary keeps the first hearing", async ({
  page,
}) => {
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
  await chargesSummaryPage.selectAddMoreChargesYes();
  await chargesSummaryPage.saveAndContinue();
  await chargeSuspect(page, {
    suspectIndex: 0,
    chargeIndex: 1,
    dates: offence,
    hasExistingVictims: true,
    addMore: false,
  });
  const firstHearing = await completeMonitoringFirstHearingAndAssignee(page);
  await expectFirstHearingOnSummary(page, firstHearing);

  await new CaseRegistrationSummaryPage(page).removeSuspectCharge(0, 0);
  await expectStep(page, "/case-registration/charge-remove-confirmation");
  await new ChargeRemoveConfirmationPage(page).saveAndContinue();

  await expectFirstHearingOnSummary(page, firstHearing);
  expectHearingPayload(await submit(page, urn), firstHearing);
});

test("Scenario 40: removing one of two charged suspects from the summary keeps the first hearing", async ({
  page,
}) => {
  const { urn, dates } = await startTwoSuspectCase(page);
  await chargeSuspect(page, {
    suspectIndex: 0,
    chargeIndex: 0,
    dates,
    hasExistingVictims: false,
    addMore: true,
  });
  await chargeSuspect(page, {
    suspectIndex: 1,
    chargeIndex: 0,
    dates,
    hasExistingVictims: true,
    addMore: false,
  });
  const firstHearing = await completeMonitoringFirstHearingAndAssignee(page);
  await expectFirstHearingOnSummary(page, firstHearing);

  await new CaseRegistrationSummaryPage(page).removeSuspect(1);
  await expectStep(page, "/case-registration/suspect-remove-confirmation");
  await new SuspectRemoveConfirmationPage(page).saveAndContinue();

  await expectFirstHearingOnSummary(page, firstHearing);
  const payload = await submit(page, urn);
  expectHearingPayload(payload, firstHearing);
  expect(payload.defendants).toHaveLength(1);
});

test("Scenario 41: changing the area of a charged case asks for the first hearing again for the new unit", async ({
  page,
}) => {
  const { urn } = await startChargedCaseWithFirstHearing(page);

  const detailsPage = await changeAreaFromSummary(page);
  const lookups = watchAssigneeLookups(page);
  const newHearing = await completeFirstHearing(page, () =>
    detailsPage.saveAndContinue(),
  );
  await fillAssignee(page, lookups, { ignoreNameOverrides: true });

  await expectFirstHearingOnSummary(page, newHearing);
  expectHearingPayload(
    await submit(page, urn, CHANGED_AREA_VALUES),
    newHearing,
  );
});

test("Scenario 42: changing the area of a pre-charge case does not ask for the first hearing", async ({
  page,
}) => {
  const visited = recordVisitedSteps(page);
  const urn = await startChargedCase(page);
  const monitoringPage = new CaseMonitoringPage(page);
  await expectStep(page, MONITORING_STEP);
  await monitoringPage.selectMonitoringCode(PRE_CHARGE);
  const lookups = watchAssigneeLookups(page);
  await monitoringPage.saveAndContinue();
  await fillAssignee(page, lookups);
  await expectPreChargeWithoutFirstHearing(page);

  const detailsPage = await changeAreaFromSummary(page);
  const newLookups = watchAssigneeLookups(page);
  await detailsPage.saveAndContinue();
  await fillAssignee(page, newLookups, { ignoreNameOverrides: true });

  await expectPreChargeWithoutFirstHearing(page);
  expect(visited, "the first hearing page must not be shown").not.toContain(
    FIRST_HEARING_STEP,
  );
  expectPreChargeWithoutHearingPayload(
    await submit(page, urn, CHANGED_AREA_VALUES),
  );
});
