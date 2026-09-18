import { useEffect, useRef, useContext } from "react";
import { useLocation } from "react-router";
import { telemetryService } from "../../TelemetryLogger";
import { CaseRegistrationFormContext } from "../providers/CaseRegistrationProvider";
import { pageTitles } from "../constants/pageTitles";

const usePageView = () => {
  const { state } = useContext(CaseRegistrationFormContext);
  const location = useLocation();
  const lastPath = useRef<string | null>(null);
  const cleanPath = location.pathname.replace(/\/+$/, "") || "/";
  useEffect(() => {
    if (lastPath.current === cleanPath) return;
    if (cleanPath !== "/case-registration" && !state.telemetryData.journeyId) {
      return;
    }

    const lastSlashIndex = cleanPath.lastIndexOf("/");
    const lastSegment = cleanPath.substring(lastSlashIndex);
    const pageName = pageTitles[lastSegment] || "Unknown Page";

    telemetryService.trackPageView(pageName, [
      {
        journeyId: state.telemetryData.journeyId,
      },
      {
        path: cleanPath,
      },
    ]);

    lastPath.current = cleanPath;
  }, [cleanPath, state.telemetryData.journeyId]);
};

export default usePageView;
