import { test } from "@playwright/test";
import { completeLongPathWantToAddChargesNo } from "./journeys/longPathWantToAddChargesNo";

const OPERATION_NAME = process.env.E2E_OPERATION_NAME ?? "thunderstruck";

test("Scenario 5: long path, suspect added then 'add charges' answered No, skips the charge flow and submits to /api/v1/cases", async ({
  page,
}) => {
  await completeLongPathWantToAddChargesNo(page, {
    operationName: OPERATION_NAME,
  });
});
