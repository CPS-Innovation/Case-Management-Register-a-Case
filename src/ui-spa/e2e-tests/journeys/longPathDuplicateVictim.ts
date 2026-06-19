import { type Page } from "@playwright/test";
import { AddChargeSuspectPage } from "../../integration-tests/pages/addChargeSuspectPage";
import { ChargesSummaryPage } from "../../integration-tests/pages/chargesSummaryPage";
import { ChargesVictimDuplicateConfirmationPage } from "../../integration-tests/pages/chargesVictimDuplicateConfirmation";
import { generateUniqueUrn } from "../utils/generateUrn";
import { expectStep } from "../utils/expectStep";
import {
  AREA,
  REGISTERING_UNIT,
  WITNESS_CARE_UNIT,
  completeMonitoringAndAssignee,
  verifySummaryAndSubmit,
} from "./steps";
import {
  personName,
  chargeDates,
  startSingleSuspectUpToCharges,
  addCharge,
  completeFirstHearing,
} from "./suspectChargeSteps";

const OFFENCE_CODE = process.env.E2E_OFFENCE_CODE ?? "TH68040";
const OFFENCE_CODE_2 = process.env.E2E_OFFENCE_CODE_2 ?? "TH68066";

export interface LongPathDuplicateVictimOptions {
  operationName: string;
}

export async function completeLongPathDuplicateVictim(
  page: Page,
  { operationName }: LongPathDuplicateVictimOptions,
): Promise<void> {
  const urn = generateUniqueUrn();
  const victim = personName();
  const { offence, arrestDate } = chargeDates();

  await startSingleSuspectUpToCharges(page, { operationName, urn, arrestDate });

  await addCharge(page, {
    suspectIndex: 0,
    chargeIndex: 0,
    offenceCode: OFFENCE_CODE,
    dates: offence,
    chargedWithAdult: true,
    victim: { mode: "new", name: victim },
    hasExistingVictims: false,
  });

  const chargesSummaryPage = new ChargesSummaryPage(page);
  await expectStep(page, "/case-registration/charges-summary");
  await chargesSummaryPage.selectAddMoreChargesYes();
  await chargesSummaryPage.saveAndContinue();

  const addChargeSuspectPage = new AddChargeSuspectPage(page);
  await expectStep(page, "/case-registration/add-charge-suspect");
  await addChargeSuspectPage.selectSuspectByIndex(0);
  await addChargeSuspectPage.saveAndContinue();

  await addCharge(page, {
    suspectIndex: 0,
    chargeIndex: 1,
    offenceCode: OFFENCE_CODE_2,
    dates: offence,
    chargedWithAdult: true,
    victim: { mode: "new", name: victim },
    hasExistingVictims: true,
  });

  const duplicateVictimPage = new ChargesVictimDuplicateConfirmationPage(page);
  await expectStep(
    page,
    "/case-registration/charges-victim-duplicate-confirmation",
  );
  await duplicateVictimPage.verifyPageElements();
  await duplicateVictimPage.saveAndContinue();

  await expectStep(page, "/case-registration/charges-summary");
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
