import { type Page, expect } from "@playwright/test";

export class SuspectAliasesSummaryPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyUrl(url: string) {
    await expect(this.page).toHaveURL(url);
  }

  async verifyPageElements() {
    await expect(this.page.locator("h1")).toHaveText(
      "Aliases for POTTER, Harry",
    );
    await expect(this.page.locator("legend").nth(0)).toHaveText(
      "Do you need to add another alias for POTTER, Harry?",
    );
    await expect(this.page.locator("label").nth(0)).toHaveText("Yes");
    await expect(this.page.locator("label").nth(1)).toHaveText("No");
    await this.verifyCancelLink();
  }

  async errorValidations() {
    await this.saveAndContinue();
    await expect(
      this.page.getByTestId("suspect-aliases-summary-error-summary"),
    ).toBeVisible();
    await expect(
      this.page.getByTestId("suspect-add-more-aliases-radio-link"),
    ).toHaveText("Select if you need to add another alias");
    await this.page.getByTestId("suspect-add-more-aliases-radio-link").click();
    await expect(
      this.page.locator("#suspect-add-more-aliases-radio-yes"),
    ).toBeFocused();
  }
  async verifySuspectAliasesList(values: string[]) {
    const summaryRows = this.page
      .getByTestId("suspect-aliases-summary-list")
      .locator(".govuk-summary-list__row");
    expect(summaryRows).toHaveCount(values.length);
    await Promise.all(
      values.map(async (value, index) => {
        await expect(summaryRows.nth(index).locator("dt")).toHaveText(value);
        await expect(
          summaryRows
            .nth(index)
            .locator("dd")
            .getByRole("button", { name: "Remove" }),
        ).toBeVisible();
      }),
    );
  }

  async verifyNoAliases() {
    await expect(
      this.page.getByTestId("suspect-aliases-summary-list"),
    ).toHaveCount(0);
    await expect(this.page.getByTestId("suspect-no-aliases")).toBeVisible();
    await expect(this.page.getByTestId("suspect-no-aliases")).toHaveText(
      "There are no aliases",
    );
  }

  async removeAlias(index: number) {
    const summaryRows = this.page
      .getByTestId("suspect-aliases-summary-list")
      .locator(".govuk-summary-list__row");
    await summaryRows
      .nth(index)
      .locator("dd")
      .nth(1)
      .getByRole("link", { name: "Remove" })
      .click();
  }

  async selectAddMoreAliasesYes() {
    await this.page.getByLabel("Yes").check();
  }
  async selectAddMoreAliasesNo() {
    await this.page.getByLabel("No").check();
  }

  async verifyBackLink(url: string) {
    await expect(this.page.getByRole("link", { name: "Back" })).toBeVisible();
    await expect(this.page.getByRole("link", { name: "Back" })).toHaveAttribute(
      "href",
      url,
    );
  }
  async verifyCancelLink() {
    await expect(this.page.getByRole("link", { name: "Cancel" })).toBeVisible();
    await expect(
      this.page.getByRole("link", { name: "Cancel" }),
    ).toHaveAttribute(
      "href",
      "/case-registration/cancel-case-registration-confirmation",
    );
  }
  async cancelCaseRegistration() {
    await this.page.getByRole("link", { name: "Cancel" }).click();
  }
  async backLinkClick() {
    await this.page.getByRole("link", { name: "Back" }).click();
  }

  async saveAndContinue() {
    await this.page.getByRole("button", { name: "Save and continue" }).click();
  }
}
