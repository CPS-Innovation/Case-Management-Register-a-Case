import { expect, type Page } from "@playwright/test";

export interface FieldError {
  testId: string;
  message: string;
}

// Submits the current step with no data and asserts the error summary and each
// field-level message render. Deliberately does NOT assert focus management: the
// integration page objects' errorValidations() do, but those toBeFocused()
// checks are unreliable against the real backend (API-driven radio pages such as
// religion/ethnicity re-render as data settles) and in headed mode (the browser
// window may not hold OS focus). The error summary and messages are the contract
// this scenario cares about.
export async function submitEmptyAndAssertErrors(
  page: Page,
  submit: () => Promise<void>,
  summaryTestId: string,
  fieldErrors: FieldError[],
): Promise<void> {
  await submit();
  await expect(page.getByTestId(summaryTestId)).toBeVisible();
  for (const fieldError of fieldErrors) {
    await expect(page.getByTestId(fieldError.testId)).toHaveText(
      fieldError.message,
    );
  }
}
