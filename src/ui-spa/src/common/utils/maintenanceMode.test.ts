import { afterEach, describe, expect, it } from "vitest";
import {
  DEFAULT_MAINTENANCE_MESSAGE_1,
  DEFAULT_MAINTENANCE_MESSAGE_2,
  getMaintenanceMessage1,
  getMaintenanceMessage2,
  isMaintenanceModeEnabled,
} from "./maintenanceMode";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("isMaintenanceModeEnabled", () => {
  it("is enabled only when the flag is true", () => {
    expect(isMaintenanceModeEnabled("true")).toBe(true);
    expect(isMaintenanceModeEnabled(" TRUE ")).toBe(true);
    expect(isMaintenanceModeEnabled("false")).toBe(false);
    expect(isMaintenanceModeEnabled("")).toBe(false);
    expect(isMaintenanceModeEnabled(undefined)).toBe(false);
    expect(isMaintenanceModeEnabled(null)).toBe(false);
  });

  it("reads the feature flag from the environment", () => {
    vi.stubEnv("VITE_FEATURE_FLAG_MAINTENANCE_MODE", "true");
    expect(isMaintenanceModeEnabled()).toBe(true);

    vi.stubEnv("VITE_FEATURE_FLAG_MAINTENANCE_MODE", "false");
    expect(isMaintenanceModeEnabled()).toBe(false);
  });

  it("stays off when the feature flag is missing", () => {
    vi.stubEnv("VITE_FEATURE_FLAG_MAINTENANCE_MODE", "");
    expect(isMaintenanceModeEnabled()).toBe(false);
  });
});

describe("maintenance messages", () => {
  it("uses the configured messages", () => {
    expect(getMaintenanceMessage1("Unavailable from 18:00.")).toBe(
      "Unavailable from 18:00.",
    );
    expect(getMaintenanceMessage2("Please return after 08:00.")).toBe(
      "Please return after 08:00.",
    );
  });

  it("falls back when a message is missing or blank", () => {
    expect(getMaintenanceMessage1(undefined)).toBe(
      DEFAULT_MAINTENANCE_MESSAGE_1,
    );
    expect(getMaintenanceMessage1("   ")).toBe(DEFAULT_MAINTENANCE_MESSAGE_1);
    expect(getMaintenanceMessage1(null)).toBe(DEFAULT_MAINTENANCE_MESSAGE_1);
    expect(getMaintenanceMessage2(undefined)).toBe(
      DEFAULT_MAINTENANCE_MESSAGE_2,
    );
    expect(getMaintenanceMessage2("")).toBe(DEFAULT_MAINTENANCE_MESSAGE_2);
  });

  it("reads message overrides from the environment", () => {
    vi.stubEnv("VITE_MAINTENANCE_MODE_MESSAGE1", "Down from Friday 18:00.");
    vi.stubEnv("VITE_MAINTENANCE_MODE_MESSAGE2", "Back Monday 08:00.");

    expect(getMaintenanceMessage1()).toBe("Down from Friday 18:00.");
    expect(getMaintenanceMessage2()).toBe("Back Monday 08:00.");
  });

  it("uses the fallback copy when the environment values are missing", () => {
    vi.stubEnv("VITE_MAINTENANCE_MODE_MESSAGE1", "");
    vi.stubEnv("VITE_MAINTENANCE_MODE_MESSAGE2", "");

    expect(getMaintenanceMessage1()).toBe(DEFAULT_MAINTENANCE_MESSAGE_1);
    expect(getMaintenanceMessage2()).toBe(DEFAULT_MAINTENANCE_MESSAGE_2);
  });
});
