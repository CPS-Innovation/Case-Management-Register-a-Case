import { test } from "@playwright/test";
import { completeShortPathWithAreaChange } from "./journeys/shortPathChangeArea";

const OPERATION_NAME = process.env.E2E_OPERATION_NAME ?? "thunderstruck";

test("Scenario 3: short path with a change-area confirmation, submits to /api/v1/cases", async ({
  page,
}) => {
  await completeShortPathWithAreaChange(page, {
    operationName: OPERATION_NAME,
  });
});
