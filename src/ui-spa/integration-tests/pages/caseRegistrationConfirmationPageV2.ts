import { type Page, expect } from "@playwright/test";

export class CaseRegistrationConfirmationPageV2 {
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
    await expect(this.page).toHaveTitle(
      /Case Registration Confirmation - Register A Case/,
    );
    await expect(this.page.locator("h1")).toHaveText("Case registered");
    await expect(
      this.page.getByTestId("main-content").locator("p").nth(0),
    ).toHaveText("URN");
    await expect(
      this.page.getByTestId("main-content").locator("p").nth(1),
    ).toHaveText(urn);
    await expect(
      this.page.getByTestId("main-content").locator("p").nth(2),
    ).toHaveText(
      "Save the URN as you will need it to find or update the case.",
    );
    await expect(
      this.page.getByTestId("main-content").locator("h2"),
    ).toHaveText("Next steps");
    await expect(
      this.page.getByTestId("main-content").locator("p").nth(3),
    ).toHaveText("You can:");
    await expect(
      this.page.getByTestId("main-content").locator("ul>li").nth(0),
    ).toHaveText("update the case on CMS Classic");
    await expect(
      this.page.getByTestId("main-content").locator("ul>li").nth(1),
    ).toHaveText("go to the homepage to view your cases and tasks");
    await expect(
      this.page.getByTestId("main-content").locator("ul>li").nth(2),
    ).toHaveText("set up Egress and the Shared Drive");
    await expect(
      this.page.getByRole("link", { name: "update the case on CMS Classic" }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("link", { name: "update the case on CMS Classic" }),
    ).toHaveAttribute("href", "cms-classic-url");

    await expect(
      this.page.getByRole("link", { name: "go to the homepage" }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("link", { name: "go to the homepage" }),
    ).toHaveAttribute("href", "https://www.gov.uk/");

    await expect(
      this.page.getByRole("link", {
        name: "set up Egress and the Shared Drive",
      }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("link", {
        name: "set up Egress and the Shared Drive",
      }),
    ).toHaveAttribute("href", "https://design-system.service.gov.uk/");
  }
}
