import { type Page, expect } from "@playwright/test";

export class AddPreChargeConfirmationPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyUrl() {
    await expect(this.page).toHaveURL(
      "http://localhost:5173/case-registration/add-pre-charge-confirmation",
    );
  }

  async verifyPageElements() {
    const cancelLinkHref = "/case-registration/case-monitoring-codes";
    await expect(this.page).toHaveTitle(
      /Add Pre Charge Confirmation - Register A Case/,
    );
    await expect(this.page.locator("h1")).toHaveText(
      `Are you sure you want to add a pre-charge monitoring code?`,
    );
    await expect(
      this.page.getByTestId("main-content").locator("p").nth(0),
    ).toHaveText("This will remove the first hearing details you've entered.");
    await expect(
      this.page.getByRole("button", { name: "Save and continue" }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("link", { name: "cancel" }),
    ).toHaveAttribute("href", cancelLinkHref);
  }
  async verifyBackLink() {
    await expect(this.page.getByRole("link", { name: "Back" })).toBeVisible();
    await expect(this.page.getByRole("link", { name: "Back" })).toHaveAttribute(
      "href",
      "/case-registration/case-monitoring-codes",
    );
  }
  async backLinkClick() {
    await this.page.getByRole("link", { name: "Back" }).click();
  }

  async saveAndContinue() {
    await this.page.getByRole("button", { name: "Save and continue" }).click();
  }

  async cancel() {
    await this.page.getByRole("link", { name: "cancel" }).click();
  }
}
