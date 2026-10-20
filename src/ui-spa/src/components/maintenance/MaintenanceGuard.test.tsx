import { render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import MaintenanceGuard from "./MaintenanceGuard";
import {
  isMaintenanceModeEnabled,
  MAINTENANCE_HEADING,
} from "../../common/utils/maintenanceMode";

vi.mock("../../common/utils/maintenanceMode", async () => {
  const actual = await vi.importActual<
    typeof import("../../common/utils/maintenanceMode")
  >("../../common/utils/maintenanceMode");

  return {
    ...actual,
    isMaintenanceModeEnabled: vi.fn(),
  };
});

vi.mock("../../auth", () => ({
  useUserDetails: () => ({
    username: "signed-in.user@example.org",
  }),
}));

const mockedMaintenanceMode = vi.mocked(isMaintenanceModeEnabled);

const LocationProbe = () => {
  const location = useLocation();
  return (
    <div data-testid="location">
      {location.pathname}
      {location.search}
    </div>
  );
};

const renderGuard = (initialEntry: string) =>
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <MaintenanceGuard>
        <div>case registration content</div>
      </MaintenanceGuard>
      <LocationProbe />
    </MemoryRouter>,
  );

describe("MaintenanceGuard", () => {
  beforeEach(() => {
    mockedMaintenanceMode.mockReset();
  });

  it("redirects main routes to the maintenance page when maintenance mode is on", () => {
    mockedMaintenanceMode.mockReturnValue(true);

    const { unmount } = renderGuard("/");
    expect(screen.getByTestId("location")).toHaveTextContent("/maintenance");
    expect(
      screen.getByRole("heading", { level: 1, name: MAINTENANCE_HEADING }),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("case registration content"),
    ).not.toBeInTheDocument();
    unmount();

    renderGuard("/case-registration");
    expect(screen.getByTestId("location")).toHaveTextContent("/maintenance");
    expect(
      screen.queryByText("case registration content"),
    ).not.toBeInTheDocument();
  });

  it("shows the maintenance page directly and ignores bypass query parameters", () => {
    mockedMaintenanceMode.mockReturnValue(true);

    renderGuard(
      "/maintenance?automation-test-first-visit&no-auth=true&maintenance=false",
    );

    expect(screen.getByTestId("location")).toHaveTextContent(
      "/maintenance?automation-test-first-visit&no-auth=true&maintenance=false",
    );
    expect(
      screen.getByRole("heading", { level: 1, name: MAINTENANCE_HEADING }),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("case registration content"),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId("div-ad-username")).not.toBeInTheDocument();
  });

  it("does not let a query parameter on a normal route bypass maintenance mode", () => {
    mockedMaintenanceMode.mockReturnValue(true);

    renderGuard("/?automation-test-first-visit&maintenance=false");

    expect(screen.getByTestId("location")).toHaveTextContent("/maintenance");
    expect(
      screen.queryByText("case registration content"),
    ).not.toBeInTheDocument();
  });

  it("redirects /maintenance home when maintenance mode is off", () => {
    mockedMaintenanceMode.mockReturnValue(false);

    renderGuard("/maintenance?maintenance=true");

    expect(screen.getByTestId("location")).toHaveTextContent("/");
    expect(
      screen.queryByRole("heading", { name: MAINTENANCE_HEADING }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("case registration content")).toBeInTheDocument();
  });

  it("leaves normal routes in place when maintenance mode is off", () => {
    mockedMaintenanceMode.mockReturnValue(false);

    renderGuard("/case-registration");

    expect(screen.getByTestId("location")).toHaveTextContent(
      "/case-registration",
    );
    expect(screen.getByText("case registration content")).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: MAINTENANCE_HEADING }),
    ).not.toBeInTheDocument();
  });
});
