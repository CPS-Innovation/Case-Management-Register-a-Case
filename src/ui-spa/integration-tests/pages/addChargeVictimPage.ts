import { type Page, expect } from "@playwright/test";

export class AddChargeVictimPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyUrl(url: string) {
    await expect(this.page).toHaveURL(url);
  }

  async verifyPageElements(name: string, charge: string) {
    await expect(this.page.locator("h1")).toHaveText(
      "Add a victim to this charge",
    );
    await expect(this.page.locator("h2").nth(0)).toHaveText(name);
    await expect(this.page.locator("h2").nth(1)).toHaveText(charge);
    await this.verifyCancelLink();
  }
  async verifyAddFirstVictimElements() {
    await expect(
      this.page.getByLabel("Victim first name (optional)"),
    ).toBeVisible();
    await expect(this.page.getByLabel("Victim last name")).toBeVisible();
    await expect(this.page.locator("fieldset legend")).toHaveText(
      "Victim details (optional)",
    );
    await expect(
      this.page.getByLabel("The victim is vulnerable"),
    ).toBeVisible();
    await expect(
      this.page.getByLabel("The victim has been intimidated"),
    ).toBeVisible();
    await expect(this.page.getByLabel("The victim is a witness")).toBeVisible();
    await expect(this.page.getByLabel("The victim is a witness")).toBeChecked();
  }

  async verifyAddMoreVictimElements(victimNames: string[]) {
    await Promise.all(
      victimNames.map(async (name) => {
        await expect(this.page.getByLabel(name)).toBeVisible();
      }),
    );
    await expect(this.page.getByLabel("Add new victim")).toBeVisible();
    await this.selectVictimByName("SMITH, Steve");
    const selectedVictimAdditionalDetails = this.page.locator(
      "#conditional-add-victim-radio-0",
    );
    await expect(
      selectedVictimAdditionalDetails.getByLabel("The victim is vulnerable"),
    ).toBeVisible();
    await expect(
      selectedVictimAdditionalDetails.getByLabel(
        "The victim has been intimidated",
      ),
    ).toBeVisible();
    await expect(
      selectedVictimAdditionalDetails.getByLabel("The victim is a witness"),
    ).toBeVisible();
    await expect(this.page.getByTestId("new-victim-fields")).not.toBeVisible();
    await expect(
      this.page
        .locator("#conditional-add-victim-radio-add-new-victim")
        .getByTestId("victim-additional-details-checkboxes"),
    ).not.toBeVisible();

    await this.selectVictimByName("Add new victim");
    await expect(this.page.getByTestId("new-victim-fields")).toBeVisible();
    await expect(
      this.page
        .locator("#conditional-add-victim-radio-add-new-victim")
        .getByTestId("victim-additional-details-checkboxes"),
    ).toBeVisible();
    await expect(
      this.page.getByLabel("Victim first name (optional)"),
    ).toBeVisible();

    await expect(this.page.getByLabel("Victim last name")).toBeVisible();

    const newVictimAdditionalDetails = this.page.locator(
      "#conditional-add-victim-radio-add-new-victim",
    );
    await expect(
      newVictimAdditionalDetails.getByLabel("The victim is vulnerable"),
    ).toBeVisible();
    await expect(
      newVictimAdditionalDetails.getByLabel("The victim has been intimidated"),
    ).toBeVisible();
    await expect(
      newVictimAdditionalDetails.getByLabel("The victim is a witness"),
    ).toBeVisible();
    await expect(
      newVictimAdditionalDetails.getByLabel("The victim is a witness"),
    ).toBeChecked();
  }

  async errorValidationsNewVictims() {
    await this.saveAndContinue();
    await expect(
      this.page.getByTestId("add-charge-victim-error-summary"),
    ).toBeVisible();
    await expect(this.page.getByTestId("victim-lastname-link")).toHaveText(
      "Enter the victim's last name",
    );
    await this.page.getByTestId("victim-lastname-link").click();
    await expect(this.page.locator("#victim-lastname-text")).toBeFocused();
  }
  async errorValidationsSelectVictims() {
    await this.saveAndContinue();
    await expect(this.page.getByTestId("victim-radio-link")).toHaveText(
      "Select an option",
    );
    await this.page.getByTestId("victim-radio-link").click();
    await expect(this.page.locator("#add-victim-radio-0")).toBeFocused();
    await this.selectVictimByName("Add new victim");
    await this.saveAndContinue();
    await expect(
      this.page.getByTestId("add-charge-victim-error-summary"),
    ).toBeVisible();
    await expect(this.page.getByTestId("victim-lastname-link")).toHaveText(
      "Enter the victim's last name",
    );
    await this.page.getByTestId("victim-lastname-link").click();
    await expect(this.page.locator("#victim-lastname-text")).toBeFocused();
  }

  async fillVictimFirstName(name: string) {
    await this.page.locator("#victim-firstname-text").fill(name);
  }
  async fillVictimLastName(name: string) {
    await this.page.locator("#victim-lastname-text").fill(name);
  }

  async selectVictimIsVulnerable(checked: boolean) {
    const label = this.page.locator(
      "label:has-text('The victim is vulnerable'):visible",
    );
    if (checked) {
      await label.check();
      return;
    }
    await label.uncheck();
  }

  async selectVictimIsIntimidated(checked: boolean) {
    const label = this.page.locator(
      "label:has-text('The victim has been intimidated'):visible",
    );
    if (checked) {
      await label.check();
      return;
    }
    await label.uncheck();
  }

  async selectVictimIsWitness(checked: boolean) {
    const label = this.page.locator(
      "label:has-text('The victim is a witness'):visible",
    );
    if (checked) {
      await label.check();
      return;
    }
    await label.uncheck();
  }

  async selectVictimByName(name: string) {
    await this.page.getByLabel(name).check();
  }
  async unSelectVictimByName(name: string) {
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
