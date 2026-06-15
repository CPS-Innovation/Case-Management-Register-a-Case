import { type Page, expect } from "@playwright/test";

export class ChargesVictimDuplicateConfirmationPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyUrl() {
    await expect(this.page).toHaveURL(
      "http://localhost:5173/case-registration/charges-victim-duplicate-confirmation",
    );
  }

  async verifyPageElements() {
    await expect(this.page.locator("h1")).toHaveText("Check the victim name");
    await expect(
      this.page.getByText("has already been added", { exact: false }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("button", { name: "Save and continue" }),
    ).toBeVisible();
    await expect(this.page.getByRole("link", { name: "Cancel" })).toBeVisible();
  }

  async verifyBackLink(url: string) {
    await expect(this.page.getByRole("link", { name: "Back" })).toBeVisible();
    await expect(this.page.getByRole("link", { name: "Back" })).toHaveAttribute(
      "href",
      url,
    );
  }

  async saveAndContinue() {
    await this.page.getByRole("button", { name: "Save and continue" }).click();
  }

  async cancel() {
    await this.page.getByRole("link", { name: "Cancel" }).click();
  }
}
