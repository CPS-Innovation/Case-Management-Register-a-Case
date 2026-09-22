import { render, waitFor } from "@testing-library/react";
import {
  type Mock,
  vi,
  describe,
  it,
  beforeEach,
  afterEach,
  expect,
} from "vitest";
import { type UseQueryOptions } from "@tanstack/react-query";

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(),
}));

vi.mock("react-router", () => ({
  useNavigate: vi.fn(),
}));

import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import useAuthedQuery from "./useAuthedQuery";
import { ApiError } from "../errors/ApiError";

const useQueryMock = useQuery as unknown as Mock;
const useNavigateMock = useNavigate as unknown as Mock;

function TestComponent(props: { options: UseQueryOptions }) {
  useAuthedQuery(props.options);
  return null;
}

describe("useAuthedQuery", () => {
  const navigateFn = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useNavigateMock.mockReturnValue(navigateFn);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("navigates to /unauthorised when query.error is ApiError with code 401", async () => {
    const apiErr = new ApiError("unauth", "/api/v1/units", {
      status: 401,
      statusText: "Unauthorized",
    });

    useQueryMock.mockReturnValue({ error: apiErr });

    render(<TestComponent options={{ queryKey: ["k"] }} />);

    await waitFor(() => {
      expect(navigateFn).toHaveBeenCalledWith("/unauthorised", {
        replace: true,
      });
    });
  });

  it("does not navigate for non-401 ApiError", async () => {
    const apiErr = new ApiError("unauth", "/api/v1/units", {
      status: 403,
      statusText: "Forbidden",
    });
    useQueryMock.mockReturnValue({ error: apiErr });

    render(<TestComponent options={{ queryKey: ["k"] }} />);

    await waitFor(() => {
      expect(navigateFn).not.toHaveBeenCalled();
    });
  });

  it("provides a throwOnError function that returns false for ApiError(401) and true otherwise", () => {
    useQueryMock.mockReturnValue({ error: null });

    render(<TestComponent options={{ queryKey: ["k"] }} />);

    const param = useQueryMock.mock.calls[0][0];
    expect(typeof param.throwOnError).toBe("function");

    expect(
      param.throwOnError(
        new ApiError("api error", "path", {
          status: 401,
          statusText: "Unauthorized",
        }),
      ),
    ).toBe(false);

    expect(
      param.throwOnError(
        new ApiError("api error", "path", {
          status: 403,
          statusText: "Forbidden",
        }),
      ),
    ).toBe(true);

    expect(param.throwOnError(new Error("other"))).toBe(true);
  });
});
