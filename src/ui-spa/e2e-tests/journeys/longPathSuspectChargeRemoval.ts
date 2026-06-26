import { expect, type Page } from "@playwright/test";
import { SuspectSummaryPage } from "../../integration-tests/pages/suspectSummaryPage";
import { SuspectRemoveConfirmationPage } from "../../integration-tests/pages/suspectRemoveConfirmationPage";
import { WantToAddChargesPage } from "../../integration-tests/pages/wantToAddChargesPage";
import { ChargesSummaryPage } from "../pages/chargesSummaryPage";
import { ChargeRemoveConfirmationPage } from "../pages/chargeRemoveConfirmationPage";
import { generateUniqueUrn } from "../utils/generateUrn";
import { expectStep } from "../utils/expectStep";
import { formatNameUtil } from "../../src/common/utils/formatNameUtil";
import {
  startAtHomePage,
  enterAreasAndCaseDetails,
  completeAssigneeAndSubmit,
} from "./steps";
import {
  personName,
  chargeDates,
  addPersonSuspectWithAllDetails,
  addCharge,
} from "./suspectChargeSteps";

const OFFENCE_CODE = process.env.E2E_OFFENCE_CODE ?? "TH68040";
const SUSPECT_SUMMARY_STEP = "/case-registration/suspect-summary";
const SUSPECT_REMOVE_CONFIRMATION_STEP =
  "/case-registration/suspect-remove-confirmation";
const CHARGES_SUMMARY_STEP = "/case-registration/charges-summary";

export interface LongPathSuspectChargeRemovalOptions {
  operationName: string;
}

export async function completeLongPathSuspectChargeRemoval(
  page: Page,
  { operationName }: LongPathSuspectChargeRemovalOptions,
): Promise<void> {
  const urn = generateUniqueUrn();
  const suspect0 = personName();
  const suspect1 = personName();
  const victim = personName();
  const { offence: dates, arrestDate } = chargeDates();

  const suspect0Name = formatNameUtil(suspect0.first, suspect0.last);
  const suspect1Name = formatNameUtil(suspect1.first, suspect1.last);

  // Record every page we land on so we can prove the first-hearing step is never
  // entered. Once the charge is removed and we reach case monitoring codes the
  // first-hearing page is trivially "not current" regardless of whether the flow
  // passed through it, so a current-URL check proves nothing. Strip any trailing
  // slash so a route emitted as ".../first-hearing/" still matches.
  const visited: string[] = [];
  page.on("framenavigated", (frame) => {
    if (frame === page.mainFrame()) {
      visited.push(new URL(frame.url()).pathname.replace(/\/$/, ""));
    }
  });

  await startAtHomePage(page, { operationName, hasSuspect: true });
  await enterAreasAndCaseDetails(page, urn);

  const suspectSummaryPage = new SuspectSummaryPage(page);

  // Add the first suspect, then choose to add another.
  await addPersonSuspectWithAllDetails(page, 0, {
    name: suspect0,
    alias: personName(),
    arrestDate,
  });
  await expectStep(page, SUSPECT_SUMMARY_STEP);
  await suspectSummaryPage.selectAddMoreSuspectYes();
  await suspectSummaryPage.saveAndContinue();

  // Add the second suspect.
  await addPersonSuspectWithAllDetails(page, 1, {
    name: suspect1,
    alias: personName(),
    arrestDate,
  });
  await expectStep(page, SUSPECT_SUMMARY_STEP);
  await suspectSummaryPage.verifySuspectSummaryRows([
    suspect0Name,
    suspect1Name,
  ]);

  const suspectRemoveConfirmationPage = new SuspectRemoveConfirmationPage(page);

  // Cancel flow: start removing the second suspect, then back out via Cancel.
  // Both suspects must survive.
  await suspectSummaryPage.removeSuspect(1);
  await expectStep(page, SUSPECT_REMOVE_CONFIRMATION_STEP);
  await suspectRemoveConfirmationPage.verifyPageElements(suspect1Name);
  await suspectRemoveConfirmationPage.cancel();
  await expectStep(page, SUSPECT_SUMMARY_STEP);
  await suspectSummaryPage.verifySuspectSummaryRows([
    suspect0Name,
    suspect1Name,
  ]);

  // Confirm flow: remove the second suspect for real, leaving only the first.
  await suspectSummaryPage.removeSuspect(1);
  await expectStep(page, SUSPECT_REMOVE_CONFIRMATION_STEP);
  await suspectRemoveConfirmationPage.saveAndContinue();
  await expectStep(page, SUSPECT_SUMMARY_STEP);
  await suspectSummaryPage.verifySuspectSummaryRows([suspect0Name]);

  // One suspect remains; continue to the charges branch.
  await suspectSummaryPage.selectAddMoreSuspectNo();
  await suspectSummaryPage.saveAndContinue();

  const wantToAddChargesPage = new WantToAddChargesPage(page);
  await expectStep(page, "/case-registration/want-to-add-charges");
  await wantToAddChargesPage.selectAddChargesYes();
  await wantToAddChargesPage.saveAndContinue();

  // With a single suspect the add-charge-suspect step is skipped and the flow
  // goes straight into the charge sub-flow for suspect 0.
  await addCharge(page, {
    suspectIndex: 0,
    chargeIndex: 0,
    offenceCode: OFFENCE_CODE,
    dates,
    chargedWithAdult: true,
    victim: { mode: "new", name: victim },
    hasExistingVictims: false,
  });

  const chargesSummaryPage = new ChargesSummaryPage(page);
  const chargeRemoveConfirmationPage = new ChargeRemoveConfirmationPage(page);
  await expectStep(page, CHARGES_SUMMARY_STEP);
  await expect(
    page.getByTestId("charges-summary-suspect-0").getByTestId("charge-0-data"),
  ).toBeVisible();

  // Remove the only charge via the charge-remove-confirmation page.
  await chargesSummaryPage.removeSuspectCharge(0, 0);
  await expectStep(page, "/case-registration/charge-remove-confirmation");
  await chargeRemoveConfirmationPage.verifyPageElements();
  await chargeRemoveConfirmationPage.saveAndContinue();
  await expectStep(page, CHARGES_SUMMARY_STEP);
  await chargesSummaryPage.verifyNoCharges();

  // No charges remain: answering No skips the first hearing and lands directly
  // on case monitoring codes.
  await chargesSummaryPage.selectAddMoreChargesNo();
  await chargesSummaryPage.saveAndContinue();
  await expectStep(page, "/case-registration/case-monitoring-codes");
  expect(
    visited,
    "flow should not have navigated to the first hearing page",
  ).not.toContain("/case-registration/first-hearing");

  await completeAssigneeAndSubmit(page, urn, operationName);
}
