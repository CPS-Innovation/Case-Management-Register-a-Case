import { type Page, expect } from "@playwright/test";

export class SuspectSummaryPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyUrl() {
    await expect(this.page).toHaveURL(
      "http://localhost:5173/case-registration/suspect-summary",
    );
  }

  async verifyPageElements(h1Text: string) {
    await expect(this.page.locator("h1")).toHaveText(h1Text);
    await expect(this.page.locator("legend").nth(0)).toHaveText(
      "Do you need to add another suspect?",
    );
    await expect(this.page.locator("label").nth(0)).toHaveText("Yes");
    await expect(this.page.locator("label").nth(1)).toHaveText("No");
    await this.verifyCancelLink();
  }

  async errorValidations() {
    this.saveAndContinue();
    await expect(
      this.page.getByTestId("suspect-summary-error-summary"),
    ).toBeVisible();
    await expect(
      this.page.getByTestId("add-more-suspects-radio-link"),
    ).toHaveText("Select whether you need to add another suspect");
    await this.page.getByTestId("add-more-suspects-radio-link").click();
    await expect(
      this.page.locator("#add-more-suspects-radio-yes"),
    ).toBeFocused();
  }

  async verifySuspectSummaryRows(values: string[]) {
    const suspectList = this.page.locator('div[data-testid^="suspect-key-"]');

    expect(suspectList).toHaveCount(values.length);
    await Promise.all(
      values.map(async (value, index) => {
        await expect(
          this.page
            .getByTestId(`suspect-row-${index}`)
            .getByTestId(`suspect-name-${index}`),
        ).toHaveText(value);
        await expect(
          this.page
            .getByTestId(`suspect-row-${index}`)
            .locator("dd")
            .nth(1)
            .getByRole("link", { name: "Change" }),
        ).toHaveAttribute(
          "href",
          `/case-registration/suspect-${index}/add-suspect`,
        );
        await expect(
          this.page
            .getByTestId(`suspect-row-${index}`)
            .locator("dd")
            .nth(1)
            .getByRole("link", { name: "Remove" }),
        ).toHaveAttribute(
          "href",
          "/case-registration/suspect-remove-confirmation",
        );
      }),
    );
  }

  async verifySuspectSummaryDetails(
    suspectIndex: number,
    values: { key: string; value: string | string[] }[],
  ) {
    await expect(
      this.page
        .getByTestId(`suspect-details-${suspectIndex}`)
        .locator("summary"),
    ).toHaveText("Suspect details");
    await this.page
      .getByTestId(`suspect-details-${suspectIndex}`)
      .locator("summary")
      .click();
    await Promise.all(
      values.map(async (value, index) => {
        await expect(
          this.page
            .getByTestId(`suspect-details-${suspectIndex}`)
            .locator(".govuk-summary-list__row")
            .nth(index)
            .locator("dt")
            .nth(0),
        ).toHaveText(value.key);
        await expect(
          this.page
            .getByTestId(`suspect-details-${suspectIndex}`)
            .locator(".govuk-summary-list__row")
            .nth(index)
            .locator("dd")
            .nth(0),
        ).toHaveText(value.value);
      }),
    );
  }

  async verifyNoSuspects() {
    await expect(
      this.page.getByTestId("suspect-aliases-summary-list"),
    ).toHaveCount(0);
    await expect(this.page.locator("h1")).toHaveText(
      "You have added 0 suspect",
    );
    await expect(this.page.locator("legend").nth(0)).toHaveText(
      "Do you need to add a suspect?",
    );
    await expect(this.page.locator("label").nth(0)).toHaveText("Yes");
    await expect(this.page.locator("label").nth(1)).toHaveText("No");
    await this.verifySuspectSummaryRows([]);
  }

  async removeSuspect(index: number) {
    const suspectRow = this.page.getByTestId(`suspect-row-${index}`);

    await suspectRow
      .locator("dd")
      .nth(1)
      .getByRole("link", { name: "Remove" })
      .click();
  }
  async changeSuspect(index: number) {
    const suspectRow = this.page.getByTestId(`suspect-row-${index}`);

    await suspectRow
      .locator("dd")
      .nth(1)
      .getByRole("link", { name: "Change" })
      .click();
  }

  async selectAddMoreSuspectYes() {
    await this.page.getByLabel("Yes").check();
  }
  async selectAddMoreSuspectNo() {
    await this.page.getByLabel("No").check();
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
