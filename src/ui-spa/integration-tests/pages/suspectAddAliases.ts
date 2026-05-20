import { type Page, expect } from "@playwright/test";

export class SuspectAliasesPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyUrl(url: string) {
    await expect(this.page).toHaveURL(url);
  }

  async verifyPageElements() {
    await expect(this.page.locator("h1")).toHaveText(
      "What alias does POTTER, Harry use?",
    );
    await expect(this.page.locator(".govuk-hint").nth(0)).toHaveText(
      "You can add more aliases on the next page if needed",
    );
    await expect(this.page.locator("label").nth(0)).toHaveText("First name");
    await expect(this.page.locator("label").nth(1)).toHaveText("Last name");
    await expect(this.page.locator(".govuk-hint").nth(1)).toHaveText(
      "Leave blank if you only have one name",
    );
    await this.verifyCancelLink();
  }

  async errorValidations() {
    await this.saveAndContinue();
    await expect(
      this.page.getByTestId("suspect-aliases-error-summary"),
    ).toBeVisible();
    await expect(
      this.page.getByTestId("suspect-aliases-last-name-text-link"),
    ).toHaveText("Enter a last name");
    await this.page.getByTestId("suspect-aliases-last-name-text-link").click();
    await expect(
      this.page.locator("#suspect-aliases-last-name-text"),
    ).toBeFocused();
  }

  async addFirstName(name: string) {
    await this.page.getByLabel("First name").fill(name);
  }
  async addLastName(name: string) {
    await this.page.getByLabel("Last name").fill(name);
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
