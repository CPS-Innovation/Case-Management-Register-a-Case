import { v4 as uuidv4 } from "uuid";
import { GATEWAY_BASE_URL, GATEWAY_SCOPE } from "../config";
import { getAccessToken } from "../auth";
import { z } from "zod";
import {
  type CaseAreasAndRegisteringUnits,
  type CaseAreasAndWitnessCareUnits,
  type CourtLocations,
  type CaseComplexities,
  type CaseMonitoringCodes,
  type CaseProsecutors,
  type CaseCaseworkers,
  type InvestigatorTitles,
  type CaseRegistrationRequestData,
  type Genders,
  type Ethnicities,
  type Religions,
  type OffenderTypes,
  type PoliceUnits,
  type Offences,
  type ValidateUrn,
  type CaseRegistrationResponse,
  caseAreasAndRegisteringUnitsSchema,
  caseAreasAndWitnessCareUnitsSchema,
  courtLocationsSchema,
  caseComplexitiesSchema,
  caseMonitoringCodesSchema,
  caseProsecutorsSchema,
  caseCaseworkersSchema,
  investigatorTitlesSchema,
  gendersSchema,
  ethnicitiesSchema,
  religionsSchema,
  offenderTypesSchema,
  policeUnitsSchema,
  offencesSchema,
  validateUrnSchema,
  caseRegistrationResponseSchema,
} from "../schemas";
import { ApiError } from "../common/errors/ApiError";
import { type TelemetryPayload } from "../TelemetryLogger";

export const CORRELATION_ID = "Correlation-Id";

const buildCommonHeaders = async (): Promise<Record<string, string>> => {
  return {
    [CORRELATION_ID]: uuidv4(),
    Authorization: `Bearer ${await getAccessToken([GATEWAY_SCOPE])}`,
  };
};

export const parseAndValidateResponse = async <T>(
  response: Response,
  url: string,
  schema: z.ZodType<T>,
  contextText: string,
): Promise<T> => {
  let parsedJson: unknown;
  try {
    parsedJson = await response.json();
  } catch (error) {
    throw new ApiError(`${error}`, url, response);
  }

  const result = schema.safeParse(parsedJson);

  if (!result.success) {
    console.warn(`${contextText} validation failed`, result.error);
    throw new ApiError(`response schema validation failed`, url, response);
  }

  return result.data;
};

export const getCaseAreasAndRegisteringUnits: () => Promise<CaseAreasAndRegisteringUnits> =
  async () => {
    const url = `${GATEWAY_BASE_URL}/api/v1/units`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        ...(await buildCommonHeaders()),
      },
    });

    if (!response.ok) {
      throw new ApiError(
        `Getting case areas and registering units failed`,
        url,
        response,
      );
    }

    const result = await parseAndValidateResponse<CaseAreasAndRegisteringUnits>(
      response,
      url,
      caseAreasAndRegisteringUnitsSchema,
      "caseAreasAndRegisteringUnitsSchema",
    );
    return result;
  };

export const getCaseAreasAndWitnessCareUnits = async () => {
  const url = `${GATEWAY_BASE_URL}/api/v1/wms-units`;

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      ...(await buildCommonHeaders()),
    },
  });

  if (!response.ok) {
    throw new ApiError(
      `Getting case areas and witness care units failed`,
      url,
      response,
    );
  }

  const result = await parseAndValidateResponse<CaseAreasAndWitnessCareUnits>(
    response,
    url,
    caseAreasAndWitnessCareUnitsSchema,
    "caseAreasAndWitnessCareUnitsSchema",
  );
  return result;
};

export const validateUrn = async (urn: string) => {
  const url = `${GATEWAY_BASE_URL}/api/v1/urns/${urn}/exists`;

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      ...(await buildCommonHeaders()),
    },
  });

  if (!response.ok) {
    throw new ApiError(`URN validation failed`, url, response);
  }

  const result = await parseAndValidateResponse<ValidateUrn>(
    response,
    url,
    validateUrnSchema,
    "validateUrnSchema",
  );
  return result;
};

export const getCourtsByUnitId = async (registeringUnitId: number) => {
  const url = `${GATEWAY_BASE_URL}/api/v1/courts/${registeringUnitId}`;
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      ...(await buildCommonHeaders()),
    },
  });

  if (!response.ok) {
    throw new ApiError(`getting courts by unit ID failed`, url, response);
  }

  const result = await parseAndValidateResponse<CourtLocations>(
    response,
    url,
    courtLocationsSchema,
    "courtLocationsSchema",
  );
  return result;
};

export const getCaseComplexities = async () => {
  const url = `${GATEWAY_BASE_URL}/api/v1/complexities`;
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      ...(await buildCommonHeaders()),
    },
  });

  if (!response.ok) {
    throw new ApiError(`getting case complexities failed`, url, response);
  }

  const result = await parseAndValidateResponse<CaseComplexities>(
    response,
    url,
    caseComplexitiesSchema,
    "caseComplexitiesSchema",
  );
  return result;
};

export const getCaseMonitoringCodes = async () => {
  const url = `${GATEWAY_BASE_URL}/api/v1/monitoring-codes`;
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      ...(await buildCommonHeaders()),
    },
  });

  if (!response.ok) {
    throw new ApiError(`getting monitoring codes failed`, url, response);
  }

  const result = await parseAndValidateResponse<CaseMonitoringCodes>(
    response,
    url,
    caseMonitoringCodesSchema,
    "caseMonitoringCodesSchema",
  );
  return result;
};

