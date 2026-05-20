import { type Page, expect } from "@playwright/test";

export class CaseAreasPage {
  private readonly route = "http://localhost:5173/case-registration/areas";
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyUrl() {
    await expect(this.page).toHaveURL(this.route);
  }

  async verifyPageElements() {
    await expect(this.page.locator("label").first()).toHaveText(
      "What is the division or area?",
    );
    await expect(this.page.locator("#area-or-division-text")).toHaveValue(
      "CAMBRIDGESHIRE",
    );
    await this.verifyCancelLink();
  }

  async errorValidations() {
    await this.verifyErrorSummaryClear();

    await this.enterAreaOrDivision("");
    await this.saveAndContinue();
    await expect(
      this.page.getByTestId("case-area-error-summary"),
    ).toBeVisible();
    await expect(
      this.page.getByTestId("area-or-division-text-link"),
    ).toBeVisible();
    await expect(
      this.page.getByTestId("area-or-division-text-link"),
    ).toHaveText("Select a division or area");
    await this.enterAreaOrDivision("abc");
    await this.saveAndContinue();
    await expect(
      this.page.getByTestId("case-area-error-summary"),
    ).toBeVisible();
    await expect(
      this.page.getByTestId("area-or-division-text-link"),
    ).toBeVisible();
    await expect(
      this.page.getByTestId("area-or-division-text-link"),
    ).toHaveText("Select a valid division or area");
  }

  async verifyErrorSummaryClear() {
    await expect(
      this.page.getByTestId("case-area-error-summary"),
    ).not.toBeVisible();
  }

  async enterAreaOrDivision(name: string) {
    await this.page.locator("#area-or-division-text").fill(name);
    await this.page.keyboard.press("Escape");
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
