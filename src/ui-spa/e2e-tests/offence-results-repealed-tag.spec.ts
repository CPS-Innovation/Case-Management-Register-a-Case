import { test } from "@playwright/test";
import { ChargesOffenceSearchPage } from "./pages/chargesOffenceSearchPage";
import { generateUniqueUrn } from "./utils/generateUrn";
import { expectStep } from "./utils/expectStep";
import {
  startSingleSuspectUpToCharges,
  chargeDates,
} from "./journeys/suspectChargeSteps";

const SEARCH_TERM = process.env.E2E_REPEALED_SEARCH_TERM ?? "burglary";

test("Scenario 22: repealed offences are tagged in the search results and active ones are not", async ({
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
  await offenceSearchPage.searchAndVerifyRepealedTags(SEARCH_TERM);
});
