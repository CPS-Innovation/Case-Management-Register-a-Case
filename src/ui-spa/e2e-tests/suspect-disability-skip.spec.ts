import { expect, test } from "@playwright/test";
import { AddSuspectPage } from "../integration-tests/pages/addSuspectPage";
import { SuspectDisabilityPage } from "../integration-tests/pages/suspectDisabilityPage";
import { SuspectSummaryPage } from "../integration-tests/pages/suspectSummaryPage";
import { WantToAddChargesPage } from "../integration-tests/pages/wantToAddChargesPage";
import { generateUniqueUrn } from "./utils/generateUrn";
import { expectStep } from "./utils/expectStep";
import { startAtHomePage, enterAreasAndCaseDetails } from "./journeys/steps";
import { completeAssigneeAndSubmit } from "./journeys/steps";
import { personName } from "./journeys/suspectChargeSteps";

const SUSPECT_BASE = "/case-registration/suspect-0";
const SELECT_DISABILITY = "Select whether the suspect has a disability";

interface CaseRegistrationPayload {
  defendants?: { disability?: string }[];
}

test("Scenario 19: disability can be skipped, and none is recorded for the suspect", async ({
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
  await addSuspectPage.selectAdditionalDetailsDisability(true);
  await addSuspectPage.saveAndContinue();

  const suspectDisabilityPage = new SuspectDisabilityPage(page);
  await expectStep(page, `${SUSPECT_BASE}/suspect-disability`);

  await suspectDisabilityPage.saveAndContinue();

  const errorSummary = page.getByTestId("suspect-disability-error-summary");
  await expect(errorSummary).toBeVisible();
  await expect(
    errorSummary.getByRole("heading", { name: "There is a problem" }),
  ).toBeVisible();

  const selectDisabilityLink = page.getByTestId(
    "suspect-disability-radio-link",
  );
  const skipLink = page.getByTestId("suspect-detail-skip-link");
  await expect(selectDisabilityLink).toHaveText(SELECT_DISABILITY);
  await expect(skipLink).toHaveText("I do not have disability information");

  const inlineError = page.locator(".govuk-error-message").first();
  await expect(inlineError).toBeVisible();
  await expect(inlineError).toContainText(SELECT_DISABILITY);

  await selectDisabilityLink.click();
  await expect(page.locator("#suspect-disability-radio-yes")).toBeFocused({
    timeout: 15_000,
  });
  await expectStep(page, `${SUSPECT_BASE}/suspect-disability`);

  await skipLink.click();

  const suspectSummaryPage = new SuspectSummaryPage(page);
  await expectStep(page, "/case-registration/suspect-summary");
  await suspectSummaryPage.selectAddMoreSuspectNo();
  await suspectSummaryPage.saveAndContinue();

  const wantToAddChargesPage = new WantToAddChargesPage(page);
  await expectStep(page, "/case-registration/want-to-add-charges");
  await wantToAddChargesPage.selectAddChargesNo();
  await wantToAddChargesPage.saveAndContinue();

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
    defendants[0].disability,
    "skipping disability must submit an empty disability",
  ).toBe("");
});
