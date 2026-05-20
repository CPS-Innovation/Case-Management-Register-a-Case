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
import { getReligions } from "../../../apis/gateway-api";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { formatNameUtil } from "../../../common/utils/formatNameUtil";
import {
  getNextSuspectJourneyRoute,
  getPreviousSuspectJourneyRoute,
} from "../../../common/utils/getSuspectJourneyRoutes";
import styles from "../index.module.scss";

const SuspectReligionPage = () => {
  type ErrorText = {
    errorSummaryText: string;
    inputErrorText?: string;
  };
  type FormDataErrors = {
    suspectReligionRadio?: ErrorText;
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
    suspectReligionRadio: { shortCode: string; description: string };
  }>({
    suspectReligionRadio: state.formData.suspects[suspectIndex]
      .suspectReligionRadio || {
      shortCode: "",
      description: "",
    },
  });

  const {
    data: religionsData,
    isLoading: isReligionsLoading,
    error: religionsError,
  } = useQuery({
    queryKey: ["religion"],
    queryFn: () => getReligions(),
    enabled: !state.apiData.suspectReligions,
    retry: false,
  });

  useEffect(() => {
    if (religionsError) throw religionsError;
  }, [religionsError]);

  const previousRoute = useMemo(() => {
    return getPreviousSuspectJourneyRoute(
      "suspect-religion",
      state.formData.suspects[suspectIndex].suspectAdditionalDetailsCheckboxes,
      suspectIndex,
    );
  }, [state.formData.suspects, suspectIndex]);

  const [formDataErrors, setFormDataErrors] = useState<FormDataErrors>({});

  const errorSummaryProperties = useCallback(
    (errorKey: keyof FormDataErrors) => {
      if (errorKey === "suspectReligionRadio") {
        return {
          children: formDataErrors[errorKey]?.errorSummaryText,
          href: "#suspect-religion-radio-0",
          "data-testid": "suspect-religion-radio-link",
        };
      }

      return null;
    },
    [formDataErrors],
  );

  const validateFormData = () => {
    const errors: FormDataErrors = {};

    const { suspectReligionRadio = { shortCode: null, description: "" } } =
      formData;

    if (!suspectReligionRadio.shortCode) {
      errors.suspectReligionRadio = {
        errorSummaryText: "Select the defendant's religion",
        inputErrorText: "Select the defendant's religion",
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
    if (!isReligionsLoading && religionsData) {
      dispatch({
        type: "SET_CASE_SUSPECT_RELIGIONS",
        payload: {
          suspectReligions: religionsData,
        },
      });
    }
  }, [religionsData, dispatch, isReligionsLoading]);

  const religionItems = useMemo(() => {
    if (!state.apiData.suspectReligions) return [];
    return state.apiData.suspectReligions.map((religion, index) => ({
      id: `suspect-religion-radio-${index}`,
      children: religion.description,
      value: religion.shortCode,
      "data-testid": `suspect-religion-radio-${index}`,
    }));
  }, [state.apiData.suspectReligions]);

  const setFormValue = (value: string) => {
    const selectedReligion = state.apiData.suspectReligions?.find(
      (religion) => religion.shortCode === value,
    );
    if (selectedReligion) {
      setFormData({
        ...formData,
        suspectReligionRadio: selectedReligion,
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
      "suspect-religion",
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
            data-testid={"suspect-religion-error-summary"}
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
                    {`What is ${formatNameUtil(suspectFirstNameText, suspectLastNameText)}'s
                    religion?`}
                  </h1>
                ),
              },
            }}
            errorMessage={
              formDataErrors["suspectReligionRadio"]
                ? {
                    children:
                      formDataErrors["suspectReligionRadio"].inputErrorText,
                  }
                : undefined
            }
            items={religionItems}
            value={formData.suspectReligionRadio.shortCode || ""}
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

export default SuspectReligionPage;
