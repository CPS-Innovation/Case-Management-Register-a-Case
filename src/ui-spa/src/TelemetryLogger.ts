import { logTelemetryEvent } from "./apis/gateway-api";
type PageName = "HomePage";

export const TelemetryType = {
  Event: 0,
  Exception: 1,
  Metric: 2,
  PageView: 3,
  Trace: 4,
} as const;

export type TelemetryPayload = {
  telemetryType: (typeof TelemetryType)[keyof typeof TelemetryType];
  eventTimestamp: string;
  properties: Record<string, unknown>[];
};

export type TelemetryEventPropsMap = {
  JourneyStarted: [{ journeyId: string }];
};
export type CustomEventName = keyof TelemetryEventPropsMap;

export type TelemetryEventProps<T extends CustomEventName> =
  TelemetryEventPropsMap[T];

export type TelemetryPageViewProps = [
  { journeyId: string },
  Record<string, unknown>,
];

export class TelemetryService {
  async trackEvent<T extends CustomEventName>(
    eventName: T,
    properties: TelemetryEventProps<T>,
  ): Promise<void> {
    const payload: TelemetryPayload = {
      telemetryType: TelemetryType.Event,
      eventTimestamp: new Date().toISOString(),
      properties: [{ name: eventName }, ...properties],
    };
    await logTelemetryEvent(payload);
  }

  async trackPageView(
    pageName: PageName,
    properties: TelemetryPageViewProps,
  ): Promise<void> {
    const payload: TelemetryPayload = {
      telemetryType: TelemetryType.PageView,
      eventTimestamp: new Date().toISOString(),
      properties: [{ pageName: pageName }, ...properties],
    };
    await logTelemetryEvent(payload);
  }

  async trackException(
    error: Error,
    properties: Record<string, unknown>[] = [],
  ): Promise<void> {
    const payload: TelemetryPayload = {
      telemetryType: TelemetryType.Exception,
      eventTimestamp: new Date().toISOString(),
      properties: [{ error: error.message }, ...properties],
    };
    await logTelemetryEvent(payload);
  }

  async trackTrace(properties: Record<string, unknown>[] = []): Promise<void> {
    const payload: TelemetryPayload = {
      telemetryType: TelemetryType.Trace,
      eventTimestamp: new Date().toISOString(),
      properties: [...properties],
    };
    await logTelemetryEvent(payload);
  }
}
export const telemetryService = new TelemetryService();
