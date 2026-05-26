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
import { getGenders } from "../../../apis/gateway-api";
import { useQuery } from "@tanstack/react-query";
import { formatNameUtil } from "../../../common/utils/formatNameUtil";
import { useNavigate, useParams } from "react-router-dom";
import {
  getNextSuspectJourneyRoute,
  getPreviousSuspectJourneyRoute,
} from "../../../common/utils/getSuspectJourneyRoutes";
import styles from "../index.module.scss";

const SuspectGenderPage = () => {
  type ErrorText = {
    errorSummaryText: string;
    inputErrorText?: string;
  };
  type FormDataErrors = {
    suspectGenderRadio?: ErrorText;
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
    suspectGenderRadio: { shortCode: string; description: string };
  }>({
    suspectGenderRadio: state.formData.suspects[suspectIndex]
      .suspectGenderRadio || {
      shortCode: "",
      description: "",
    },
  });

  const {
    data: gendersData,
    isLoading: isGendersLoading,
    error: gendersError,
  } = useQuery({
    queryKey: ["genders"],
    queryFn: () => getGenders(),
    enabled: !state.apiData.suspectGenders,
    retry: false,
  });

  useEffect(() => {
    if (gendersError) throw gendersError;
  }, [gendersError]);

  const previousRoute = useMemo(() => {
    return getPreviousSuspectJourneyRoute(
      "suspect-gender",
      state.formData.suspects[suspectIndex].suspectAdditionalDetailsCheckboxes,
      suspectIndex,
    );
  }, [state.formData.suspects, suspectIndex]);

  const [formDataErrors, setFormDataErrors] = useState<FormDataErrors>({});

  const errorSummaryProperties = useCallback(
    (errorKey: keyof FormDataErrors) => {
      if (errorKey === "suspectGenderRadio") {
        return {
          children: formDataErrors[errorKey]?.errorSummaryText,
          href: "#suspect-gender-radio-0",
          "data-testid": "suspect-gender-radio-link",
        };
      }

      return null;
    },
    [formDataErrors],
  );

  const validateFormData = () => {
    const errors: FormDataErrors = {};
    const { suspectGenderRadio = { shortCode: null, description: "" } } =
      formData;

    if (!suspectGenderRadio.shortCode) {
      errors.suspectGenderRadio = {
        errorSummaryText: "Select a gender",
        inputErrorText: "Select a gender",
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
    if (!isGendersLoading && gendersData) {
      dispatch({
        type: "SET_CASE_SUSPECT_GENDERS",
        payload: {
          suspectGenders: gendersData,
        },
      });
    }
  }, [gendersData, dispatch, isGendersLoading]);

  const genderItems = useMemo(() => {
    if (!state.apiData.suspectGenders) return [];
    return state.apiData.suspectGenders
      .filter(
        (gender) =>
          gender.description != "Other" && gender.description != "Unknown",
      )
      .map((gender, index) => ({
        id: `suspect-gender-radio-${index}`,
        children: gender.description,
        value: gender.shortCode,
        "data-testid": `suspect-gender-radio-${index}`,
      }));
  }, [state.apiData.suspectGenders]);

  const setFormValue = (value: string) => {
    const selectedGender = state.apiData.suspectGenders?.find(
      (gender) => gender.shortCode === value,
    );
    if (selectedGender) {
      setFormData({
        ...formData,
        suspectGenderRadio: selectedGender,
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
      "suspect-gender",
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
            data-testid={"suspect-gender-error-summary"}
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
                    {`What is ${formatNameUtil(suspectFirstNameText, suspectLastNameText)}'s gender?`}
                  </h1>
                ),
              },
            }}
            errorMessage={
              formDataErrors["suspectGenderRadio"]
                ? {
                    children:
                      formDataErrors["suspectGenderRadio"].inputErrorText,
                  }
                : undefined
            }
            items={genderItems}
            value={formData.suspectGenderRadio.shortCode || ""}
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

export default SuspectGenderPage;
