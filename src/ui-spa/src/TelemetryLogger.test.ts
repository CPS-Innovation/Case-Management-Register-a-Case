import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { telemetryService, TelemetryType } from "./TelemetryLogger";

// mock the gateway API used by TelemetryLogger
vi.mock("./apis/gateway-api", () => ({
  logTelemetryEvent: vi.fn(),
}));

import { logTelemetryEvent } from "./apis/gateway-api";

const getSentPayload = () =>
  (logTelemetryEvent as any).mock.calls[0][0] as Record<string, any>;

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("TelemetryService", () => {
  it("trackEvent sends an Event payload with name + props", async () => {
    await telemetryService.trackEvent("JourneyStarted" as any, [
      { journeyId: "J1" },
    ]);

    expect(logTelemetryEvent).toHaveBeenCalledTimes(1);
    const sent = getSentPayload();

    const expected = {
      telemetryType: TelemetryType.Event,
      properties: [{ name: "JourneyStarted" }, { journeyId: "J1" }],
    };

    expect(sent).toEqual(expected);
  });

  it("trackPageView sends a PageView payload with pageName and additional props", async () => {
    await telemetryService.trackPageView("HomePage", [{ foo: "bar" } as any]);

    expect(logTelemetryEvent).toHaveBeenCalledTimes(1);
    const sent = getSentPayload();

    const expected = {
      telemetryType: TelemetryType.PageView,
      properties: [{ pageName: "HomePage" }, { foo: "bar" }],
    };

    expect(sent).toEqual(expected);
  });

  it("trackException sends Exception payload with message/name/stack plus extra props", async () => {
    const err = new Error("boom");
    err.name = "BoomError";

    await telemetryService.trackException(err, [{ k: "v" }]);

    expect(logTelemetryEvent).toHaveBeenCalledTimes(1);
    const sent = getSentPayload();

    const exceptionProp = sent.properties[0];
    const expected = {
      telemetryType: TelemetryType.Exception,

      properties: [
        {
          exceptionMessage: exceptionProp.exceptionMessage,
          errorName: exceptionProp.errorName,
          errorStack: exceptionProp.errorStack,
        },
        { k: "v" },
      ],
    };

    expect(sent).toEqual(expected);
  });

  it("trackTrace forwards provided properties", async () => {
    await telemetryService.trackTrace([{ trace: "t" } as any]);

    expect(logTelemetryEvent).toHaveBeenCalledTimes(1);
    const sent = getSentPayload();

    const expected = {
      telemetryType: TelemetryType.Trace,
      eventTimestamp: sent.eventTimestamp,
      properties: [{ trace: "t" }],
    };

    expect(sent).toEqual(expected);
  });
});
