import { useContext, useMemo } from "react";
import { Panel } from "../../govuk";
import {
  HOME_PAGE_URL,
  CMS_CLASSIC_URL,
  SET_UP_EGRESS_AND_SHARED_DRIVE_URL,
} from "../../../config";
import { CaseRegistrationFormContext } from "../../../common/providers/CaseRegistrationProvider";
import PageContentWrapper from "../../common/PageContentWrapper";
import styles from "./index.module.scss";
const CaseRegistrationConfirmationPageV2 = () => {
  const {
    state: { formData },
  } = useContext(CaseRegistrationFormContext);
  const urn = useMemo(
    () =>
      `${formData.urnPoliceForceText}${formData.urnPoliceUnitText}${formData.urnUniqueReferenceText}${formData.urnYearReferenceText}`,
    [formData],
  );
  return (
    <PageContentWrapper>
      <div className={styles.caseRegistrationConfirmationPage}>
        <Panel titleChildren="Case registered">
          <div className={styles.urnData}>
            <p className={styles.urnLabel}>URN</p>
            <p className={styles.urnValue}>{urn}</p>
          </div>
        </Panel>
        <p>Save the URN as you will need it to find or update the case.</p>
        <h2>Next steps</h2>
        <p>You can:</p>
        <ul className="govuk-list govuk-list--bullet">
          <li>
            <a
              href={CMS_CLASSIC_URL}
              className="govuk-link govuk-link--no-visited-state"
            >
              update the case on CMS Classic
            </a>
          </li>
          <li>
            <a
              href={HOME_PAGE_URL}
              className="govuk-link govuk-link--no-visited-state"
            >
              go to the homepage
            </a>{" "}
            to view your cases and tasks
          </li>
          <li>
            <a
              href={SET_UP_EGRESS_AND_SHARED_DRIVE_URL}
              className="govuk-link govuk-link--no-visited-state"
            >
              set up Egress and the Shared Drive
            </a>
          </li>
        </ul>
      </div>
    </PageContentWrapper>
  );
};
export default CaseRegistrationConfirmationPageV2;
