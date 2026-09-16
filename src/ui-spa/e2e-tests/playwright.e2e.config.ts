import { defineConfig, devices } from "@playwright/test";
import { FRONTEND_URL, STORAGE_STATE } from "./config";

export default defineConfig({
  timeout: 120000,
  testDir: ".",
  globalSetup: "./global-setup.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ["list"],
    ["html", { outputFolder: "./playwright-report", open: "never" }],
    ["junit", { outputFile: "./e2e-test-results.xml" }],
  ],
  use: {
    baseURL: FRONTEND_URL,
    storageState: STORAGE_STATE,
    trace: process.env.CI ? "off" : "retain-on-failure",
    video: process.env.CI ? "retain-on-failure" : "on",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
