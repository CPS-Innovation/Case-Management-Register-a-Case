import { test } from "@playwright/test";
import { completeLongPathMultiSuspectCharge } from "./journeys/longPathMultiSuspectCharge";

const OPERATION_NAME = process.env.E2E_OPERATION_NAME ?? "thunderstruck";

test("Scenario 6: long path, multiple suspects and charges with victim reuse, submits to /api/v1/cases", async ({
  page,
}) => {
  test.setTimeout(180_000);
  await completeLongPathMultiSuspectCharge(page, {
    operationName: OPERATION_NAME,
  });
});
