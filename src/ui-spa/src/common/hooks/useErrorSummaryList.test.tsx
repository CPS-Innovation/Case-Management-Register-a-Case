import React from "react";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, it, expect, vi } from "vitest";
import useErrorSummaryList from "./useErrorSummaryList";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function TestComponent(props: {
  readonly formDataErrors: Record<string, Record<string, string>>;
  readonly errorSummaryProperties: (k: string) => {
    children: React.ReactNode;
    href: string;
    "data-testid": string;
  } | null;
}) {
  const { formDataErrors, errorSummaryProperties } = props;
  const { errorSummaryRef, errorList, disableBtns, setDisableBtns } =
    useErrorSummaryList(formDataErrors, errorSummaryProperties);

  return (
    <div>
      <div ref={errorSummaryRef} data-testid="error-ref" tabIndex={-1} />
      <div>
        <span data-testid="disable-value">{String(disableBtns)}</span>
        <button
          type="button"
          data-testid="set-disable-true"
          onClick={() => setDisableBtns(true)}
        >
          set true
        </button>
      </div>
      <ul>
        {errorList.map((it) => (
          <li key={it.reactListKey} data-testid={`item-${it.reactListKey}`}>
            {it.children}
          </li>
        ))}
      </ul>
    </div>
  );
}

describe("useErrorSummaryList", () => {
  it("returns empty list, disableBtns false and does not focus when no errors", async () => {
    render(
      <TestComponent formDataErrors={{}} errorSummaryProperties={() => null} />,
    );

    expect(screen.queryByTestId("item-0")).toBeNull();
    expect(screen.getByTestId("disable-value").textContent).toBe("false");

    const refEl = screen.getByTestId("error-ref") as HTMLElement;
    await waitFor(() => {
      expect(document.activeElement).not.toBe(refEl);
    });
  });

  it("maps errors to list, focuses the ref and exposes disable state/setter", async () => {
    const errors = {
      one: { msg: "a" },
      two: { msg: "b" },
    };

    render(
      <TestComponent
        formDataErrors={errors}
        errorSummaryProperties={(key) => {
          if (key === "one")
            return { children: "First", "data-testid": "item-0", href: "#one" };
          if (key === "two")
            return {
              children: "Second",
              "data-testid": "item-1",
              href: "#two",
            };
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

    const user = userEvent.setup();
    expect(screen.getByTestId("disable-value").textContent).toBe("false");
    await user.click(screen.getByTestId("set-disable-true"));
    expect(screen.getByTestId("disable-value").textContent).toBe("true");
  });
});
