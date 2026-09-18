import { randomInt } from "node:crypto";

export interface UrnParts {
  policeForce: string;
  policeUnit: string;
  uniqueReference: string;
  yearReference: string;
  formatted: string;
}

// The police force, unit and year are fixed, so the 5-digit reference is the
// only thing keeping a URN unique - a space of 100,000 shared with every case
// already registered in the environment. Collisions are therefore expected
// rather than rare, and are resolved on submit by
// CaseDetailsPage.saveAndContinueWithFreeUrn.
const nextUniqueReference = (): string => {
  const workerIndex = Number(process.env.TEST_WORKER_INDEX ?? "0");
  return String(
    (Date.now() + workerIndex * 13 + randomInt(100000)) % 100000,
  ).padStart(5, "0");
};

const formatUrn = (parts: Omit<UrnParts, "formatted">): string =>
  `${parts.policeForce}${parts.policeUnit}${parts.uniqueReference}${parts.yearReference}`;

export const generateUniqueUrn = (
  policeForce = "12",
  policeUnit = "21",
  year = "26",
): UrnParts => {
  const parts = {
    policeForce,
    policeUnit,
    uniqueReference: nextUniqueReference(),
    yearReference: year,
  };
  return { ...parts, formatted: formatUrn(parts) };
};

// Swaps in a new reference in place, so callers holding the object (summary and
// confirmation assertions, later steps) see the URN the case was registered
// under rather than the one that turned out to be taken.
export const refreshUniqueReference = (urn: UrnParts): UrnParts => {
  urn.uniqueReference = nextUniqueReference();
  urn.formatted = formatUrn(urn);
  return urn;
};
