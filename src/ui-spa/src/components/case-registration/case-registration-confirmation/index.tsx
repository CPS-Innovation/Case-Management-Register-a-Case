import { useContext, useMemo } from "react";
import { Panel } from "../../govuk";
import { HOME_PAGE_URL } from "../../../config";
import { CaseRegistrationFormContext } from "../../../common/providers/CaseRegistrationProvider";
import PageContentWrapper from "../../common/PageContentWrapper";
import styles from "./index.module.scss";
const CaseRegistrationConfirmationPage = () => {
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
        <Panel titleChildren="Case registered successfully">
          <div className={styles.urnData}>
            <p className={styles.urnLabel}>URN</p>
            <p className={styles.urnValue}>{urn}</p>
          </div>
        </Panel>
        <h2>Next steps</h2>
        <p>Use the URN to find the case.</p>
        <a href={HOME_PAGE_URL} className="govuk-link">
          Return to the home page
        </a>
      </div>
    </PageContentWrapper>
  );
};
export default CaseRegistrationConfirmationPage;
