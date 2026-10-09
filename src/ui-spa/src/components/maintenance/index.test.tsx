import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it } from "vitest";
import Layout from "../Layout";
import MaintenancePage from "./index";
import {
  DEFAULT_MAINTENANCE_MESSAGE_1,
  DEFAULT_MAINTENANCE_MESSAGE_2,
  MAINTENANCE_CONTACT_LINE,
  MAINTENANCE_HEADING,
} from "../../common/utils/maintenanceMode";

vi.mock("../../auth", () => ({
  useUserDetails: () => ({
    username: "signed-in.user@example.org",
  }),
}));

afterEach(() => {
  vi.unstubAllEnvs();
  document.title = "";
});

const renderMaintenancePage = () =>
  render(
    <MemoryRouter initialEntries={["/maintenance"]}>
      <Layout showAuthenticatedContent={false}>
        <MaintenancePage />
      </Layout>
    </MemoryRouter>,
  );

describe("MaintenancePage", () => {
  it("renders the heading, configured messages, and contact line in order", () => {
    vi.stubEnv(
      "VITE_MAINTENANCE_MODE_MESSAGE1",
      "Unavailable from 18:00 on 9 October 2026.",
    );
    vi.stubEnv(
      "VITE_MAINTENANCE_MODE_MESSAGE2",
      "Please try again after 08:00 on 10 October 2026.",
    );

    renderMaintenancePage();

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent(MAINTENANCE_HEADING);
    expect(heading).toHaveAccessibleName(MAINTENANCE_HEADING);

    const message1 = screen.getByTestId("txt-maintenance-message-1");
    const message2 = screen.getByTestId("txt-maintenance-message-2");
    const contact = screen.getByTestId("txt-maintenance-contact");

    expect(message1).toHaveTextContent(
      "Unavailable from 18:00 on 9 October 2026.",
    );
    expect(message2).toHaveTextContent(
      "Please try again after 08:00 on 10 October 2026.",
    );
    expect(contact).toHaveTextContent(MAINTENANCE_CONTACT_LINE);

    expect(
      heading.compareDocumentPosition(message1) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      message1.compareDocumentPosition(message2) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      message2.compareDocumentPosition(contact) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("falls back to the default messages when the environment values are missing", () => {
    vi.stubEnv("VITE_MAINTENANCE_MODE_MESSAGE1", "");
    vi.stubEnv("VITE_MAINTENANCE_MODE_MESSAGE2", "   ");

    renderMaintenancePage();

    expect(screen.getByTestId("txt-maintenance-message-1")).toHaveTextContent(
      DEFAULT_MAINTENANCE_MESSAGE_1,
    );
    expect(screen.getByTestId("txt-maintenance-message-2")).toHaveTextContent(
      DEFAULT_MAINTENANCE_MESSAGE_2,
    );
    expect(screen.getByTestId("txt-maintenance-contact")).toHaveTextContent(
      MAINTENANCE_CONTACT_LINE,
    );
  });

  it("does not show signed-in user details", () => {
    renderMaintenancePage();

    expect(screen.queryByTestId("div-ad-username")).not.toBeInTheDocument();
    expect(
      screen.queryByText("signed-in.user@example.org"),
    ).not.toBeInTheDocument();
  });

  it("announces the heading and can be moved through with the keyboard", async () => {
    const user = userEvent.setup();
    renderMaintenancePage();

    expect(document.title).toBe(`${MAINTENANCE_HEADING} - Register A Case`);

    const skipLink = screen.getByRole("link", {
      name: /skip to main content/i,
    });
    await user.tab();
    expect(skipLink).toHaveFocus();

    await user.tab();
    expect(screen.getByTestId("link-homepage")).toHaveFocus();

    const seen = new Set<Element>();
    let active = document.activeElement;
    while (active && active !== document.body && !seen.has(active)) {
      seen.add(active);
      await user.tab();
      active = document.activeElement;
    }

    expect(seen.size).toBeGreaterThan(1);
  });
});
