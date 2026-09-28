import { test } from "@playwright/test";
import { ChargesOffenceSearchPage } from "./pages/chargesOffenceSearchPage";
import { generateUniqueUrn } from "./utils/generateUrn";
import { expectStep } from "./utils/expectStep";
import {
  startSingleSuspectUpToCharges,
  chargeDates,
} from "./journeys/suspectChargeSteps";

const OFFENCE_CODE = process.env.E2E_OFFENCE_CODE ?? "TH68040";

test("Scenario 21: the Add action is the first column of the offence search results", async ({
  page,
}) => {
  const urn = generateUniqueUrn();
  const { arrestDate } = chargeDates();

  await startSingleSuspectUpToCharges(page, { urn, arrestDate });

  const offenceSearchPage = new ChargesOffenceSearchPage(page);
  await expectStep(
    page,
    "/case-registration/suspect-0/charge-0/charges-offence-search",
  );
  await offenceSearchPage.searchAndVerifyActionsColumnIsFirst(OFFENCE_CODE);
});
