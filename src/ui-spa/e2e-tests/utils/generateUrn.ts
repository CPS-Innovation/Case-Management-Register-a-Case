import { randomInt } from "node:crypto";

export interface UrnParts {
  policeForce: string;
  policeUnit: string;
  uniqueReference: string;
  yearReference: string;
  formatted: string;
}

export const generateUniqueUrn = (
  policeForce = "12",
  policeUnit = "21",
  year = "26",
): UrnParts => {
  const workerIndex = Number(process.env.TEST_WORKER_INDEX ?? "0");
  const uniqueReference = String(
    (Date.now() + workerIndex * 13 + randomInt(100000)) % 100000,
  ).padStart(5, "0");
  return {
    policeForce,
    policeUnit,
    uniqueReference,
    yearReference: year,
    formatted: `${policeForce}${policeUnit}${uniqueReference}${year}`,
  };
};
