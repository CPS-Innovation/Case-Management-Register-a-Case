import {
  useRef,
  useEffect,
  useState,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { Input, Radios, ErrorSummary } from "../govuk";
import SaveAndCancel from "../common/SaveAndCancel";
import { CaseRegistrationFormContext } from "../../common/providers/CaseRegistrationProvider";
import { type GeneralRadioValue } from "../../common/reducers/caseRegistrationReducer";
import {
  getCaseAreasAndRegisteringUnits,
  getCaseAreasAndWitnessCareUnits,
  getCaseComplexities,
} from "../../apis/gateway-api";
import { useQuery } from "@tanstack/react-query";
import { useIsAreaSensitive } from "../../common/hooks/useIsAreaSensitive";
import { sanitizeOperationNameText } from "../../common/utils/sanitizeOperationNameText";
import { DEFAULT_COMPLEXITY_DESCRIPTION } from "../../common/constants/general";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";

const CaseRegistrationPage = () => {
  type ErrorText = {
    errorSummaryText: string;
    inputErrorText?: string;
    hasLink: boolean;
  };
  type FormDataErrors = {
    operationNameRadio?: ErrorText;
    suspectDetailsRadio?: ErrorText;
    operationNameText?: ErrorText;
    genericError?: ErrorText;
  };
  const errorSummaryRef = useRef<HTMLInputElement>(null);
  const { state, dispatch } = useContext(CaseRegistrationFormContext);
  const navigate = useNavigate();
  const isAreaSensitive = useIsAreaSensitive();

  const [formData, setFormData] = useState<{
    operationNameRadio: GeneralRadioValue;
    suspectDetailsRadio: GeneralRadioValue;
    operationNameText: string;
  }>({
    operationNameRadio: state.formData.operationNameRadio || "",
    suspectDetailsRadio: state.formData.suspectDetailsRadio || "",
    operationNameText: state.formData.operationNameText || "",
  });

  const { data: areasData, error: areaDataError } = useQuery({
    queryKey: ["areas"],
    queryFn: getCaseAreasAndRegisteringUnits,
    retry: false,
    enabled: !state.apiData.areasAndRegisteringUnits,
  });

  const { data: witnessCareUnitsData, error: witnessCareUnitsError } = useQuery(
    {
      queryKey: ["witness-care-units"],
      queryFn: getCaseAreasAndWitnessCareUnits,
      retry: false,
      enabled: !state.apiData.areasAndWitnessCareUnits,
    },
  );

  const { data: caseComplexitiesData, error: caseComplexitiesError } = useQuery(
    {
      queryKey: ["case-complexities"],
      queryFn: () => getCaseComplexities(),
      enabled: !state.apiData.caseComplexities,
      retry: false,
    },
  );

  const [formDataErrors, setFormDataErrors] = useState<FormDataErrors>({});

  const errorSummaryProperties = useCallback(
    (errorKey: keyof FormDataErrors) => {
      switch (errorKey) {
        case "operationNameRadio":
          return {
            children: formDataErrors[errorKey]?.errorSummaryText,
            href: "#operation-name-radio-yes",
            "data-testid": "operation-name-radio-link",
          };
        case "suspectDetailsRadio":
          return {
            children: formDataErrors[errorKey]?.errorSummaryText,
            href: "#suspect-details-radio-yes",
            "data-testid": "suspect-details-radio-link",
          };
        case "operationNameText":
          return {
            children: formDataErrors[errorKey]?.errorSummaryText,
            href: "#operation-name-text",
            "data-testid": "operation-name-text-link",
          };
        case "genericError":
          return {
            children: formDataErrors[errorKey]?.errorSummaryText,
            "data-testid": "generic-error-text",
          };
        default:
          return null;
      }
    },
    [formDataErrors],
  );

  const validateFormData = () => {
    const errors: FormDataErrors = {};
    const { operationNameRadio, suspectDetailsRadio, operationNameText } =
      formData;

    if (operationNameRadio === "no" && suspectDetailsRadio === "no") {
      errors.operationNameRadio = {
        errorSummaryText: "Select if you have an operation name",
        inputErrorText: "Select if you have an operation name",
        hasLink: true,
      };
      errors.suspectDetailsRadio = {
        errorSummaryText: "Select if you have suspect details",
        inputErrorText: "Select if you have suspect details",
        hasLink: true,
      };
    }

    if (!operationNameRadio && !suspectDetailsRadio) {
      errors.operationNameRadio = {
        errorSummaryText: "Select if you have an operation name",
        inputErrorText: "Select if you have an operation name",
        hasLink: true,
      };
      errors.suspectDetailsRadio = {
        errorSummaryText: "Select if you have suspect details",
        inputErrorText: "Select if you have suspect details",
        hasLink: true,
      };
    } else {
      if (!operationNameRadio) {
        errors.operationNameRadio = {
          errorSummaryText: "Select if you have an operation name",
          inputErrorText: "Select if you have an operation name",
          hasLink: true,
        };
      }
      if (!suspectDetailsRadio) {
        errors.suspectDetailsRadio = {
          errorSummaryText: "Select if you have suspect details",
          inputErrorText: "Select if you have suspect details",
          hasLink: true,
        };
      }
    }

    if (operationNameRadio == "yes" && !operationNameText) {
      errors.operationNameText = {
        errorSummaryText: "Enter an operation name",
        inputErrorText: "Enter an operation name",
        hasLink: true,
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
    if (areaDataError) throw areaDataError;
  }, [areaDataError]);

  useEffect(() => {
    if (witnessCareUnitsError) throw witnessCareUnitsError;
  }, [witnessCareUnitsError]);

  useEffect(() => {
    if (caseComplexitiesError) throw caseComplexitiesError;
  }, [caseComplexitiesError]);

  useEffect(() => {
    if (errorList.length) errorSummaryRef.current?.focus();
  }, [errorList]);

  useEffect(() => {
    if (areasData && !state.apiData.areasAndRegisteringUnits) {
      dispatch({
        type: "SET_AREAS_AND_REGISTERING_UNITS",
        payload: {
          areasAndRegisteringUnits: areasData,
        },
      });

      if (!state.formData.areaOrDivisionText.id && areasData?.homeUnit) {
        dispatch({
          type: "SET_FIELDS",
          payload: {
            data: {
              areaOrDivisionText: {
                id: areasData.homeUnit.areaId,
                description: areasData.homeUnit.areaDescription,
              },
            },
          },
        });
      }
    }
  }, [
    areasData,
    dispatch,
    state.formData.areaOrDivisionText,
    state.apiData.areasAndRegisteringUnits,
  ]);

  useEffect(() => {
    if (witnessCareUnitsData && !state.apiData.areasAndWitnessCareUnits) {
      dispatch({
        type: "SET_AREAS_AND_WITNESS_CARE_UNITS",
        payload: {
          areasAndWitnessCareUnits: witnessCareUnitsData,
        },
      });
    }
  }, [witnessCareUnitsData, dispatch, state.apiData.areasAndWitnessCareUnits]);

  useEffect(() => {
    if (caseComplexitiesData) {
      if (!state.apiData.caseComplexities) {
        dispatch({
          type: "SET_CASE_COMPLEXITIES",
          payload: {
            caseComplexities: caseComplexitiesData,
          },
        });

        const defaultComplexity = caseComplexitiesData.find(
          (complexity) =>
            complexity.description === DEFAULT_COMPLEXITY_DESCRIPTION,
        );
        if (
          defaultComplexity &&
          !state.formData.caseComplexityRadio.shortCode
        ) {
          dispatch({
            type: "SET_FIELDS",
            payload: {
              data: {
                caseComplexityRadio: {
                  shortCode: defaultComplexity.shortCode,
                  description: defaultComplexity.description,
                },
              },
            },
          });
        }
      }
    }
  }, [
    caseComplexitiesData,
    dispatch,
    state.apiData.caseComplexities,
    state.formData.caseComplexityRadio.shortCode,
  ]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateFormData()) return;

    let nextRoute = "/case-registration/areas";
    if (state.formData.navigation.fromCaseSummaryPage) {
      nextRoute = "/case-registration/case-summary";
    } else if (isAreaSensitive) {
      nextRoute = "/case-registration/case-details";
    }

    if (
      formData.suspectDetailsRadio === "no" &&
      state.formData.suspects.length > 0
    ) {
      navigate("/case-registration/remove-all-suspects-confirmation", {
        state: {
          backRoute: "/case-registration",
          nextRoute: nextRoute,
          formData: formData,
        },
      });
      return;
    }
    dispatch({
      type: "SET_FIELDS",
      payload: {
        data: {
          ...formData,
        },
      },
    });
    if (state.formData.navigation.fromCaseSummaryPage) {
      dispatch({
        type: "SET_NAVIGATION_DATA",
        payload: { fromCaseSummaryPage: false },
      });
    }

    navigate(nextRoute);
  };

  const setFormValue = (
    fieldName:
      | "operationNameRadio"
      | "suspectDetailsRadio"
      | "operationNameText",
    value: string,
  ) => {
    if (fieldName === "operationNameText") {
      value = sanitizeOperationNameText(value);
    }
    const newValue = {
      [fieldName]: value,
    };

    if (fieldName === "operationNameRadio" && value === "no") {
      newValue["operationNameText"] = "";
    }
    setFormData((prevState) => ({
      ...prevState,
      ...newValue,
    }));
  };

  return (
    <div>
      <h1>Register a case</h1>
      {!!errorList.length && (
        <div
          ref={errorSummaryRef}
          tabIndex={-1}
          className={styles.errorSummaryWrapper}
        >
          <ErrorSummary
            data-testid={"case-registration-error-summary"}
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
                  <span className="govuk-!-font-weight-bold">{`Do you have an operation name?`}</span>
                ),
              },
            }}
            errorMessage={
              formDataErrors["operationNameRadio"]
                ? {
                    children:
                      formDataErrors["operationNameRadio"].inputErrorText,
                  }
                : undefined
            }
            items={[
              {
                id: "operation-name-radio-yes",
                children: "Yes",
                value: "yes",
                "data-testid": "operation-name-radio-yes",
                conditional: {
                  children: [
                    <Input
                      key="operation-name-text"
                      id="operation-name-text"
                      data-testid="operation-name-text"
                      errorMessage={
                        formDataErrors["operationNameText"]
                          ? {
                              children:
                                formDataErrors["operationNameText"]
                                  .inputErrorText,
                            }
                          : undefined
                      }
                      className="govuk-input--width-20"
                      label={{
                        children: "Operation name",
                      }}
                      type="text"
                      value={formData.operationNameText}
                      onChange={(value: string) => {
                        setFormValue("operationNameText", value);
                      }}
                    />,
                  ],
                },
              },
              {
                children: "No",
                value: "no",
                "data-testid": "operation-name-radio-no",
              },
            ]}
            value={formData.operationNameRadio}
            onChange={(value) => {
              if (value) setFormValue("operationNameRadio", value);
            }}
          ></Radios>
          <Radios
            fieldset={{
              legend: {
                children: (
                  <span className="govuk-!-font-weight-bold">{`Do you have any suspect details?`}</span>
                ),
              },
            }}
            errorMessage={
              formDataErrors["suspectDetailsRadio"]
                ? {
                    children:
                      formDataErrors["suspectDetailsRadio"].inputErrorText,
                  }
                : undefined
            }
            items={[
              {
                children: "Yes",
                value: "yes",
                "data-testid": "suspect-details-radio-yes",
                id: "suspect-details-radio-yes",
              },
              {
                children: "No",
                value: "no",
                "data-testid": "suspect-details-radio-no",
              },
            ]}
            value={formData.suspectDetailsRadio}
            onChange={(value) => {
              if (value) setFormValue("suspectDetailsRadio", value);
            }}
          ></Radios>
        </div>
        <SaveAndCancel onSave={handleSubmit} />
      </form>
    </div>
  );
};

export default CaseRegistrationPage;
