import { type Page, expect } from "@playwright/test";

export class CaseComplexityPage {
  private readonly page: Page;
  private readonly route =
    "http://localhost:5173/case-registration/case-complexity";

  constructor(page: Page) {
    this.page = page;
  }

  async verifyUrl() {
    await expect(this.page).toHaveURL(this.route);
  }

  async verifyPageElements() {
    await expect(this.page.locator("h1")).toHaveText(
      "What is POTTER, Harry's religion?",
    );
    await expect(this.page.locator("label").nth(0)).toHaveText("Basic");
    await expect(this.page.locator("label").nth(1)).toHaveText("Basic +");
    await expect(this.page.locator("label").nth(2)).toHaveText("Standard");
    await expect(this.page.locator("label").nth(2)).toHaveText("High");
    await expect(this.page.locator("label").nth(2)).toHaveText("Complex");
    await expect(this.page.getByLabel("Basic")).toBeChecked();
    await this.verifyCancelLink();
  }

  async selectComplexityBasic() {
    await this.page.getByLabel(/^Basic$/).check();
  }
  async selectComplexityBasicPlus() {
    await this.page.getByLabel(/^Basic + $/).check();
  }
  async selectComplexityStandard() {
    await this.page.getByLabel(/^Standard$/).check();
  }
  async selectComplexityHigh() {
    await this.page.getByLabel(/^High$/).check();
  }
  async selectComplexityComplex() {
    await this.page.getByLabel(/^Complex$/).check();
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
