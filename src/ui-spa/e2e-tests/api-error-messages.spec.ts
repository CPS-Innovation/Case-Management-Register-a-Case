import { expect, test } from "@playwright/test";
import { API_BASE_URL } from "./config";

const CASES_ENDPOINT = `${API_BASE_URL}/api/v1/cases`;
const SANITISED = "The request body contains invalid JSON.";
const MALFORMED_BODIES = ['{"id": }', "not json at all", '{"urn": "12AB"', "}"];

const INTERNALS =
  /System\.|Text\.Json|LineNumber|BytePosition|StackTrace|Exception|\n\s+at /;

test("API error messages leak no system detail (ITHC)", async ({
  page,
  context,
}) => {
  const unitsRequest = page.waitForRequest(
    (request) => request.url().includes("/api/v1/units"),
    { timeout: 60_000 },
  );
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const authorization =
    (await (await unitsRequest).headerValue("authorization")) ?? "";
  expect(authorization.split("."), "no bearer token captured").toHaveLength(3);

  const post = (data: string) =>
    context.request.post(CASES_ENDPOINT, {
      headers: {
        Authorization: authorization,
        "Content-Type": "application/json",
        "Correlation-Id": crypto.randomUUID(),
      },
      data,
      failOnStatusCode: false,
    });

  for (const body of MALFORMED_BODIES) {
    const response = await post(body);
    const text = await response.text();
    expect(response.status(), body).toBe(400);
    expect(text, body).not.toMatch(INTERNALS);
    expect(JSON.parse(text), body).toEqual([SANITISED]);
  }

  const response = await post("{}");
  expect(response.status()).toBe(400);
  expect(await response.text()).not.toMatch(INTERNALS);
});
