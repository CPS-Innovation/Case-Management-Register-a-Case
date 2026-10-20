import { Navigate, useLocation } from "react-router";
import Layout from "../Layout";
import MaintenancePage from "./index";
import { isMaintenanceModeEnabled } from "../../common/utils/maintenanceMode";

const isMaintenancePath = (pathname: string) => {
  const normalised =
    pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return normalised.toLowerCase() === "/maintenance";
};

const MaintenanceGuard = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const maintenanceMode = isMaintenanceModeEnabled();
  const onMaintenancePage = isMaintenancePath(location.pathname);

  if (maintenanceMode && onMaintenancePage) {
    return (
      <Layout showAuthenticatedContent={false}>
        <MaintenancePage />
      </Layout>
    );
  }

  if (maintenanceMode) {
    return <Navigate to="/maintenance" replace />;
  }

  if (onMaintenancePage) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default MaintenanceGuard;
