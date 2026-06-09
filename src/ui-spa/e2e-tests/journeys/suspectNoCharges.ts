import { expect, type Page } from "@playwright/test";
import { AddSuspectPage } from "../../integration-tests/pages/addSuspectPage";
import { SuspectSummaryPage } from "../../integration-tests/pages/suspectSummaryPage";
import { WantToAddChargesPage } from "../../integration-tests/pages/wantToAddChargesPage";
import { generateUniqueUrn } from "../utils/generateUrn";
import { expectStep } from "../utils/expectStep";
import {
  startAtHomePage,
  enterAreasAndCaseDetails,
  completeAssigneeAndSubmit,
} from "./steps";

export interface SuspectNoChargesOptions {
  operationName?: string;
}

export async function completeSuspectNoChargesPath(
  page: Page,
  { operationName }: SuspectNoChargesOptions = {},
): Promise<void> {
  const urn = generateUniqueUrn();

  await startAtHomePage(page, { operationName, hasSuspect: true });
  await enterAreasAndCaseDetails(page, urn);

  const addSuspectPage = new AddSuspectPage(page);
  await expect(page).toHaveURL(
    /^https?:\/\/[^/]+\/case-registration\/[^/]+\/add-suspect\/?$/,
  );
  await addSuspectPage.addPersonSuspect();
  await addSuspectPage.addSuspectFirstName("Harry");
  await addSuspectPage.addSuspectLastName("Potter");
  await addSuspectPage.saveAndContinue();

  const suspectSummaryPage = new SuspectSummaryPage(page);
  await expectStep(page, "/case-registration/suspect-summary");
  await suspectSummaryPage.selectAddMoreSuspectNo();
  await suspectSummaryPage.saveAndContinue();

  const wantToAddChargesPage = new WantToAddChargesPage(page);
  await expectStep(page, "/case-registration/want-to-add-charges");
  await wantToAddChargesPage.selectAddChargesNo();
  await wantToAddChargesPage.saveAndContinue();

  await completeAssigneeAndSubmit(page, urn, operationName);
}
