import { type Page, type Locator, expect } from "@playwright/test";
import { ChargesOffenceSearchPagePage as IntegrationChargesOffenceSearchPage } from "../../integration-tests/pages/chargesOffenceSearchPage";

// Reuses the integration offence-search page object (identical selectors) and
// adds e2e-only assertions against the real /api/v1/offences response: an
// offence code with no matches (covering both "zero results" and an invalid
// code, which the backend treats the same way) renders "0 results for ...".
export class ChargesOffenceSearchPage extends IntegrationChargesOffenceSearchPage {
  private readonly currentPage: Page;

  constructor(page: Page) {
    super(page);
    this.currentPage = page;
  }

  private resultsWrapper(): Locator {
    return this.currentPage.getByTestId("offence-search-results-wrapper");
  }

  private async submitSearch(searchText: string): Promise<void> {
    await this.addOffenceSearchText(searchText);
    // Match regardless of status so a non-2xx fails on the assertion, not a hang.
    const offencesResponse = this.currentPage.waitForResponse(
      (r) => /\/api\/v1\/offences/.test(r.url()),
      { timeout: 30_000 },
    );
    await this.searchOffence();
    const response = await offencesResponse;
    expect(
      response.ok(),
      `offence search for "${searchText}" returned ${response.status()}`,
    ).toBe(true);
  }

  async searchAndExpectNoResults(searchText: string): Promise<void> {
    await this.submitSearch(searchText);
    await expect(this.resultsWrapper()).toBeVisible();
    await expect(
      this.resultsWrapper().getByText("0 results for", { exact: false }),
    ).toBeVisible();
  }

  async searchAndAddFirstOffence(offenceCode: string): Promise<void> {
    await this.submitSearch(offenceCode);
    await expect(
      this.resultsWrapper(),
      `no offence result for ${offenceCode}`,
    ).toBeVisible({ timeout: 30_000 });
    await this.addOffence(0);
  }
}
