import React from "react";
import { render } from "@testing-library/react";
import { type Mock } from "vitest";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("../../TelemetryLogger", () => ({
  telemetryService: {
    trackPageView: vi.fn(),
  },
}));

vi.mock("react-router", () => ({
  useLocation: vi.fn(),
}));

import { telemetryService } from "../../TelemetryLogger";
import { useLocation } from "react-router";
import { CaseRegistrationFormContext } from "../providers/CaseRegistrationProvider";
import usePageView from "./usePageView";

function TestComponent() {
  usePageView();
  return null;
}

describe("usePageView", () => {
  const mockedUseLocation = useLocation as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("calls telemetryService.trackPageView with the expected payload when pathname changes and journeyId is present", () => {
    const pathname = "/case-registration";
    mockedUseLocation.mockImplementation(() => ({
      pathname,
    }));

    const providerValue = {
      state: { telemetryData: { journeyId: "J1" } },
    } as unknown as React.ContextType<typeof CaseRegistrationFormContext>;

    render(
      <CaseRegistrationFormContext.Provider value={providerValue}>
        <TestComponent />
      </CaseRegistrationFormContext.Provider>,
    );

    expect(telemetryService.trackPageView).toHaveBeenCalledTimes(1);

    const call = (telemetryService.trackPageView as Mock).mock.calls[0];

    const expectedPageName = "Home";
    const expectedProperties = [{ journeyId: "J1" }, { path: pathname }];

    expect(call).toEqual([expectedPageName, expectedProperties]);
  });

  it("does not call trackPageView when journeyId is missing", () => {
    mockedUseLocation.mockImplementation(() => ({
      pathname: "/case-registration/step-1",
    }));

    const providerValue = {
      state: { telemetryData: { journeyId: "" } },
    } as unknown as React.ContextType<typeof CaseRegistrationFormContext>;

    render(
      <CaseRegistrationFormContext.Provider value={providerValue}>
        <TestComponent />
      </CaseRegistrationFormContext.Provider>,
    );

    expect(telemetryService.trackPageView).not.toHaveBeenCalled();
  });

  it("does not call trackPageView again if pathname hasn't changed", () => {
    mockedUseLocation.mockImplementation(() => ({
      pathname: "/case-registration/",
    }));

    const providerValue = {
      state: { telemetryData: { journeyId: "J1" } },
    } as unknown as React.ContextType<typeof CaseRegistrationFormContext>;

    const { rerender } = render(
      <CaseRegistrationFormContext.Provider value={providerValue}>
        <TestComponent />
      </CaseRegistrationFormContext.Provider>,
    );

    expect(telemetryService.trackPageView).toHaveBeenCalledTimes(1);

    mockedUseLocation.mockImplementation(() => ({
      pathname: "/case-registration/",
    }));
    rerender(
      <CaseRegistrationFormContext.Provider value={providerValue}>
        <TestComponent />
      </CaseRegistrationFormContext.Provider>,
    );

    expect(telemetryService.trackPageView).toHaveBeenCalledTimes(1);
  });
});
