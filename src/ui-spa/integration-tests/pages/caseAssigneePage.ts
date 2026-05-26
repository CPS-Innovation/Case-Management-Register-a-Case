import { type Page, expect } from "@playwright/test";

export class CaseAssigneePage {
  private readonly route =
    "http://localhost:5173/case-registration/case-assignee";
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyUrl() {
    await expect(this.page).toHaveURL(this.route);
  }

  async verifyPageElements() {
    await expect(this.page.locator("h1")).toHaveText(
      "Who is working on the case?",
    );
    await expect(this.page.locator("legend").nth(0)).toHaveText(
      "Do you want to add a prosecutor and caseworker?",
    );
    await expect(this.page.locator("legend").nth(1)).toHaveText(
      "Do you want to add a police officer or investigator?",
    );
    await this.verifyCancelLink();
  }

  async errorValidations() {
    await this.verifyErrorSummaryClear();
    await this.saveAndContinue();
    await expect(
      this.page.getByTestId("case-assignee-error-summary"),
    ).toBeVisible();
    await expect(
      this.page.getByTestId("case-prosecutor-radio-link"),
    ).toBeVisible();
    await expect(
      this.page.getByTestId("case-prosecutor-radio-link"),
    ).toHaveText("Select whether you need to add a prosecutor and caseworker");
    await expect(
      this.page.getByTestId("case-investigator-radio-link"),
    ).toBeVisible();
    await expect(
      this.page.getByTestId("case-investigator-radio-link"),
    ).toHaveText(
      "Select whether you need to add a police officer or investigator",
    );
    await this.page.getByTestId("case-prosecutor-radio-link").click();
    await expect(
      this.page.getByTestId("case-prosecutor-radio-yes"),
    ).toBeFocused();
    await this.page.getByTestId("case-investigator-radio-link").click();
    await expect(
      this.page.getByTestId("case-investigator-radio-yes"),
    ).toBeFocused();
    await this.addProsecutorYes();
    await this.saveAndContinue();
    await expect(this.page.getByTestId("case-prosecutor-text-link")).toHaveText(
      "Select a prosecutor or caseworker name",
    );
    await this.enterProsecutorName("Jo");
    await this.enterCaseworkerName("Jo");
    await this.saveAndContinue();
    await expect(
      this.page.getByTestId("case-prosecutor-radio-link"),
    ).not.toBeVisible();
    await expect(this.page.getByTestId("case-prosecutor-text-link")).toHaveText(
      "Select a valid prosecutor name",
    );
    await expect(this.page.getByTestId("case-caseworker-text-link")).toHaveText(
      "Select a valid caseworker name",
    );
    await this.page.getByTestId("case-prosecutor-text-link").click();
    await expect(this.page.locator("#case-prosecutor-text")).toBeFocused();
    await this.page.getByTestId("case-caseworker-text-link").click();
    await expect(this.page.locator("#case-caseworker-text")).toBeFocused();
    await this.enterProsecutorName("Prosecutor A");
    await this.enterCaseworkerName("Caseworker A");
    await this.saveAndContinue();
    await expect(
      this.page.getByTestId("case-prosecutor-text-link"),
    ).not.toBeVisible();
    await expect(
      this.page.getByTestId("case-caseworker-text-link"),
    ).not.toBeVisible();
    await this.addInvestigatorYes();
    await this.saveAndContinue();
    await expect(
      this.page.getByTestId("case-investigator-lastname-text-link"),
    ).toHaveText("Enter the investigator's last name");
    await this.page.getByTestId("case-investigator-lastname-text-link").click();
    await expect(
      this.page.getByTestId("case-investigator-lastname-text"),
    ).toBeFocused();
  }

  async verifyErrorSummaryClear() {
    await expect(
      this.page.getByTestId("case-assignee-error-summary"),
    ).not.toBeVisible();
  }

  async addProsecutorYes() {
    await this.page.getByTestId("case-prosecutor-radio-yes").check();
  }

  async addProsecutorNo() {
    await this.page.getByTestId("case-prosecutor-radio-no").check();
  }

  async enterProsecutorName(value: string) {
    await this.page.locator("#case-prosecutor-text").fill(value);
    await this.page.keyboard.press("Escape");
  }

  async enterCaseworkerName(value: string) {
    await this.page.locator("#case-caseworker-text").fill(value);
    await this.page.keyboard.press("Escape");
  }

  async addInvestigatorYes() {
    await this.page.getByTestId("case-investigator-radio-yes").check();
  }

  async addInvestigatorNo() {
    await this.page.getByTestId("case-investigator-radio-no").check();
  }

  async addInvestigatorTitle(value: string) {
    await this.page.getByTestId("case-investigator-title").selectOption(value);
  }

  async addInvestigatorFirstName(value: string) {
    await this.page.getByTestId("case-investigator-firstname-text").fill(value);
  }

  async addInvestigatorLastName(value: string) {
    await this.page.getByTestId("case-investigator-lastname-text").fill(value);
  }

  async addInvestigatorShoulderNumber(value: string) {
    await this.page
      .getByTestId("case-investigator-shoulder-number-text")
      .fill(value);
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
  async verifyNoBackLink() {
    await expect(
      this.page.getByRole("link", { name: "Back" }),
    ).not.toBeVisible();
  }
  async backLinkClick() {
    await this.page.getByRole("link", { name: "Back" }).click();
  }

  async saveAndContinue() {
    await this.page.getByRole("button", { name: "Save and continue" }).click();
  }
}
