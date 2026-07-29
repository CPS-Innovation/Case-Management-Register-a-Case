import { useState, useContext, useCallback } from "react";
import { Radios, ErrorSummary, BackLink } from "../../govuk";
import SaveAndCancel from "../../common/SaveAndCancel";
import { CaseRegistrationFormContext } from "../../../common/providers/CaseRegistrationProvider";
import { type GeneralRadioValue } from "../../../common/reducers/caseRegistrationReducer";
import useErrorSummaryList from "../../../common/hooks/useErrorSummaryList";
import { useNavigate } from "react-router";
import PageContentWrapper from "../../common/PageContentWrapper";
import styles from "../index.module.scss";

const WantToAddCharges = () => {
  type ErrorText = {
    errorSummaryText: string;
    inputErrorText?: string;
  };
  type FormDataErrors = {
    wantToAddChargesRadio?: ErrorText;
  };

  const { state, dispatch } = useContext(CaseRegistrationFormContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState<{
    wantToAddChargesRadio: GeneralRadioValue;
  }>({
    wantToAddChargesRadio: state.formData.wantToAddChargesRadio || "",
  });

  const [formDataErrors, setFormDataErrors] = useState<FormDataErrors>({});

  const errorSummaryProperties = useCallback(
    (errorKey: keyof FormDataErrors) => {
      if (errorKey === "wantToAddChargesRadio") {
        return {
          children: formDataErrors[errorKey]?.errorSummaryText,
          href: "#want-to-add-charges-radio-yes",
          "data-testid": "want-to-add-charges-radio-link",
        };
      }

      return null;
    },
    [formDataErrors],
  );
  const { errorSummaryRef, errorList, disableBtns, setDisableBtns } =
    useErrorSummaryList(formDataErrors, errorSummaryProperties);
  const validateFormData = () => {
    let isValid = true;
    const errors: FormDataErrors = {};
    const { wantToAddChargesRadio } = formData;

    if (!wantToAddChargesRadio) {
      errors.wantToAddChargesRadio = {
        errorSummaryText:
          state.formData.suspects.length > 1
            ? "Select whether you need to add charges for any suspects"
            : "Select whether you need to add charges for the suspect",
        inputErrorText:
          state.formData.suspects.length > 1
            ? "Select whether you need to add charges for any suspects"
            : "Select whether you need to add charges for the suspect",
      };
      isValid = false;
    }

    setFormDataErrors(errors);
    return isValid;
  };

  const setFormValue = (value: string) => {
    setFormData({
      wantToAddChargesRadio: value as GeneralRadioValue,
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateFormData()) return;
    setDisableBtns(true);
    dispatch({
      type: "SET_FIELDS",
      payload: {
        data: {
          ...formData,
        },
      },
    });
    const { wantToAddChargesRadio } = formData;
    if (wantToAddChargesRadio === "no") {
      if (
        state.formData.navigation.changeCaseSuspects ||
        state.formData.navigation.changeCaseCharges
      ) {
        dispatch({
          type: "SET_NAVIGATION_DATA",
          payload: {
            changeCaseSuspects: false,
            changeCaseCharges: false,
          },
        });
        navigate("/case-registration/case-summary");
        return;
      }
      return navigate("/case-registration/case-monitoring-codes");
    }
    if (wantToAddChargesRadio === "yes" && state.formData.suspects.length > 1) {
      return navigate("/case-registration/add-charge-suspect");
    }
    const chargeIndex = state.formData.suspects[0].charges.length;
    return navigate(
      `/case-registration/suspect-0/charge-${chargeIndex}/charges-offence-search`,
    );
  };

  const {
    formData: { suspects },
  } = state;

  return (
    <div>
      <BackLink to={"/case-registration/suspect-summary"}>Back</BackLink>
      <PageContentWrapper>
        {!!errorList.length && (
          <div
            ref={errorSummaryRef}
            tabIndex={-1}
            className={styles.errorSummaryWrapper}
          >
            <ErrorSummary
              data-testid={"want-to-add-charges-error-summary"}
              errorList={errorList}
              titleChildren="There is a problem"
            />
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className={styles.inputWrapper}>
            <Radios
              fieldset={{
                legend: {
                  children: (
                    <h1>
                      {suspects.length > 1
                        ? `Do you want to add charges for any of the suspects?`
                        : `Do you want to add charges for the suspect?`}
                    </h1>
                  ),
                },
              }}
              errorMessage={
                formDataErrors["wantToAddChargesRadio"]
                  ? {
                      children:
                        formDataErrors["wantToAddChargesRadio"].inputErrorText,
                    }
                  : undefined
              }
              items={[
                {
                  id: `want-to-add-charges-radio-yes`,
                  children: "Yes",
                  value: "yes",
                  "data-testid": `want-to-add-charges-radio-yes`,
                },
                {
                  id: `want-to-add-charges-radio-no`,
                  children: "No",
                  value: "no",
                  "data-testid": `want-to-add-charges-radio-no`,
                },
              ]}
              value={formData.wantToAddChargesRadio}
              onChange={(value) => {
                if (value) setFormValue(value);
              }}
            ></Radios>
          </div>
          <SaveAndCancel onSave={handleSubmit} disabled={disableBtns} />
        </form>
      </PageContentWrapper>
    </div>
  );
};

export default WantToAddCharges;
