import { expect, test, type Request } from "@playwright/test";
import { generateUniqueUrn } from "./utils/generateUrn";
import {
  AREA,
  startAtHomePage,
  enterAreasAndCaseDetails,
  completeAssigneeAndSubmit,
} from "./journeys/steps";

const OPERATION_NAME = process.env.E2E_OPERATION_NAME ?? "thunderstruck";
const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

interface TelemetryPayload {
  telemetryType: string;
  properties: Record<string, unknown>[];
}

const toProperties = (payload: TelemetryPayload): Record<string, unknown> =>
  Object.assign({}, ...payload.properties);

test("Scenario 25: the case registration carries the journey id of the JourneyStarted event and the chosen area", async ({
  page,
}) => {
  const telemetry: TelemetryPayload[] = [];
  page.on("request", (request: Request) => {
    if (
      request.url().endsWith("/api/v1/telemetry") &&
      request.method() === "POST"
    ) {
      telemetry.push(JSON.parse(request.postData() ?? "null"));
    }
  });

  const urn = generateUniqueUrn();
  await startAtHomePage(page, {
    operationName: OPERATION_NAME,
    hasSuspect: false,
  });
  await enterAreasAndCaseDetails(page, urn);

  const casesRequest = page.waitForRequest(
    (request) =>
      request.url().endsWith("/api/v1/cases") && request.method() === "POST",
    { timeout: 120_000 },
  );
  await completeAssigneeAndSubmit(page, urn, OPERATION_NAME);

  const journeyStarted = telemetry
    .map(toProperties)
    .filter((properties) => properties.name === "JourneyStarted");
  expect(
    journeyStarted,
    "expected exactly one JourneyStarted event",
  ).toHaveLength(1);
  const journeyId = journeyStarted[0].journeyId;
  expect(journeyId, "JourneyStarted journeyId is not a v4 UUID").toMatch(UUID);

  const pageViews = telemetry
    .filter((payload) => payload.telemetryType === "PageView")
    .map(toProperties);
  expect(pageViews.length, "no page views were tracked").toBeGreaterThan(0);
  for (const pageView of pageViews) {
    expect(pageView.journeyId, `page view ${pageView.pageName}`).toBe(
      journeyId,
    );
  }

  const payload = JSON.parse((await casesRequest).postData() ?? "null") as {
    journeyId?: string;
    areaOrDivisionText?: string;
  } | null;
  expect(payload, "no POST /api/v1/cases payload was captured").not.toBeNull();
  expect(payload!.journeyId).toBe(journeyId);
  expect(payload!.areaOrDivisionText).toBe(AREA);
});
