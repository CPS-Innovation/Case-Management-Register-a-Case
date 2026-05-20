import { type Page, expect } from "@playwright/test";

export class CaseRegistrationSummaryPage {
  private readonly route =
    "http://localhost:5173/case-registration/case-summary";
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyUrl() {
    await expect(this.page).toHaveURL(this.route);
  }

  async verifyBackLink(url: string) {
    await expect(this.page.getByRole("link", { name: "Back" })).toBeVisible();
    await expect(this.page.getByRole("link", { name: "Back" })).toHaveAttribute(
      "href",
      url,
    );
  }
  async backLinkClick() {
    await this.page.getByRole("link", { name: "Back" }).click();
  }

  async errorValidations() {
    await expect(
      this.page.getByTestId("case-summary-error-summary"),
    ).toBeVisible();
    await expect(this.page.getByTestId("urn-error-change-link")).toHaveText(
      "URN already exists, please change urn and try again",
    );
    await this.page.getByTestId("urn-error-change-link").click();
    await expect(this.page.locator("#change-urn-link")).toBeFocused();
  }

  async verifyErrorSummaryCleared() {
    await expect(
      this.page.getByTestId("case-summary-error-summary"),
    ).not.toBeVisible();
  }

  async verifyPageElements() {
    await expect(this.page.locator("h1")).toHaveText(
      "Check your answers before creating the case",
    );
    await this.verifyCancelLink();
  }

  async verifyCaseDetailsElements(values: {
    area: string;
    urn: string;
    registeringUnit: string;
    wcu: string;
    operationName: string;
  }) {
    const caseDetailWrapperElement = this.page.getByTestId(
      "case-details-summary",
    );
    await expect(caseDetailWrapperElement.locator("h2").nth(0)).toHaveText(
      "Case details",
    );
    const rows = caseDetailWrapperElement.locator(".govuk-summary-list__row");
    await expect(rows.nth(0).locator("dt").nth(0)).toHaveText("Area");
    await expect(rows.nth(0).locator("dd").nth(0)).toHaveText(values.area);
    const areaChangeLink = rows
      .nth(0)
      .locator("dd")
      .nth(1)
      .getByRole("link", { name: "Change" });
    await expect(areaChangeLink).toHaveAttribute(
      "href",
      "/case-registration/areas",
    );

    await expect(rows.nth(1).locator("dt").nth(0)).toHaveText("URN");
    await expect(rows.nth(1).locator("dd").nth(0)).toHaveText(values.urn);
    const urnChangeLink = rows
      .nth(1)
      .locator("dd")
      .nth(1)
      .getByRole("link", { name: "Change" });
    await expect(urnChangeLink).toHaveAttribute(
      "href",
      "/case-registration/case-details",
    );

    await expect(rows.nth(2).locator("dt").nth(0)).toHaveText(
      "Registering unit",
    );
    await expect(rows.nth(2).locator("dd").nth(0)).toHaveText(
      values.registeringUnit,
    );
    const registeringUnitChangeLink = rows
      .nth(2)
      .locator("dd")
      .nth(1)
      .getByRole("link", { name: "Change" });
    await expect(registeringUnitChangeLink).toHaveAttribute(
      "href",
      "/case-registration/case-details",
    );

    await expect(rows.nth(3).locator("dt").nth(0)).toHaveText("WCU");
    await expect(rows.nth(3).locator("dd").nth(0)).toHaveText(values.wcu);
    const wcuChangeLink = rows
      .nth(3)
      .locator("dd")
      .nth(1)
      .getByRole("link", { name: "Change" });
    await expect(wcuChangeLink).toHaveAttribute(
      "href",
      "/case-registration/case-details",
    );

    await expect(rows.nth(4).locator("dt").nth(0)).toHaveText("Operation name");
    await expect(rows.nth(4).locator("dd").nth(0)).toHaveText(
      values.operationName,
    );
    const operationNameChangeLink = rows
      .nth(4)
      .locator("dd")
      .nth(1)
      .getByRole("link", { name: "Change" });
    await expect(operationNameChangeLink).toHaveAttribute(
      "href",
      "/case-registration",
    );
  }

