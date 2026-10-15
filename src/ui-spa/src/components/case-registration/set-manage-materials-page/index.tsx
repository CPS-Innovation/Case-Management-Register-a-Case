import { useContext, useMemo, useCallback, useState } from "react";
import { Radios, Button } from "../../govuk";
import { SET_UP_EGRESS_AND_SHARED_DRIVE_URL } from "../../../config";
import { CaseRegistrationFormContext } from "../../../common/providers/CaseRegistrationProvider";
import { type GeneralRadioValue } from "../../../common/reducers/caseRegistrationReducer";
import PageContentWrapper from "../../common/PageContentWrapper";
import { useNavigate } from "react-router";
import useErrorSummaryList from "../../../common/hooks/useErrorSummaryList";
import ErrorSummaryWrapper from "../../common/ErrorSummaryWrapper";
import styles from "./index.module.scss";
const SetManageMaterialsPage = () => {
  type ErrorText = {
    errorSummaryText: string;
    inputErrorText?: string;
  };
  type FormDataErrors = {
    manageMaterialsRadio?: ErrorText;
  };

  const { state, dispatch } = useContext(CaseRegistrationFormContext);
  const navigate = useNavigate();
  const { formData } = state;
  const urn = useMemo(
    () =>
      `${formData.urnPoliceForceText}${formData.urnPoliceUnitText}${formData.urnUniqueReferenceText}${formData.urnYearReferenceText}`,
    [formData],
  );

  const [manageMaterialsFormData, setManageMaterialsFormData] = useState<{
    manageMaterialsRadio?: GeneralRadioValue;
  }>({
    manageMaterialsRadio: state.furtherJourneyData.manageMaterialsRadio || "",
  });

  const [manageMaterialsFormDataErrors, setManageMaterialsFormDataErrors] =
    useState<FormDataErrors>({});

  const errorSummaryProperties = useCallback(
    (errorKey: keyof FormDataErrors) => {
      if (errorKey === "manageMaterialsRadio") {
        return {
          children: manageMaterialsFormDataErrors[errorKey]?.errorSummaryText,
          href: "#manage-materials-radio-yes",
          "data-testid": "manage-materials-radio-link",
        };
      }

      return null;
    },
    [manageMaterialsFormDataErrors],
  );
  const { errorSummaryRef, errorList, setDisableBtns } = useErrorSummaryList(
    manageMaterialsFormDataErrors,
    errorSummaryProperties,
  );
  const validateFormData = () => {
    const errors: FormDataErrors = {};
    const { manageMaterialsRadio = "" } = manageMaterialsFormData;

    if (!manageMaterialsRadio) {
      errors.manageMaterialsRadio = {
        errorSummaryText: "Select if you want to manage case materials",
        inputErrorText: "Select if you want to manage case materials",
      };
      setManageMaterialsFormDataErrors(errors);

      return false;
    }

    return true;
  };

  const setFormValue = (value: string) => {
    setManageMaterialsFormData({
      ...manageMaterialsFormData,
      manageMaterialsRadio: value as GeneralRadioValue,
    });
  };

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (!validateFormData()) return;
    setDisableBtns(true);
    dispatch({
      type: "FURTHER_JOURNEY_DATA",
      payload: manageMaterialsFormData,
    });

    if (manageMaterialsFormData.manageMaterialsRadio === "no") {
      void navigate("/case-registration/case-registration-confirmation");
      return;
    }

    const destinationUrl = new URL(
      SET_UP_EGRESS_AND_SHARED_DRIVE_URL,
      window.location.origin,
    );
    destinationUrl.searchParams.set("urn", urn);
    window.location.href = destinationUrl.toString();
  };

  return (
    <PageContentWrapper>
      <ErrorSummaryWrapper
        errorList={errorList}
        errorSummaryRef={errorSummaryRef}
        dataTestId="manage-materials-error-summary"
      />
      <div className={styles.setManageMaterialsPage}>
        <h1 className="govuk-heading-xl">Case Registered</h1>
        <p>The case has been created.</p>
        <p className="govuk-inset-text" data-testid="urn-reference">
          URN: {urn}
        </p>

        <h2 className="govuk-heading-m">Manage case materials</h2>
        <p className="govuk-body">You can:</p>
        <ul className="govuk-list govuk-list--bullet">
          <li>create a new Egress or Shared drive folder for this case</li>
          <li>
            connect an existing Egress or Shared drive folder to this case
          </li>
        </ul>

        <form onSubmit={handleSubmit}>
          <div>
            <Radios
              fieldset={{
                legend: {
                  children: "Would you like to manage materials for this case?",
                },
              }}
              errorMessage={
                manageMaterialsFormDataErrors["manageMaterialsRadio"]
                  ? {
                      children:
                        manageMaterialsFormDataErrors["manageMaterialsRadio"]
                          .inputErrorText,
                    }
                  : undefined
              }
              items={[
                {
                  id: `manage-materials-radio-yes`,
                  children: "Yes",
                  value: "yes",
                  "data-testid": `manage-materials-radio-yes`,
                },
                {
                  id: `manage-materials-radio-no`,
                  children: "No",
                  value: "no",
                  "data-testid": `manage-materials-radio-no`,
                },
              ]}
              value={manageMaterialsFormData.manageMaterialsRadio}
              onChange={(value) => {
                if (value) setFormValue(value);
              }}
            ></Radios>
          </div>
          <Button>Continue</Button>
        </form>
      </div>
    </PageContentWrapper>
  );
};
export default SetManageMaterialsPage;
