import { type Page, expect } from "@playwright/test";

export class ChangeAreaConfirmationPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyUrl() {
    await expect(this.page).toHaveURL(
      "http://localhost:5173/case-registration/change-area-confirmation",
    );
  }

  async verifyPageElements(firstHearing: boolean) {
    await expect(this.page.locator("h1")).toHaveText(
      "Changing the area means you must update other case details",
    );
    await expect(
      this.page.getByTestId("main-content").locator("p").nth(1),
    ).toHaveText("You will need to check and update:");
    await expect(this.page.locator("li").nth(0)).toHaveText(
      "the registering unit",
    );

    if (firstHearing) {
      await expect(this.page.locator("li").nth(1)).toHaveText(
        "first hearing details",
      );
      await expect(this.page.locator("li").nth(2)).toHaveText(
        "who is working on the case",
      );
    } else {
      await expect(this.page.locator("li").nth(1)).toHaveText(
        "who is working on the case",
      );
    }
    await expect(
      this.page.getByTestId("main-content").locator("p").nth(1),
    ).toHaveText("You will need to check and update:");

    await expect(
      this.page.getByTestId("main-content").locator("p").nth(2),
    ).toHaveText(
      "You can continue to change the area now, or cancel to keep the current area.",
    );
    await expect(
      this.page.getByRole("button", { name: "Continue and change the area" }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("link", { name: "cancel" }),
    ).toHaveAttribute("href", "/case-registration/areas");
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
    await this.page
      .getByRole("button", { name: "Continue and change the area" })
      .click();
  }

  async cancel() {
    await this.page.getByRole("link", { name: "cancel" }).click();
  }
}
