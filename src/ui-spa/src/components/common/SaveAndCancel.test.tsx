import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { describe, it, expect, afterEach, vi } from "vitest";
import SaveAndCancel from "./SaveAndCancel";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("SaveAndCancel", () => {
  it("shows 'Save and continue' and Cancel link when not case summary and not disabled", async () => {
    const onSave = vi.fn();
    render(
      <MemoryRouter initialEntries={["/current-route"]}>
        <SaveAndCancel onSave={onSave} />
      </MemoryRouter>,
    );

    const btn = screen.getByRole("button", { name: /save and continue/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toBeEnabled();

    const link = screen.getByRole("link", { name: /cancel/i });
    expect(link).toBeInTheDocument();
    expect(link.getAttribute("href")).toMatch(
      /\/case-registration\/cancel-case-registration-confirmation$/,
    );

    await userEvent.click(btn);
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it("shows 'Accept and create' when isCaseSummaryPage is true", async () => {
    const onSave = vi.fn();
    render(
      <MemoryRouter initialEntries={["/summary-route"]}>
        <SaveAndCancel onSave={onSave} isCaseSummaryPage={true} />
      </MemoryRouter>,
    );

    const btn = screen.getByRole("button", { name: /accept and create/i });
    expect(btn).toBeInTheDocument();

    await userEvent.click(btn);
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it("disables button and hides Cancel link when disabled prop is true", async () => {
    const onSave = vi.fn();
    render(
      <MemoryRouter initialEntries={["/some-route"]}>
        <SaveAndCancel onSave={onSave} disabled={true} />
      </MemoryRouter>,
    );

    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();

    const link = screen.queryByRole("link", { name: /cancel/i });
    expect(link).toBeNull();

    await userEvent.click(btn);
    expect(onSave).not.toHaveBeenCalled();
  });
});
