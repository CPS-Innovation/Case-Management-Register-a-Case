# Register a Case — end-to-end tests

Playwright end-to-end suite that drives the **deployed dev SPA** against the
**real backend** (gateway API + MDS). Unlike `integration-tests/`, nothing is
mocked here — no `playwright-msw`, no stubbed APIs

- Frontend under test and gateway API: set via `E2E_FRONTEND_URL` /
  `E2E_API_BASE_URL` (see `.env.e2e.local.example` for starting values).
- Browser: Chromium only


## Prerequisites

- Node and dependencies installed (`npm install` in `src/ui-spa`).
- Chromium installed for Playwright: `npx playwright install chromium`.
- Network access to the dev environment (the deployed UI, the gateway API, and
  `login.microsoftonline.com`).
- Credentials (see below).

## Credentials and configuration

Secrets are read from `e2e-tests/.env.e2e.local` (gitignored). Copy
`e2e-tests/.env.e2e.local.example` to `e2e-tests/.env.e2e.local` and fill it in
(PowerShell: `Copy-Item e2e-tests/.env.e2e.local.example e2e-tests/.env.e2e.local`).

Required (no defaults — the suite throws if any are unset):

| Variable             | Purpose                                            |
| -------------------- | -------------------------------------------------- |
| `E2E_FRONTEND_URL`   | SPA under test (e.g. the dev SPA)                  |
| `E2E_API_BASE_URL`   | Gateway API base URL (e.g. the dev API)            |
| `E2E_CMS_USERNAME`   | CMS user for the tactical login (authenticates API)|
| `E2E_CMS_PASSWORD`   | CMS password                                       |
| `E2E_AAD_USERNAME`   | Entra/Azure AD UPN (email) for the SPA sign-in     |
| `E2E_AAD_PASSWORD`   | Entra/Azure AD password                            |

The URLs are required deliberately so a run can't silently target the wrong
environment; set them for your target environment in `.env.e2e.local`
(see `.env.e2e.local.example` for the template).


## Running

All commands run from `src/ui-spa`:

```
npm run e2e:test                                                  # headless
npx playwright test --config=e2e-tests/playwright.e2e.config.ts --headed   # headed
npm run e2e:test:ui                                               # Playwright UI mode
npm run e2e:test:ci                                               # CI mode (CI=true)
npm run e2e:report                                                # open the HTML report
```

The HTML report is written to `e2e-tests/playwright-report/`; JUnit results to
`e2e-tests/e2e-test-results.xml`.

## How authentication works

Authentication happens once in `global-setup.ts`, in a single browser context:

1. **Tactical CMS login** (`auth/tacticalLogin.ts`) — posts the CMS credentials
   to `{API}/api/tactical/login`, which sets the `Cms-Auth-Values` cookie that
   authenticates the gateway API.
2. **Entra (Azure AD) sign-in** (`auth/aadLogin.ts`) — drives the Microsoft
   sign-in for the deployed SPA, starting at the app root. Entra now returns to
   `/redirect.html` (the MSAL redirect bridge), which hands the response back to
   the app root, so `/redirect.html` must be a registered redirect URI on the app
   registration.

The resulting cookies are saved as Playwright `storageState`
(`e2e-tests/.auth/state.json`, gitignored) and reused by every test via
`use.storageState`. MSAL caches its tokens in `sessionStorage` (which
storageState does not persist), so each test's `loginRedirect` completes
silently via the saved SSO cookies.

## Test data

Each run creates **real cases** in the dev environment. Every test generates a
URN (`utils/generateUrn.ts`) whose 5-digit reference combines a millisecond
timestamp (`Date.now()`), the Playwright worker index and a CSPRNG value, so
parallel workers and successive runs are very unlikely to clash. There is no
automatic cleanup; cases are isolated by URN.

## Structure

```
e2e-tests/
  playwright.e2e.config.ts   Chromium, 120s timeout, HTML/JUnit/list reporters
  global-setup.ts            tactical + AAD login -> storageState
  config.ts                  env loading + URLs + credential accessors
  auth/                      tacticalLogin, aadLogin
  utils/                     expectStep, startRegistration, generateUrn
  journeys/                  reusable end-to-end journeys (shortPath, steps,
                             suspectNoCharges)
  *.spec.ts                  the scenarios
```