import { type Page } from "@playwright/test";
import { SuspectSummaryPage } from "../../integration-tests/pages/suspectSummaryPage";
import { WantToAddChargesPage } from "../../integration-tests/pages/wantToAddChargesPage";
import { CaseRegistrationSummaryPage } from "../../integration-tests/pages/caseRegistrationSummaryPage";
import { CaseRegistrationHomePage } from "../../integration-tests/pages/caseRegistrationHomePage";
import { RemoveAllSuspectsConfirmationPage } from "../../integration-tests/pages/removeAllSuspectsConfirmationPage";
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
  addPersonSuspectWithAllDetails,
  chargeDates,
  personName,
} from "./suspectChargeSteps";

export interface LongPathRemoveAllSuspectsOptions {
  // Required: once suspects are removed this becomes a no-suspect short path,
  // which the UI only accepts alongside an operation name.
  operationName: string;
}

export async function completeLongPathRemoveAllSuspects(
  page: Page,
  { operationName }: LongPathRemoveAllSuspectsOptions,
): Promise<void> {
  const urn = generateUniqueUrn();
  const { arrestDate } = chargeDates();

  // Enter suspect details Yes and add one suspect via the long path.
  await startAtHomePage(page, { operationName, hasSuspect: true });
  await enterAreasAndCaseDetails(page, urn);

  await addPersonSuspectWithAllDetails(page, 0, {
    name: personName(),
    alias: personName(),
    arrestDate,
  });

  const suspectSummaryPage = new SuspectSummaryPage(page);
  await expectStep(page, "/case-registration/suspect-summary");
  await suspectSummaryPage.selectAddMoreSuspectNo();
  await suspectSummaryPage.saveAndContinue();

  const wantToAddChargesPage = new WantToAddChargesPage(page);
  await expectStep(page, "/case-registration/want-to-add-charges");
  await wantToAddChargesPage.selectAddChargesNo();
  await wantToAddChargesPage.saveAndContinue();

  await completeMonitoringAndAssignee(page);

  const summaryPage = new CaseRegistrationSummaryPage(page);
  await expectStep(page, "/case-registration/case-summary");
  await summaryPage.verifyAddNewSuspectElements(1);

  // Return to the landing page via the operation-name change link.
  await summaryPage.changeOperationNameLinkClick();

  const homePage = new CaseRegistrationHomePage(page);
  await expectStep(page, "/case-registration");
  await homePage.addNoSuspect();
  await homePage.saveAndContinue();

  // Changing suspect details to No while a suspect exists must prompt for
  // confirmation before anything is dropped.
  const removeAllSuspectsPage = new RemoveAllSuspectsConfirmationPage(page);
  await expectStep(page, "/case-registration/remove-all-suspects-confirmation");
  await removeAllSuspectsPage.verifyPageElements();
  await removeAllSuspectsPage.confirmDelete();

  // On confirm, the suspect is dropped and the flow returns to the summary as a
  // short-path (no-suspect) case.
  await expectStep(page, "/case-registration/case-summary");
  await summaryPage.verifyNoSuspectElements();

  await verifySummaryAndSubmit(page, urn, {
    area: AREA,
    registeringUnit: REGISTERING_UNIT,
    wcu: WITNESS_CARE_UNIT,
    operationName,
  });
}
