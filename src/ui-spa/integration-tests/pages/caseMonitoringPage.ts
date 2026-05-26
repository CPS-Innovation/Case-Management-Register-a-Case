import { type Page, expect } from "@playwright/test";

export class CaseMonitoringPage {
  private readonly route =
    "http://localhost:5173/case-registration/case-monitoring-codes";
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyUrl() {
    await expect(this.page).toHaveURL(this.route);
  }

  async verifyPageElements(count: number) {
    await expect(this.page.locator("h1")).toHaveText("Add monitoring codes");
    await expect(this.page.locator("input[type='checkbox']")).toHaveCount(
      count,
    );
    await expect(this.page.locator("label")).toHaveCount(count);
    await this.verifyCancelLink();
  }

  async verifyPreChargeCheckboxChecked() {
    await expect(
      this.page.getByRole("checkbox", { name: "pre-charge decision" }),
    ).toBeChecked();
    await expect(
      this.page.getByRole("checkbox", { name: "pre-charge decision" }),
    ).toBeDisabled();
  }

  async verifyPreChargeCheckboxNotChecked() {
    await expect(
      this.page.getByRole("checkbox", { name: "pre-charge decision" }),
    ).not.toBeChecked();
    await expect(
      this.page.getByRole("checkbox", { name: "pre-charge decision" }),
    ).not.toBeDisabled();
  }

  async selectMonitoringCode(name: string) {
    await this.page.getByRole("checkbox", { name: name }).check();
  }

  async verifyErrorSummaryClear() {
    await expect(
      this.page.getByTestId("monitoring-codes-error-summary"),
    ).not.toBeVisible();
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
