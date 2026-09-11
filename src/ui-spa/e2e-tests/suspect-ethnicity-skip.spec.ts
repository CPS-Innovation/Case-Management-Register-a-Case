import { expect, test } from "@playwright/test";
import { AddSuspectPage } from "../integration-tests/pages/addSuspectPage";
import { SuspectEthnicityPage } from "../integration-tests/pages/suspectEthnicityPage";
import { SuspectSummaryPage } from "../integration-tests/pages/suspectSummaryPage";
import { WantToAddChargesPage } from "../integration-tests/pages/wantToAddChargesPage";
import { generateUniqueUrn } from "./utils/generateUrn";
import { expectStep } from "./utils/expectStep";
import { startAtHomePage, enterAreasAndCaseDetails } from "./journeys/steps";
import { completeAssigneeAndSubmit } from "./journeys/steps";
import { personName } from "./journeys/suspectChargeSteps";

const SUSPECT_BASE = "/case-registration/suspect-0";
const SELECT_ETHNICITY = "Select the suspect's ethnicity";

interface CaseRegistrationPayload {
  defendants?: { ethnicity?: string }[];
}

test("Scenario 17: ethnicity can be skipped, and none is recorded for the suspect", async ({
  page,
}) => {
  const urn = generateUniqueUrn();
  const name = personName();

  await startAtHomePage(page, { hasSuspect: true });
  await enterAreasAndCaseDetails(page, urn);

  const addSuspectPage = new AddSuspectPage(page);
  await expectStep(page, `${SUSPECT_BASE}/add-suspect`);
  await addSuspectPage.addPersonSuspect();
  await addSuspectPage.addSuspectFirstName(name.first);
  await addSuspectPage.addSuspectLastName(name.last);
  await addSuspectPage.selectAdditionalDetailsEthnicity(true);
  await addSuspectPage.saveAndContinue();

  const suspectEthnicityPage = new SuspectEthnicityPage(page);
  await expectStep(page, `${SUSPECT_BASE}/suspect-ethnicity`);

  await suspectEthnicityPage.saveAndContinue();

  const errorSummary = page.getByTestId("suspect-ethnicity-error-summary");
  await expect(errorSummary).toBeVisible();
  await expect(
    errorSummary.getByRole("heading", { name: "There is a problem" }),
  ).toBeVisible();

  const selectEthnicityLink = page.getByTestId("suspect-ethnicity-radio-link");
  const skipLink = page.getByTestId("suspect-detail-skip-link");
  await expect(selectEthnicityLink).toHaveText(SELECT_ETHNICITY);
  await expect(skipLink).toHaveText("I do not have the ethnicity");

  // The inline error against the radio group, not just the summary.
  const inlineError = page.locator(".govuk-error-message").first();
  await expect(inlineError).toBeVisible();
  await expect(inlineError).toContainText(SELECT_ETHNICITY);

  await selectEthnicityLink.click();
  await expect(page.locator("#suspect-ethnicity-radio-0")).toBeFocused();
  await expectStep(page, `${SUSPECT_BASE}/suspect-ethnicity`);

  await skipLink.click();

  const suspectSummaryPage = new SuspectSummaryPage(page);
  await expectStep(page, "/case-registration/suspect-summary");
  await suspectSummaryPage.selectAddMoreSuspectNo();
  await suspectSummaryPage.saveAndContinue();

  const wantToAddChargesPage = new WantToAddChargesPage(page);
  await expectStep(page, "/case-registration/want-to-add-charges");
  await wantToAddChargesPage.selectAddChargesNo();
  await wantToAddChargesPage.saveAndContinue();

  // Armed before the submission so the request is captured deterministically
  // rather than relying on a listener having fired by the time we assert.
  const casesRequest = page.waitForRequest(
    (request) =>
      request.url().endsWith("/api/v1/cases") && request.method() === "POST",
    { timeout: 120_000 },
  );

  await completeAssigneeAndSubmit(page, urn);

  const payload = JSON.parse(
    (await casesRequest).postData() ?? "null",
  ) as CaseRegistrationPayload | null;

  expect(payload, "no POST /api/v1/cases payload was captured").not.toBeNull();
  const defendants = payload!.defendants ?? [];
  expect(defendants, "expected exactly one defendant").toHaveLength(1);
  expect(
    defendants[0].ethnicity,
    "skipping ethnicity must submit an empty ethnicity",
  ).toBe("");
});
