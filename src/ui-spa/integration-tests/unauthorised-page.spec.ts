import { delay, HttpResponse, http } from "msw";
import { expect, test } from "./utils/test";

test("Should show unauthorised page if the units api return 401", async ({
  page,
  worker,
}) => {
  await worker.use(
    http.get("https://mocked-out-api/api/v1/units", async () => {
      await delay(200);
      return new HttpResponse(null, { status: 401 });
    }),
  );

  await page.goto("http://localhost:5173");
  await expect(page.getByText("Loading...")).toBeVisible();
  await expect(page.getByText("Loading...")).not.toBeVisible();
  await expect(page).toHaveURL("http://localhost:5173/unauthorised");
  await expect(page.locator("h1")).toHaveText("You cannot access this service");
  await expect(
    page.getByText(
      "Close this tab and open the homepage again from CMS Classic.",
    ),
  ).toBeVisible();
});

test("Should show unauthorised page if the wms-units api return 401", async ({
  page,
  worker,
}) => {
  await worker.use(
    http.get("https://mocked-out-api/api/v1/wms-units", async () => {
      await delay(200);
      return new HttpResponse(null, { status: 401 });
    }),
  );
  await page.goto("http://localhost:5173");
  await expect(page.getByText("Loading...")).toBeVisible();
  await expect(page.getByText("Loading...")).not.toBeVisible();
  await expect(page).toHaveURL("http://localhost:5173/unauthorised");
  await expect(page.locator("h1")).toHaveText("You cannot access this service");
  await expect(
    page.getByText(
      "Close this tab and open the homepage again from CMS Classic.",
    ),
  ).toBeVisible();
});
test("Should show unauthorised page if the complexities api return 401", async ({
  page,
  worker,
}) => {
  await worker.use(
    http.get("https://mocked-out-api/api/v1/complexities", async () => {
      await delay(200);
      return new HttpResponse(null, { status: 401 });
    }),
  );
  await page.goto("http://localhost:5173");
  await expect(page.getByText("Loading...")).toBeVisible();
  await expect(page.getByText("Loading...")).not.toBeVisible();
  await expect(page).toHaveURL("http://localhost:5173/unauthorised");
  await expect(page.locator("h1")).toHaveText("You cannot access this service");
  await expect(
    page.getByText(
      "Close this tab and open the homepage again from CMS Classic.",
    ),
  ).toBeVisible();
});
