import { Routes, Route, Navigate } from "react-router";
import CaseRegistrationPage from "./case-registration";
import CaseAreasPage from "./case-registration/case-areas-page";
import CaseDetailsPage from "./case-registration//case-details-page";
import FirstHearingPage from "./case-registration/first-hearing-page";
import CaseComplexityPage from "./case-registration/case-complexity-page";
import CaseMonitoringCodesPage from "./case-registration/case-monitoring-codes";
import CaseAssigneePage from "./case-registration/case-assignee";
import CaseSummaryPage from "./case-registration/case-summary-page";
import CaseRegistrationConfirmationPage from "./case-registration/case-registration-confirmation";
import AddSuspectPage from "./case-registration/add-suspect";
import SuspectDOBPage from "./case-registration/suspect-dob";
import SuspectGenderPage from "./case-registration/suspect-gender";
import SuspectEthnicityPage from "./case-registration/suspect-ethnicity";
import SuspectReligionPage from "./case-registration/suspect-religion";
import SuspectDisabilityPage from "./case-registration/suspect-disability";
import SuspectASNPage from "./case-registration/suspect-asn";
import SuspectOffenderPage from "./case-registration/suspect-offender";
import SuspectAliasesPage from "./case-registration/suspect-aliases";
import SuspectAliasesSummaryPage from "./case-registration/suspect-aliases-summary";
import SuspectSummaryPage from "./case-registration/suspect-summary";
import SuspectRemoveConfirmationPage from "./case-registration/suspect-remove-confirmation";
import WantToAddCharges from "./case-registration/want-to-add-charges";
import AddChargeSuspectPage from "./case-registration/add-charge-suspect";
import OffenceSearchPage from "./case-registration/charges-offence-search";
import AddChargeDetailsPage from "./case-registration/add-charge-details";
import ChargesSummaryPage from "./case-registration/charges-summary";
import AddChargeVictimPage from "./case-registration/add-charge-victim";
import ChargeRemoveConfirmationPage from "./case-registration/charge-remove-confirmation";
import ChargesVictimDuplicateConfirmationPage from "./case-registration/charges-victim-duplicate-confirmation";
import ChangeAreaConfirmationPage from "./case-registration/change-area-confirmation";
import ChangeRegisteringUnitConfirmationPage from "./case-registration/change-registering-unit-confirmation";
import RemoveAllSuspectsConfirmationPage from "./case-registration/remove-all-suspects-confirmation";
import CancelCaseRegistrationConfirmationPage from "./case-registration/cancel-case-registration-confirmation";
import ProtectedRoutes from "./ProtectedRoutes";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/case-registration" element={<CaseRegistrationPage />} />
      <Route element={<ProtectedRoutes />}>
        <Route path="/case-registration/areas" element={<CaseAreasPage />} />
        <Route
          path="/case-registration/case-details"
          element={<CaseDetailsPage />}
        />
        <Route
          path="/case-registration/first-hearing"
          element={<FirstHearingPage />}
        />
        <Route
          path="/case-registration/case-complexity"
          element={<CaseComplexityPage />}
        />
        <Route
          path="/case-registration/case-monitoring-codes"
          element={<CaseMonitoringCodesPage />}
        />
        <Route
          path="/case-registration/case-assignee"
          element={<CaseAssigneePage />}
        />
        <Route
          path="/case-registration/case-summary"
          element={<CaseSummaryPage />}
        />
        <Route
          path="/case-registration/case-registration-confirmation"
          element={<CaseRegistrationConfirmationPage />}
        />
        <Route
          path="/case-registration/:suspectId/add-suspect"
          element={<AddSuspectPage />}
        />
        <Route
          path="/case-registration/:suspectId/suspect-dob"
          element={<SuspectDOBPage />}
        />
        <Route
          path="/case-registration/:suspectId/suspect-gender"
          element={<SuspectGenderPage />}
        />
        <Route
          path="/case-registration/:suspectId/suspect-ethnicity"
          element={<SuspectEthnicityPage />}
        />
        <Route
          path="/case-registration/:suspectId/suspect-religion"
          element={<SuspectReligionPage />}
        />
        <Route
          path="/case-registration/:suspectId/suspect-disability"
          element={<SuspectDisabilityPage />}
        />
        <Route
          path="/case-registration/:suspectId/suspect-asn"
          element={<SuspectASNPage />}
        />
        <Route
          path="/case-registration/:suspectId/suspect-offender"
          element={<SuspectOffenderPage />}
        />
        <Route
          path="/case-registration/:suspectId/suspect-add-aliases"
          element={<SuspectAliasesPage />}
        />
        <Route
          path="/case-registration/:suspectId/suspect-aliases-summary"
          element={<SuspectAliasesSummaryPage />}
        />
        <Route
          path="/case-registration/suspect-summary"
          element={<SuspectSummaryPage />}
        />
        <Route
          path="/case-registration/suspect-remove-confirmation"
          element={<SuspectRemoveConfirmationPage />}
        />
        <Route
          path="/case-registration/want-to-add-charges"
          element={<WantToAddCharges />}
        />
        <Route
          path="/case-registration/add-charge-suspect"
          element={<AddChargeSuspectPage />}
        />
        <Route
          path="/case-registration/:suspectId/:chargeId/charges-offence-search"
          element={<OffenceSearchPage />}
        />
        <Route
          path="/case-registration/:suspectId/:chargeId/add-charge-details"
          element={<AddChargeDetailsPage />}
        />
        <Route
          path="/case-registration/charges-summary"
          element={<ChargesSummaryPage />}
        />
        <Route
          path="/case-registration/:suspectId/:chargeId/add-charge-victim"
          element={<AddChargeVictimPage />}
        />
        <Route
          path="/case-registration/charge-remove-confirmation"
          element={<ChargeRemoveConfirmationPage />}
        />
        <Route
          path="/case-registration/charges-victim-duplicate-confirmation"
          element={<ChargesVictimDuplicateConfirmationPage />}
        />
        <Route
          path="/case-registration/change-area-confirmation"
          element={<ChangeAreaConfirmationPage />}
        />
        <Route
          path="/case-registration/change-registering-unit-confirmation"
          element={<ChangeRegisteringUnitConfirmationPage />}
        />
        <Route
          path="/case-registration/remove-all-suspects-confirmation"
          element={<RemoveAllSuspectsConfirmationPage />}
        />
      </Route>
      <Route
        path="/case-registration/cancel-case-registration-confirmation"
        element={<CancelCaseRegistrationConfirmationPage />}
      />
      <Route path="*" element={<Navigate to="/case-registration" replace />} />
    </Routes>
  );
};

export default AppRoutes;
