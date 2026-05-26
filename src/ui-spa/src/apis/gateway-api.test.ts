import {
  getCaseAreasAndRegisteringUnits,
  getCaseAreasAndWitnessCareUnits,
  validateUrn,
  getCourtsByUnitId,
  getCaseComplexities,
  getCaseMonitoringCodes,
  getCaseProsecutors,
  getCaseCaseworkers,
  getInvestigatorTitles,
  submitCaseRegistration,
  getGenders,
  getEthnicities,
  getReligions,
  getOffenderTypes,
  getPoliceUnits,
  getOffences,
} from "./gateway-api";
import { ApiError } from "../common/errors/ApiError";

vi.mock("../auth", () => ({
  getAccessToken: vi.fn().mockResolvedValue("access-token"),
}));

vi.mock("../config", () => ({
  GATEWAY_BASE_URL: "https://mocked-out-api",
  GATEWAY_SCOPE: "gateway_scope",
}));

vi.mock("uuid", () => ({
  v4: () => "mock-uuid",
}));

describe("gateway-api", () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getCaseAreasAndRegisteringUnits - success", async () => {
    const mockBody = {
      allUnits: [
        {
          areaId: 2,
          areaDescription: "RMU area",
          areaIsSensitive: false,
          id: 3,
          description: "RMU unit",
        },
        {
          areaId: 1008,
          areaDescription: "CAMBRIDGESHIRE",
          areaIsSensitive: false,
          id: 2033,
          description: "SOUTHERN CJU (Cambridge)",
        },
      ],
      homeUnit: {
        areaId: 1008,
        areaDescription: "CAMBRIDGESHIRE",
        areaIsSensitive: false,
        id: 2033,
        description: "SOUTHERN CJU (Cambridge)",
      },
    };
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockBody,
    });

    const result = await getCaseAreasAndRegisteringUnits();
    expect(result).toEqual(mockBody);
    expect(fetch).toHaveBeenCalledWith(
      "https://mocked-out-api/api/v1/units",
      expect.objectContaining({
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: "Bearer access-token",
          "Correlation-Id": "mock-uuid",
        },
      }),
    );
  });
  it("getCaseAreasAndRegisteringUnits - failure throws ApiError", async () => {
    (globalThis.fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    await expect(getCaseAreasAndRegisteringUnits()).rejects.toBeInstanceOf(
      ApiError,
    );
    await expect(getCaseAreasAndRegisteringUnits()).rejects.toThrow(
      "API Error: https://mocked-out-api/api/v1/units returned 500 Internal Server Error - Getting case areas and registering units failed",
    );
  });

  it("getCaseAreasAndRegisteringUnits - invalid json response throws error", async () => {
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: () => Promise.reject(new SyntaxError("Unexpected token < in JSON")),
    });

    await expect(getCaseAreasAndRegisteringUnits()).rejects.toBeInstanceOf(
      ApiError,
    );
    await expect(getCaseAreasAndRegisteringUnits()).rejects.toThrow(
      "API Error: https://mocked-out-api/api/v1/units returned 200 OK - SyntaxError: Unexpected token < in JSON",
    );
  });

  it("getCaseAreasAndRegisteringUnits - response schema validation failed", async () => {
    const mockBody = {
      allUnits: [
        {
          areaId: 2,
          areaDescription: "RMU area",
          areaIsSensitive: false,
          id: 3,
          description: "RMU unit",
        },
      ],
    };
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => mockBody,
    });

    await expect(getCaseAreasAndRegisteringUnits()).rejects.toBeInstanceOf(
      ApiError,
    );
    await expect(getCaseAreasAndRegisteringUnits()).rejects.toThrow(
      "API Error: https://mocked-out-api/api/v1/units returned 200 OK - response schema validation failed",
    );
  });

  it("getCaseAreasAndWitnessCareUnits - success", async () => {
    const mockBody = [
      {
        areaId: 2,
        areaDescription: "B",
        id: 20,
        description: "e",
        isWCU: true,
      },
    ];
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockBody,
    });
    const result = await getCaseAreasAndWitnessCareUnits();
    expect(result).toEqual(mockBody);
    expect(fetch).toHaveBeenCalledWith(
      "https://mocked-out-api/api/v1/wms-units",
      expect.objectContaining({
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: "Bearer access-token",
          "Correlation-Id": "mock-uuid",
        },
      }),
    );
  });
  it("getCaseAreasAndWitnessCareUnits - failure throws ApiError", async () => {
    (globalThis.fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    await expect(getCaseAreasAndWitnessCareUnits()).rejects.toBeInstanceOf(
      ApiError,
    );
    await expect(getCaseAreasAndWitnessCareUnits()).rejects.toThrow(
      "API Error: https://mocked-out-api/api/v1/wms-units returned 500 Internal Server Error - Getting case areas and witness care units failed",
    );
  });
  it("getCaseAreasAndWitnessCareUnits - invalid json response throws error", async () => {
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: () => Promise.reject(new SyntaxError("Unexpected token < in JSON")),
    });

    await expect(getCaseAreasAndWitnessCareUnits()).rejects.toBeInstanceOf(
      ApiError,
    );
    await expect(getCaseAreasAndWitnessCareUnits()).rejects.toThrow(
      "API Error: https://mocked-out-api/api/v1/wms-units returned 200 OK - SyntaxError: Unexpected token < in JSON",
    );
  });
  it("getCaseAreasAndWitnessCareUnits - response schema validation failed", async () => {
    const mockBody = [
      {
        areaId: 2,
        areaDescription: "B",
        id: 20,
        description1: "e",
        isWCU1: true,
      },
    ];
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => mockBody,
    });
    await expect(getCaseAreasAndWitnessCareUnits()).rejects.toBeInstanceOf(
      ApiError,
    );
    await expect(getCaseAreasAndWitnessCareUnits()).rejects.toThrow(
      "API Error: https://mocked-out-api/api/v1/wms-units returned 200 OK - response schema validation failed",
    );
  });

  it("validateUrn - success", async () => {
    const mockBody = true;
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockBody,
    });
    const result = await validateUrn("URN123");
    expect(result).toEqual(mockBody);
    expect(fetch).toHaveBeenCalledWith(
      "https://mocked-out-api/api/v1/urns/URN123/exists",
      expect.objectContaining({
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: "Bearer access-token",
          "Correlation-Id": "mock-uuid",
        },
      }),
    );
  });
  it("validateUrn - failure throws ApiError", async () => {
    (globalThis.fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    await expect(validateUrn("URN123")).rejects.toBeInstanceOf(ApiError);
    await expect(validateUrn("URN123")).rejects.toThrow(
      "API Error: https://mocked-out-api/api/v1/urns/URN123/exists returned 500 Internal Server Error - URN validation failed",
    );
  });

  it("validateUrn - invalid json response throws error", async () => {
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: () => Promise.reject(new SyntaxError("Unexpected token < in JSON")),
    });

    await expect(validateUrn("URN123")).rejects.toBeInstanceOf(ApiError);
    await expect(validateUrn("URN123")).rejects.toThrow(
      "API Error: https://mocked-out-api/api/v1/urns/URN123/exists returned 200 OK - SyntaxError: Unexpected token < in JSON",
    );
  });
  it("validateUrn - response schema validation failed", async () => {
    const mockBody = "abc";
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => mockBody,
    });
    await expect(validateUrn("URN123")).rejects.toBeInstanceOf(ApiError);
    await expect(validateUrn("URN123")).rejects.toThrow(
      "API Error: https://mocked-out-api/api/v1/urns/URN123/exists returned 200 OK - response schema validation failed",
    );
  });

  it("getCourtsByUnitId - success", async () => {
    const mockBody = [
      { id: 1, description: "Court A" },
      { id: 2, description: "Court B" },
    ];
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockBody,
    });
    const result = await getCourtsByUnitId(20);
    expect(result).toEqual(mockBody);
    expect(fetch).toHaveBeenCalledWith(
      "https://mocked-out-api/api/v1/courts/20",
      expect.objectContaining({
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: "Bearer access-token",
          "Correlation-Id": "mock-uuid",
        },
      }),
    );
  });
  it("getCourtsByUnitId - failure throws ApiError", async () => {
    (globalThis.fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    await expect(getCourtsByUnitId(20)).rejects.toBeInstanceOf(ApiError);
    await expect(getCourtsByUnitId(20)).rejects.toThrow(
      "API Error: https://mocked-out-api/api/v1/courts/20 returned 500 Internal Server Error - getting courts by unit ID failed",
    );
  });
  it("getCourtsByUnitId - invalid json response throws error", async () => {
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: () => Promise.reject(new SyntaxError("Unexpected token < in JSON")),
    });

    await expect(getCourtsByUnitId(20)).rejects.toBeInstanceOf(ApiError);
    await expect(getCourtsByUnitId(20)).rejects.toThrow(
      "API Error: https://mocked-out-api/api/v1/courts/20 returned 200 OK - SyntaxError: Unexpected token < in JSON",
    );
  });
  it("getCourtsByUnitId - response schema validation failed", async () => {
    const mockBody = "abc";
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => mockBody,
    });
    await expect(getCourtsByUnitId(20)).rejects.toBeInstanceOf(ApiError);
    await expect(getCourtsByUnitId(20)).rejects.toThrow(
      "API Error: https://mocked-out-api/api/v1/courts/20 returned 200 OK - response schema validation failed",
    );
  });

  it("getCaseComplexities - success", async () => {
    const mockBody = [
      { shortCode: "A", description: "Low" },
      { shortCode: "B", description: "High" },
    ];
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockBody,
    });
    const result = await getCaseComplexities();
    expect(result).toEqual(mockBody);
    expect(fetch).toHaveBeenCalledWith(
      "https://mocked-out-api/api/v1/complexities",
      expect.objectContaining({
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: "Bearer access-token",
          "Correlation-Id": "mock-uuid",
        },
      }),
    );
  });
  it("getCaseComplexities - failure throws ApiError", async () => {
    (globalThis.fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    await expect(getCaseComplexities()).rejects.toBeInstanceOf(ApiError);
    await expect(getCaseComplexities()).rejects.toThrow(
      "API Error: https://mocked-out-api/api/v1/complexities returned 500 Internal Server Error - getting case complexities failed",
    );
  });
  it("getCaseComplexities - invalid json response throws error", async () => {
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: () => Promise.reject(new SyntaxError("Unexpected token < in JSON")),
    });

    await expect(getCaseComplexities()).rejects.toBeInstanceOf(ApiError);
    await expect(getCaseComplexities()).rejects.toThrow(
      "API Error: https://mocked-out-api/api/v1/complexities returned 200 OK - SyntaxError: Unexpected token < in JSON",
    );
  });
  it("getCaseComplexities - response schema validation failed", async () => {
    const mockBody = "abc";
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => mockBody,
    });
    await expect(getCaseComplexities()).rejects.toBeInstanceOf(ApiError);
    await expect(getCaseComplexities()).rejects.toThrow(
      "API Error: https://mocked-out-api/api/v1/complexities returned 200 OK - response schema validation failed",
    );
  });

  it("getCaseMonitoringCodes - success", async () => {
    const mockBody = [
      {
        code: "ATRY",
        description: "Asset Recovery",
        display: "Asset Recovery",
      },
    ];
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockBody,
    });
    const result = await getCaseMonitoringCodes();
    expect(result).toEqual(mockBody);
    expect(fetch).toHaveBeenCalledWith(
      "https://mocked-out-api/api/v1/monitoring-codes",
      expect.objectContaining({
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: "Bearer access-token",
          "Correlation-Id": "mock-uuid",
        },
      }),
    );
  });
  it("getCaseMonitoringCodes - failure throws ApiError", async () => {
    (globalThis.fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    await expect(getCaseMonitoringCodes()).rejects.toBeInstanceOf(ApiError);
    await expect(getCaseMonitoringCodes()).rejects.toThrow(
      "API Error: https://mocked-out-api/api/v1/monitoring-codes returned 500 Internal Server Error - getting monitoring codes failed",
    );
  });
  it("getCaseMonitoringCodes - invalid json response throws error", async () => {
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: () => Promise.reject(new SyntaxError("Unexpected token < in JSON")),
    });

    await expect(getCaseMonitoringCodes()).rejects.toBeInstanceOf(ApiError);
    await expect(getCaseMonitoringCodes()).rejects.toThrow(
      "API Error: https://mocked-out-api/api/v1/monitoring-codes returned 200 OK - SyntaxError: Unexpected token < in JSON",
    );
  });
  it("getCaseMonitoringCodes - response schema validation failed", async () => {
    const mockBody = "abc";
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => mockBody,
    });
    await expect(getCaseMonitoringCodes()).rejects.toBeInstanceOf(ApiError);
    await expect(getCaseMonitoringCodes()).rejects.toThrow(
      "API Error: https://mocked-out-api/api/v1/monitoring-codes returned 200 OK - response schema validation failed",
    );
  });

  it("getCaseProsecutors - success", async () => {
    const mockBody = [
      { id: 1, description: "Prosecutor A" },
      { id: 2, description: "Prosecutor B" },
    ];
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockBody,
    });
    const result = await getCaseProsecutors(20);
    expect(result).toEqual(mockBody);
    expect(fetch).toHaveBeenCalledWith(
      "https://mocked-out-api/api/v1/prosecutors/20",
      expect.objectContaining({
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: "Bearer access-token",
          "Correlation-Id": "mock-uuid",
        },
      }),
    );
  });
  it("getCaseProsecutors - failure throws ApiError", async () => {
    (globalThis.fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    await expect(getCaseProsecutors(20)).rejects.toBeInstanceOf(ApiError);
    await expect(getCaseProsecutors(20)).rejects.toThrow(
      "API Error: https://mocked-out-api/api/v1/prosecutors/20 returned 500 Internal Server Error - getting prosecutors by unit ID failed",
    );
  });
  it("getCaseProsecutors - invalid json response throws error", async () => {
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: () => Promise.reject(new SyntaxError("Unexpected token < in JSON")),
    });

    await expect(getCaseProsecutors(20)).rejects.toBeInstanceOf(ApiError);
    await expect(getCaseProsecutors(20)).rejects.toThrow(
      "API Error: https://mocked-out-api/api/v1/prosecutors/20 returned 200 OK - SyntaxError: Unexpected token < in JSON",
    );
  });
  it("getCaseProsecutors - response schema validation failed", async () => {
    const mockBody = "abc";
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => mockBody,
    });
    await expect(getCaseProsecutors(20)).rejects.toBeInstanceOf(ApiError);
    await expect(getCaseProsecutors(20)).rejects.toThrow(
      "API Error: https://mocked-out-api/api/v1/prosecutors/20 returned 200 OK - response schema validation failed",
    );
  });

  it("getCaseCaseworkers - success", async () => {
    const mockBody = [
      { id: 1, description: "caseworker A" },
      { id: 2, description: "caseworker B" },
    ];
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockBody,
    });
    const result = await getCaseCaseworkers(20);
    expect(result).toEqual(mockBody);
    expect(fetch).toHaveBeenCalledWith(
      "https://mocked-out-api/api/v1/caseworkers/20",
      expect.objectContaining({
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: "Bearer access-token",
          "Correlation-Id": "mock-uuid",
        },
      }),
    );
  });
  it("getCaseCaseworkers - failure throws ApiError", async () => {
    (globalThis.fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    await expect(getCaseCaseworkers(20)).rejects.toBeInstanceOf(ApiError);
    await expect(getCaseCaseworkers(20)).rejects.toThrow(
      "API Error: https://mocked-out-api/api/v1/caseworkers/20 returned 500 Internal Server Error - getting caseworkers by unit ID failed",
    );
  });

  it("getCaseCaseworkers - invalid json response throws error", async () => {
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: () => Promise.reject(new SyntaxError("Unexpected token < in JSON")),
    });

    await expect(getCaseCaseworkers(20)).rejects.toBeInstanceOf(ApiError);
    await expect(getCaseCaseworkers(20)).rejects.toThrow(
      "API Error: https://mocked-out-api/api/v1/caseworkers/20 returned 200 OK - SyntaxError: Unexpected token < in JSON",
    );
  });
  it("getCaseCaseworkers - response schema validation failed", async () => {
    const mockBody = "abc";
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => mockBody,
    });
    await expect(getCaseCaseworkers(20)).rejects.toBeInstanceOf(ApiError);
    await expect(getCaseCaseworkers(20)).rejects.toThrow(
      "API Error: https://mocked-out-api/api/v1/caseworkers/20 returned 200 OK - response schema validation failed",
    );
  });

  it("getInvestigatorTitles - success", async () => {
    const mockBody = [
      {
        shortCode: "PC",
        description: "Police Constable",
        display: "Police Constable",
        isPoliceTitle: true,
      },
    ];
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockBody,
    });
    const result = await getInvestigatorTitles();
    expect(result).toEqual(mockBody);
    expect(fetch).toHaveBeenCalledWith(
      "https://mocked-out-api/api/v1/titles",
      expect.objectContaining({
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: "Bearer access-token",
          "Correlation-Id": "mock-uuid",
        },
      }),
    );
  });
  it("getInvestigatorTitles - failure throws ApiError", async () => {
    (globalThis.fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    await expect(getInvestigatorTitles()).rejects.toBeInstanceOf(ApiError);
    await expect(getInvestigatorTitles()).rejects.toThrow(
      "API Error: https://mocked-out-api/api/v1/titles returned 500 Internal Server Error - getting investigator titles failed",
    );
  });
  it("getInvestigatorTitles - invalid json response throws error", async () => {
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: () => Promise.reject(new SyntaxError("Unexpected token < in JSON")),
    });

    await expect(getInvestigatorTitles()).rejects.toBeInstanceOf(ApiError);
    await expect(getInvestigatorTitles()).rejects.toThrow(
      "API Error: https://mocked-out-api/api/v1/titles returned 200 OK - SyntaxError: Unexpected token < in JSON",
    );
  });
  it("getInvestigatorTitles - response schema validation failed", async () => {
    const mockBody = "abc";
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => mockBody,
    });
    await expect(getInvestigatorTitles()).rejects.toBeInstanceOf(ApiError);
    await expect(getInvestigatorTitles()).rejects.toThrow(
      "API Error: https://mocked-out-api/api/v1/titles returned 200 OK - response schema validation failed",
    );
  });

  it("getGenders - success", async () => {
    const mockBody = [
      { shortCode: "male", description: "Male" },
      { shortCode: "female", description: "Female" },
    ];
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockBody,
    });
    const result = await getGenders();
    expect(result).toEqual(mockBody);
    expect(fetch).toHaveBeenCalledWith(
      "https://mocked-out-api/api/v1/genders",
      expect.objectContaining({
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: "Bearer access-token",
          "Correlation-Id": "mock-uuid",
        },
      }),
    );
  });
  it("getGenders - failure throws ApiError", async () => {
    (globalThis.fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    await expect(getGenders()).rejects.toBeInstanceOf(ApiError);
    await expect(getGenders()).rejects.toThrow(
      "API Error: https://mocked-out-api/api/v1/genders returned 500 Internal Server Error - getting genders failed",
    );
  });
  it("getGenders - invalid json response throws error", async () => {
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: () => Promise.reject(new SyntaxError("Unexpected token < in JSON")),
    });

    await expect(getGenders()).rejects.toBeInstanceOf(ApiError);
    await expect(getGenders()).rejects.toThrow(
      "API Error: https://mocked-out-api/api/v1/genders returned 200 OK - SyntaxError: Unexpected token < in JSON",
    );
  });
  it("getGenders - response schema validation failed", async () => {
    const mockBody = "abc";
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => mockBody,
    });
    await expect(getGenders()).rejects.toBeInstanceOf(ApiError);
    await expect(getGenders()).rejects.toThrow(
      "API Error: https://mocked-out-api/api/v1/genders returned 200 OK - response schema validation failed",
    );
  });

  it("getEthnicities - success", async () => {
    const mockBody = [
      { shortCode: "black", description: "Black" },
      { shortCode: "white", description: "White" },
    ];
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockBody,
    });
    const result = await getEthnicities();
    expect(result).toEqual(mockBody);
    expect(fetch).toHaveBeenCalledWith(
      "https://mocked-out-api/api/v1/ethnicities",
      expect.objectContaining({
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: "Bearer access-token",
          "Correlation-Id": "mock-uuid",
        },
      }),
    );
  });
  it("getEthnicities - failure throws ApiError", async () => {
    (globalThis.fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    await expect(getEthnicities()).rejects.toBeInstanceOf(ApiError);
    await expect(getEthnicities()).rejects.toThrow(
      "API Error: https://mocked-out-api/api/v1/ethnicities returned 500 Internal Server Error - getting ethnicities failed",
    );
  });

  it("getEthnicities - invalid json response throws error", async () => {
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: () => Promise.reject(new SyntaxError("Unexpected token < in JSON")),
    });

    await expect(getEthnicities()).rejects.toBeInstanceOf(ApiError);
    await expect(getEthnicities()).rejects.toThrow(
      "API Error: https://mocked-out-api/api/v1/ethnicities returned 200 OK - SyntaxError: Unexpected token < in JSON",
    );
  });
  it("getEthnicities - response schema validation failed", async () => {
    const mockBody = "abc";
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => mockBody,
    });
    await expect(getEthnicities()).rejects.toBeInstanceOf(ApiError);
    await expect(getEthnicities()).rejects.toThrow(
      "API Error: https://mocked-out-api/api/v1/ethnicities returned 200 OK - response schema validation failed",
    );
  });

  it("getReligions - success", async () => {
    const mockBody = [
      { shortCode: "christianity", description: "Christianity" },
      { shortCode: "Buddhism", description: "Buddhism" },
    ];
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockBody,
    });
    const result = await getReligions();
    expect(result).toEqual(mockBody);
    expect(fetch).toHaveBeenCalledWith(
      "https://mocked-out-api/api/v1/religions",
      expect.objectContaining({
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: "Bearer access-token",
          "Correlation-Id": "mock-uuid",
        },
      }),
    );
  });
  it("getReligions - failure throws ApiError", async () => {
    (globalThis.fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    await expect(getReligions()).rejects.toBeInstanceOf(ApiError);
    await expect(getReligions()).rejects.toThrow(
      "API Error: https://mocked-out-api/api/v1/religions returned 500 Internal Server Error - getting religions failed",
    );
  });

  it("getReligions - invalid json response throws error", async () => {
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: () => Promise.reject(new SyntaxError("Unexpected token < in JSON")),
    });

    await expect(getReligions()).rejects.toBeInstanceOf(ApiError);
    await expect(getReligions()).rejects.toThrow(
      "API Error: https://mocked-out-api/api/v1/religions returned 200 OK - SyntaxError: Unexpected token < in JSON",
    );
  });
  it("getReligions - response schema validation failed", async () => {
    const mockBody = "abc";
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => mockBody,
    });
    await expect(getReligions()).rejects.toBeInstanceOf(ApiError);
    await expect(getReligions()).rejects.toThrow(
      "API Error: https://mocked-out-api/api/v1/religions returned 200 OK - response schema validation failed",
    );
  });

  it("getOffenderTypes - success", async () => {
    const mockBody = [
      {
        shortCode: "PP",
        description: "PPO",
        display: "Prolific priority offender (PPO)",
      },
    ];
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockBody,
    });
    const result = await getOffenderTypes();
    expect(result).toEqual(mockBody);
    expect(fetch).toHaveBeenCalledWith(
      "https://mocked-out-api/api/v1/offender-categories",
      expect.objectContaining({
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: "Bearer access-token",
          "Correlation-Id": "mock-uuid",
        },
      }),
    );
  });
  it("getOffenderTypes - failure throws ApiError", async () => {
    (globalThis.fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    await expect(getOffenderTypes()).rejects.toBeInstanceOf(ApiError);
    await expect(getOffenderTypes()).rejects.toThrow(
      "API Error: https://mocked-out-api/api/v1/offender-categories returned 500 Internal Server Error - getting offender categories failed",
    );
  });

  it("getOffenderTypes - invalid json response throws error", async () => {
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: () => Promise.reject(new SyntaxError("Unexpected token < in JSON")),
    });

    await expect(getOffenderTypes()).rejects.toBeInstanceOf(ApiError);
    await expect(getOffenderTypes()).rejects.toThrow(
      "API Error: https://mocked-out-api/api/v1/offender-categories returned 200 OK - SyntaxError: Unexpected token < in JSON",
    );
  });
  it("getOffenderTypes - response schema validation failed", async () => {
    const mockBody = "abc";
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => mockBody,
    });
    await expect(getOffenderTypes()).rejects.toBeInstanceOf(ApiError);
    await expect(getOffenderTypes()).rejects.toThrow(
      "API Error: https://mocked-out-api/api/v1/offender-categories returned 200 OK - response schema validation failed",
    );
  });

  it("getPoliceUnits - success", async () => {
    const mockBody = [
      {
        unitId: 2213,
        unitDescription: "Northern CJU (Bristol)",
        code: "SB",
        description: "Avon & Somerset Constabulary (Northern Team)",
      },
    ];
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockBody,
    });
    const result = await getPoliceUnits();
    expect(result).toEqual(mockBody);
    expect(fetch).toHaveBeenCalledWith(
      "https://mocked-out-api/api/v1/police-units",
      expect.objectContaining({
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: "Bearer access-token",
          "Correlation-Id": "mock-uuid",
        },
      }),
    );
  });
  it("getPoliceUnits - failure throws ApiError", async () => {
    (globalThis.fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    await expect(getPoliceUnits()).rejects.toBeInstanceOf(ApiError);
    await expect(getPoliceUnits()).rejects.toThrow(
      "API Error: https://mocked-out-api/api/v1/police-units returned 500 Internal Server Error - getting police units failed",
    );
  });

  it("getPoliceUnits - invalid json response throws error", async () => {
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: () => Promise.reject(new SyntaxError("Unexpected token < in JSON")),
    });

    await expect(getPoliceUnits()).rejects.toBeInstanceOf(ApiError);
    await expect(getPoliceUnits()).rejects.toThrow(
      "API Error: https://mocked-out-api/api/v1/police-units returned 200 OK - SyntaxError: Unexpected token < in JSON",
    );
  });
  it("getPoliceUnits - response schema validation failed", async () => {
    const mockBody = "abc";
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => mockBody,
    });
    await expect(getPoliceUnits()).rejects.toBeInstanceOf(ApiError);
    await expect(getPoliceUnits()).rejects.toThrow(
      "API Error: https://mocked-out-api/api/v1/police-units returned 200 OK - response schema validation failed",
    );
  });

  it("getOffences - success", async () => {
    const mockBody = {
      offences: [
        {
          cmsId: 10001,
          code: "WC81229",
          description: "Permit to be set trap etc - cause injury to wild bird",
          legislation:
            "Contrary to sections 5(1)(f) and 21(1) of the Wildlife and Countryside Act 1981.",
          effectiveFromDate: "1998-03-17T00:00:00",
          effectiveToDate: "1998-04-17T00:00:00",
          modeOfTrial: "abc",
          cmsModeOfTrialShortCode: "NYC",
        },
      ],
      total: 3,
    };

    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockBody,
    });
    const result = await getOffences("search-text", 100);
    expect(result).toEqual(mockBody);
    expect(fetch).toHaveBeenCalledWith(
      "https://mocked-out-api/api/v1/offences?legislation-partial=true&description-partial=true&items-per-page=100&multisearch-partial=true&multisearch=search-text",
      expect.objectContaining({
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: "Bearer access-token",
          "Correlation-Id": "mock-uuid",
        },
      }),
    );
  });
  it("getOffences - failure throws ApiError", async () => {
    (globalThis.fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    await expect(getOffences("search-text", 100)).rejects.toBeInstanceOf(
      ApiError,
    );
    await expect(getOffences("search-text", 100)).rejects.toThrow(
      "API Error: https://mocked-out-api/api/v1/offences?legislation-partial=true&description-partial=true&items-per-page=100&multisearch-partial=true&multisearch=search-text returned 500 Internal Server Error",
    );
  });

  it("getOffences - invalid json response throws error", async () => {
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: () => Promise.reject(new SyntaxError("Unexpected token < in JSON")),
    });

    await expect(getOffences("search-text", 100)).rejects.toBeInstanceOf(
      ApiError,
    );
    await expect(getOffences("search-text", 100)).rejects.toThrow(
      "API Error: https://mocked-out-api/api/v1/offences?legislation-partial=true&description-partial=true&items-per-page=100&multisearch-partial=true&multisearch=search-text returned 200 OK - SyntaxError: Unexpected token < in JSON",
    );
  });
  it("getOffences - response schema validation failed", async () => {
    const mockBody = "abc";
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => mockBody,
    });
    await expect(getOffences("search-text", 100)).rejects.toBeInstanceOf(
      ApiError,
    );
    await expect(getOffences("search-text", 100)).rejects.toThrow(
      "API Error: https://mocked-out-api/api/v1/offences?legislation-partial=true&description-partial=true&items-per-page=100&multisearch-partial=true&multisearch=search-text returned 200 OK - response schema validation failed",
    );
  });

  it("submitCaseRegistration - success", async () => {
    const mockRequest = { mockRequestData: {} } as any;
    const mockResponse = { caseId: 1234 };
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });
    const result = await submitCaseRegistration(mockRequest);
    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith(
      "https://mocked-out-api/api/v1/cases",
      expect.objectContaining({
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: "Bearer access-token",
          "Correlation-Id": "mock-uuid",
        },
      }),
    );
  });
  it("submitCaseRegistration - failure throws ApiError", async () => {
    const mockRequest = { mockRequestData: {} } as any;
    (globalThis.fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(submitCaseRegistration(mockRequest)).rejects.toBeInstanceOf(
      ApiError,
    );
  });
  it("submitCaseRegistration - invalid json response throws error", async () => {
    const mockRequest = { mockRequestData: {} } as any;
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: () => Promise.reject(new SyntaxError("Unexpected token < in JSON")),
    });

    await expect(submitCaseRegistration(mockRequest)).rejects.toBeInstanceOf(
      ApiError,
    );
    await expect(submitCaseRegistration(mockRequest)).rejects.toThrow(
      "API Error: https://mocked-out-api/api/v1/cases returned 200 OK - SyntaxError: Unexpected token < in JSON",
    );
  });
  it("submitCaseRegistration - response schema validation failed", async () => {
    const mockRequest = { mockRequestData: {} } as any;
    const mockBody = "abc";
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => mockBody,
    });
    await expect(submitCaseRegistration(mockRequest)).rejects.toBeInstanceOf(
      ApiError,
    );
    await expect(submitCaseRegistration(mockRequest)).rejects.toThrow(
      "API Error: https://mocked-out-api/api/v1/cases returned 200 OK - response schema validation failed",
    );
  });
});
