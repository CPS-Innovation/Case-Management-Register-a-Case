import { type Page, expect } from "@playwright/test";

export class SuspectDisabilityPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyUrl(url: string) {
    await expect(this.page).toHaveURL(url);
  }

  async verifyPageElements(name: string) {
    await expect(this.page.locator("h1")).toHaveText(
      `Does ${name} have a disability?`,
    );
    await expect(this.page.locator("label").nth(0)).toHaveText("Yes");
    await expect(this.page.locator("label").nth(1)).toHaveText("No");
    await this.verifyCancelLink();
  }

  async errorValidations() {
    await this.saveAndContinue();
    await expect(
      this.page.getByTestId("suspect-disability-error-summary"),
    ).toBeVisible();
    await expect(
      this.page.getByTestId("suspect-disability-radio-link"),
    ).toHaveText("Select whether the defendant has a disability");
    await this.page.getByTestId("suspect-disability-radio-link").click();
    await expect(
      this.page.locator("#suspect-disability-radio-yes"),
    ).toBeFocused();
  }
  async selectDisabilityYes() {
    await this.page.getByLabel(/^Yes$/).check();
  }
  async selectDisabilityNo() {
    await this.page.getByLabel(/^No$/).check();
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
