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
import DateInputNative from "../../common/DateInputNative";
import { CaseRegistrationFormContext } from "../../../common/providers/CaseRegistrationProvider";
import { getOffenderTypes } from "../../../apis/gateway-api";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { formatNameUtil } from "../../../common/utils/formatNameUtil";
import {
  getNextSuspectJourneyRoute,
  getPreviousSuspectJourneyRoute,
} from "../../../common/utils/getSuspectJourneyRoutes";
import { isValidOnOrBeforeDate } from "../../../common/utils/isValidOnOrBeforeDate";
import { isChargedWithAdultWarningActive } from "../../../common/utils/isChargedWithAdultWarningActive";
import styles from "../index.module.scss";

const SuspectOffenderPage = () => {
  type ErrorText = {
    errorSummaryText: string;
    inputErrorText?: string;
  };
  type FormDataErrors = {
    suspectOffenderTypesRadio?: ErrorText;
    suspectArrestDate?: ErrorText;
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
    suspectOffenderTypesRadio: {
      shortCode: string;
      display: string;
      arrestDate: string;
    };
  }>({
    suspectOffenderTypesRadio: state.formData.suspects[suspectIndex]
      .suspectOffenderTypesRadio || {
      shortCode: "",
      display: "",
      arrestDate: "",
    },
  });
  const suspectData = useMemo(() => {
    return state.formData.suspects[suspectIndex] || {};
  }, [state.formData.suspects, suspectIndex]);

  const {
    data: offenderData,
    isLoading: isOffendersLoading,
    error: offenderError,
  } = useQuery({
    queryKey: ["offenders"],
    queryFn: () => getOffenderTypes(),
    enabled: !state.apiData.suspectOffenderTypes,
    retry: false,
  });

  useEffect(() => {
    if (offenderError) throw offenderError;
  }, [offenderError]);
  const previousRoute = useMemo(() => {
    return getPreviousSuspectJourneyRoute(
      "suspect-offender",
      state.formData.suspects[suspectIndex].suspectAdditionalDetailsCheckboxes,
      suspectIndex,
    );
  }, [state.formData.suspects, suspectIndex]);

  const [formDataErrors, setFormDataErrors] = useState<FormDataErrors>({});

  const errorSummaryProperties = useCallback(
    (errorKey: keyof FormDataErrors) => {
      if (errorKey === "suspectOffenderTypesRadio") {
        return {
          children: formDataErrors[errorKey]?.errorSummaryText,
          href: "#suspect-offender-radio-0",
          "data-testid": "suspect-offender-radio-link",
        };
      }

      if (errorKey === "suspectArrestDate") {
        return {
          children: formDataErrors[errorKey]?.errorSummaryText,
          href: "#suspect-arrest-date",
          "data-testid": "suspect-arrest-date-link",
        };
      }

      return null;
    },
    [formDataErrors],
  );

  const validateFormData = () => {
    const errors: FormDataErrors = {};
    const {
      suspectOffenderTypesRadio = {
        shortCode: null,
        display: "",
        arrestDate: "",
      },
    } = formData;

    if (
      suspectOffenderTypesRadio?.arrestDate &&
      !isValidOnOrBeforeDate(suspectOffenderTypesRadio?.arrestDate)
    ) {
      errors.suspectArrestDate = {
        errorSummaryText: "Enter an arrest date that is today or in the past",
        inputErrorText: "Enter an arrest date that is today or in the past",
      };
    }

    if (!suspectOffenderTypesRadio.shortCode) {
      errors.suspectOffenderTypesRadio = {
        errorSummaryText: "Select the type of offender",
        inputErrorText: "Select the type of offender",
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
    if (!isOffendersLoading && offenderData) {
      dispatch({
        type: "SET_CASE_SUSPECT_OFFENDER_TYPES",
        payload: {
          suspectOffenderTypes: offenderData,
        },
      });
    }
  }, [offenderData, dispatch, isOffendersLoading]);

  const handleDateChange = useCallback((value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      suspectOffenderTypesRadio: {
        ...prevState.suspectOffenderTypesRadio,
        arrestDate: value,
      },
    }));
  }, []);

  const offenderItems = useMemo(() => {
    if (!state.apiData.suspectOffenderTypes) return [];
    return state.apiData.suspectOffenderTypes
      .filter((offender) => offender.description != "Unspecified")
      .map((offender, index) => {
        const conditional =
          offender.shortCode === "PP"
            ? undefined
            : {
                children: [
                  <DateInputNative
                    key="suspect-arrest-date"
                    id="suspect-arrest-date"
                    label={
                      <span className="govuk-!-font-weight-bold">
                        Arrest date (optional)
                      </span>
                    }
                    value={formData.suspectOffenderTypesRadio?.arrestDate || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleDateChange(e.target.value)
                    }
                    errorMessage={
                      formDataErrors["suspectArrestDate"]
                        ? formDataErrors["suspectArrestDate"].inputErrorText
                        : undefined
                    }
                  />,
                ],
              };
        return {
          id: `suspect-offender-radio-${index}`,
          children: offender.display,
          value: offender.shortCode,
          "data-testid": `suspect-offender-radio-${index}`,
          conditional: conditional,
        };
      });
  }, [
    state.apiData.suspectOffenderTypes,
    handleDateChange,
    formData.suspectOffenderTypesRadio,
    formDataErrors,
  ]);

  const setFormValue = (value: string) => {
    const selectedOffender = state.apiData.suspectOffenderTypes?.find(
      (offender) => offender.shortCode === value,
    );
    if (selectedOffender) {
      setFormData({
        ...formData,
        suspectOffenderTypesRadio: {
          shortCode: selectedOffender.shortCode,
          display: selectedOffender.display,
          arrestDate: "",
        },
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

    if (
      !isChargedWithAdultWarningActive(
        formData.suspectOffenderTypesRadio.shortCode,
      )
    ) {
      dispatch({
        type: "RESET_CHARGE_WITH_ADULT",
        payload: {
          suspectIndex,
        },
      });
    }

    const nextRoute = getNextSuspectJourneyRoute(
      "suspect-offender",
      state.formData.suspects[suspectIndex].suspectAdditionalDetailsCheckboxes,
      suspectIndex,
      state.formData.suspects[suspectIndex].suspectAliases.length > 0,
    );
    return navigate(nextRoute);
  };

  const { suspectFirstNameText = "", suspectLastNameText = "" } = suspectData;

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
            data-testid={"suspect-offender-types-error-summary"}
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
                    {`What type of offender is ${formatNameUtil(suspectFirstNameText, suspectLastNameText)}?`}
                  </h1>
                ),
              },
            }}
            errorMessage={
              formDataErrors["suspectOffenderTypesRadio"]
                ? {
                    children:
                      formDataErrors["suspectOffenderTypesRadio"]
                        .inputErrorText,
                  }
                : undefined
            }
            items={offenderItems}
            value={formData.suspectOffenderTypesRadio.shortCode ?? ""}
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

export default SuspectOffenderPage;
