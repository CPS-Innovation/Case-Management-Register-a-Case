import { type Page } from "@playwright/test";
import { generateUniqueUrn } from "../utils/generateUrn";
import { expectStep, expectNotStep } from "../utils/expectStep";
import { completeAssigneeAndSubmit } from "./steps";
import {
  chargeDates,
  startSingleSuspectUpToCharges,
} from "./suspectChargeSteps";

export interface LongPathWantToAddChargesNoOptions {
  operationName?: string;
}

// Pages that only belong to the "add charges" branch. Answering "No" on the
// want-to-add-charges page must skip every one of these (and the charge-driven
// first-hearing page) and land straight on the case monitoring codes page.
const SKIPPED_STEPS = [
  "/case-registration/suspect-0/charge-0/charges-offence-search",
  "/case-registration/suspect-0/charge-0/add-charge-details",
  "/case-registration/suspect-0/charge-0/add-charge-victim",
  "/case-registration/charges-summary",
  "/case-registration/first-hearing",
];

export async function completeLongPathWantToAddChargesNo(
  page: Page,
  { operationName }: LongPathWantToAddChargesNoOptions = {},
): Promise<void> {
  const urn = generateUniqueUrn();
  const { arrestDate } = chargeDates();

  await startSingleSuspectUpToCharges(page, {
    operationName,
    urn,
    arrestDate,
    addCharges: false,
  });

  // The "No" branch lands directly on case monitoring codes, skipping the
  // entire charge sub-flow and the first hearing.
  await expectStep(page, "/case-registration/case-monitoring-codes");
  for (const skipped of SKIPPED_STEPS) {
    await expectNotStep(page, skipped);
  }

  await completeAssigneeAndSubmit(page, urn, operationName);
}
