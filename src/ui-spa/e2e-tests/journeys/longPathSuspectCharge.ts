import { type Page } from "@playwright/test";
import { ChargesSummaryPage } from "../../integration-tests/pages/chargesSummaryPage";
import { generateUniqueUrn } from "../utils/generateUrn";
import { expectStep } from "../utils/expectStep";
import {
  AREA,
  REGISTERING_UNIT,
  WITNESS_CARE_UNIT,
  verifySummaryAndSubmit,
} from "./steps";
import {
  personName,
  chargeDates,
  startSingleSuspectUpToCharges,
  addCharge,
  completeMonitoringFirstHearingAndAssignee,
} from "./suspectChargeSteps";

const OFFENCE_CODE = process.env.E2E_OFFENCE_CODE ?? "TH68040";

export interface LongPathSuspectChargeOptions {
  operationName: string;
}

export async function completeLongPathSuspectCharge(
  page: Page,
  { operationName }: LongPathSuspectChargeOptions,
): Promise<void> {
  const urn = generateUniqueUrn();
  const { offence, arrestDate } = chargeDates();

  await startSingleSuspectUpToCharges(page, { operationName, urn, arrestDate });

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
  await completeMonitoringFirstHearingAndAssignee(page);

  await verifySummaryAndSubmit(page, urn, {
    area: AREA,
    registeringUnit: REGISTERING_UNIT,
    wcu: WITNESS_CARE_UNIT,
    operationName,
  });
}
