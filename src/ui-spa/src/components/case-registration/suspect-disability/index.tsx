import { useState, useContext, useCallback, useMemo } from "react";
import { Radios, ErrorSummary, BackLink } from "../../govuk";
import SaveAndCancel from "../../common/SaveAndCancel";
import { CaseRegistrationFormContext } from "../../../common/providers/CaseRegistrationProvider";
import { type GeneralRadioValue } from "../../../common/reducers/caseRegistrationReducer";
import { formatNameUtil } from "../../../common/utils/formatNameUtil";
import { useNavigate, useParams } from "react-router-dom";
import useErrorSummaryList from "../../../common/hooks/useErrorSummaryList";
import useGetSuspectRoute from "../../../common/hooks/useGetSuspectRoute";
import styles from "../index.module.scss";

const SuspectDisabilityPage = () => {
  type ErrorText = {
    errorSummaryText: string;
    inputErrorText?: string;
  };
  type FormDataErrors = {
    suspectDisabilityRadio?: ErrorText;
  };

  const { state, dispatch } = useContext(CaseRegistrationFormContext);
  const navigate = useNavigate();
  const { suspectId } = useParams<{ suspectId: string }>() as {
    suspectId: string;
  };

  const suspectIndex = useMemo(() => {
    const index = suspectId.replace("suspect-", "");
    return Number.parseInt(index, 10);
  }, [suspectId]);

  const [formData, setFormData] = useState<{
    suspectDisabilityRadio?: GeneralRadioValue;
  }>({
    suspectDisabilityRadio:
      state.formData.suspects[suspectIndex].suspectDisabilityRadio || "",
  });

  const { previousRoute, nextRoute } = useGetSuspectRoute(
    "suspect-disability",
    state.formData.suspects[suspectIndex].suspectAdditionalDetailsCheckboxes,
    suspectIndex,
    state.formData.suspects[suspectIndex].suspectAliases.length > 0,
  );

  const [formDataErrors, setFormDataErrors] = useState<FormDataErrors>({});

  const errorSummaryProperties = useCallback(
    (errorKey: keyof FormDataErrors) => {
      if (errorKey === "suspectDisabilityRadio") {
        return {
          children: formDataErrors[errorKey]?.errorSummaryText,
          href: "#suspect-disability-radio-yes",
          "data-testid": "suspect-disability-radio-link",
        };
      }

      return null;
    },
    [formDataErrors],
  );
  const { errorSummaryRef, errorList, disableBtns, setDisableBtns } =
    useErrorSummaryList(formDataErrors, errorSummaryProperties);
  const validateFormData = () => {
    const errors: FormDataErrors = {};
    const { suspectDisabilityRadio = "" } = formData;

    if (!suspectDisabilityRadio) {
      errors.suspectDisabilityRadio = {
        errorSummaryText: "Select whether the defendant has a disability",
        inputErrorText: "Select whether the defendant has a disability",
      };
    }

    const isValid = !Object.entries(errors).filter(([, value]) => value).length;

    setFormDataErrors(errors);
    return isValid;
  };

  const setFormValue = (value: string) => {
    setFormData({
      ...formData,
      suspectDisabilityRadio: value as GeneralRadioValue,
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateFormData()) return;
    setDisableBtns(true);
    dispatch({
      type: "SET_SUSPECT_FIELDS",
      payload: {
        index: suspectIndex,
        data: formData,
      },
    });

    return navigate(nextRoute);
  };

  const {
    formData: { suspects },
  } = state;

  const { suspectFirstNameText = "", suspectLastNameText = "" } =
    suspects[suspectIndex] || {};

  return (
    <div>
      <BackLink to={previousRoute}>Back</BackLink>
      {!!errorList.length && (
        <div
          ref={errorSummaryRef}
          tabIndex={-1}
          className={styles.errorSummaryWrapper}
        >
          <ErrorSummary
            data-testid={"suspect-disability-error-summary"}
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
                    {` Does ${formatNameUtil(
                      suspectFirstNameText,
                      suspectLastNameText,
                    )} have a disability?`}
                  </h1>
                ),
              },
            }}
            errorMessage={
              formDataErrors["suspectDisabilityRadio"]
                ? {
                    children:
                      formDataErrors["suspectDisabilityRadio"].inputErrorText,
                  }
                : undefined
            }
            items={[
              {
                id: `suspect-disability-radio-yes`,
                children: "Yes",
                value: "yes",
                "data-testid": `suspect-disability-radio-yes`,
              },
              {
                id: `suspect-disability-radio-no`,
                children: "No",
                value: "no",
                "data-testid": `suspect-disability-radio-no`,
              },
            ]}
            value={formData.suspectDisabilityRadio}
            onChange={(value) => {
              if (value) setFormValue(value);
            }}
          ></Radios>
        </div>
        <SaveAndCancel onSave={handleSubmit} disabled={disableBtns} />
      </form>
    </div>
  );
};

export default SuspectDisabilityPage;
