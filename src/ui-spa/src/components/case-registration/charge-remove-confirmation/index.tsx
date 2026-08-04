import { useContext } from "react";
import { Button, BackLink } from "../../govuk";
import { useNavigate, useLocation, Link } from "react-router";
import { CaseRegistrationFormContext } from "../../../common/providers/CaseRegistrationProvider";
import PageContentWrapper from "../../common/PageContentWrapper";
import pageStyles from "./index.module.scss";

const ChargeRemoveConfirmationPage = () => {
  const navigate = useNavigate();
  const {
    state: { suspectId, chargeId, backRoute },
  }: {
    state: { suspectId: string; chargeId: string; backRoute: string };
  } = useLocation();
  const { dispatch } = useContext(CaseRegistrationFormContext);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch({
      type: "REMOVE_SUSPECT_CHARGE",
      payload: {
        suspectId,
        chargeId,
      },
    });

    return navigate(backRoute);
  };

  return (
    <div className={pageStyles.chargeRemoveConfirmationPage}>
      <BackLink to={backRoute}>Back</BackLink>
      <PageContentWrapper>
        <form onSubmit={handleSubmit}>
          <h1>Are you sure you want to remove this charge?</h1>
          <div>
            <p>
              This will permanently remove all the details you&apos;ve entered.
            </p>
            <p>You will not be able to restore them.</p>
          </div>
          <div className={pageStyles.buttonWrapper}>
            <Button type="submit" onClick={() => handleSubmit}>
              Save and continue
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

export default ChargeRemoveConfirmationPage;
