import { type Page, expect } from "@playwright/test";

export class CaseRegistrationConfirmationPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyUrl() {
    await expect(this.page).toHaveURL(
      "http://localhost:5173/case-registration/case-registration-confirmation",
    );
  }

  async verifyPageElements(urn: string) {
    await expect(this.page.locator("h1")).toHaveText(
      "Case registered successfully",
    );
    await expect(this.page.locator("p").nth(0)).toHaveText("URN");
    await expect(this.page.locator("p").nth(1)).toHaveText(urn);
    await expect(this.page.locator("h2")).toHaveText("Next steps");
    await expect(this.page.locator("p").nth(2)).toHaveText(
      "Use the URN to find the case.",
    );
    await expect(
      this.page.getByRole("link", { name: "Return to the home page" }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("link", { name: "Return to the home page" }),
    ).toHaveAttribute("href", "https://www.gov.uk/");
  }
}
