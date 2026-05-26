import { type Page, expect } from "@playwright/test";

export class FirstHearingDetailsPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyUrl() {
    await expect(this.page).toHaveURL(
      "http://localhost:5173/case-registration/first-hearing",
    );
  }

  async verifyPageElements() {
    await expect(this.page.locator("h1")).toHaveText(
      "Do you have details of the first hearing?",
    );
    await expect(this.page.getByLabel("Yes")).toBeVisible();
    await expect(this.page.getByLabel("No")).toBeVisible();
    await this.selectAddFirstHearingDetailsNo();
    await expect(
      this.page.locator("#conditional-first-hearing-radio-yes"),
    ).not.toBeVisible();
    await this.selectAddFirstHearingDetailsYes();
    await expect(
      this.page.locator("#conditional-first-hearing-radio-yes"),
    ).toBeVisible();
    await this.verifyCancelLink();
  }

  async errorValidations() {
    await this.saveAndContinue();
    await expect(
      this.page.getByTestId("first-hearing-error-summary"),
    ).toBeVisible();
    await expect(this.page.getByTestId("first-hearing-radio-link")).toHaveText(
      "Select if you need to add first hearing details",
    );
    await this.page.getByTestId("first-hearing-radio-link").click();
    await expect(this.page.locator("#first-hearing-radio-yes")).toBeFocused();
    await this.selectAddFirstHearingDetailsYes();
    await this.saveAndContinue();
    await expect(
      this.page.getByTestId("first-hearing-error-summary"),
    ).toBeVisible();
    await expect(
      this.page.getByTestId("first-hearing-court-location-text-link"),
    ).toHaveText("Select the court location");
    await this.page
      .getByTestId("first-hearing-court-location-text-link")
      .click();
    await expect(
      this.page.locator("#first-hearing-court-location-text"),
    ).toBeFocused();
    await expect(
      this.page.getByTestId("first-hearing-date-text-link"),
    ).toHaveText("Enter the date of first hearing");
    await this.page.getByTestId("first-hearing-date-text-link").click();
    await expect(this.page.locator("#first-hearing-date-text")).toBeFocused();
    await this.selectAddFirstHearingDetailsYes();
    await this.saveAndContinue();
  }
  async enterFirstHearingCourtLocation(name: string) {
    await this.page.locator("#first-hearing-court-location-text").fill(name);
    await this.page.keyboard.press("Escape");
  }

  async addFirstHearingDate(value: string) {
    await this.page.getByLabel(/^Date$/).fill(value);
  }

  async selectAddFirstHearingDetailsYes() {
    await this.page.getByLabel(/^Yes$/).check();
  }
  async selectAddFirstHearingDetailsNo() {
    await this.page.getByLabel(/^No$/).check();
  }
  async verifyBackLink(url: string) {
    await expect(this.page.getByRole("link", { name: "Back" })).toBeVisible();
    await expect(this.page.getByRole("link", { name: "Back" })).toHaveAttribute(
      "href",
      url,
    );
  }
  async verifyNoBackLink() {
    await expect(
      this.page.getByRole("link", { name: "Back" }),
    ).not.toBeVisible();
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
