import { useState, useContext, useCallback, useMemo } from "react";
import { Radios, BackLink } from "../../govuk";
import SaveAndCancel from "../../common/SaveAndCancel";
import { CaseRegistrationFormContext } from "../../../common/providers/CaseRegistrationProvider";
import { type GeneralRadioValue } from "../../../common/reducers/caseRegistrationReducer";
import { formatNameUtil } from "../../../common/utils/formatNameUtil";
import { useNavigate, useParams } from "react-router-dom";
import useErrorSummaryList from "../../../common/hooks/useErrorSummaryList";
import useGetSuspectRoute from "../../../common/hooks/useGetSuspectRoute";
import ErrorSummaryWrapper from "../../common/ErrorSummaryWrapper";
import PageContentWrapper from "../../common/PageContentWrapper";
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

  const [disabilityFormData, setDisabilityFormData] = useState<{
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

  const [disabilityFormDataErrors, setDisabilityFormDataErrors] =
    useState<FormDataErrors>({});

  const errorSummaryProperties = useCallback(
    (errorKey: keyof FormDataErrors) => {
      if (errorKey === "suspectDisabilityRadio") {
        return {
          children: disabilityFormDataErrors[errorKey]?.errorSummaryText,
          href: "#suspect-disability-radio-yes",
          "data-testid": "suspect-disability-radio-link",
        };
      }

      return null;
    },
    [disabilityFormDataErrors],
  );
  const { errorSummaryRef, errorList, disableBtns, setDisableBtns } =
    useErrorSummaryList(disabilityFormDataErrors, errorSummaryProperties);
  const validateFormData = () => {
    const errors: FormDataErrors = {};
    const { suspectDisabilityRadio = "" } = disabilityFormData;

    if (!suspectDisabilityRadio) {
      errors.suspectDisabilityRadio = {
        errorSummaryText: "Select whether the defendant has a disability",
        inputErrorText: "Select whether the defendant has a disability",
      };
    }

    const isValid = !Object.entries(errors).filter(([, value]) => value).length;

    setDisabilityFormDataErrors(errors);
    return isValid;
  };

  const setFormValue = (value: string) => {
    setDisabilityFormData({
      ...disabilityFormData,
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
        data: disabilityFormData,
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
      <PageContentWrapper>
        <ErrorSummaryWrapper
          errorList={errorList}
          errorSummaryRef={errorSummaryRef}
          dataTestId="suspect-disability-error-summary"
        />
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
                disabilityFormDataErrors["suspectDisabilityRadio"]
                  ? {
                      children:
                        disabilityFormDataErrors["suspectDisabilityRadio"]
                          .inputErrorText,
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
              value={disabilityFormData.suspectDisabilityRadio}
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

export default SuspectDisabilityPage;
