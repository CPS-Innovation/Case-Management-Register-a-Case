# Register a Case — end-to-end tests

Playwright end-to-end suite that drives the **deployed dev SPA** against the
**real backend** (gateway API + MDS). Unlike `integration-tests/`, nothing is
mocked here — no `playwright-msw`, no stubbed APIs — so breakages in the gateway
API, request/response contracts, validators, mappers or the MDS wiring are
caught from the browser side.

- Frontend under test: `https://cmrc-app-ui-spa-dev.azurewebsites.net`
- Gateway API: `https://fa-cmrc-api-dev.azurewebsites.net`
- Browser: Chromium only

The existing `integration-tests/` suite is untouched and still runs as before.

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

Required:

| Variable             | Purpose                                            |
| -------------------- | -------------------------------------------------- |
| `E2E_CMS_USERNAME`   | CMS user for the tactical login (authenticates API)|
| `E2E_CMS_PASSWORD`   | CMS password                                       |
| `E2E_AAD_USERNAME`   | Entra/Azure AD UPN (email) for the SPA sign-in     |
| `E2E_AAD_PASSWORD`   | Entra/Azure AD password                            |

The AAD account must have dev access and **no enforced MFA / interactive
conditional access**, otherwise the unattended sign-in will stall.

Optional overrides default to sensible values in `config.ts` / `journeys/steps.ts`,
so the suite runs with only the credentials above. Set any of these in
`e2e-tests/.env.e2e.local` (or the process environment) to override:

`E2E_FRONTEND_URL`, `E2E_API_BASE_URL`, `E2E_AREA`, `E2E_REGISTERING_UNIT`,
`E2E_WITNESS_CARE_UNIT`, `E2E_OPERATION_NAME`, `E2E_PROSECUTOR`,
`E2E_CASEWORKER`, `E2E_INVESTIGATOR_FIRST_NAME`, `E2E_INVESTIGATOR_LAST_NAME`,
`E2E_INVESTIGATOR_SHOULDER_NUMBER`.

Prosecutor and caseworker are picked from the live API response for the
registering unit when not overridden (the MSW defaults are not real dev data).

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
   sign-in for the deployed SPA, starting at the app root (the only registered
   MSAL redirect URI).

The resulting cookies are saved as Playwright `storageState`
(`e2e-tests/.auth/state.json`, gitignored) and reused by every test via
`use.storageState`. MSAL caches its tokens in `sessionStorage` (which
storageState does not persist), so each test's `loginRedirect` completes
silently via the saved SSO cookies.

## Test data

Each run creates **real cases** in the dev environment. Every test generates a
URN (`utils/generateUrn.ts`) whose 5-digit reference combines the clock, the
Playwright worker index and a CSPRNG value, so parallel workers and successive
runs are very unlikely to clash. There is no automatic cleanup; cases are
isolated by URN. Note the reference space is bounded (5 digits, the CMS URN
format), so over a long-lived shared environment a generated URN could still
collide with an existing case — a duplicate-URN retry/cleanup step is a possible
future hardening (and the planned URN-duplicate-validation scenario will cover
the error path explicitly).

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

Page Object Models are reused from `../integration-tests/pages`. Because those
hardcode `http://localhost:5173` in `verifyUrl()`, the e2e suite asserts the
current step with the origin-agnostic `utils/expectStep.ts` instead.

## Known defect

The pure short path with **no operation name and no suspect** is currently
blocked by an SPA defect: selecting "No" for "Do you have an operation name?"
with no suspect does not register in the form (the radio shows selected but Save
reports an error). Scenario 1 covers the no-operation-name path **with a
suspect**, which sidesteps the defect. Track the SPA fix separately.
