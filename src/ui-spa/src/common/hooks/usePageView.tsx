import { useEffect, useRef, useContext } from "react";
import { useLocation } from "react-router";
import { telemetryService } from "../../TelemetryLogger";
import { CaseRegistrationFormContext } from "../providers/CaseRegistrationProvider";
import { pageTitles } from "../constants/pageTitles";

export const usePageView = () => {
  const { state } = useContext(CaseRegistrationFormContext);
  const location = useLocation();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (lastPath.current === location.pathname) return;
    if (
      location.pathname !== "/case-registration" &&
      !state.telemetryData.journeyId
    ) {
      return;
    }

    const lastSlashIndex = location.pathname.lastIndexOf("/");
    const lastSegment = location.pathname.substring(lastSlashIndex);
    const pageName = pageTitles[lastSegment];
    telemetryService.trackPageView(pageName, [
      {
        journeyId: state.telemetryData.journeyId,
        path: location.pathname,
      },
    ]);

    lastPath.current = location.pathname;
    console.log("location.pathname:", location.pathname);
  }, [location, state.telemetryData.journeyId]);
};
