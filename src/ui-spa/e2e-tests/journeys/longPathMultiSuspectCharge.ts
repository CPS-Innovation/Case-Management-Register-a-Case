import { expect, type Page } from "@playwright/test";
import { SuspectSummaryPage } from "../../integration-tests/pages/suspectSummaryPage";
import { WantToAddChargesPage } from "../../integration-tests/pages/wantToAddChargesPage";
import { AddChargeSuspectPage } from "../../integration-tests/pages/addChargeSuspectPage";
import { ChargesSummaryPage } from "../../integration-tests/pages/chargesSummaryPage";
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
import {
  personName,
  chargeDates,
  addPersonSuspectWithAllDetails,
  addCharge,
  completeFirstHearing,
} from "./suspectChargeSteps";

const OFFENCE_CODE = process.env.E2E_OFFENCE_CODE ?? "TH68040";
const OFFENCE_CODE_2 = process.env.E2E_OFFENCE_CODE_2 ?? "TH68066";

export interface LongPathMultiSuspectChargeOptions {
  operationName: string;
}

export async function completeLongPathMultiSuspectCharge(
  page: Page,
  { operationName }: LongPathMultiSuspectChargeOptions,
): Promise<void> {
  const urn = generateUniqueUrn();
  const suspect0 = personName();
  const suspect1 = personName();
  const victim0 = personName();
  const victim1 = personName();

  const { offence: dates, arrestDate } = chargeDates();

  await startAtHomePage(page, { operationName, hasSuspect: true });
  await enterAreasAndCaseDetails(page, urn);

  const suspectSummaryPage = new SuspectSummaryPage(page);

  await addPersonSuspectWithAllDetails(page, 0, {
    name: suspect0,
    alias: personName(),
    arrestDate,
  });
  await expectStep(page, "/case-registration/suspect-summary");
  await suspectSummaryPage.selectAddMoreSuspectYes();
  await suspectSummaryPage.saveAndContinue();

  await addPersonSuspectWithAllDetails(page, 1, {
    name: suspect1,
    alias: personName(),
    arrestDate,
  });
  await expectStep(page, "/case-registration/suspect-summary");
  await suspectSummaryPage.selectAddMoreSuspectNo();
  await suspectSummaryPage.saveAndContinue();

  const wantToAddChargesPage = new WantToAddChargesPage(page);
  await expectStep(page, "/case-registration/want-to-add-charges");
  await wantToAddChargesPage.selectAddChargesYes();
  await wantToAddChargesPage.saveAndContinue();

  const addChargeSuspectPage = new AddChargeSuspectPage(page);
  const chargesSummaryPage = new ChargesSummaryPage(page);

  await expectStep(page, "/case-registration/add-charge-suspect");
  await addChargeSuspectPage.selectSuspectByIndex(0);
  await addChargeSuspectPage.saveAndContinue();

  await addCharge(page, {
    suspectIndex: 0,
    chargeIndex: 0,
    offenceCode: OFFENCE_CODE,
    dates,
    chargedWithAdult: true,
    victim: { mode: "new", name: victim0 },
    hasExistingVictims: false,
  });
  await expectStep(page, "/case-registration/charges-summary");
  await chargesSummaryPage.selectAddMoreChargesYes();
  await chargesSummaryPage.saveAndContinue();

  await expectStep(page, "/case-registration/add-charge-suspect");
  await addChargeSuspectPage.selectSuspectByIndex(0);
  await addChargeSuspectPage.saveAndContinue();
  await addCharge(page, {
    suspectIndex: 0,
    chargeIndex: 1,
    offenceCode: OFFENCE_CODE_2,
    dates,
    chargedWithAdult: true,
    victim: { mode: "reuse", expectVictim: victim0 },
    hasExistingVictims: true,
  });
  await expectStep(page, "/case-registration/charges-summary");
  await chargesSummaryPage.selectAddMoreChargesYes();
  await chargesSummaryPage.saveAndContinue();

  await expectStep(page, "/case-registration/add-charge-suspect");
  await addChargeSuspectPage.selectSuspectByIndex(1);
  await addChargeSuspectPage.saveAndContinue();
  await addCharge(page, {
    suspectIndex: 1,
    chargeIndex: 0,
    offenceCode: OFFENCE_CODE,
    dates,
    chargedWithAdult: true,
    victim: { mode: "new", name: victim1 },
    hasExistingVictims: true,
  });
  await expectStep(page, "/case-registration/charges-summary");

  const suspect0Group = page.getByTestId("charges-summary-suspect-0");
  await expect(suspect0Group).toBeVisible();
  await expect(suspect0Group.locator("h2")).toContainText(
    suspect0.last.toUpperCase(),
  );
  await expect(suspect0Group.getByTestId("charge-0-data")).toBeVisible();
  await expect(suspect0Group.getByTestId("charge-1-data")).toBeVisible();

  const suspect1Group = page.getByTestId("charges-summary-suspect-1");
  await expect(suspect1Group).toBeVisible();
  await expect(suspect1Group.locator("h2")).toContainText(
    suspect1.last.toUpperCase(),
  );
  await expect(suspect1Group.getByTestId("charge-0-data")).toBeVisible();
  await expect(suspect1Group.getByTestId("charge-1-data")).toHaveCount(0);

  await chargesSummaryPage.selectAddMoreChargesNo();
  await completeFirstHearing(page, () => chargesSummaryPage.saveAndContinue());

  await completeMonitoringAndAssignee(page, { preChargeChecked: false });

  await verifySummaryAndSubmit(page, urn, {
    area: AREA,
    registeringUnit: REGISTERING_UNIT,
    wcu: WITNESS_CARE_UNIT,
    operationName,
  });
}
