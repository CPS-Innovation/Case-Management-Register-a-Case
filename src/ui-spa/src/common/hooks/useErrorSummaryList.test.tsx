import React, { useRef } from "react";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import { afterEach, describe, it, expect, vi } from "vitest";
import useErrorSummaryList from "./useErrorSummaryList";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function TestComponent<
  T extends Record<string, Record<string, string | boolean | string[]>>,
>(
  props: Readonly<{
    formDataErrors: T;
    errorSummaryProperties: (key: keyof T) => {
      children: React.ReactNode;
      href: string;
      "data-testid": string;
    } | null;
  }>,
) {
  const { formDataErrors, errorSummaryProperties } = props;
  const ref = useRef<HTMLDivElement | null>(null);
  type ErrorSummaryItem = {
    reactListKey: string | number;
    children?: React.ReactNode;
  };
  const list = useErrorSummaryList(
    formDataErrors,
    errorSummaryProperties,
    ref,
  ) as ErrorSummaryItem[];
  return (
    <div>
      <div ref={ref} data-testid="error-ref" tabIndex={-1} />
      <ul>
        {list.map((item) => (
          <li key={item.reactListKey} data-testid={`item-${item.reactListKey}`}>
            {item.children}
          </li>
        ))}
      </ul>
    </div>
  );
}

describe("useErrorSummaryList (simple)", () => {
  it("returns no items and does not focus when there are no errors", async () => {
    render(
      <TestComponent formDataErrors={{}} errorSummaryProperties={() => null} />,
    );

    expect(screen.queryByTestId("item-0")).toBeNull();
    const refEl = screen.getByTestId("error-ref") as HTMLElement;
    await waitFor(() => {
      expect(document.activeElement).not.toBe(refEl);
    });
  });

  it("renders items and focuses the ref when errors exist", async () => {
    const errors = {
      one: { msg: "a" },
      two: { msg: "b" },
    } as const;

    render(
      <TestComponent
        formDataErrors={errors}
        errorSummaryProperties={(key) => {
          if (key === "one") {
            return {
              children: "First",
              href: "http://example.com/one",
              "data-testid": "item-0",
            };
          } else if (key === "two") {
            return {
              children: "Second",
              href: "http://example.com/two",
              "data-testid": "item-1",
            };
          }
          return null;
        }}
      />,
    );

    expect(await screen.findByTestId("item-0")).toBeInTheDocument();
    expect(screen.getByTestId("item-1")).toBeInTheDocument();
    expect(screen.getByTestId("item-0").textContent).toBe("First");
    expect(screen.getByTestId("item-1").textContent).toBe("Second");

    const refEl = screen.getByTestId("error-ref") as HTMLElement;
    await waitFor(() => {
      expect(document.activeElement).toBe(refEl);
    });
  });
});
