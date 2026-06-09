import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";
import { tacticalLogin } from "./auth/tacticalLogin";
import { aadLogin } from "./auth/aadLogin";
import {
  API_BASE_URL,
  FRONTEND_URL,
  STORAGE_STATE,
  getAadCredentials,
  getCmsCredentials,
} from "./config";

async function globalSetup(): Promise<void> {
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext();
    const page = await context.newPage();

    await tacticalLogin(page, {
      apiBaseUrl: API_BASE_URL,
      ...getCmsCredentials(),
    });

    await aadLogin(page, {
      appUrl: FRONTEND_URL,
      ...getAadCredentials(),
    });

    fs.mkdirSync(path.dirname(STORAGE_STATE), { recursive: true });
    await context.storageState({ path: STORAGE_STATE });
  } finally {
    await browser.close();
  }
}

export default globalSetup;
