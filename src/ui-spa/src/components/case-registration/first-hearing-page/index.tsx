import {
  useRef,
  useEffect,
  useState,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { AutoComplete, Radios, ErrorSummary, BackLink } from "../../govuk";
import SaveAndCancel from "../../common/SaveAndCancel";
import DateInputNative from "../../common/DateInputNative";
import { CaseRegistrationFormContext } from "../../../common/providers/CaseRegistrationProvider";
import { getSelectedUnit } from "../../../common/utils/getSelectedUnit";
import { getCourtsByUnitId } from "../../../apis/gateway-api";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { isOnOrAfterChargeDates } from "../../../common/utils/chargeDatesUtil";
import styles from "../index.module.scss";
const FirstHearingPage = () => {
  type ErrorText = {
    errorSummaryText: string;
    inputErrorText?: string;
    hasLink: boolean;
  };
  type FormDataErrors = {
    firstHearingRadio?: ErrorText;
    firstHearingCourtLocationText?: ErrorText;
    firstHearingDateText?: ErrorText;
  };
  const errorSummaryRef = useRef<HTMLInputElement>(null);
  const { state, dispatch } = useContext(CaseRegistrationFormContext);
  const navigate = useNavigate();

  const previousRoute = useMemo(() => {
    if (state.formData.navigation.fromCaseSummaryPage) {
      return "/case-registration/case-summary";
    }

    return "/case-registration/charges-summary";
  }, [state.formData.navigation.fromCaseSummaryPage]);

  const registeringUnitId = useMemo(() => {
    return state.formData.registeringUnitText?.id;
  }, [state.formData.registeringUnitText]);

  const [formData, setFormData] = useState<{
    firstHearingRadio: string;
    firstHearingCourtLocationText: { id: number | null; description: string };
    firstHearingDateText: string;
  }>({
    firstHearingRadio: state.formData.firstHearingRadio || "",
    firstHearingCourtLocationText: state.formData
      .firstHearingCourtLocationText || {
      id: null,
      description: "",
    },
    firstHearingDateText: state.formData.firstHearingDateText || "",
  });

  const {
    data: courtLocationsData,
    isLoading: isCourtLocationsLoading,
    error: courtLocationsError,
  } = useQuery({
    queryKey: ["court-locations", registeringUnitId],
    enabled: !!registeringUnitId,
    queryFn: () => getCourtsByUnitId(registeringUnitId!),
    retry: false,
  });

  useEffect(() => {
    if (courtLocationsError) throw courtLocationsError;
  }, [courtLocationsError]);

  const [formDataErrors, setFormDataErrors] = useState<FormDataErrors>({});

  const errorSummaryProperties = useCallback(
    (errorKey: keyof FormDataErrors) => {
      switch (errorKey) {
        case "firstHearingRadio":
          return {
            children: formDataErrors[errorKey]?.errorSummaryText,
            href: "#first-hearing-radio-yes",
            "data-testid": "first-hearing-radio-link",
          };
        case "firstHearingCourtLocationText":
          return {
            children: formDataErrors[errorKey]?.errorSummaryText,
            href: "#first-hearing-court-location-text",
            "data-testid": "first-hearing-court-location-text-link",
          };
        case "firstHearingDateText":
          return {
            children: formDataErrors[errorKey]?.errorSummaryText,
            href: "#first-hearing-date-text",
            "data-testid": "first-hearing-date-text-link",
          };

        default:
          return null;
      }
    },
    [formDataErrors],
  );

  const validateFormData = (
    courtLocations: { id: number; description: string }[],
    inputCourtLocationValue: string,
  ) => {
    const errors: FormDataErrors = {};
    const { firstHearingRadio, firstHearingDateText } = formData;
    if (
      firstHearingDateText &&
      !isOnOrAfterChargeDates(firstHearingDateText, state.formData.suspects)
    ) {
      errors.firstHearingDateText = {
        errorSummaryText:
          "First hearing date may not be earlier than any charges dates",
        inputErrorText:
          "First hearing date may not be earlier than any charges dates",
        hasLink: true,
      };
    }

    if (!firstHearingRadio) {
      errors.firstHearingRadio = {
        errorSummaryText: "Select if you need to add first hearing details",
        inputErrorText: "Select if you need to add first hearing details",
        hasLink: true,
      };
    }

    if (firstHearingRadio === "yes") {
      if (!inputCourtLocationValue) {
        errors.firstHearingCourtLocationText = {
          errorSummaryText: "Select the court location",
          inputErrorText: "Select the court location",
          hasLink: true,
        };
      } else if (
        courtLocations.findIndex(
          (cl) => cl.description === inputCourtLocationValue,
        ) === -1
      ) {
        errors.firstHearingCourtLocationText = {
          errorSummaryText: "Select a valid court location",
          inputErrorText: "Select a valid court location",
          hasLink: true,
        };
      }
    }

    if (firstHearingRadio == "yes" && !firstHearingDateText) {
      errors.firstHearingDateText = {
        errorSummaryText: "Enter the date of first hearing",
        inputErrorText: "Enter the date of first hearing",
        hasLink: true,
      };
    }

    const isValid = !Object.entries(errors).filter(([, value]) => value).length;

    setFormDataErrors(errors);
    return isValid;
  };
  const courtLocations = useMemo(() => {
    if (state.apiData.courtLocations) {
      return state.apiData.courtLocations;
    }
    return [] as { id: number; description: string }[];
  }, [state.apiData.courtLocations]);

  const courtLocationsSuggest = (
    query: string,
    populateResults: (results: string[]) => void,
  ) => {
    const filteredResults = courtLocations
      .filter((result) =>
        result.description.toLowerCase().includes(query.toLowerCase()),
      )
      .map((r) => r.description);
    populateResults(filteredResults);
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
    if (!isCourtLocationsLoading && courtLocationsData) {
      dispatch({
        type: "SET_COURT_LOCATIONS",
        payload: {
          courtLocations: courtLocationsData,
        },
      });
    }
  }, [courtLocationsData, dispatch, isCourtLocationsLoading]);

  const setFormValue = (
    fieldName: "firstHearingRadio" | "firstHearingDateText",
    value: string,
  ) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleDateChange = (value: string) => {
    setFormValue("firstHearingDateText", value);
  };

  const handleCourtLocationConfirm = (value: string) => {
    const { id, description } = getSelectedUnit(courtLocations, value);
    setFormData((prev) => ({
      ...prev,
      firstHearingCourtLocationText: { id, description },
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    let formValue = formData;
    const input = document.getElementById(
      "first-hearing-court-location-text",
    ) as HTMLInputElement | null;
    const inputCourtLocationValue = input?.value ?? "";
    if (
      inputCourtLocationValue !==
      formData.firstHearingCourtLocationText?.description
    ) {
      const { id, description } = getSelectedUnit(
        courtLocations,
        inputCourtLocationValue,
      );
      formValue = {
        ...formValue,
        firstHearingCourtLocationText: { id, description },
      };
    }

    if (!validateFormData(courtLocations, inputCourtLocationValue)) return;

    dispatch({
      type: "SET_FIELDS",
      payload: {
        data: {
          ...formValue,
        },
      },
    });

    if (
      state.formData.navigation.changeCaseArea ||
      state.formData.navigation.changeCaseDetails
    ) {
      navigate("/case-registration/case-assignee");
      return;
    }
    if (state.formData.navigation.fromCaseSummaryPage) {
      dispatch({
        type: "SET_NAVIGATION_DATA",
        payload: { fromCaseSummaryPage: false },
      });
      navigate("/case-registration/case-summary");
      return;
    }

    return navigate("/case-registration/case-monitoring-codes");
  };

  const handleBackLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (previousRoute === "/case-registration/case-summary") {
      dispatch({
        type: "SET_NAVIGATION_DATA",
        payload: { fromCaseSummaryPage: false },
      });
    }
    navigate(previousRoute);
  };

  return (
    <div>
      {!state.formData.navigation.changeCaseArea &&
        !state.formData.navigation.changeCaseDetails && (
          <BackLink to={previousRoute} onClick={handleBackLinkClick}>
            Back
          </BackLink>
        )}
      {!!errorList.length && (
        <div
          ref={errorSummaryRef}
          tabIndex={-1}
          className={styles.errorSummaryWrapper}
        >
          <ErrorSummary
            data-testid={"first-hearing-error-summary"}
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
                children: <h1>Do you have details of the first hearing?</h1>,
              },
            }}
            errorMessage={
              formDataErrors["firstHearingRadio"]
                ? {
                    children:
                      formDataErrors["firstHearingRadio"].inputErrorText,
                  }
                : undefined
            }
            items={[
              {
                id: "first-hearing-radio-yes",
                children: "Yes",
                value: "yes",
                "data-testid": "first-hearing-radio-yes",
                conditional: {
                  children: [
                    formData.firstHearingRadio === "yes" && (
                      <AutoComplete
                        key="first-hearing-court-location-text"
                        id="first-hearing-court-location-text"
                        inputClasses={"govuk-input--error"}
                        source={courtLocationsSuggest}
                        confirmOnBlur={false}
                        onConfirm={handleCourtLocationConfirm}
                        defaultValue={
                          formData.firstHearingCourtLocationText?.description
                        }
                        label={{
                          children: (
                            <span className="govuk-!-font-weight-bold">
                              Court location
                            </span>
                          ),
                        }}
                        errorMessage={
                          formDataErrors["firstHearingCourtLocationText"]
                            ? formDataErrors["firstHearingCourtLocationText"]
                                .inputErrorText
                            : undefined
                        }
                      />
                    ),
                    <DateInputNative
                      key="first-hearing-date-text"
                      id="first-hearing-date-text"
                      label={
                        <span className="govuk-!-font-weight-bold">Date</span>
                      }
                      value={formData.firstHearingDateText}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleDateChange(e.target.value)
                      }
                      errorMessage={
                        formDataErrors["firstHearingDateText"]
                          ? formDataErrors["firstHearingDateText"]
                              .inputErrorText
                          : undefined
                      }
                      hint={<span>For example, 17/05/2024</span>}
                    />,
                  ],
                },
              },
              {
                children: "No",
                value: "no",
                "data-testid": "radio-operation-name-no",
              },
            ]}
            value={formData.firstHearingRadio}
            onChange={(value) => {
              if (value) setFormValue("firstHearingRadio", value);
            }}
          ></Radios>
        </div>
        <SaveAndCancel onSave={handleSubmit} />
      </form>
    </div>
  );
};

export default FirstHearingPage;