  async verifyNoSuspectElements() {
    await expect(
      this.page.getByTestId("case-suspect-summary"),
    ).not.toBeVisible();
  }

  async verifyAddNewSuspectElements(suspectsLength: number) {
    const caseDetailWrapperElement = this.page.getByTestId(
      "case-details-summary",
    );
    const rows = caseDetailWrapperElement.locator(".govuk-summary-list__row");
    await expect(rows.nth(5).locator("dt").nth(0)).toHaveText("Suspects");
    if (!suspectsLength) {
      await expect(rows.nth(5).locator("dd").nth(0)).toHaveText("Not entered");
    }
    if (suspectsLength === 1) {
      await expect(rows.nth(5).locator("dd").nth(0)).toHaveText(
        "1 suspect added",
      );
    }
    if (suspectsLength > 1) {
      await expect(rows.nth(5).locator("dd").nth(0)).toHaveText(
        `${suspectsLength} suspects added`,
      );
    }
    const operationNameChangeLink = rows
      .nth(5)
      .locator("dd")
      .nth(1)
      .getByRole("link", { name: "Add a suspect" });
    await expect(operationNameChangeLink).toHaveAttribute(
      "href",
      `/case-registration/suspect-${suspectsLength}/add-suspect`,
    );
  }

  async verifyComplexityAndMonitoringCodesElements(values: {
    complexity: string;
    monitoringCodes: string[];
  }) {
    const caseComplexityWrapperElement = this.page.getByTestId(
      "case-complexity-and-monitoring-codes-summary",
    );
    await expect(caseComplexityWrapperElement.locator("h2")).toHaveText(
      "Case complexity and monitoring codes",
    );
    const rows = caseComplexityWrapperElement.locator(
      ".govuk-summary-list__row",
    );
    await expect(rows.nth(0).locator("dt").nth(0)).toHaveText(
      "Case complexity",
    );
    await expect(rows.nth(0).locator("dd").nth(0)).toHaveText(
      values.complexity,
    );
    const complexityChangeLink = rows
      .nth(0)
      .locator("dd")
      .nth(1)
      .getByRole("link", { name: "Change" });
    await expect(complexityChangeLink).toHaveAttribute(
      "href",
      "/case-registration/case-complexity",
    );
    await expect(rows.nth(1).locator("dt").nth(0)).toHaveText(
      "Monitoring codes",
    );
    const monitoringCodes = await rows
      .nth(1)
      .locator("dd")
      .nth(0)
      .locator("li")
      .allTextContents();
    expect(monitoringCodes).toEqual(values.monitoringCodes);
    const monitoringCodesChangeLink = rows
      .nth(1)
      .locator("dd")
      .nth(1)
      .getByRole("link", { name: "Change" });
    await expect(monitoringCodesChangeLink).toHaveAttribute(
      "href",
      "/case-registration/case-monitoring-codes",
    );
  }

