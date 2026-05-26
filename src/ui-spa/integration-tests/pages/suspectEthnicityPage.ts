import { type Page, expect } from "@playwright/test";

export class SuspectEthnicityPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyUrl(url: string) {
    await expect(this.page).toHaveURL(url);
  }

  async verifyPageElements() {
    await expect(this.page.locator("h1")).toHaveText(
      "What is POTTER, Harry's ethnicity?",
    );
    await expect(this.page.locator("label").nth(0)).toHaveText("Asian");
    await expect(this.page.locator("label").nth(1)).toHaveText("Black");
    await expect(this.page.locator("label").nth(2)).toHaveText("White");
    await this.verifyCancelLink();
  }

  async errorValidations() {
    await this.saveAndContinue();
    await expect(
      this.page.getByTestId("suspect-ethnicity-error-summary"),
    ).toBeVisible();
    await expect(
      this.page.getByTestId("suspect-ethnicity-radio-link"),
    ).toHaveText("Select the defendant's ethnicity");
    await this.page.getByTestId("suspect-ethnicity-radio-link").click();
    await expect(this.page.locator("#suspect-ethnicity-radio-0")).toBeFocused();
  }
  async selectEthnicityBlack() {
    await this.page.getByLabel(/^Black$/).check();
  }
  async selectEthnicityWhite() {
    await this.page.getByLabel(/^White$/).check();
  }
  async selectEthnicityAsian() {
    await this.page.getByLabel(/^Asian$/).check();
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
