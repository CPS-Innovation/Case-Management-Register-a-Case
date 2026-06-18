import { test } from "@playwright/test";
import { completeLongPathRemoveAllSuspects } from "./journeys/longPathRemoveAllSuspects";

const OPERATION_NAME = process.env.E2E_OPERATION_NAME ?? "thunderstruck";

test("Scenario 8: long path, suspect added then suspect details changed to No, confirms removal and submits the short path to /api/v1/cases", async ({
  page,
}) => {
  await completeLongPathRemoveAllSuspects(page, {
    operationName: OPERATION_NAME,
  });
});
