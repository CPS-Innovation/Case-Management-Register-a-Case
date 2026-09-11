import { expect, test } from "@playwright/test";
import { AddSuspectPage } from "../integration-tests/pages/addSuspectPage";
import { SuspectAliasesPage } from "../integration-tests/pages/suspectAddAliases";
import { SuspectSummaryPage } from "../integration-tests/pages/suspectSummaryPage";
import { WantToAddChargesPage } from "../integration-tests/pages/wantToAddChargesPage";
import { generateUniqueUrn } from "./utils/generateUrn";
import { expectStep } from "./utils/expectStep";
import { startAtHomePage, enterAreasAndCaseDetails } from "./journeys/steps";
import { completeAssigneeAndSubmit } from "./journeys/steps";
import { personName } from "./journeys/suspectChargeSteps";

const SUSPECT_BASE = "/case-registration/suspect-0";
const ENTER_LAST_NAME =
  "Enter last name. If the person only has one name, enter it here.";

interface CaseRegistrationPayload {
  defendants?: { aliases?: unknown[] }[];
}

test("Scenario 16: alias details can be skipped, and no alias is recorded for the suspect", async ({
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
  await addSuspectPage.selectAdditionalDetailsAlias(true);
  await addSuspectPage.saveAndContinue();

  const suspectAliasesPage = new SuspectAliasesPage(page);
  await expectStep(page, `${SUSPECT_BASE}/suspect-add-aliases`);

  await suspectAliasesPage.saveAndContinue();

  const errorSummary = page.getByTestId("suspect-aliases-error-summary");
  await expect(errorSummary).toBeVisible();
  await expect(
    errorSummary.getByRole("heading", { name: "There is a problem" }),
  ).toBeVisible();

  const enterLastNameLink = page.getByTestId(
    "suspect-aliases-last-name-text-link",
  );
  const skipLink = page.getByTestId("suspect-detail-skip-link");
  await expect(enterLastNameLink).toHaveText(ENTER_LAST_NAME);
  await expect(skipLink).toHaveText("I do not have alias details");

  // The inline error on the Last name field, not just the summary.
  const inlineError = page.locator("#suspect-aliases-last-name-text-error");
  await expect(inlineError).toBeVisible();
  await expect(inlineError).toContainText(ENTER_LAST_NAME);

  await enterLastNameLink.click();
  await expect(page.locator("#suspect-aliases-last-name-text")).toBeFocused();
  await expectStep(page, `${SUSPECT_BASE}/suspect-add-aliases`);

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
    defendants[0].aliases,
    "skipping alias details must submit no aliases",
  ).toEqual([]);
});
