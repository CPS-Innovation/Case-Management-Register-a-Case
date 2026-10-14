export const GATEWAY_BASE_URL = `${import.meta.env.VITE_GATEWAY_BASE_URL}`;
export const GATEWAY_SCOPE = `${import.meta.env.VITE_GATEWAY_SCOPE}`;
export const MOCK_API_SOURCE = `${import.meta.env.VITE_MOCK_API_SOURCE}`;
export const CLIENT_ID = `${import.meta.env.VITE_CLIENT_ID}`;
export const TENANT_ID = `${import.meta.env.VITE_TENANT_ID}`;
export const MOCK_AUTH = `${import.meta.env.VITE_MOCK_AUTH}` === "true";
export const PRIVATE_BETA_USER_GROUP = `${import.meta.env.VITE_PRIVATE_BETA_USER_GROUP}`;
export const PRIVATE_BETA_CONTACT_EMAIL = `${import.meta.env.VITE_PRIVATE_BETA_CONTACT_EMAIL}`;
export const HOME_PAGE_URL = import.meta.env.VITE_HOME_PAGE_URL ?? "/";
export const CMS_CLASSIC_URL = import.meta.env.VITE_CMS_CLASSIC_URL ?? "/";
export const SET_UP_EGRESS_AND_SHARED_DRIVE_URL =
  import.meta.env.VITE_SET_UP_EGRESS_AND_SHARED_DRIVE_URL ?? "/";
export const FEATURE_FLAG_CASE_REGISTRATION_V2 =
  `${import.meta.env.VITE_FEATURE_FLAG_CASE_REGISTRATION_V2}` === "true";
