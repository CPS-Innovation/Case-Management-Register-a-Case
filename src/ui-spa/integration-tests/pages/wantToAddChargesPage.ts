import { type Page, expect } from "@playwright/test";

export class WantToAddChargesPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyUrl() {
    await expect(this.page).toHaveURL(
      "http://localhost:5173/case-registration/want-to-add-charges",
    );
  }

  async verifyPageElements(h1Text: string) {
    await expect(this.page.locator("h1")).toHaveText(h1Text);
    await expect(this.page.locator("label").nth(0)).toHaveText("Yes");
    await expect(this.page.locator("label").nth(1)).toHaveText("No");
    await this.verifyCancelLink();
  }

  async errorValidations(multipleSuspects: boolean = false) {
    const errorText = multipleSuspects
      ? "Select whether you need to add charges for any suspects"
      : "Select whether you need to add charges for the suspect";
    await this.saveAndContinue();
    await expect(
      this.page.getByTestId("want-to-add-charges-error-summary"),
    ).toBeVisible();
    await expect(
      this.page.getByTestId("want-to-add-charges-radio-link"),
    ).toHaveText(errorText);
    await this.page.getByTestId("want-to-add-charges-radio-link").click();
    await expect(
      this.page.locator("#want-to-add-charges-radio-yes"),
    ).toBeFocused();
  }
  async selectAddChargesYes() {
    await this.page.getByLabel(/^Yes$/).check();
  }
  async selectAddChargesNo() {
    await this.page.getByLabel(/^No$/).check();
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
