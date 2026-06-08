import { test } from "@playwright/test";
import { completeSuspectNoChargesPath } from "./journeys/suspectNoCharges";

test("Scenario 1: no operation name with a suspect, submits to /api/v1/cases", async ({
  page,
}) => {
  await completeSuspectNoChargesPath(page, {});
});
