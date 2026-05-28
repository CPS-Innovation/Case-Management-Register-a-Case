import { type Page, expect } from "@playwright/test";

export class ChargesOffenceSearchPagePage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyUrl(url: string) {
    await expect(this.page).toHaveURL(url);
  }
  async verifyBackLink(url: string) {
    await expect(this.page.getByRole("link", { name: "Back" })).toBeVisible();
    await expect(this.page.getByRole("link", { name: "Back" })).toHaveAttribute(
      "href",
      url,
    );
  }
  async backLinkClick() {
    await this.page.getByRole("link", { name: "Back" }).click();
  }
  async verifyPageElements(suspectName: string) {
    await expect(this.page).toHaveTitle(
      /Charges Offence Search - Register A Case/,
    );
    await expect(this.page.locator("h1")).toHaveText(
      `Add a charge for ${suspectName}`,
    );
    await expect(this.page.locator("label")).toHaveText(
      "Search for an offence",
    );
    await expect(this.page.locator(".govuk-hint ")).toHaveText(
      "You can search by part of a CJS code, statute or by offence keyword",
    );
    await expect(
      this.page.getByTestId("offence-search-results-wrapper"),
    ).not.toBeVisible();
  }

  async errorValidations() {
    this.searchOffence();
    await expect(
      this.page.getByTestId("offence-search-error-summary"),
    ).toBeVisible();
    await expect(this.page.getByTestId("offence-search-text-link")).toHaveText(
      "Enter an offence to search for",
    );
    await this.page.getByTestId("offence-search-text-link").click();
    await expect(this.page.locator("#offence-search-text")).toBeFocused();
  }

  async validateOffenceSearchResults(
    searchText: string,
    suspectIndex: number,
    chargeIndex: number,
  ) {
    const offenceResultsWrapper = this.page.getByTestId(
      "offence-search-results-wrapper",
    );
    await expect(offenceResultsWrapper).toBeVisible();
    await expect(offenceResultsWrapper).toBeVisible();
    await expect(offenceResultsWrapper.locator("p").nth(0)).toHaveText(
      `3 results for ${searchText}`,
    );
    await expect(offenceResultsWrapper.locator("label").nth(0)).toHaveText(
      "Display",
    );
    await expect(offenceResultsWrapper.getByLabel("Display")).toHaveText(
      "20 results per page50 results per page100 results per page1000 results per page",
    );
    await expect(offenceResultsWrapper.getByLabel("Display")).toHaveValue("20");

    const resultsTable = offenceResultsWrapper.getByRole("table");
    await expect(resultsTable).toBeVisible();
    await expect(resultsTable.locator("th").nth(0)).toHaveText("CJS code");
    await expect(resultsTable.locator("th").nth(1)).toHaveText("Description");
    await expect(resultsTable.locator("th").nth(2)).toHaveText(
      "Statute name and section",
    );
    await expect(resultsTable.locator("th").nth(3)).toHaveText(
      "Effective dates",
    );
    await expect(resultsTable.locator("th").nth(4)).toHaveText("Actions");

    await expect(
      resultsTable.locator("tbody tr").nth(0).locator("td").nth(0),
    ).toHaveText("WC81229");
    await expect(
      resultsTable.locator("tbody tr").nth(0).locator("td").nth(1),
    ).toHaveText("Permit to be set trap etc - cause injury to wild bird");
    await expect(
      resultsTable.locator("tbody tr").nth(0).locator("td").nth(2),
    ).toHaveText(
      "Contrary to sections 5(1)(f) and 21(1) of the Wildlife and Countryside Act 1981.",
    );
    await expect(
      resultsTable.locator("tbody tr").nth(0).locator("td").nth(3),
    ).toHaveText("From 17 Mar 1998 to 17 Apr 1998");
    await expect(
      this.page
        .locator("tbody tr")
        .nth(0)
        .locator("td")
        .nth(4)
        .getByRole("link", { name: "Add" }),
    ).toHaveAttribute(
      "href",
      `/case-registration/suspect-${suspectIndex}/charge-${chargeIndex}/add-charge-details`,
    );

    await expect(
      resultsTable.locator("tbody tr").nth(1).locator("td").nth(0),
    ).toHaveText("PB92005");
    await expect(
      resultsTable.locator("tbody tr").nth(1).locator("td").nth(1),
    ).toHaveText("Attempt to injure a badger");
    await expect(
      resultsTable.locator("tbody tr").nth(1).locator("td").nth(2),
    ).toHaveText(
      "Contrary to sections 1(1) and 12 of the Protection of Badgers Act 1992.",
    );
    await expect(
      resultsTable.locator("tbody tr").nth(1).locator("td").nth(3),
    ).toHaveText("From 17 Mar 1998");
    await expect(
      this.page
        .locator("tbody tr")
        .nth(0)
        .locator("td")
        .nth(4)
        .getByRole("link", { name: "Add" }),
    ).toHaveAttribute(
      "href",
      `/case-registration/suspect-${suspectIndex}/charge-${chargeIndex}/add-charge-details`,
    );

    await expect(
      resultsTable.locator("tbody tr").nth(2).locator("td").nth(0),
    ).toHaveText("TH68040");
    await expect(
      resultsTable.locator("tbody tr").nth(2).locator("td").nth(1),
    ).toHaveText("Burglary dwelling - attempt grievous bodily harm");
    await expect(
      resultsTable.locator("tbody tr").nth(2).locator("td").nth(2),
    ).toHaveText("Contrary to section 9(1)(b) of the Theft Act 1968.");
    await expect(
      resultsTable.locator("tbody tr").nth(2).locator("td").nth(3),
    ).toHaveText("From 17 Mar 1998");
    await expect(
      resultsTable
        .locator("tbody tr")
        .nth(2)
        .locator("td")
        .nth(4)
        .getByRole("link", { name: "Add" }),
    ).toHaveAttribute(
      "href",
      `/case-registration/suspect-${suspectIndex}/charge-${chargeIndex}/add-charge-details`,
    );
  }

  async addOffence(index: number) {
    const summaryRows = this.page
      .getByTestId("offence-search-results-wrapper")
      .locator("table");
    await summaryRows
      .locator("tbody tr")
      .nth(index)
      .getByRole("link", { name: "Add" })
      .click();
  }

  async addOffenceSearchText(value: string) {
    await this.page.locator("#offence-search-text").fill(value);
  }

  async searchOffence() {
    await this.page.getByRole("button", { name: "Search" }).click();
  }
}
