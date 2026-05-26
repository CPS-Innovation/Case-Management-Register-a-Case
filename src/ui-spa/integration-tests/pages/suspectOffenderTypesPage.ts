import { type Page, expect } from "@playwright/test";

export class SuspectOffenderTypesPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyUrl(url: string) {
    await expect(this.page).toHaveURL(url);
  }

  async verifyBasePageElements() {
    await expect(this.page.locator("h1")).toHaveText(
      "What type of offender is POTTER, Harry?",
    );
    await expect(this.page.locator("label:visible").nth(0)).toHaveText(
      "Prolific priority offender (PPO)",
    );
    await expect(this.page.locator("label:visible").nth(1)).toHaveText(
      "Prolific youth offender (PYO)",
    );
    await expect(this.page.locator("label:visible").nth(2)).toHaveText(
      "Youth offender (YO)",
    );
    await this.verifyCancelLink();
  }

  async verifyPYOElements() {
    await this.selectOffenderTypePYO();

    await expect(
      this.page.locator("#conditional-suspect-offender-radio-1 label"),
    ).toHaveText("Arrest date (optional)");
    await expect(
      this.page.locator(
        "#conditional-suspect-offender-radio-1 input[type='date']",
      ),
    ).toBeVisible();
  }
  async verifyYOElements() {
    await this.selectOffenderTypeYO();

    await expect(
      this.page.locator("#conditional-suspect-offender-radio-2 label"),
    ).toHaveText("Arrest date (optional)");
    await expect(
      this.page.locator(
        "#conditional-suspect-offender-radio-2 input[type='date']",
      ),
    ).toBeVisible();
  }

  async errorValidations() {
    await this.saveAndContinue();
    await expect(
      this.page.getByTestId("suspect-offender-types-error-summary"),
    ).toBeVisible();
    await expect(
      this.page.getByTestId("suspect-offender-radio-link"),
    ).toHaveText("Select the type of offender");
    await this.page.getByTestId("suspect-offender-radio-link").click();
    await expect(this.page.locator("#suspect-offender-radio-0")).toBeFocused();
  }
  async selectOffenderTypePPO() {
    await this.page.getByLabel(/^Prolific priority offender \(PPO\)$/).check();
  }
  async selectOffenderTypePYO() {
    await this.page.getByLabel(/^Prolific youth offender \(PYO\)$/).check();
  }
  async selectOffenderTypeYO() {
    await this.page.getByLabel(/^Youth offender \(YO\)$/).check();
  }
  async addArrestDate(value: string) {
    await this.page.getByLabel(/^Arrest date \(optional\)$/).fill(value);
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
