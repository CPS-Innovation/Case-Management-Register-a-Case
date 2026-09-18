import { type Page, expect } from "@playwright/test";
import { CaseDetailsPage as IntegrationCaseDetailsPage } from "../../integration-tests/pages/caseDetailsPage";
import { refreshUniqueReference, type UrnParts } from "../utils/generateUrn";

const EXISTING_URN_ERROR =
  "URN already exists, please change reference text and try again";

// A collision only costs one extra submit, so a handful of attempts is far more
// than the odds need; the cap is here to fail loudly rather than spin.
const MAX_URN_ATTEMPTS = 5;

const URN_EXISTS_ENDPOINT = /\/api\/v1\/urns\/.+\/exists/;

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

  // Submits case details, and if the URN turns out to be taken, swaps in a new
  // reference and submits again.
  //
  // The generated reference collides with an already-registered case often
  // enough to flake the suite. Rather than guessing from the rendered error, we
  // read the boolean the page itself acts on: GET /api/v1/urns/{urn}/exists,
  // which the page calls on every submit once client-side validation passes.
  // That avoids mistaking a stale error summary from the previous attempt for a
  // fresh collision, and it settles as soon as the backend answers.
  //
  // Assumes the registering unit and WCU are already filled in, since the
  // existence check only runs after client-side validation passes.
  async saveAndContinueWithFreeUrn(urn: UrnParts): Promise<UrnParts> {
    for (let attempt = 1; attempt <= MAX_URN_ATTEMPTS; attempt++) {
      const existsResponse = this.currentPage.waitForResponse(
        (r) => URN_EXISTS_ENDPOINT.test(r.url()) && r.ok(),
        { timeout: 30_000 },
      );
      await this.saveAndContinue();
      const urnExists = (await (await existsResponse).json()) as boolean;

      if (!urnExists) return urn;

      refreshUniqueReference(urn);
      await this.enterUrnUniqueReference(urn.uniqueReference);
    }

    throw new Error(
      `URN was already registered on ${MAX_URN_ATTEMPTS} consecutive attempts; last tried ${urn.formatted}`,
    );
  }

  // Enters an already-registered URN, submits, and asserts the real error
  // rendered from GET /api/v1/urns/{urn}/exists returning true.
  async submitAndExpectExistingUrnError(existingUrn: UrnParts) {
    await this.enterUrn(existingUrn);
    const existsResponse = this.currentPage.waitForResponse(
      (r) => URN_EXISTS_ENDPOINT.test(r.url()) && r.ok(),
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
