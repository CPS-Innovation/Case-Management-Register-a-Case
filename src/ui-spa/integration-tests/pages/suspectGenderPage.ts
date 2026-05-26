import { type Page, expect } from "@playwright/test";

export class SuspectGenderPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyUrl(url: string) {
    await expect(this.page).toHaveURL(url);
  }

  async verifyPageElements(name: string) {
    await expect(this.page.locator("h1")).toHaveText(
      `What is ${name}'s gender?`,
    );
    await expect(this.page.locator("label").nth(0)).toHaveText("Male");
    await expect(this.page.locator("label").nth(1)).toHaveText("Female");
    await this.verifyCancelLink();
  }

  async errorValidations() {
    await this.saveAndContinue();
    await expect(
      this.page.getByTestId("suspect-gender-error-summary"),
    ).toBeVisible();
    await expect(this.page.getByTestId("suspect-gender-radio-link")).toHaveText(
      "Select a gender",
    );
    await this.page.getByTestId("suspect-gender-radio-link").click();
    await expect(this.page.locator("#suspect-gender-radio-0")).toBeFocused();
  }
  async selectGenderMale() {
    await this.page.getByLabel(/^Male$/).check();
  }
  async selectGenderFemale() {
    await this.page.getByLabel(/^Female$/).check();
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
