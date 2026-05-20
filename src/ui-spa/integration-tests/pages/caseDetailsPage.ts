import { type Page, expect } from "@playwright/test";

export class CaseDetailsPage {
  private readonly route =
    "http://localhost:5173/case-registration/case-details";
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyUrl() {
    await expect(this.page).toHaveURL(this.route);
  }

  async verifyPageElements() {
    await expect(this.page.locator("h1")).toHaveText("Case details");
    await expect(this.page.locator("legend").first()).toHaveText(
      "What is the URN?",
    );
    await expect(this.page.locator("label").nth(0)).toHaveText("Police force");
    await expect(this.page.locator("label").nth(1)).toHaveText("Police unit");
    await expect(this.page.locator("label").nth(2)).toHaveText(
      "Unique reference",
    );
    await expect(this.page.locator("label").nth(3)).toHaveText(
      "Year reference",
    );
    await expect(this.page.locator("label").nth(4)).toHaveText(
      "What is the registering unit?",
    );
    await expect(this.page.locator("label").nth(5)).toHaveText(
      "What is the witness care unit (WCU)?",
    );
    await expect(this.page.getByTestId("urn-year-reference-text")).toHaveValue(
      "26",
    );
    await this.verifyCancelLink();
  }

  async errorValidations() {
    await this.enterUrnYearReference("");
    await this.verifyErrorSummaryClear();
    this.saveAndContinue();

    await expect(
      this.page.getByTestId("case-details-error-summary"),
    ).toBeVisible();
    await expect(this.page.getByTestId("urn-error-text-link")).toBeVisible();
    await expect(this.page.getByTestId("urn-error-text-link")).toHaveText(
      "Enter the URN",
    );
    await expect(
      this.page.getByTestId("registering-unit-error-text-link"),
    ).toBeVisible();
    await expect(
      this.page.getByTestId("registering-unit-error-text-link"),
    ).toHaveText("Select the registering unit");
    await expect(
      this.page.getByTestId("witness-care-unit-error-text-link"),
    ).toBeVisible();
    await expect(
      this.page.getByTestId("witness-care-unit-error-text-link"),
    ).toHaveText("Select the witness care unit");

    await this.page.getByTestId("urn-error-text-link").click();
    await expect(this.page.getByTestId("urn-police-force-text")).toBeFocused();
    await this.enterUrnPoliceForce("12");
    await this.page.getByRole("button", { name: "Save and continue" }).click();
    await this.page.getByTestId("urn-error-text-link").click();
    await expect(this.page.getByTestId("urn-police-unit-text")).toBeFocused();
    await this.enterUrnPoliceUnit("21");
    await this.page.getByRole("button", { name: "Save and continue" }).click();
    await this.page.getByTestId("urn-error-text-link").click();
    await expect(
      this.page.getByTestId("urn-unique-reference-text"),
    ).toBeFocused();
    await this.enterUrnUniqueReference("12345");
    await this.page.getByRole("button", { name: "Save and continue" }).click();
    await this.page.getByTestId("urn-error-text-link").click();
    await expect(
      this.page.getByTestId("urn-year-reference-text"),
    ).toBeFocused();
    await this.enterUrnYearReference("26");
    await this.page.getByRole("button", { name: "Save and continue" }).click();
    await expect(
      this.page.getByTestId("urn-error-text-link"),
    ).not.toBeVisible();

    await this.page.getByTestId("registering-unit-error-text-link").click();
    await expect(this.page.locator("#registering-unit-text")).toBeFocused();
    await this.enterRegisteringUnit("abc");
    await this.page.getByRole("button", { name: "Save and continue" }).click();
    await expect(
      this.page.getByTestId("registering-unit-error-text-link"),
    ).toHaveText("Select a valid registering unit");
    await this.page.getByTestId("registering-unit-error-text-link").click();
    await expect(this.page.locator("#registering-unit-text")).toBeFocused();
    await this.enterRegisteringUnit("NORTHERN CJU (Peterborough)");
    await this.page.getByRole("button", { name: "Save and continue" }).click();
    await expect(
      this.page.getByTestId("registering-unit-error-text-link"),
    ).not.toBeVisible();

    await this.page.getByTestId("witness-care-unit-error-text-link").click();
    await expect(this.page.locator("#witness-care-unit-text")).toBeFocused();
    await this.enterWitnessCareUnit("abc");
    await this.page.getByRole("button", { name: "Save and continue" }).click();
    await expect(
      this.page.getByTestId("witness-care-unit-error-text-link"),
    ).toHaveText("Select a valid witness care unit");
    await this.page.getByTestId("witness-care-unit-error-text-link").click();
    await expect(this.page.locator("#witness-care-unit-text")).toBeFocused();
  }

  async verifyErrorSummaryClear() {
    await expect(
      this.page.getByTestId("case-details-error-summary"),
    ).not.toBeVisible();
  }

  async enterUrnPoliceForce(value: string) {
    await this.page.locator("#urn-police-force-text").fill(value);
  }
  async enterUrnPoliceUnit(value: string) {
    await this.page.locator("#urn-police-unit-text").fill(value);
  }
  async enterUrnUniqueReference(value: string) {
    await this.page.locator("#urn-unique-reference-text").fill(value);
  }
  async enterUrnYearReference(value: string) {
    await this.page.locator("#urn-year-reference-text").fill(value);
  }
  async enterRegisteringUnit(value: string) {
    await this.page.locator("#registering-unit-text").fill(value);
    await this.page.keyboard.press("Escape");
  }
  async enterWitnessCareUnit(value: string) {
    await this.page.locator("#witness-care-unit-text").fill(value);
    await this.page.keyboard.press("Escape");
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
