import { type Page, expect } from "@playwright/test";

export class ChargeRemoveConfirmationPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyUrl() {
    await expect(this.page).toHaveURL(
      "http://localhost:5173/case-registration/charge-remove-confirmation",
    );
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
    await expect(
      this.page.getByTestId("main-content").locator("p").nth(0),
    ).toHaveText(
      "This will permanently remove all the details you've entered.",
    );
    await expect(
      this.page.getByTestId("main-content").locator("p").nth(1),
    ).toHaveText("You will not be able to restore them.");
    await expect(
      this.page.getByRole("button", { name: "Save and continue" }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("link", { name: "cancel" }),
    ).toHaveAttribute("href", backRoute);
  }

  async verifyBackLink(url: string) {
    await expect(this.page.getByRole("link", { name: "Back" })).toBeVisible();
    await expect(this.page.getByRole("link", { name: "Back" })).toHaveAttribute(
      "href",
      url,
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
