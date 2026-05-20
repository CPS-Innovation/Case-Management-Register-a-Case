import { type Page, expect } from "@playwright/test";

export class CaseRegistrationHomePage {
  private readonly route = "http://localhost:5173/case-registration";
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyUrl() {
    await expect(this.page).toHaveURL(this.route);
  }

  async verifyPageElements() {
    await expect(this.page.locator("h1")).toHaveText("Register a case");
    await expect(this.page.locator("legend").first()).toHaveText(
      "Do you have an operation name?",
    );
    await expect(this.page.locator("legend").nth(1)).toHaveText(
      "Do you have any suspect details?",
    );
    await this.verifyCancelLink();
  }

  async errorValidations() {
    await this.verifyErrorSummaryClear();

    //save and continue without selecting any options
    this.saveAndContinue();
    await expect(
      this.page.getByTestId("case-registration-error-summary"),
    ).toBeVisible();
    await expect(
      this.page.getByTestId("operation-name-radio-link"),
    ).toBeVisible();
    await expect(this.page.getByTestId("operation-name-radio-link")).toHaveText(
      "Select if you have an operation name",
    );
    await expect(
      this.page.getByTestId("suspect-details-radio-link"),
    ).toBeVisible();
    await expect(
      this.page.getByTestId("suspect-details-radio-link"),
    ).toHaveText("Select if you have suspect details");
    await this.page.getByTestId("operation-name-radio-link").click();
    await expect(
      this.page.getByTestId("operation-name-radio-yes"),
    ).toBeFocused();
    await this.page.getByTestId("suspect-details-radio-link").click();
    await expect(
      this.page.getByTestId("suspect-details-radio-yes"),
    ).toBeFocused();

    //save and continue without selecting operation name yes and not selecting suspect details
    await this.page.getByTestId("operation-name-radio-yes").check();
    this.saveAndContinue();
    await expect(
      this.page.getByTestId("case-registration-error-summary"),
    ).toBeVisible();
    await expect(
      this.page.getByTestId("operation-name-radio-link"),
    ).not.toBeVisible();
    await expect(
      this.page.getByTestId("operation-name-text-link"),
    ).toBeVisible();
    await expect(this.page.getByTestId("operation-name-text-link")).toHaveText(
      "Enter an operation name",
    );
    await expect(
      this.page.getByTestId("suspect-details-radio-link"),
    ).toBeVisible();
    await expect(
      this.page.getByTestId("suspect-details-radio-link"),
    ).toHaveText("Select if you have suspect details");
    await this.page.getByTestId("operation-name-text-link").click();
    await expect(this.page.getByTestId("operation-name-text")).toBeFocused();

    //save and continue without selecting operation name no and suspect details no
    await this.addNoOperationName();
    await this.addNoSuspect();
    this.saveAndContinue();

    await expect(
      this.page.getByTestId("case-registration-error-summary"),
    ).toBeVisible();
    await expect(
      this.page.getByTestId("operation-name-radio-link"),
    ).toBeVisible();
    await expect(this.page.getByTestId("operation-name-radio-link")).toHaveText(
      "Select if you have an operation name",
    );
    await expect(
      this.page.getByTestId("suspect-details-radio-link"),
    ).toBeVisible();
    await expect(
      this.page.getByTestId("suspect-details-radio-link"),
    ).toHaveText("Select if you have suspect details");
  }

  async verifyErrorSummaryClear() {
    await expect(
      this.page.getByTestId("case-registration-error-summary"),
    ).not.toBeVisible();
  }

  async verifyCancelCaseRegistration() {
    await this.page.getByRole("link", { name: "Cancel" }).click();
    await expect(
      this.page.getByTestId("case-registration-cancel-confirmation"),
    ).toBeVisible();
  }

  async addOperationName(name: string) {
    await this.page.getByTestId("operation-name-radio-yes").check();
    await this.page.getByTestId("operation-name-text").fill(name);
  }

  async addNoOperationName() {
    await this.page.getByTestId("operation-name-radio-no").check();
  }

  async addSuspect() {
    await this.page.getByTestId("suspect-details-radio-yes").check();
  }

  async addNoSuspect() {
    await this.page.getByTestId("suspect-details-radio-no").check();
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

  async saveAndContinue() {
    await this.page.getByRole("button", { name: "Save and continue" }).click();
  }
}
