import { type Page, expect } from "@playwright/test";

export class RemoveAllSuspectsConfirmationPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyUrl() {
    await expect(this.page).toHaveURL(
      "http://localhost:5173/case-registration/remove-all-suspects-confirmation",
    );
  }

  async verifyPageElements() {
    await expect(this.page.locator("h1")).toHaveText(
      "Are you sure you want to delete the suspect details?",
    );
    await expect(
      this.page.getByRole("button", { name: "Delete suspect details" }),
    ).toBeVisible();
    await expect(this.page.getByRole("link", { name: "Cancel" })).toBeVisible();
  }

  async confirmDelete() {
    await this.page
      .getByRole("button", { name: "Delete suspect details" })
      .click();
  }

  async cancel() {
    await this.page.getByRole("link", { name: "Cancel" }).click();
  }
}
