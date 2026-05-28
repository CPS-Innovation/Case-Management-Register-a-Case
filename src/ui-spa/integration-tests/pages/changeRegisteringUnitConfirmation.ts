import { type Page, expect } from "@playwright/test";

export class ChangeRegisteringUnitConfirmationPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyUrl() {
    await expect(this.page).toHaveURL(
      "http://localhost:5173/case-registration/change-registering-unit-confirmation",
    );
  }

  async verifyPageElements(firstHearing: boolean) {
    await expect(this.page.locator("h1")).toHaveText(
      "Changing the registering unit means you must update other case details",
    );
    await expect(
      this.page.getByTestId("main-content").locator("p").nth(0),
    ).toHaveText(
      "If you change the registering unit, you will need to review and update other case details. This is because some information is linked to the registering unit.",
    );
    await expect(
      this.page.getByTestId("main-content").locator("p").nth(1),
    ).toHaveText("You will need to check and update:");

    if (firstHearing) {
      await expect(this.page.locator("li").nth(0)).toHaveText(
        "first hearing details",
      );
      await expect(this.page.locator("li").nth(1)).toHaveText(
        "who is working on the case",
      );
    } else {
      await expect(this.page.locator("li").nth(0)).toHaveText(
        "who is working on the case",
      );
    }
    await expect(
      this.page.getByTestId("main-content").locator("p").nth(1),
    ).toHaveText("You will need to check and update:");

    await expect(
      this.page.getByTestId("main-content").locator("p").nth(2),
    ).toHaveText(
      "You can continue to change the registering unit now, or cancel to keep the current registering unit.",
    );
    await expect(
      this.page.getByRole("button", {
        name: "Continue and change the registering unit",
      }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("link", { name: "cancel" }),
    ).toHaveAttribute("href", "/case-registration/case-details");
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
      .getByRole("button", { name: "Continue and change the registering unit" })
      .click();
  }

  async cancel() {
    await this.page.getByRole("link", { name: "cancel" }).click();
  }
}
