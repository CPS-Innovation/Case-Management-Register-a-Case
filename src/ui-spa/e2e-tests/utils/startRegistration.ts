import { expect, type Page } from "@playwright/test";

export const startRegistration = async (page: Page): Promise<void> => {
  const unitsLoaded = page.waitForResponse(
    (r) => r.url().includes("/api/v1/units") && r.request().method() === "GET",
    { timeout: 60_000 },
  );
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Register a case" }),
  ).toBeVisible({ timeout: 30_000 });
  await unitsLoaded;
};
