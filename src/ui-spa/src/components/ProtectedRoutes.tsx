import { Outlet, Navigate } from "react-router";
import { useContext } from "react";
import { CaseRegistrationFormContext } from "../common/providers/CaseRegistrationProvider";
const ProtectedRoutes = () => {
  const { state } = useContext(CaseRegistrationFormContext);

  const isAllowed =
    state.formData.suspectDetailsRadio &&
    state.apiData.areasAndRegisteringUnits;
  return isAllowed ? <Outlet /> : <Navigate to="/case-registration" replace />;
};

export default ProtectedRoutes;
