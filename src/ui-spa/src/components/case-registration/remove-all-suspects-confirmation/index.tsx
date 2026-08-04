import { useContext } from "react";
import { Button, BackLink } from "../../govuk";
import { useNavigate, useLocation, Link } from "react-router";
import { CaseRegistrationFormContext } from "../../../common/providers/CaseRegistrationProvider";
import { type GeneralRadioValue } from "../../../common/reducers/caseRegistrationReducer";
import PageContentWrapper from "../../common/PageContentWrapper";
import pageStyles from "./index.module.scss";

const RemoveAllSuspectsConfirmationPage = () => {
  const navigate = useNavigate();
  const {
    state: { formData, nextRoute, backRoute },
  }: {
    state: {
      nextRoute: string;
      backRoute: string;
      formData: {
        operationNameRadio: GeneralRadioValue;
        suspectDetailsRadio: GeneralRadioValue;
        operationNameText: string;
      };
    };
  } = useLocation();
  const { dispatch } = useContext(CaseRegistrationFormContext);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch({
      type: "SET_FIELDS",
      payload: {
        data: {
          ...formData,
        },
      },
    });
    dispatch({
      type: "REMOVE_ALL_SUSPECTS",
    });

    if (nextRoute === "/case-registration/case-summary") {
      dispatch({
        type: "SET_NAVIGATION_DATA",
        payload: { fromCaseSummaryPage: false },
      });
    }

    return navigate(nextRoute);
  };

  return (
    <div className={pageStyles.removeAllSuspectsConfirmationPage}>
      <BackLink to={backRoute}>Back</BackLink>
      <PageContentWrapper>
        <form onSubmit={handleSubmit}>
          <h1>Are you sure you want to delete the suspect details?</h1>
          <div>
            <p>
              Changing your answer to No will delete information you entered
              including any charges or victims.
            </p>
            <p>You will not be able to recover this.</p>
          </div>
          <div className={pageStyles.buttonWrapper}>
            <Button type="submit" onClick={() => handleSubmit}>
              Delete suspect details
            </Button>

            <Link to={backRoute} className="govuk-link--no-visited-state">
              Cancel
            </Link>
          </div>
        </form>
      </PageContentWrapper>
    </div>
  );
};

export default RemoveAllSuspectsConfirmationPage;
