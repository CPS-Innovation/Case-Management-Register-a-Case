import { type Page } from "@playwright/test";
import { generateUniqueUrn } from "../utils/generateUrn";
import {
  startAtHomePage,
  enterAreasAndCaseDetails,
  completeAssigneeAndSubmit,
} from "./steps";

export interface ShortPathOptions {
  operationName?: string;
}

export async function completeShortPath(
  page: Page,
  { operationName }: ShortPathOptions = {},
): Promise<void> {
  const urn = generateUniqueUrn();

  await startAtHomePage(page, { operationName, hasSuspect: false });
  await enterAreasAndCaseDetails(page, urn);
  await completeAssigneeAndSubmit(page, urn, operationName);
}
