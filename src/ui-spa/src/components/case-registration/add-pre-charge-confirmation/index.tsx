import { useContext } from "react";
import { Button, BackLink } from "../../govuk";
import { useNavigate, useLocation, Link } from "react-router";
import { CaseRegistrationFormContext } from "../../../common/providers/CaseRegistrationProvider";
import PageContentWrapper from "../../common/PageContentWrapper";
import pageStyles from "./index.module.scss";

const AddPreChargeConfirmationPage = () => {
  const navigate = useNavigate();
  const {
    state: { caseMonitoringCodesCheckboxes },
  }: { state: { caseMonitoringCodesCheckboxes: string[]; backRoute: string } } =
    useLocation();
  const { state, dispatch } = useContext(CaseRegistrationFormContext);

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();

    dispatch({
      type: "SET_FIELDS",
      payload: {
        data: {
          caseMonitoringCodesCheckboxes,
          firstHearingRadio: "",
          firstHearingCourtLocationText: { id: null, description: "" },
          firstHearingDateText: "",
        },
      },
    });

    if (
      state.formData.navigation.fromCaseSummaryPage ||
      state.formData.navigation.changeCaseSuspects ||
      state.formData.navigation.changeCaseCharges
    ) {
      dispatch({
        type: "SET_NAVIGATION_DATA",
        payload: {
          fromCaseSummaryPage: false,
          changeCaseSuspects: false,
          changeCaseCharges: false,
        },
      });
      void navigate("/case-registration/case-summary");
      return;
    }

    void navigate("/case-registration/case-assignee");
  };

  return (
    <div className={pageStyles.caseSuspectRemoveConfirmationPage}>
      <BackLink to="/case-registration/case-monitoring-codes">Back</BackLink>
      <PageContentWrapper>
        <form onSubmit={handleSubmit}>
          <h1>{`Are you sure you want to add a pre-charge monitoring code?`}</h1>
          <div>
            <p>
              This will remove the first hearing details you&apos;ve entered.
            </p>
          </div>
          <div className={pageStyles.buttonWrapper}>
            <Button type="submit" onClick={() => handleSubmit}>
              Save and continue
            </Button>

            <Link
              to={"/case-registration/case-monitoring-codes"}
              className="govuk-link--no-visited-state"
            >
              Cancel
            </Link>
          </div>
        </form>
      </PageContentWrapper>
    </div>
  );
};

export default AddPreChargeConfirmationPage;
