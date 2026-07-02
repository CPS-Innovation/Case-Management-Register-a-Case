/// <reference types="vitest" />
import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import istanbul from "vite-plugin-istanbul";

// During `vite dev`, Vite injects application CSS as inline <style> elements
// (HMR). The committed CSP intentionally omits 'unsafe-inline' from style-src so
// production (which ships external stylesheets) stays locked down and clears
// SonarCloud Web:S7039. This dev-only plugin re-adds 'unsafe-inline' so styling
// still works while running the dev server.
const devStyleCspPlugin: Plugin = {
  name: "dev-style-csp-unsafe-inline",
  apply: "serve",
  transformIndexHtml(html) {
    return html.replace(
      "style-src 'self';",
      "style-src 'self' 'unsafe-inline';",
    );
  },
};

export default defineConfig(({ command, mode }) => {
  const isIstanbulCoverage = process.env.ISTANBUL_COVERAGE === "1";
  const isProdBuild = command === "build" && mode === "production";
  const buildSourceMap = isIstanbulCoverage || !isProdBuild;

  // Fail fast if the gateway base URL is missing for a production build.
  if (isProdBuild) {
    const env = loadEnv(mode, process.cwd(), "");
    if (!env.VITE_GATEWAY_BASE_URL) {
      throw new Error(
        "VITE_GATEWAY_BASE_URL is not set. It must be provided for a production build so the CSP connect-src and gateway API calls resolve correctly.",
      );
    }
  }

  return {
    build: { sourcemap: buildSourceMap },
    plugins: [
      devStyleCspPlugin,
      react(),
      svgr(),
      isIstanbulCoverage &&
        istanbul({
          include: ["src/**/*.{ts,tsx,js,jsx}"],
          exclude: [
            "src/**/*.{test,spec}.ts",
            "src/**/*.{test,spec}.tsx",
            "src/mocks",
            "src/common/types",
            "src/auth/mock",
            "src/auth/no-auth",
            "src/auth/index.ts",
            "src/auth/userDetails.ts",
            "src/config.ts",
            "src/types.d.ts",
            "src/vite-env.d.ts",
            "src/main.tsx",
          ],
          requireEnv: false,
          forceBuildInstrument: true,
        }),
    ].filter(Boolean),
    test: {
      silent: true,
      globals: true,
      environment: "jsdom",
      setupFiles: ["./src/tests/setup.ts"],
      include: ["src/**/*.{test,spec}.{ts,tsx}"],
      reporters: ["default", "junit"],
      outputFile: {
        junit: "./unit-test-results.xml",
      },
      coverage: {
        enabled: true,
        reporter: ["text", "json", "html", "cobertura"],
        provider: "v8",
        reportsDirectory: "./coverage/unit",
        include: ["src/**/*.{ts,tsx,js,jsx}"],
        exclude: [
          "src/**/*.{test,spec}.ts",
          "src/**/*.{test,spec}.tsx",
          "src/mocks",
          "src/schemas",
          "src/components/govuk",
          "src/components/*.tsx",
          "src/components/case-registration/*.tsx",
          "src/components/case-registration/*/*.tsx",
          "src/auth/mock",
          "src/auth/no-auth",
          "src/auth/index.ts",
          "src/auth/userDetails.ts",
          "src/config.ts",
          "src/types.d.ts",
          "src/vite-env.d.ts",
          "src/main.tsx",
        ],
      },
    },
    server: {
      port: 5173,
      strictPort: true,
    },
    preview: {
      port: 5173,
      strictPort: true,
    },
  };
});