  async verifyWorkingOnTheCaseElements(
    values: {
      prosecutor: string;
      caseworker: string;
      investigator: string;
      shoulderNumber: string;
      policeUnit: string;
    },
    investigatorDetailsEntered: boolean = true,
  ) {
    const caseAssigneeWrapperElement = this.page.getByTestId(
      "case-assignee-summary",
    );
    await expect(caseAssigneeWrapperElement.locator("h2")).toHaveText(
      "Working on the case",
    );
    const rows = caseAssigneeWrapperElement.locator(".govuk-summary-list__row");
    await expect(rows.nth(0).locator("dt").nth(0)).toHaveText("Prosecutor");
    await expect(rows.nth(0).locator("dd").nth(0)).toHaveText(
      values.prosecutor,
    );
    const prosecutorChangeLink = rows
      .nth(0)
      .locator("dd")
      .nth(1)
      .getByRole("link", { name: "Change" });
    await expect(prosecutorChangeLink).toHaveAttribute(
      "href",
      "/case-registration/case-assignee",
    );

    await expect(rows.nth(1).locator("dt").nth(0)).toHaveText("Caseworker");
    await expect(rows.nth(1).locator("dd").nth(0)).toHaveText(
      values.caseworker,
    );
    const caseworkerChangeLink = rows
      .nth(1)
      .locator("dd")
      .nth(1)
      .getByRole("link", { name: "Change" });
    await expect(caseworkerChangeLink).toHaveAttribute(
      "href",
      "/case-registration/case-assignee",
    );

    await expect(rows.nth(2).locator("dt").nth(0)).toHaveText(
      "Police officer or investigator",
    );
    await expect(rows.nth(2).locator("dd").nth(0)).toHaveText(
      values.investigator,
    );
    if (investigatorDetailsEntered) {
      const investigatorChangeLink = rows
        .nth(2)
        .locator("dd")
        .nth(1)
        .getByRole("link", { name: "Change" });
      await expect(investigatorChangeLink).toHaveAttribute(
        "href",
        "/case-registration/case-assignee",
      );

      await expect(rows.nth(3).locator("dt").nth(0)).toHaveText(
        "Shoulder number",
      );
      await expect(rows.nth(3).locator("dd").nth(0)).toHaveText(
        values.shoulderNumber,
      );
      const shoulderNumberChangeLink = rows
        .nth(3)
        .locator("dd")
        .nth(1)
        .getByRole("link", { name: "Change" });
      await expect(shoulderNumberChangeLink).toHaveAttribute(
        "href",
        "/case-registration/case-assignee",
      );

      await expect(rows.nth(4).locator("dt").nth(0)).toHaveText("Police unit");
      await expect(rows.nth(4).locator("dd").nth(0)).toHaveText(
        values.policeUnit,
      );
      const policeUnitChangeLink = rows
        .nth(4)
        .locator("dd")
        .nth(1)
        .getByRole("link", { name: "Change" });
      await expect(policeUnitChangeLink).toHaveAttribute(
        "href",
        "/case-registration/case-assignee",
      );
    }
  }

  async verifyFirstHearingElements(values: {
    courtLocation: string;
    firstHearingDate: string;
  }) {
    const caseFirstHearingWrapperElement = this.page.getByTestId(
      "case-first-hearing-summary",
    );
    await expect(caseFirstHearingWrapperElement.locator("h2")).toHaveText(
      "First hearing details",
    );
    const rows = caseFirstHearingWrapperElement.locator(
      ".govuk-summary-list__row",
    );
    await expect(rows.nth(0).locator("dt").nth(0)).toHaveText(
      "First hearing court location",
    );
    await expect(rows.nth(0).locator("dd").nth(0)).toHaveText(
      values.courtLocation,
    );
    const courtLocationChangeLink = rows
      .nth(0)
      .locator("dd")
      .nth(1)
      .getByRole("link", { name: "Change" });
    await expect(courtLocationChangeLink).toHaveAttribute(
      "href",
      "/case-registration/first-hearing",
    );
    await expect(rows.nth(1).locator("dt").nth(0)).toHaveText(
      "First hearing date",
    );
    await expect(rows.nth(1).locator("dd").nth(0)).toHaveText(
      values.firstHearingDate,
    );
    const firstHearingDateLink = rows
      .nth(1)
      .locator("dd")
      .nth(1)
      .getByRole("link", { name: "Change" });
    await expect(firstHearingDateLink).toHaveAttribute(
      "href",
      "/case-registration/first-hearing",
    );
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
    suspectType: "person" | "company" = "person",
  ) {
    const summaryText =
      suspectType === "person" ? "Details and charges" : "Charges";
    await expect(
      this.page
        .getByTestId(`suspect-details-${suspectIndex}`)
        .locator("summary"),
    ).toHaveText(summaryText);

    const suspectAdditionDetails = this.page
      .getByTestId(`suspect-details-${suspectIndex}`)
      .getByTestId(`suspect-additional-details`);

    if (!values.length) {
      await expect(suspectAdditionDetails).not.toBeVisible();
      return;
    }

    await expect(suspectAdditionDetails.locator("h3").nth(0)).toHaveText(
      "Suspect details",
    );
    await this.page
      .getByTestId(`suspect-details-${suspectIndex}`)
      .locator("summary")
      .click();
    await Promise.all(
      values.map(async (value, index) => {
        await expect(
          suspectAdditionDetails
            .locator(".govuk-summary-list__row")
            .nth(index)
            .locator("dt")
            .nth(0),
        ).toHaveText(value.key);
        await expect(
          suspectAdditionDetails
            .locator(".govuk-summary-list__row")
            .nth(index)
            .locator("dd")
            .nth(0),
        ).toHaveText(value.value);
      }),
    );
    await this.page
      .getByTestId(`suspect-details-${suspectIndex}`)
      .locator("summary")
      .click();
  }

