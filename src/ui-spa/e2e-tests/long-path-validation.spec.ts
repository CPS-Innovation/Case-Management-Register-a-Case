import { test } from "@playwright/test";
import { completeLongPathValidation } from "./journeys/longPathValidation";

const OPERATION_NAME = process.env.E2E_OPERATION_NAME ?? "thunderstruck";

test("Scenario 10: long path with validation on every step (incl. backend duplicate-URN and zero-result offence search), submits to /api/v1/cases", async ({
  page,
}) => {
  await completeLongPathValidation(page, { operationName: OPERATION_NAME });
});
