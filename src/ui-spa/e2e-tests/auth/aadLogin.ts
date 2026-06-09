import { expect, type Page } from "@playwright/test";

export interface AadLoginOptions {
  appUrl: string;
  username: string;
  password: string;
}

export async function aadLogin(
  page: Page,
  { appUrl, username, password }: AadLoginOptions,
): Promise<void> {
  await page.goto(`${appUrl}/`);

  const email = page.locator('input[name="loginfmt"]');
  await email.waitFor({ state: "visible", timeout: 30_000 });
  await email.fill(username);
  await page.click("#idSIButton9");

  const passwordInput = page.locator('input[name="passwd"]');
  await passwordInput.waitFor({ state: "visible", timeout: 30_000 });
  await passwordInput.fill(password);
  await page.click("#idSIButton9");

  const kmsiHeading = page.getByRole("heading", { name: /stay signed in/i });
  const kmsiShown = await kmsiHeading
    .waitFor({ state: "visible", timeout: 20_000 })
    .then(() => true)
    .catch(() => false);
  if (kmsiShown) {
    await page.click("#idSIButton9");
  }

  await expect(
    page.getByRole("heading", { name: "Register a case" }),
    "MSAL sign-in did not land on the Register a case page (check AAD creds / group access / MFA)",
  ).toBeVisible({ timeout: 60_000 });
}
