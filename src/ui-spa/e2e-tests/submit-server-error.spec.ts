import { test } from "@playwright/test";
import { completeSubmitServerError } from "./journeys/submitServerError";

const OPERATION_NAME = process.env.E2E_OPERATION_NAME ?? "thunderstruck";

test("Scenario 11: a 5xx from POST /api/v1/cases shows the generic error page; a fresh registration then submits successfully", async ({
  page,
}) => {
  await completeSubmitServerError(page, { operationName: OPERATION_NAME });
});