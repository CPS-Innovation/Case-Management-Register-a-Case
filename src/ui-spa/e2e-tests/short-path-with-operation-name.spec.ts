import { test } from "@playwright/test";
import { completeShortPath } from "./journeys/shortPath";

const OPERATION_NAME = process.env.E2E_OPERATION_NAME ?? "thunderstruck";

test("Scenario 2: short path with an operation name, submits to /api/v1/cases", async ({
  page,
}) => {
  await completeShortPath(page, { operationName: OPERATION_NAME });
});
