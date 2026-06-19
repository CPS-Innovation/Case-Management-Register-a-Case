import { test } from "@playwright/test";
import { completeLongPathDuplicateVictim } from "./journeys/longPathDuplicateVictim";

const OPERATION_NAME = process.env.E2E_OPERATION_NAME ?? "thunderstruck";

test("Scenario 7: long path, duplicate victim confirmation, submits to /api/v1/cases", async ({
  page,
}) => {
  test.setTimeout(180_000);
  await completeLongPathDuplicateVictim(page, {
    operationName: OPERATION_NAME,
  });
});
