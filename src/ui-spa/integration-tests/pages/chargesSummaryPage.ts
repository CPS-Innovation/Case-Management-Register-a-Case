import { type Page, expect } from "@playwright/test";

export class ChargesSummaryPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyUrl() {
    await expect(this.page).toHaveURL(
      "http://localhost:5173/case-registration/charges-summary",
    );
  }

  async verifyPageElements(h1Text: string) {
    await expect(this.page.locator("h1")).toHaveText(h1Text);
    await expect(this.page.locator("legend").nth(0)).toHaveText(
      "Do you need to add another charge?",
    );
    await expect(this.page.locator("label").nth(0)).toHaveText("Yes");
    await expect(this.page.locator("label").nth(1)).toHaveText("No");
    await expect(this.page.getByTestId("charges-summary")).toBeVisible();
    await this.verifyCancelLink();
  }

  async errorValidations() {
    await this.saveAndContinue();
    await expect(
      this.page.getByTestId("charges-summary-error-summary"),
    ).toBeVisible();
    await expect(
      this.page.getByTestId("add-more-charges-radio-link"),
    ).toHaveText("Select whether you need to add another charge");
    await this.page.getByTestId("add-more-charges-radio-link").click();
    await expect(
      this.page.locator("#add-more-charges-radio-yes"),
    ).toBeFocused();
  }

  async verifyChargesSummaryRow(
    value: {
      suspectName: string;
      charges: {
        offenceCode: string;
        offenceDescription: string;
        chargeDetails: {
          dateOfOffence: string;
          victim: {
            name: string;
            properties: string;
          };
        };
      }[];
    },
    rowIndex: number,
  ) {
    const suspectChargeSummary = this.page.getByTestId(
      `charges-summary-suspect-${rowIndex}`,
    );
    await expect(suspectChargeSummary.locator("h2")).toHaveText(
      `Charges for ${value.suspectName}`,
    );
    await Promise.all(
      value.charges.map(async (charge, index) => {
        await expect(
          suspectChargeSummary
            .getByTestId(`charge-${index}-data`)
            .locator("dt")
            .nth(0),
        ).toHaveText(charge.offenceCode);
        await expect(
          suspectChargeSummary
            .getByTestId(`charge-${index}-data`)
            .locator("dd")
            .nth(0),
        ).toHaveText(charge.offenceDescription);

        await expect(
          suspectChargeSummary
            .getByTestId(`charge-${index}-data`)
            .locator("dd")
            .nth(1)
            .getByRole("link", { name: "Remove" }),
        ).toHaveAttribute(
          "href",
          "/case-registration/charge-remove-confirmation",
        );

        await expect(
          suspectChargeSummary
            .getByTestId(`charge-${index}-details-button`)
            .locator("summary"),
        ).toHaveText("View charge details");
        await expect(
          suspectChargeSummary.getByTestId(`charge-${index}-details`),
        ).not.toBeVisible();
        await suspectChargeSummary
          .getByTestId(`charge-${index}-details-button`)
          .locator("summary")
          .click();
        // await expect(
        //   suspectChargeSummary.getByTestId(`charge-${index}-details`),
        // ).toBeVisible();
        await expect(
          suspectChargeSummary
            .getByTestId(`charge-${index}-details`)
            .locator("dt")
            .nth(0),
        ).toHaveText("Date of offence");
        await expect(
          suspectChargeSummary
            .getByTestId(`charge-${index}-details`)
            .locator("dd")
            .nth(0),
        ).toHaveText(charge.chargeDetails.dateOfOffence);
        await expect(
          suspectChargeSummary
            .getByTestId(`charge-${index}-details`)
            .locator("dt")
            .nth(1),
        ).toHaveText("Victim");
        await expect(
          suspectChargeSummary
            .getByTestId(`charge-${index}-details`)
            .locator("dd")
            .nth(1),
        ).toHaveText(
          `${charge.chargeDetails.victim.name}${charge.chargeDetails.victim.properties}`,
        );
      }),
    );
  }

  async verifyNoCharges() {
    await expect(
      this.page.getByTestId("suspect-aliases-summary-list"),
    ).toHaveCount(0);
    await expect(this.page.locator("h1")).toHaveText(
      "You have added 0 charges",
    );
    await expect(this.page.locator("legend").nth(0)).toHaveText(
      "Do you need to add a charge?",
    );
    await expect(this.page.locator("label").nth(0)).toHaveText("Yes");
    await expect(this.page.locator("label").nth(1)).toHaveText("No");
    await expect(this.page.getByTestId("charges-summary")).not.toBeVisible();
  }

  async removeSuspectCharge(suspectIndex: number, chargeIndex: number) {
    const suspectChargeSummary = this.page.getByTestId(
      `charges-summary-suspect-${suspectIndex}`,
    );
    await suspectChargeSummary
      .getByTestId(`charge-${chargeIndex}-data`)
      .locator("dd")
      .nth(1)
      .getByRole("link", { name: "Remove" })
      .click();
  }

  async selectAddMoreChargesYes() {
    await this.page.getByLabel("Yes").check();
  }
  async selectAddMoreChargesNo() {
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
