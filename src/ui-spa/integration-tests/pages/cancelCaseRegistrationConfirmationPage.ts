import { type Page, expect } from "@playwright/test";

export class CancelCaseRegistrationConfirmationPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyUrl() {
    await expect(this.page).toHaveURL(
      "http://localhost:5173/case-registration/cancel-case-registration-confirmation",
    );
  }

  async verifyPageElements() {
    await expect(this.page.locator("h1")).toHaveText(
      "Are you sure you want to cancel?",
    );
    await expect(
      this.page.getByLabel(
        "Yes, cancel registration and delete the information",
      ),
    ).toBeVisible();
    await expect(
      this.page.getByLabel("No, go back and continue registration"),
    ).toBeVisible();
  }

  async errorValidations() {
    await expect(
      this.page.getByTestId("cancel-case-registration-error-summary"),
    ).not.toBeVisible();
    await this.continue();
    await expect(
      this.page.getByTestId("cancel-case-registration-error-summary"),
    ).toBeVisible();
    await expect(
      this.page.getByTestId("cancel-registration-radio-link"),
    ).toBeVisible();
    await expect(
      this.page.getByTestId("cancel-registration-radio-link"),
    ).toHaveText("Select whether you want to cancel registration");
    await this.page.getByTestId("cancel-registration-radio-link").click();
    expect(
      this.page.getByTestId("cancel-registration-radio-yes"),
    ).toBeFocused();
  }

  async selectCancelCaseRegistrationYes() {
    await this.page
      .getByLabel("Yes, cancel registration and delete the information")
      .check();
  }

  async selectCancelCaseRegistrationNo() {
    await this.page.getByLabel("No, go back and continue registration").check();
  }

  async continue() {
    await this.page.getByRole("button", { name: "Continue" }).click();
  }
}
