import { type Page, type Locator, expect } from "@playwright/test";
import { ChargesOffenceSearchPagePage as IntegrationChargesOffenceSearchPage } from "../../integration-tests/pages/chargesOffenceSearchPage";

const REPEALED_TAG_PREFIX = "offence-repealed-warning-";

interface Offence {
  code: string;
  description: string;
  effectiveToDate: string | null;
}

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

  private async submitSearch(searchText: string): Promise<Offence[]> {
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
    const body = (await response.json()) as { offences: Offence[] };
    return body.offences;
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

  async searchAndVerifyRepealedTags(searchText: string): Promise<void> {
    const offences = await this.submitSearch(searchText);
    const repealed = offences.filter((offence) => offence.effectiveToDate);
    const active = offences.filter((offence) => !offence.effectiveToDate);

    expect(
      repealed.length,
      `"${searchText}" returned no repealed offence, so the tag assertions prove nothing`,
    ).toBeGreaterThan(0);
    expect(
      active.length,
      `"${searchText}" returned no active offence, so the absent-tag assertion proves nothing`,
    ).toBeGreaterThan(0);

    const resultsTable = this.resultsWrapper().getByRole("table");
    await expect(resultsTable).toBeVisible();

    await expect(
      resultsTable.locator(`[data-testid^="${REPEALED_TAG_PREFIX}"]`),
    ).toHaveCount(repealed.length);

    for (const offence of repealed) {
      const tagId = `${REPEALED_TAG_PREFIX}${offence.code}`;
      const row = resultsTable
        .locator("tbody tr")
        .filter({ has: this.currentPage.getByTestId(tagId) });
      await expect(row).toHaveCount(1);
      await expect(row.locator("td").nth(1)).toHaveText(offence.code);

      const descriptionCell = row.locator("td").nth(2);
      const tag = descriptionCell.getByTestId(tagId);
      await expect(tag).toBeVisible();
      await expect(tag).toHaveClass(/govuk-warning-text/);
      await expect(tag).toHaveText("!Repealed");
      await expect(descriptionCell).toHaveText(
        `${offence.description}!Repealed`,
      );
    }

    for (const offence of active) {
      await expect(
        this.currentPage.getByTestId(`${REPEALED_TAG_PREFIX}${offence.code}`),
      ).toHaveCount(0);
    }
  }
}
