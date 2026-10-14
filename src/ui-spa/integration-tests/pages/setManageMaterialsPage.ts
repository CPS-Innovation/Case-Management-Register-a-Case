import { type Page, expect } from "@playwright/test";

export class SetManageMaterialsPage {
  private readonly route =
    "http://localhost:5173/case-registration/set-manage-materials";
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyUrl() {
    await expect(this.page).toHaveURL(this.route);
  }

  async verifyPageElements() {
    await expect(this.page).toHaveTitle(
      /Set Manage Materials - Register A Case/,
    );
    await expect(
      this.page.getByTestId("main-content").locator("h1"),
    ).toHaveText("Case Registered");
    await expect(
      this.page.getByTestId("main-content").locator("p").nth(0),
    ).toHaveText("The case has been created.");
    await expect(
      this.page.getByTestId("main-content").locator("p").nth(1),
    ).toHaveText("URN: 12211234526");
    await expect(
      this.page.getByTestId("main-content").locator("h2"),
    ).toHaveText("Manage case materials");
    await expect(
      this.page.getByTestId("main-content").locator("ul>li").nth(0),
    ).toHaveText("create a new Egress or Shared drive folder for this case");
    await expect(
      this.page.getByTestId("main-content").locator("ul>li").nth(1),
    ).toHaveText(
      "connect an existing Egress or Shared drive folder to this case",
    );
    await expect(
      this.page.getByTestId("main-content").locator("legend").nth(0),
    ).toHaveText("Would you like to manage materials for this case?");
    await expect(
      this.page.getByTestId("main-content").locator("label").nth(0),
    ).toHaveText("Yes");
    await expect(
      this.page.getByTestId("main-content").locator("label").nth(1),
    ).toHaveText("No");
  }

  async errorValidations() {
    await this.continue();
    await expect(
      this.page.getByTestId("manage-materials-error-summary"),
    ).toBeVisible();
    await expect(
      this.page.getByTestId("manage-materials-radio-link"),
    ).toHaveText("Select whether you like to manage materials for this case");
    await this.page.getByTestId("manage-materials-radio-link").click();
    await expect(
      this.page.locator("#manage-materials-radio-yes"),
    ).toBeFocused();
  }
  async selectSetManageMaterialsYes() {
    await this.page.getByLabel(/^Yes$/).check();
  }
  async selectSetManageMaterialsNo() {
    await this.page.getByLabel(/^No$/).check();
  }

  async continue() {
    await this.page.getByRole("button", { name: "Continue" }).click();
  }
}
