import { expect, type Page } from "@playwright/test";

export interface TacticalLoginOptions {
  apiBaseUrl: string;
  username: string;
  password: string;
}

export async function tacticalLogin(
  page: Page,
  { apiBaseUrl, username, password }: TacticalLoginOptions,
): Promise<void> {
  await page.goto(`${apiBaseUrl}/api/tactical/login`);
  await page.locator("input[name='username']").fill(username);
  await page.locator("input[name='password']").fill(password);
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(
    page.getByTestId("login-ok"),
    "Tactical CMS login failed — check E2E_CMS_USERNAME / E2E_CMS_PASSWORD in .env.e2e.local",
  ).toBeVisible();
}