export const getCaseProsecutors = async (registeringUnitId: number) => {
  const url = `${GATEWAY_BASE_URL}/api/v1/prosecutors/${registeringUnitId}`;
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      ...(await buildCommonHeaders()),
    },
  });

  if (!response.ok) {
    throw new ApiError(`getting prosecutors by unit ID failed`, url, response);
  }

  const result = await parseAndValidateResponse<CaseProsecutors>(
    response,
    url,
    caseProsecutorsSchema,
    "caseProsecutorsSchema",
  );
  return result;
};

export const getCaseCaseworkers = async (registeringUnitId: number) => {
  const url = `${GATEWAY_BASE_URL}/api/v1/caseworkers/${registeringUnitId}`;
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      ...(await buildCommonHeaders()),
    },
  });

  if (!response.ok) {
    throw new ApiError(`getting caseworkers by unit ID failed`, url, response);
  }

  const result = await parseAndValidateResponse<CaseCaseworkers>(
    response,
    url,
    caseCaseworkersSchema,
    "caseCaseworkersSchema",
  );
  return result;
};

export const getInvestigatorTitles = async () => {
  const url = `${GATEWAY_BASE_URL}/api/v1/titles`;
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      ...(await buildCommonHeaders()),
    },
  });
  if (!response.ok) {
    throw new ApiError(`getting investigator titles failed`, url, response);
  }

  const result = await parseAndValidateResponse<InvestigatorTitles>(
    response,
    url,
    investigatorTitlesSchema,
    "investigatorTitlesSchema",
  );
  return result;
};

export const getGenders = async () => {
  const url = `${GATEWAY_BASE_URL}/api/v1/genders`;
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      ...(await buildCommonHeaders()),
    },
  });
  if (!response.ok) {
    throw new ApiError(`getting genders failed`, url, response);
  }

  const result = await parseAndValidateResponse<Genders>(
    response,
    url,
    gendersSchema,
    "gendersSchema",
  );
  return result;
};

export const getEthnicities = async () => {
  const url = `${GATEWAY_BASE_URL}/api/v1/ethnicities`;
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      ...(await buildCommonHeaders()),
    },
  });
  if (!response.ok) {
    throw new ApiError(`getting ethnicities failed`, url, response);
  }

  const result = await parseAndValidateResponse<Ethnicities>(
    response,
    url,
    ethnicitiesSchema,
    "ethnicitiesSchema",
  );
  return result;
};

export const getReligions = async () => {
  const url = `${GATEWAY_BASE_URL}/api/v1/religions`;
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      ...(await buildCommonHeaders()),
    },
  });
  if (!response.ok) {
    throw new ApiError(`getting religions failed`, url, response);
  }

  const result = await parseAndValidateResponse<Religions>(
    response,
    url,
    religionsSchema,
    "religionsSchema",
  );
  return result;
};

export const getOffenderTypes = async () => {
  const url = `${GATEWAY_BASE_URL}/api/v1/offender-categories`;
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      ...(await buildCommonHeaders()),
    },
  });
  if (!response.ok) {
    throw new ApiError(`getting offender categories failed`, url, response);
  }

  const result = await parseAndValidateResponse<OffenderTypes>(
    response,
    url,
    offenderTypesSchema,
    "offenderTypesSchema",
  );
  return result;
};

export const getPoliceUnits = async () => {
  const url = `${GATEWAY_BASE_URL}/api/v1/police-units`;
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      ...(await buildCommonHeaders()),
    },
  });
  if (!response.ok) {
    throw new ApiError(`getting police units failed`, url, response);
  }

  const result = await parseAndValidateResponse<PoliceUnits>(
    response,
    url,
    policeUnitsSchema,
    "policeUnitsSchema",
  );
  return result;
};

export const getOffences = async (
  searchText: string,
  resultsPerPage: number,
) => {
  const url = `${GATEWAY_BASE_URL}/api/v1/offences?legislation-partial=true&description-partial=true&items-per-page=${resultsPerPage}&multisearch-partial=true&multisearch=${searchText}`;
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      ...(await buildCommonHeaders()),
    },
  });
  if (!response.ok) {
    throw new ApiError(`getting offences failed`, url, response);
  }

  const result = await parseAndValidateResponse<Offences>(
    response,
    url,
    offencesSchema,
    "offencesSchema",
  );
  return result;
};
export const submitCaseRegistration = async (
  data: CaseRegistrationRequestData,
) => {
  const url = `${GATEWAY_BASE_URL}/api/v1/cases`;
  const response = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: {
      ...(await buildCommonHeaders()),
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new ApiError(`registering case api failed `, url, response);
  }

  const result = await parseAndValidateResponse<CaseRegistrationResponse>(
    response,
    url,
    caseRegistrationResponseSchema,
    "caseRegistrationResponseSchema",
  );
  return result;
};

export const logTelemetryEvent = async (payload: TelemetryPayload) => {
  try {
    const url = `${GATEWAY_BASE_URL}/api/v1/telemetry`;
    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        ...(await buildCommonHeaders()),
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      console.warn("logging telemetry event failed");
    }
  } catch (error) {
    // Fail silently to ensure UI flows remain unblocked
    console.warn(
      "Logging telemetry event failed due to network or auth error:",
      error,
    );
  }
};
