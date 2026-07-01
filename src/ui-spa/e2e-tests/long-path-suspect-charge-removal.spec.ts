import { test } from "@playwright/test";
import { completeLongPathSuspectChargeRemoval } from "./journeys/longPathSuspectChargeRemoval";

const OPERATION_NAME = process.env.E2E_OPERATION_NAME ?? "thunderstruck";

test("Scenario 9: long path, remove a second suspect (cancel then confirm) and remove a charge, submits the remaining suspect with no charges to /api/v1/cases", async ({
  page,
}) => {
  test.setTimeout(180_000);
  await completeLongPathSuspectChargeRemoval(page, {
    operationName: OPERATION_NAME,
  });
});
