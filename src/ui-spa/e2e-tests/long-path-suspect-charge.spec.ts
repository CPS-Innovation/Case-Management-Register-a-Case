import { test } from "@playwright/test";
import { completeLongPathSuspectCharge } from "./journeys/longPathSuspectCharge";

const OPERATION_NAME = process.env.E2E_OPERATION_NAME ?? "thunderstruck";

test("Scenario 4: long path, single suspect with one charge and one new victim, submits to /api/v1/cases", async ({
  page,
}) => {
  await completeLongPathSuspectCharge(page, { operationName: OPERATION_NAME });
});
