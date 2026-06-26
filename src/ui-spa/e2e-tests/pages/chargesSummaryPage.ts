import { type Page, expect } from "@playwright/test";
import { ChargesSummaryPage as IntegrationChargesSummaryPage } from "../../integration-tests/pages/chargesSummaryPage";

// Reuses the integration page object (identical selectors) and only overrides
// the no-charges assertion: against the real backend the heading renders the
// singular "You have added 0 charge" for zero charges, whereas the MSW-backed
// integration suite expects the plural form.
export class ChargesSummaryPage extends IntegrationChargesSummaryPage {
  private readonly currentPage: Page;

  constructor(page: Page) {
    super(page);
    this.currentPage = page;
  }

  async verifyNoCharges() {
    await expect(
      this.currentPage.getByTestId("suspect-aliases-summary-list"),
    ).toHaveCount(0);
    await expect(this.currentPage.locator("h1")).toHaveText(
      "You have added 0 charge",
    );
    await expect(this.currentPage.locator("legend").nth(0)).toHaveText(
      "Do you need to add a charge for any suspect?",
    );
    const labels = this.currentPage.locator("label");
    await expect(labels.nth(0)).toHaveText("Yes");
    await expect(labels.nth(1)).toHaveText("No");
    await expect(
      this.currentPage.getByTestId("charges-summary"),
    ).not.toBeVisible();
  }
}
