import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const here = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(here, ".env.e2e.local") });

export const STORAGE_STATE = path.join(here, ".auth", "state.json");

const required = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required env var ${name}. Set it in e2e-tests/.env.e2e.local`,
    );
  }
  return value;
};

export const FRONTEND_URL = required("E2E_FRONTEND_URL");

export const API_BASE_URL = required("E2E_API_BASE_URL");

export const getCmsCredentials = () => ({
  username: required("E2E_CMS_USERNAME"),
  password: required("E2E_CMS_PASSWORD"),
});

export const getAadCredentials = () => ({
  username: required("E2E_AAD_USERNAME"),
  password: required("E2E_AAD_PASSWORD"),
});
