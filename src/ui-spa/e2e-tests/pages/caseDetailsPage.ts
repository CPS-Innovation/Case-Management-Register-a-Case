import { type Page, expect } from "@playwright/test";
import { CaseDetailsPage as IntegrationCaseDetailsPage } from "../../integration-tests/pages/caseDetailsPage";
import { type UrnParts } from "../utils/generateUrn";

const EXISTING_URN_ERROR =
  "URN already exists, please change reference text and try again";

// Reuses the integration case-details page object (identical selectors) and adds
// an e2e-only assertion for the backend duplicate-URN check, which the MSW suite
// can't exercise (its /urns/:urn/exists handler always returns false).
export class CaseDetailsPage extends IntegrationCaseDetailsPage {
  private readonly currentPage: Page;

  constructor(page: Page) {
    super(page);
    this.currentPage = page;
  }

  async enterUrn(urn: UrnParts) {
    await this.enterUrnPoliceForce(urn.policeForce);
    await this.enterUrnPoliceUnit(urn.policeUnit);
    await this.enterUrnUniqueReference(urn.uniqueReference);
    await this.enterUrnYearReference(urn.yearReference);
  }

  // Assumes the registering unit and WCU are already valid (the backend URN
  // existence check only runs once client-side validation passes). Enters an
  // already-registered URN, submits, and asserts the real error rendered from
  // GET /api/v1/urns/{urn}/exists returning true.
  async submitAndExpectExistingUrnError(existingUrn: UrnParts) {
    await this.enterUrn(existingUrn);
    const existsResponse = this.currentPage.waitForResponse(
      (r) => /\/api\/v1\/urns\/.+\/exists/.test(r.url()) && r.ok(),
      { timeout: 30_000 },
    );
    await this.saveAndContinue();
    await existsResponse;
    await expect(
      this.currentPage.getByTestId("case-details-error-summary"),
    ).toBeVisible();
    await expect(
      this.currentPage.getByTestId("urn-error-text-link"),
    ).toHaveText(EXISTING_URN_ERROR);
  }
}
