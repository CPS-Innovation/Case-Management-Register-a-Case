import {
  useRef,
  useEffect,
  useState,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { Radios, ErrorSummary, BackLink } from "../../govuk";
import SaveAndCancel from "../../common/SaveAndCancel";
import { CaseRegistrationFormContext } from "../../../common/providers/CaseRegistrationProvider";
import { getEthnicities } from "../../../apis/gateway-api";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import {
  getNextSuspectJourneyRoute,
  getPreviousSuspectJourneyRoute,
} from "../../../common/utils/getSuspectJourneyRoutes";
import { formatNameUtil } from "../../../common/utils/formatNameUtil";
import styles from "../index.module.scss";

const SuspectEthnicityPage = () => {
  type ErrorText = {
    errorSummaryText: string;
    inputErrorText?: string;
  };
  type FormDataErrors = {
    suspectEthnicityRadio?: ErrorText;
  };
  const errorSummaryRef = useRef<HTMLInputElement>(null);
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
    suspectEthnicityRadio: { shortCode: string; description: string };
  }>({
    suspectEthnicityRadio: state.formData.suspects[suspectIndex]
      .suspectEthnicityRadio || {
      shortCode: "",
      description: "",
    },
  });

  const {
    data: ethnicityData,
    isLoading: isEthnicitiesLoading,
    error: ethnicityError,
  } = useQuery({
    queryKey: ["ethnicities"],
    queryFn: () => getEthnicities(),
    enabled: !state.apiData.suspectEthnicities,
    retry: false,
  });

  useEffect(() => {
    if (ethnicityError) throw ethnicityError;
  }, [ethnicityError]);

  const previousRoute = useMemo(() => {
    return getPreviousSuspectJourneyRoute(
      "suspect-ethnicity",
      state.formData.suspects[suspectIndex].suspectAdditionalDetailsCheckboxes,
      suspectIndex,
    );
  }, [state.formData.suspects, suspectIndex]);

  const [formDataErrors, setFormDataErrors] = useState<FormDataErrors>({});

  const errorSummaryProperties = useCallback(
    (errorKey: keyof FormDataErrors) => {
      if (errorKey === "suspectEthnicityRadio") {
        return {
          children: formDataErrors[errorKey]?.errorSummaryText,
          href: "#suspect-ethnicity-radio-0",
          "data-testid": "suspect-ethnicity-radio-link",
        };
      }

      return null;
    },
    [formDataErrors],
  );

  const validateFormData = () => {
    const errors: FormDataErrors = {};
    const { suspectEthnicityRadio = { shortCode: null, description: "" } } =
      formData;

    if (!suspectEthnicityRadio.shortCode) {
      errors.suspectEthnicityRadio = {
        errorSummaryText: "Select the defendant's ethnicity",
        inputErrorText: "Select the defendant's ethnicity",
      };
    }

    const isValid = !Object.entries(errors).filter(([, value]) => value).length;

    setFormDataErrors(errors);
    return isValid;
  };

  const errorList = useMemo(() => {
    const validErrorKeys = Object.keys(formDataErrors).filter(
      (errorKey) => formDataErrors[errorKey as keyof FormDataErrors],
    );

    const errorSummary = validErrorKeys.map((errorKey, index) => ({
      reactListKey: `${index}`,
      ...errorSummaryProperties(errorKey as keyof FormDataErrors)!,
    }));

    return errorSummary;
  }, [formDataErrors, errorSummaryProperties]);

  useEffect(() => {
    if (errorList.length) errorSummaryRef.current?.focus();
  }, [errorList]);

  useEffect(() => {
    if (!isEthnicitiesLoading && ethnicityData) {
      dispatch({
        type: "SET_CASE_SUSPECT_ETHNICITIES",
        payload: {
          suspectEthnicities: ethnicityData,
        },
      });
    }
  }, [ethnicityData, dispatch, isEthnicitiesLoading]);

  const ethnicityItems = useMemo(() => {
    if (!state.apiData.suspectEthnicities) return [];
    return state.apiData.suspectEthnicities.map((ethnicity, index) => ({
      id: `suspect-ethnicity-radio-${index}`,
      children: ethnicity.description,
      value: ethnicity.shortCode,
      "data-testid": `suspect-ethnicity-radio-${index}`,
    }));
  }, [state.apiData.suspectEthnicities]);

  const setFormValue = (value: string) => {
    const selectedEthnicity = state.apiData.suspectEthnicities?.find(
      (ethnicity) => ethnicity.shortCode === value,
    );
    if (selectedEthnicity) {
      setFormData({
        ...formData,
        suspectEthnicityRadio: selectedEthnicity,
      });
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateFormData()) return;

    dispatch({
      type: "SET_SUSPECT_FIELDS",
      payload: {
        index: suspectIndex,
        data: formData,
      },
    });

    const nextRoute = getNextSuspectJourneyRoute(
      "suspect-ethnicity",
      state.formData.suspects[suspectIndex].suspectAdditionalDetailsCheckboxes,
      suspectIndex,
      state.formData.suspects[suspectIndex].suspectAliases.length > 0,
    );
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
            data-testid={"suspect-ethnicity-error-summary"}
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
                  <h1>{`What is ${formatNameUtil(suspectFirstNameText, suspectLastNameText)}'s ethnicity?`}</h1>
                ),
              },
            }}
            errorMessage={
              formDataErrors["suspectEthnicityRadio"]
                ? {
                    children:
                      formDataErrors["suspectEthnicityRadio"].inputErrorText,
                  }
                : undefined
            }
            items={ethnicityItems}
            value={formData.suspectEthnicityRadio.shortCode || ""}
            onChange={(value) => {
              if (value) setFormValue(value);
            }}
          ></Radios>
        </div>
        <SaveAndCancel onSave={handleSubmit} />
      </form>
    </div>
  );
};

export default SuspectEthnicityPage;
