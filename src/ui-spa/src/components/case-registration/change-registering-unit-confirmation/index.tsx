import { useContext } from "react";
import { Button, BackLink } from "../../govuk";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { CaseRegistrationFormContext } from "../../../common/providers/CaseRegistrationProvider";
import PageContentWrapper from "../../common/PageContentWrapper";
import pageStyles from "./index.module.scss";

const ChangeRegisteringUnitConfirmationPage = () => {
  const navigate = useNavigate();
  const {
    state: { formData },
  }: {
    state: {
      formData: {
        urnPoliceForceText: string;
        urnPoliceUnitText: string;
        urnUniqueReferenceText: string;
        urnYearReferenceText: string;
        registeringUnitText: { id: number | null; description: string };
        witnessCareUnitText: { id: number | null; description: string };
      };
    };
  } = useLocation();
  const { dispatch, state } = useContext(CaseRegistrationFormContext);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch({
      type: "RESET_RU_DEPENDENT_FIELDS",
    });

    dispatch({
      type: "SET_FIELDS",
      payload: {
        data: {
          ...formData,
        },
      },
    });
    if (state.formData.firstHearingRadio) {
      navigate("/case-registration/first-hearing");
      return;
    }

    navigate("/case-registration/case-assignee");
  };

  return (
    <div
      className={`${pageStyles.changeRegisteringUnitConfirmationPage} govuk-grid-column-two-thirds`}
    >
      <BackLink to={"/case-registration/case-details"}>Back</BackLink>
      <PageContentWrapper>
        <form onSubmit={handleSubmit}>
          <h1>
            Changing the registering unit means you must update other case
            details
          </h1>

          <div>
            <p>
              If you change the registering unit, you will need to review and
              update other case details. This is because some information is
              linked to the registering unit.
            </p>
            <p> You will need to check and update:</p>
            <ul>
              {state.formData.firstHearingRadio && (
                <li>first hearing details</li>
              )}
              <li>who is working on the case</li>
            </ul>
            <p>
              You can continue to change the registering unit now, or cancel to
              keep the current registering unit.
            </p>
          </div>
          <div className={pageStyles.buttonWrapper}>
            <Button type="submit" onClick={() => handleSubmit}>
              Continue and change the registering unit
            </Button>

            <Link
              to={"/case-registration/case-details"}
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

export default ChangeRegisteringUnitConfirmationPage;
