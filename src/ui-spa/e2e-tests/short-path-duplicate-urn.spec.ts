import { test } from "@playwright/test";
import { completeShortPathDuplicateUrn } from "./journeys/shortPathDuplicateUrn";

const OPERATION_NAME = process.env.E2E_OPERATION_NAME ?? "thunderstruck";

test("Scenario 5: short path, URN duplicate validation then submits to /api/v1/cases", async ({
  page,
}) => {
  await completeShortPathDuplicateUrn(page, { operationName: OPERATION_NAME });
});
