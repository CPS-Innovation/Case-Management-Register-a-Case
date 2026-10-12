import PageContentWrapper from "../common/PageContentWrapper";
import {
  getMaintenanceMessage1,
  getMaintenanceMessage2,
  MAINTENANCE_CONTACT_LINE,
  MAINTENANCE_HEADING,
} from "../../common/utils/maintenanceMode";

const MaintenancePage = () => {
  return (
    <PageContentWrapper>
      <h1
        className="govuk-heading-l govuk-!-margin-top-6"
        data-testid="txt-maintenance-heading"
      >
        {MAINTENANCE_HEADING}
      </h1>
      <p className="govuk-body" data-testid="txt-maintenance-message-1">
        {getMaintenanceMessage1()}
      </p>
      <p className="govuk-body" data-testid="txt-maintenance-message-2">
        {getMaintenanceMessage2()}
      </p>
      <p className="govuk-body" data-testid="txt-maintenance-contact">
        {MAINTENANCE_CONTACT_LINE}
      </p>
    </PageContentWrapper>
  );
};

export default MaintenancePage;
