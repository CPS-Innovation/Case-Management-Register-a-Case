export const DEFAULT_MAINTENANCE_MESSAGE_1 =
  "We're carrying out planned maintenance. The service will be unavailable.";

export const DEFAULT_MAINTENANCE_MESSAGE_2 = "Please try again later.";

export const MAINTENANCE_CONTACT_LINE =
  "If you need help, contact the product team in the Teams channel.";

export const MAINTENANCE_HEADING = "Sorry this service is unavailable";

const readMessage = (value: unknown, fallback: string) => {
  if (typeof value !== "string") {
    return fallback;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
};

export const isMaintenanceModeEnabled = (
  flag: unknown = import.meta.env.VITE_FEATURE_FLAG_MAINTENANCE_MODE,
) => typeof flag === "string" && flag.trim().toLowerCase() === "true";

export const getMaintenanceMessage1 = (
  message: unknown = import.meta.env.VITE_MAINTENANCE_MODE_MESSAGE1,
) => readMessage(message, DEFAULT_MAINTENANCE_MESSAGE_1);

export const getMaintenanceMessage2 = (
  message: unknown = import.meta.env.VITE_MAINTENANCE_MODE_MESSAGE2,
) => readMessage(message, DEFAULT_MAINTENANCE_MESSAGE_2);
