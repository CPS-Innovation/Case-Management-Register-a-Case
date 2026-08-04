import { render, screen, cleanup, act } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import useRouteDocumentTitle from "./useRouteDocumentTitle";

afterEach(() => {
  cleanup();
  document.title = "";
});

function TestHarness() {
  const { title } = useRouteDocumentTitle();
  return <div data-testid="hook-title">{title}</div>;
}

test("uses last segment to find matching route title", () => {
  act(() =>
    render(
      <MemoryRouter
        initialEntries={["/case-registration/123/suspect-ethnicity"]}
      >
        <TestHarness />
      </MemoryRouter>,
    ),
  );

  const expected = "Suspect Ethnicity - Register A Case";
  expect(document.title).toBe(expected);
  expect(screen.getByTestId("hook-title").textContent).toBe(expected);
});

test("matches full path when last segment is the page ", () => {
  act(() =>
    render(
      <MemoryRouter initialEntries={["/add-charge-details"]}>
        <TestHarness />
      </MemoryRouter>,
    ),
  );

  const expected = "Add Charge Details - Register A Case";
  expect(document.title).toBe(expected);
  expect(screen.getByTestId("hook-title").textContent).toBe(expected);
});

test("falls back to default title when no match", () => {
  act(() =>
    render(
      <MemoryRouter initialEntries={["/some/unknown/path"]}>
        <TestHarness />
      </MemoryRouter>,
    ),
  );

  const expected = "Home - Register A Case";
  expect(document.title).toBe(expected);
  expect(screen.getByTestId("hook-title").textContent).toBe(expected);
});
