import { type Page, expect } from "@playwright/test";

export class AddChargeSuspectPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyUrl() {
    await expect(this.page).toHaveURL(
      "http://localhost:5173/case-registration/add-charge-suspect",
    );
  }

  async verifyPageElements(suspectNames: string[]) {
    await expect(this.page.locator("h1")).toHaveText(
      "Which suspect to do you want to add charges for?",
    );
    await Promise.all(
      suspectNames.map(async (name, index) => {
        await expect(this.page.locator("label").nth(index)).toHaveText(name);
      }),
    );
    await expect(
      this.page.locator("label").nth(suspectNames.length),
    ).toHaveText("Suspect not listed");
    await this.verifyCancelLink();
  }

  async errorValidations() {
    await this.saveAndContinue();
    await expect(
      this.page.getByTestId("add-charge-suspect-error-summary"),
    ).toBeVisible();
    await expect(this.page.getByTestId("suspect-radio-link")).toHaveText(
      "Select which suspect you need to add charges for",
    );
    await this.page.getByTestId("suspect-radio-link").click();
    await expect(this.page.locator("#suspect-radio-0")).toBeFocused();
  }
  async selectSuspectByName(name: string) {
    await this.page.getByLabel(name).check();
  }
  async unSelectSuspectByName(name: string) {
    await this.page.getByLabel(name).uncheck();
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
