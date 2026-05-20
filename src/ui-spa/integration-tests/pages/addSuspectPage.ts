import { type Page, expect } from "@playwright/test";

export class AddSuspectPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyUrl(url: string) {
    await expect(this.page).toHaveURL(url);
  }

  async verifyBasePageElements() {
    await expect(this.page.locator("h1")).toHaveText("Add a suspect");
    await expect(this.page.locator(".govuk-hint ").nth(0)).toHaveText(
      "Choose the type of suspect you want to add",
    );
    await this.verifyCancelLink();
  }

  async verifyAdditionalElements() {
    await expect(this.page.locator("legend").nth(1)).toHaveText(
      "Do you want to add any additional details about this suspect?",
    );
    const labels = await this.page
      .getByTestId("suspect-additional-details-checkboxes")
      .locator(`label`)
      .allInnerTexts();
    expect(labels).toEqual([
      "Date of birth",
      "Gender",
      "Disability",
      "Religion",
      "Ethnicity",
      "Alias details",
      "Arrest Summons Number (ASN)",
      "Type of offender",
    ]);
  }

  async verifySelectedAdditionalDetails(checkedValues: string[]) {
    const selectedLabels = await this.page
      .getByTestId("suspect-additional-details-checkboxes")
      .locator(`input:checked + label`)
      .allInnerTexts();
    expect(selectedLabels).toEqual(checkedValues);
  }

  async verifyPersonSuspectSelected(firstName: string, lastName: string) {
    await expect(
      this.page.getByRole("radio", { name: "Person" }),
    ).toBeChecked();
    await expect(
      this.page.getByRole("radio", { name: "Company" }),
    ).not.toBeChecked();
    await expect(this.page.getByLabel("Last name")).toHaveValue(lastName);
    await expect(this.page.getByLabel("First name")).toHaveValue(firstName);
  }

  async verifyCompanySuspectSelected(companyName: string) {
    await expect(
      this.page.getByRole("radio", { name: "Company" }),
    ).toBeChecked();
    await expect(
      this.page.getByRole("radio", { name: "Person" }),
    ).not.toBeChecked();
    await expect(this.page.getByLabel("Company name")).toHaveValue(companyName);
  }

  async errorValidations() {
    await this.saveAndContinue();
    await expect(
      this.page.getByTestId("add-suspect-error-summary"),
    ).toBeVisible();
    await expect(this.page.getByTestId("add-suspect-radio-link")).toHaveText(
      "Select whether the suspect is a person or a company",
    );
    await this.page.getByTestId("add-suspect-radio-link").click();
    await expect(this.page.getByTestId("add-suspect-radio-yes")).toBeFocused();
    await this.addPersonSuspect();
    await this.saveAndContinue();
    await expect(
      this.page.getByTestId("add-suspect-error-summary"),
    ).toBeVisible();
    await expect(
      this.page.getByTestId("suspect-last-name-text-link"),
    ).toHaveText("Enter the last name");
    await this.page.getByTestId("suspect-last-name-text-link").click();
    await expect(this.page.getByTestId("suspect-last-name-text")).toBeFocused();
  }

  async addPersonSuspect() {
    await this.page.getByRole("radio", { name: "Person" }).check();
  }
  async addCompanySuspect() {
    await this.page.getByRole("radio", { name: "Company" }).check();
  }
  async addSuspectFirstName(name: string) {
    await this.page.getByLabel("First name").fill(name);
  }

  async addSuspectLastName(name: string) {
    await this.page.getByLabel("Last name").fill(name);
  }

  async addSuspectCompanyName(name: string) {
    await this.page.getByLabel("Company name").fill(name);
  }

  async selectAdditionalDetailsDOB(check: boolean) {
    if (check) {
      await this.page.getByLabel("Date of birth").check();
      return;
    }
    await this.page.getByLabel("Date of birth").uncheck();
  }

  async selectAdditionalDetailsGender(check: boolean) {
    if (check) {
      await this.page.getByLabel("Gender").check();
      return;
    }
    await this.page.getByLabel("Gender").uncheck();
  }

  async selectAdditionalDetailsDisability(check: boolean) {
    if (check) {
      await this.page.getByLabel("Disability").check();
      return;
    }
    await this.page.getByLabel("Disability").uncheck();
  }

  async selectAdditionalDetailsReligion(check: boolean) {
    if (check) {
      await this.page.getByLabel("Religion").check();
      return;
    }
    await this.page.getByLabel("Religion").uncheck();
  }

  async selectAdditionalDetailsEthnicity(check: boolean) {
    if (check) {
      await this.page.getByLabel("Ethnicity").check();
      return;
    }
    await this.page.getByLabel("Ethnicity").uncheck();
  }

  async selectAdditionalDetailsAlias(check: boolean) {
    if (check) {
      await this.page.getByLabel("Alias details").check();
      return;
    }
    await this.page.getByLabel("Alias details").uncheck();
  }

  async selectAdditionalDetailsASN(check: boolean) {
    if (check) {
      await this.page.getByLabel("Arrest Summons Number (ASN)").check();
      return;
    }
    await this.page.getByLabel("Arrest Summons Number (ASN)").uncheck();
  }

  async selectAdditionalDetailsOffenderType(check: boolean) {
    if (check) {
      await this.page.getByLabel("Type of offender").check();
      return;
    }
    await this.page.getByLabel("Type of offender").uncheck();
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
