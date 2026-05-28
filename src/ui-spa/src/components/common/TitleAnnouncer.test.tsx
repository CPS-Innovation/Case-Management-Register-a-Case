import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { vi, afterEach, describe, it, expect } from "vitest";

let currentTitle = "Initial title";

vi.mock("../../common/hooks/useRouteDocumentTitle", () => {
  return { useRouteDocumentTitle: () => ({ title: currentTitle }) };
});

import TitleAnnouncer from "./TitleAnnouncer";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  currentTitle = "Initial title";
});

function TestNav() {
  const navigate = useNavigate();
  return <button onClick={() => navigate("/next")}>Go</button>;
}

describe("TitleAnnouncer", () => {
  it("renders hidden live region with title and focuses it when title updates", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/start"]}>
        <TitleAnnouncer />
        <TestNav />
      </MemoryRouter>,
    );

    const initial = screen.getByText("Initial title");
    expect(initial).toBeInTheDocument();
    expect(initial).toHaveAttribute("aria-live", "assertive");
    expect(initial).toHaveAttribute("tabindex", "-1");
    expect(initial).toHaveClass("govuk-visually-hidden");

    currentTitle = "Updated title";

    await user.click(screen.getByRole("button", { name: /go/i }));

    await waitFor(() => {
      const updated = screen.getByText("Updated title");
      expect(updated).toBeInTheDocument();
      expect(document.activeElement).toBe(updated);
    });
  });
});
