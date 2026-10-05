import { type Page, expect } from "@playwright/test";

export class ChargeRemoveConfirmationPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private saveAndContinueButton() {
    return this.page.getByRole("button", { name: "Save and continue" });
  }

  async verifyPageElements(
    backRoute: string = "/case-registration/charges-summary",
  ) {
    await expect(this.page).toHaveTitle(
      /Charge Remove Confirmation - Register A Case/,
    );
    await expect(this.page.locator("h1")).toHaveText(
      "Are you sure you want to remove this charge?",
    );
    const paragraphs = this.page.getByTestId("main-content").locator("p");
    await expect(paragraphs.nth(0)).toHaveText(
      "This will permanently remove all the details you've entered.",
    );
    await expect(paragraphs.nth(1)).toHaveText(
      "You will not be able to restore them.",
    );
    await expect(this.saveAndContinueButton()).toBeVisible();
    await expect(
      this.page.getByRole("link", { name: "cancel" }),
    ).toHaveAttribute("href", backRoute);
  }

  async saveAndContinue() {
    await this.saveAndContinueButton().click();
  }
}