  async verifyChargesSummaryDetails(
    suspectIndex: number,
    values: { key: string; value: string | string[] }[],
    suspectType: "person" | "company" = "person",
  ) {
    const summaryText =
      suspectType === "person" ? "Details and charges" : "Charges";
    await expect(
      this.page
        .getByTestId(`suspect-details-${suspectIndex}`)
        .locator("summary"),
    ).toHaveText(summaryText);

    const suspectChargesDetails = this.page
      .getByTestId(`suspect-details-${suspectIndex}`)
      .getByTestId(`suspect-charges`);

    if (!values.length) {
      await expect(suspectChargesDetails).not.toBeVisible();
      return;
    }

    await expect(suspectChargesDetails.locator("h3").nth(0)).toHaveText(
      "Charges",
    );
    await this.page
      .getByTestId(`suspect-details-${suspectIndex}`)
      .locator("summary")
      .click();
    await Promise.all(
      values.map(async (value, index) => {
        await expect(
          suspectChargesDetails
            .locator(".govuk-summary-list__row")
            .nth(index)
            .locator("dt")
            .nth(0),
        ).toHaveText(value.key);
        await expect(
          suspectChargesDetails
            .locator(".govuk-summary-list__row")
            .nth(index)
            .locator("dd")
            .nth(0),
        ).toHaveText(value.value);
      }),
    );
    await this.page
      .getByTestId(`suspect-details-${suspectIndex}`)
      .locator("summary")
      .click();
  }

  async verifyAddNewChargeDetails(
    suspectIndex: number,
    link: string,
    suspectType: "person" | "company" = "person",
    hasCharges: boolean = true,
  ) {
    const summaryText =
      suspectType === "person" ? "Details and charges" : "Charges";
    await expect(
      this.page
        .getByTestId(`suspect-details-${suspectIndex}`)
        .locator("summary"),
    ).toHaveText(summaryText);

    await this.page
      .getByTestId(`suspect-details-${suspectIndex}`)
      .locator("summary")
      .click();
    const suspectAddNewCharge = this.page
      .getByTestId(`suspect-details-${suspectIndex}`)
      .getByTestId(`add-new-charge`);

    await expect(suspectAddNewCharge).toBeVisible();
    if (hasCharges) {
      await expect(
        suspectAddNewCharge
          .locator(".govuk-summary-list__row")
          .nth(0)
          .locator("dt")
          .nth(0),
      ).toHaveText("Add another charge");
    } else {
      await expect(
        suspectAddNewCharge
          .locator(".govuk-summary-list__row")
          .nth(0)
          .locator("dt")
          .nth(0),
      ).toHaveText("Charges");
      await expect(
        suspectAddNewCharge
          .locator(".govuk-summary-list__row")
          .nth(0)
          .locator("dd")
          .nth(0),
      ).toHaveText("No charges added");
    }

    await expect(
      this.page
        .getByTestId(`suspect-details-${suspectIndex}`)
        .getByRole("link", { name: "Add Charge" }),
    ).toHaveAttribute("href", link);

    await this.page
      .getByTestId(`suspect-details-${suspectIndex}`)
      .locator("summary")
      .click();
  }

