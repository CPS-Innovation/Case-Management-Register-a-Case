import { useMemo, useContext } from "react";
import { Button, BackLink } from "../../govuk";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { CaseRegistrationFormContext } from "../../../common/providers/CaseRegistrationProvider";
import { formatNameUtil } from "../../../common/utils/formatNameUtil";
import PageContentWrapper from "../../common/PageContentWrapper";
import pageStyles from "./index.module.scss";

const SuspectRemoveConfirmationPage = () => {
  const navigate = useNavigate();
  const {
    state: { suspectId, backRoute },
  }: { state: { suspectId: string; backRoute: string } } = useLocation();
  const { state, dispatch } = useContext(CaseRegistrationFormContext);
  const {
    formData: { suspects },
  } = state;
  const selectedSuspect = useMemo(
    () => suspects.find((suspect) => suspect.suspectId === suspectId),
    [suspects, suspectId],
  );

  const suspectName = useMemo(() => {
    if (selectedSuspect?.addSuspectRadio === "person") {
      const suspectFirstNameText = selectedSuspect?.suspectFirstNameText || "";
      const suspectLastNameText = selectedSuspect?.suspectLastNameText || "";
      return formatNameUtil(suspectFirstNameText, suspectLastNameText);
    }
    return selectedSuspect?.suspectCompanyNameText;
  }, [selectedSuspect]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    dispatch({
      type: "REMOVE_SUSPECT",
      payload: { suspectId },
    });

    return navigate(backRoute);
  };

  return (
    <div className={pageStyles.caseSuspectRemoveConfirmationPage}>
      <BackLink to={backRoute}>Back</BackLink>
      <PageContentWrapper>
        <form onSubmit={handleSubmit}>
          <h1>{`Are you sure you want to remove ${suspectName}?`}</h1>
          <div>
            <p>
              This will permanently remove all the details you&apos;ve entered
              including any linked charges.
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

export default SuspectRemoveConfirmationPage;
