import { expect, test, type Page } from "@playwright/test";
import { API_BASE_URL } from "./config";
import { expectStep } from "./utils/expectStep";

const CMS_AUTH_COOKIE = "Cms-Auth-Values";

const expectUnauthorisedPage = async (page: Page): Promise<void> => {
  const unitsResponse = page.waitForResponse(
    (r) => r.url().includes("/api/v1/units") && r.request().method() === "GET",
    { timeout: 60_000 },
  );
  await page.goto("/");
  expect((await unitsResponse).status()).toBe(401);

  await expectStep(page, "/unauthorised");
  await expect(page.locator("h1")).toHaveText("You cannot access this service");
  await expect(
    page.getByText(
      "Close this tab and open the homepage again from CMS Classic.",
    ),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Register a case" }),
  ).toHaveCount(0);
};

test("Scenario 23: a user without the CMS auth cookie is redirected to the unauthorised page", async ({
  page,
  context,
}) => {
  await context.clearCookies({ name: CMS_AUTH_COOKIE });

  await expectUnauthorisedPage(page);
});

test("Scenario 24: a user with an invalid CMS auth cookie is redirected to the unauthorised page", async ({
  page,
  context,
}) => {
  const cmsCookie = (await context.cookies(`${API_BASE_URL}/api/`)).find(
    (cookie) => cookie.name === CMS_AUTH_COOKIE,
  );
  if (!cmsCookie) {
    throw new Error(`${CMS_AUTH_COOKIE} missing from the saved storage state`);
  }
  await context.addCookies([{ ...cmsCookie, value: "invalid" }]);

  await expectUnauthorisedPage(page);
});
