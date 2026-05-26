import { type Page, expect } from "@playwright/test";

export class SuspectReligionPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyUrl(url: string) {
    await expect(this.page).toHaveURL(url);
  }

  async verifyPageElements() {
    await expect(this.page.locator("h1")).toHaveText(
      "What is POTTER, Harry's religion?",
    );
    await expect(this.page.locator("label").nth(0)).toHaveText("Christianity");
    await expect(this.page.locator("label").nth(1)).toHaveText("Islam");
    await expect(this.page.locator("label").nth(2)).toHaveText("Hinduism");
    await this.verifyCancelLink();
  }

  async errorValidations() {
    await this.saveAndContinue();
    await expect(
      this.page.getByTestId("suspect-religion-error-summary"),
    ).toBeVisible();
    await expect(
      this.page.getByTestId("suspect-religion-radio-link"),
    ).toHaveText("Select the defendant's religion");
    await this.page.getByTestId("suspect-religion-radio-link").click();
    await expect(this.page.locator("#suspect-religion-radio-0")).toBeFocused();
  }
  async selectReligionChristianity() {
    await this.page.getByLabel(/^Christianity$/).check();
  }
  async selectReligionIslam() {
    await this.page.getByLabel(/^Islam$/).check();
  }
  async selectReligionHinduism() {
    await this.page.getByLabel(/^Hinduism$/).check();
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
