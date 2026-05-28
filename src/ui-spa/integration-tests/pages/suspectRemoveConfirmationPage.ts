import { type Page, expect } from "@playwright/test";

export class SuspectRemoveConfirmationPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyUrl() {
    await expect(this.page).toHaveURL(
      "http://localhost:5173/case-registration/suspect-remove-confirmation",
    );
  }

  async verifyPageElements(
    suspectName: string,
    fromCaseSummaryPage: boolean = false,
  ) {
    const cancelLinkHref = fromCaseSummaryPage
      ? "/case-registration/case-summary"
      : "/case-registration/suspect-summary";
    await expect(this.page.locator("h1")).toHaveText(
      `Are you sure you want to remove ${suspectName}?`,
    );
    await expect(
      this.page.getByTestId("main-content").locator("p").nth(0),
    ).toHaveText(
      "This will permanently remove all the details you've entered including any linked charges.",
    );
    await expect(
      this.page.getByTestId("main-content").locator("p").nth(1),
    ).toHaveText("You will not be able to restore them.");
    await expect(
      this.page.getByRole("button", { name: "Save and continue" }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("link", { name: "cancel" }),
    ).toHaveAttribute("href", cancelLinkHref);
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

  async saveAndContinue() {
    await this.page.getByRole("button", { name: "Save and continue" }).click();
  }

  async cancel() {
    await this.page.getByRole("link", { name: "cancel" }).click();
  }
}
