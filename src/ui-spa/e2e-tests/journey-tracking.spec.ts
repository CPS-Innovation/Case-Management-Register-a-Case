import { expect, test, type Request } from "@playwright/test";
import { CaseAreasPage } from "../integration-tests/pages/caseAreasPage";
import { CancelCaseRegistrationConfirmationPage } from "../integration-tests/pages/cancelCaseRegistrationConfirmationPage";
import { AREA, startAtHomePage } from "./journeys/steps";
import { expectStep } from "./utils/expectStep";

const OPERATION_NAME = process.env.E2E_OPERATION_NAME ?? "thunderstruck";
const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

type Properties = Record<string, unknown>;

interface TelemetryCall {
  telemetryType: string;
  properties: Properties;
}

const toCall = (request: Request): TelemetryCall => {
  const postData = request.postData();
  expect(postData, "telemetry POST was sent without a body").toBeTruthy();
  const body = JSON.parse(postData!) as {
    telemetryType?: string;
    properties?: Properties[];
  } | null;
  expect(
    Array.isArray(body?.properties),
    `telemetry POST has no properties array: ${postData}`,
  ).toBe(true);
  return {
    telemetryType: body!.telemetryType ?? "",
    properties: Object.assign({}, ...body!.properties!),
  };
};

test("Scenario 26: the journey starts past the first screen, tracks each step and logs the cancellation", async ({
  page,
}) => {
  const requests: Request[] = [];
  page.on("request", (request) => {
    if (
      request.url().endsWith("/api/v1/telemetry") &&
      request.method() === "POST"
    ) {
      requests.push(request);
    }
  });
  const telemetry = () => requests.map(toCall);
  const events = (name: string) =>
    telemetry().filter(
      (call) => call.telemetryType === "Event" && call.properties.name === name,
    );
  const pageViews = () =>
    telemetry().filter((call) => call.telemetryType === "PageView");

  await startAtHomePage(page, {
    operationName: OPERATION_NAME,
    hasSuspect: false,
  });
  await expectStep(page, "/case-registration/areas");

  await expect.poll(() => events("JourneyStarted").length).toBe(1);
  const journeyId = events("JourneyStarted")[0].properties.journeyId;
  expect(journeyId, "JourneyStarted journeyId is not a v4 UUID").toMatch(UUID);

  const areasPage = new CaseAreasPage(page);
  await areasPage.enterAreaOrDivision(AREA);
  await areasPage.saveAndContinue();
  await expectStep(page, "/case-registration/case-details");

  await page.getByRole("link", { name: "Cancel" }).click();
  await expectStep(
    page,
    "/case-registration/cancel-case-registration-confirmation",
  );

  const expectedPageViews = [
    { pageName: "Home", path: "/case-registration" },
    { pageName: "Case Areas", path: "/case-registration/areas" },
    { pageName: "Case Details", path: "/case-registration/case-details" },
    {
      pageName: "Cancel Case Registration Confirmation",
      path: "/case-registration/cancel-case-registration-confirmation",
    },
  ];
  const byPath = (a: Properties, b: Properties) =>
    String(a.path).localeCompare(String(b.path));
  await expect.poll(() => pageViews().length).toBe(expectedPageViews.length);
  expect(
    pageViews()
      .map(({ properties }) => properties)
      .sort(byPath),
    "page views missing, duplicated, or carrying the wrong journeyId",
  ).toEqual(
    expectedPageViews.map((view) => ({ ...view, journeyId })).sort(byPath),
  );

  const cancelPage = new CancelCaseRegistrationConfirmationPage(page);
  await cancelPage.selectCancelCaseRegistrationYes();
  const cancelledResponse = page.waitForResponse(
    (response) =>
      response.url().endsWith("/api/v1/telemetry") &&
      response.request().postData()?.includes("JourneyCancelled") === true,
  );
  await cancelPage.continue();

  await expect.poll(() => events("JourneyCancelled").length).toBe(1);
  expect(events("JourneyCancelled")[0].properties).toEqual({
    name: "JourneyCancelled",
    journeyId,
    cancelledFrom: "/case-registration/case-details",
  });
  const response = await cancelledResponse;
  expect(
    response.ok(),
    `JourneyCancelled telemetry returned ${response.status()}`,
  ).toBe(true);

  expect(
    events("JourneyStarted"),
    "the journey was started twice",
  ).toHaveLength(1);
});
