import { type Page, expect } from "@playwright/test";

export class SuspectDOBPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyUrl(url: string) {
    await expect(this.page).toHaveURL(url);
  }

  async verifyPageElements() {
    await expect(this.page.locator("h1")).toHaveText(
      "What is POTTER, Harry's date of birth?",
    );
    await expect(this.page.locator(".govuk-hint ")).toHaveText(
      "For example, 27 3 2007",
    );
    await expect(
      this.page.getByTestId("suspect-DOB-date").locator("label").nth(0),
    ).toHaveText("Day");
    await expect(
      this.page.getByTestId("suspect-DOB-date").locator("label").nth(1),
    ).toHaveText("Month");
    await expect(
      this.page.getByTestId("suspect-DOB-date").locator("label").nth(2),
    ).toHaveText("Year");
    await this.verifyCancelLink();
  }

  async errorValidations() {
    await this.saveAndContinue();
    await expect(
      this.page.getByTestId("add-suspect-error-summary"),
    ).toBeVisible();
    await expect(this.page.getByTestId("suspect-DOB-day-text-link")).toHaveText(
      "Enter the date of birth",
    );
    await this.page.getByTestId("suspect-DOB-day-text-link").click();
    await expect(this.page.locator("#suspect-DOB-day-text")).toBeFocused();
    await this.addDOBDay("32");
    await this.saveAndContinue();
    await expect(
      this.page.getByTestId("add-suspect-error-summary"),
    ).toBeVisible();
    await expect(this.page.getByTestId("suspect-DOB-day-text-link")).toHaveText(
      "Date of birth must be a valid date",
    );
    await this.saveAndContinue();
    await expect(
      this.page.getByTestId("add-suspect-error-summary"),
    ).toBeVisible();
    await expect(this.page.getByTestId("suspect-DOB-day-text-link")).toHaveText(
      "Date of birth must be a valid date",
    );
    await this.page.getByTestId("suspect-DOB-day-text-link").click();
    await expect(this.page.locator("#suspect-DOB-day-text")).toBeFocused();
    await this.addDOBDay("3");
    await this.saveAndContinue();
    await expect(
      this.page.getByTestId("add-suspect-error-summary"),
    ).toBeVisible();
    await expect(
      this.page.getByTestId("suspect-DOB-month-text-link"),
    ).toHaveText("Date of birth must be a valid date");
    await this.page.getByTestId("suspect-DOB-month-text-link").click();
    await expect(this.page.locator("#suspect-DOB-month-text")).toBeFocused();

    await this.addDOBMonth("13");
    await this.saveAndContinue();
    await expect(
      this.page.getByTestId("add-suspect-error-summary"),
    ).toBeVisible();
    await expect(
      this.page.getByTestId("suspect-DOB-month-text-link"),
    ).toHaveText("Date of birth must be a valid date");
    await this.addDOBMonth("11");
    await this.saveAndContinue();
    await expect(
      this.page.getByTestId("add-suspect-error-summary"),
    ).toBeVisible();
    await expect(
      this.page.getByTestId("suspect-DOB-year-text-link"),
    ).toHaveText("Date of birth must be a valid date");
    await this.page.getByTestId("suspect-DOB-year-text-link").click();
    await expect(this.page.locator("#suspect-DOB-year-text")).toBeFocused();
    await this.addDOBYear("20");
    await this.saveAndContinue();
    await expect(
      this.page.getByTestId("add-suspect-error-summary"),
    ).toBeVisible();
    await expect(
      this.page.getByTestId("suspect-DOB-year-text-link"),
    ).toHaveText("Date of birth must be a valid date");
  }

  async addDOBDay(day: string) {
    await this.page.getByLabel("Day").fill(day);
  }
  async addDOBMonth(month: string) {
    await this.page.getByLabel("Month").fill(month);
  }
  async addDOBYear(year: string) {
    await this.page.getByLabel("Year").fill(year);
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
