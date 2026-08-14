# Case Management Register a Case

## Introduction

The Case Management project aims to deliver a Case Management solution that streamlines how cases are registered, created, and updated, enabling efficient tracking, improved data accuracy, and greater visibility across the case lifecycle.

## Pre-Commit Hooks
This repo contains pre-commit hooks for maintaining formatting standards. Please install these before commiting any work.
1. Install the [pre-commit package manager](https://pre-commit.com/#install).
2. Run `pre-commit install` to install the hooks.

## UI

UI is a vite react typescript project

### For fresh install:

1. Go to ui-spa folder
2. Use `npm CI` for clean install to stick with the exact packages in the package-lock.json. NOTE: dont use `npm install`

### To run locally:

1. Create and .env.local file under ui-spa and copy the contents from .env.local.example
2. make sure you have the correct env values
3. for dev build, use `npm run dev` for running the ui and you will have the dev server up and running at http://localhost:5173/
4. for prod build , use `npm run build` or building the project, then use `npm run start` and you will have the dev server up and running at http://localhost:5173/
5. to use msw and mock all the server requests when running locally, VITE_MOCK_API_SOURCE=dev,
6. to use mock auth when running localy, VITE_MOCK_AUTH=true

### To run tests:

1. To run unit tests: use `npm run test`
2. To run playwright ui integration test in browser mode: use `ui:integration`
3. To run playwright ui integration test in ci mode: use `ui:integration:ci`

## CI/CD

The project uses Azure Pipelines for automated build, test, and deployment.

### Key pipeline definitions

#### Backend

The following are triggered in response to any changes pushed to the [`backend`](src/backend) directory.

- **Backend Build & Test:** [`backend-pr-build-and-test.yml`](devops-pipelines/backend/backend-pr-build-and-test.yml)
  - Trigger: PR against main.
  - Restores, builds, and tests all backend projects.
  - Publishes test results and code coverage.
- **Backend Build & Deploy:** [`backend-build-and-deploy.yml`](devops-pipelines/backend/backend-build-and-deploy.yml)
  - Trigger: Merge to main branch.
  - Packages and publishes the main API package for deployment.
  - Deploys configuration and build artifacts to the Azure App Service instance.
  - Pauses for manual validation before deploying the same to staging.

#### UI

The following are triggered in response to any changes pushed to the [`ui-spa`](src/ui-spa) directory.

- **UI Build & Test:** [`ui-pr-build-and-test.yml`](devops-pipelines/ui/ui-pr-build-and-test.yml)
  - Trigger: PR against main.
  - Installs dependencies, lints, builds and runs unit tests for the React SPA.
  - Runs E2E tests with Playwright.
  - Publishes code coverage and test results.
- **UI Build & Deploy:** [`ui-build-and-deploy.yml`](devops-pipelines/ui/ui-build-and-deploy.yml)
  - Trigger: Merge to main branch.
  - Runs the following jobs for the dev environment:
    - Builds the SPA using environment-specific VITE variables.
    - Publishes the build artifact.
    - Deploys the build artifact to the target Azure App Service instance.
  - Pauses for manual validation before repeating the process for staging.

### Adding Configuration Variables

#### Backend

App settings for the function apps are configured in the App Service environment during the deployment pipeline, by calling the step defined in [fa-config-steps.yml](devops-pipelines/templates/fa-config-steps.yml).

New variable blocks can be added to the `appSettings` list in the task's input variables. The "slotSetting" field should always be set to false.

**Secret values:**

For settings such as api keys, passwords, certificates, etc., the "value" field should contain a [Key Vault reference](https://learn.microsoft.com/en-us/azure/app-service/app-service-key-vault-references?tabs=azure-cli). For example:
```json
{
  "name": "Api__AccessKey",
  "value": "@Microsoft.KeyVault(VaultName=${{ parameters.keyVaultName }};SecretName=Api--AccessKey)",
  "slotSetting": false
},
```
❗ The key-value pairs for these secrets must be added to the Key Vaults by a team member with appropriate access.

**Non-sensitive cross-environment values:**

Non-sensitive values that remain consistent across all environments can be added in plain text. For example:
```json
{
  "name": "DB__AuthMode",
  "value": "AAD",
  "slotSetting": false
},
```

**Sensitive values that don't require storing in Key Vault:**

- Values such as UUIDs, internally-facing urls, etc., that shouldn't be exposed in a public repository, should be added as variable references. For Example:
  ```json
  {
    "name": "TenantId",
    "value": "$(TenantId)",
    "slotSetting": false
  },
  ```
  ❗ The key-value pairs must be added to the relevant variable groups in the Azure DevOps Library.

**Non-sensitive environment-specific values**

Values that may differ by environment (e.g., feature flags) should also be added as variable references.

  The key-value pairs should be added to the following **variable template** yaml files:
  - [fa-config-dev.yml](devops-pipelines/templates/variables/fa-config-dev.yml)
  - [fa-config-staging.yml](devops-pipelines/templates/variables/fa-config-staging.yml)

  For example:
  ```yaml
  # File: fa-config-dev.yml
  variables:
  - name: 'EnableFeature'
    value: true
  ```


## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Security

If you discover a vulnerability or have a security concern, please refer to our [Security Policy](SECURITY.md) and contact Digital.Security@cps.gov.uk.