  async changeAreaLinkClick() {
    await this.page.getByTestId("change-area-link").click();
  }
  async changeUrnLinkClick() {
    await this.page.getByTestId("change-urn-link").click();
  }
  async changeRegisteringUnitLinkClick() {
    await this.page.getByTestId("change-registering-unit-link").click();
  }
  async changeWcuLinkClick() {
    await this.page.getByTestId("change-wcu-link").click();
  }
  async changeOperationNameLinkClick() {
    await this.page.getByTestId("change-operation-name-link").click();
  }
  async changeCourtLocationLinkClick() {
    await this.page.getByTestId("change-court-location-link").click();
  }
  async changeFirstHearingDateLinkClick() {
    await this.page.getByTestId("change-first-hearing-date-link").click();
  }
  async changeFirstHearingLinkClick() {
    await this.page.getByTestId("change-first-hearing-link").click();
  }
  async addSuspectLinkClick() {
    await this.page.getByTestId("add-suspect-link").click();
  }
  async changeCaseComplexityLinkClick() {
    await this.page.getByTestId("change-case-complexity-link").click();
  }
  async changeMonitoringCodesLinkClick() {
    await this.page.getByTestId("change-monitoring-codes-link").click();
  }
  async changeCaseInvestigatorLinkClick() {
    await this.page.getByTestId("change-case-investigator-link").click();
  }
  async changeShoulderNumberLinkClick() {
    await this.page.getByTestId("change-shoulder-number-link").click();
  }
  async changePoliceUnitLinkClick() {
    await this.page.getByTestId("change-police-unit-link").click();
  }
  async changePoliceOfficerOrInvestigatorLinkClick() {
    await this.page
      .getByTestId("change-police-officer-or-investigator-link")
      .click();
  }
  async changeProsecutorLinkClick() {
    await this.page.getByTestId("change-prosecutor-link").click();
  }
  async changeCaseworkerLinkClick() {
    await this.page.getByTestId("change-caseworker-link").click();
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

  async addSuspectCharge(index: number) {
    await this.page
      .getByTestId(`suspect-details-${index}`)
      .locator("summary")
      .click();

    await this.page
      .getByTestId(`suspect-details-${index}`)
      .getByRole("link", { name: "Add Charge" })
      .click();
  }

  async verifyFormSubmittingStatus(withCharge: boolean = false) {
    await expect(this.page.getByRole("link", { name: "Back" })).toHaveCount(0);
    await expect(this.page.getByRole("link", { name: "Change" })).toHaveCount(
      0,
    );
    await expect(
      this.page.getByRole("button", { name: "Accept and create" }),
    ).toBeDisabled();
    if (withCharge) {
      await expect(this.page.getByRole("link", { name: "Remove" })).toHaveCount(
        0,
      );
      await expect(
        this.page.getByRole("link", { name: "Add charge" }),
      ).toHaveCount(0);
    }
  }

  async verifyFormNonSubmittingStatus(withCharge: boolean = false) {
    await expect(this.page.getByRole("link", { name: "Back" })).not.toHaveCount(
      0,
    );
    await expect(
      this.page.getByRole("link", { name: "Change" }),
    ).not.toHaveCount(0);
    await expect(
      this.page.getByRole("button", { name: "Accept and create" }),
    ).not.toBeDisabled();
    if (withCharge) {
      await expect(
        this.page.getByRole("link", { name: "Remove" }),
      ).not.toHaveCount(0);
      await expect(
        this.page.getByRole("link", { name: "Add charge" }),
      ).not.toHaveCount(0);
    }
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
  async clickCreateCaseButton() {
    const createCaseButton = this.page.locator("button[type='submit']");
    await expect(createCaseButton).toHaveText("Accept and create");
    await createCaseButton.click();
  }
}
