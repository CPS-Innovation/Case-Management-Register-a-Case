import {
  useRef,
  useEffect,
  useState,
  useContext,
  useCallback,
  useMemo,
} from "react";
import {
  AutoComplete,
  Radios,
  ErrorSummary,
  BackLink,
  Select,
  Input,
} from "../../govuk";
import SaveAndCancel from "../../common/SaveAndCancel";
import { CaseRegistrationFormContext } from "../../../common/providers/CaseRegistrationProvider";
import { type GeneralRadioValue } from "../../../common/reducers/caseRegistrationReducer";
import { getSelectedUnit } from "../../../common/utils/getSelectedUnit";
import { getSelectedInvestigatorTitle } from "../../../common/utils/getSelectedInvestigatorTitle";
import { getPoliceUnit } from "../../../common/utils/getPoliceUnit";
import {
  getCaseProsecutors,
  getCaseCaseworkers,
  getInvestigatorTitles,
  getPoliceUnits,
} from "../../../apis/gateway-api";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import pageStyles from "./index.module.scss";
import styles from "../index.module.scss";

const CaseAssigneePage = () => {
  type ErrorText = {
    errorSummaryText: string;
    inputErrorText?: string;
    hasLink: boolean;
  };
  type FormDataErrors = {
    caseProsecutorRadio?: ErrorText;
    caseInvestigatorRadio?: ErrorText;
    caseProsecutorText?: ErrorText;
    caseCaseworkerText?: ErrorText;
    caseInvestigatorTitleSelect?: ErrorText;
    caseInvestigatorLastNameText?: ErrorText;
  };
  const errorSummaryRef = useRef<HTMLInputElement>(null);
  const { state, dispatch } = useContext(CaseRegistrationFormContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState<{
    caseProsecutorRadio: GeneralRadioValue;
    caseInvestigatorRadio: GeneralRadioValue;
    caseProsecutorText: { id: number | null; description: string };
    caseCaseworkerText: { id: number | null; description: string };
    caseInvestigatorTitleSelect: {
      shortCode: string | null;
      display: string;
    };
    caseInvestigatorFirstNameText: string;
    caseInvestigatorLastNameText: string;
    caseInvestigatorShoulderNameText: string;
    caseInvestigatorShoulderNumberText: string;
  }>({
    caseProsecutorRadio: state.formData.caseProsecutorRadio || "",
    caseInvestigatorRadio: state.formData.caseInvestigatorRadio || "",
    caseProsecutorText: state.formData.caseProsecutorText || {
      id: null,
      description: "",
    },
    caseCaseworkerText: state.formData.caseCaseworkerText || {
      id: null,
      description: "",
    },
    caseInvestigatorTitleSelect: state.formData.caseInvestigatorTitleSelect || {
      shortCode: null,
      display: "",
    },
    caseInvestigatorFirstNameText:
      state.formData.caseInvestigatorFirstNameText || "",
    caseInvestigatorLastNameText:
      state.formData.caseInvestigatorLastNameText || "",
    caseInvestigatorShoulderNameText:
      state.formData.caseInvestigatorShoulderNameText || "",
    caseInvestigatorShoulderNumberText:
      state.formData.caseInvestigatorShoulderNumberText || "",
  });

  const registeringUnitId = useMemo(() => {
    return state.formData.registeringUnitText?.id;
  }, [state.formData.registeringUnitText]);

  const previousRoute = useMemo(() => {
    if (state.formData.navigation.fromCaseSummaryPage) {
      return "/case-registration/case-summary";
    }

    return "/case-registration/case-monitoring-codes";
  }, [state.formData.navigation.fromCaseSummaryPage]);

  const { data: caseProsecutorsData, isLoading: isCaseProsecutorsLoading } =
    useQuery({
      queryKey: ["case-prosecutors", registeringUnitId],
      enabled: !!registeringUnitId,
      queryFn: () => getCaseProsecutors(registeringUnitId!),
      retry: false,
      throwOnError: true,
    });

  const { data: caseCaseworkersData, isLoading: isCaseCaseworkersLoading } =
    useQuery({
      queryKey: ["case-caseworkers", registeringUnitId],
      enabled: !!registeringUnitId,
      queryFn: () => getCaseCaseworkers(registeringUnitId!),
      retry: false,
      throwOnError: true,
    });

  const {
    data: caseInvestigatorTitlesData,
    isLoading: isCaseInvestigatorTitlesLoading,
  } = useQuery({
    queryKey: ["case-investigator-titles"],
    queryFn: () => getInvestigatorTitles(),
    enabled: !state.apiData.caseInvestigatorTitles,
    retry: false,
    throwOnError: true,
  });

  const { data: policeUnitsData, isLoading: isPoliceUnitsLoading } = useQuery({
    queryKey: ["police-units"],
    queryFn: () => getPoliceUnits(),
    enabled: !state.apiData.policeUnits,
    retry: false,
    throwOnError: true,
  });

  const [formDataErrors, setFormDataErrors] = useState<FormDataErrors>({});

  const errorSummaryProperties = useCallback(
    (errorKey: keyof FormDataErrors) => {
      switch (errorKey) {
        case "caseProsecutorRadio":
          return {
            children: formDataErrors[errorKey]?.errorSummaryText,
            href: "#case-prosecutor-radio-yes",
            "data-testid": "case-prosecutor-radio-link",
          };
        case "caseProsecutorText":
          return {
            children: formDataErrors[errorKey]?.errorSummaryText,
            href: "#case-prosecutor-text",
            "data-testid": "case-prosecutor-text-link",
          };
        case "caseCaseworkerText":
          return {
            children: formDataErrors[errorKey]?.errorSummaryText,
            href: "#case-caseworker-text",
            "data-testid": "case-caseworker-text-link",
          };
        case "caseInvestigatorTitleSelect":
          return {
            children: formDataErrors[errorKey]?.errorSummaryText,
            href: "#case-investigator-title-select",
            "data-testid": "case-investigator-title-select-link",
          };
        case "caseInvestigatorRadio":
          return {
            children: formDataErrors[errorKey]?.errorSummaryText,
            href: "#case-investigator-radio-yes",
            "data-testid": "case-investigator-radio-link",
          };

        case "caseInvestigatorLastNameText":
          return {
            children: formDataErrors[errorKey]?.errorSummaryText,
            href: "#case-investigator-lastname-text",
            "data-testid": "case-investigator-lastname-text-link",
          };

        default:
          return null;
      }
    },
    [formDataErrors],
  );

  const validateFormData = (
    prosecutors: { id: number; description: string }[],
    inputProsecutorValue: string,
    inputCaseworkerValue: string,
  ) => {
    const errors: FormDataErrors = {};
    const {
      caseProsecutorRadio,
      caseInvestigatorRadio,
      caseInvestigatorLastNameText,
    } = formData;

    if (!caseProsecutorRadio) {
      errors.caseProsecutorRadio = {
        errorSummaryText:
          "Select whether you need to add a prosecutor and caseworker",
        inputErrorText:
          "Select whether you need to add a prosecutor and caseworker",
        hasLink: true,
      };
    }

    if (caseProsecutorRadio === "yes") {
      if (!inputProsecutorValue && !inputCaseworkerValue) {
        errors.caseProsecutorText = {
          errorSummaryText: "Select a prosecutor or caseworker name",
          inputErrorText: "Select a prosecutor or caseworker name",
          hasLink: true,
        };
      }
      if (
        inputProsecutorValue &&
        prosecutors.findIndex(
          (cl) => cl.description === inputProsecutorValue,
        ) === -1
      ) {
        errors.caseProsecutorText = {
          errorSummaryText: "Select a valid prosecutor name",
          inputErrorText: "Select a valid prosecutor name",
          hasLink: true,
        };
      }

      if (
        inputCaseworkerValue &&
        caseworkers.findIndex(
          (cl) => cl.description === inputCaseworkerValue,
        ) === -1
      ) {
        errors.caseCaseworkerText = {
          errorSummaryText: "Select a valid caseworker name",
          inputErrorText: "Select a valid caseworker name",
          hasLink: true,
        };
      }
    }

    if (!caseInvestigatorRadio) {
      errors.caseInvestigatorRadio = {
        errorSummaryText:
          "Select whether you need to add a police officer or investigator",
        inputErrorText:
          "Select whether you need to add a police officer or investigator",
        hasLink: true,
      };
    }

    if (caseInvestigatorRadio === "yes") {
      if (!caseInvestigatorLastNameText) {
        errors.caseInvestigatorLastNameText = {
          errorSummaryText: "Enter the investigator's last name",
          inputErrorText: "Enter the investigator's last name",
          hasLink: true,
        };
      }
    }

    const isValid = !Object.entries(errors).filter(([, value]) => value).length;

    setFormDataErrors(errors);
    return isValid;
  };
  const prosecutors = useMemo(() => {
    if (state.apiData.caseProsecutors) {
      return state.apiData.caseProsecutors;
    }
    return [] as { id: number; description: string }[];
  }, [state.apiData.caseProsecutors]);

  const caseworkers = useMemo(() => {
    if (state.apiData.caseCaseworkers) {
      return state.apiData.caseCaseworkers;
    }
    return [] as { id: number; description: string }[];
  }, [state.apiData.caseCaseworkers]);

  const investigatorTitles = useMemo(() => {
    const titles = [{ shortCode: "", display: "--Select--" }];
    if (state.apiData.caseInvestigatorTitles) {
      return [
        ...titles,
        ...state.apiData.caseInvestigatorTitles.filter(
          (title) => title.isPoliceTitle,
        ),
      ];
    }
    return titles;
  }, [state.apiData.caseInvestigatorTitles]);

  const policeUnitLabel = useMemo(() => {
    if (!state.apiData.policeUnits) return "";
    const policeUnit = getPoliceUnit(
      state.formData.urnPoliceUnitText,
      state.apiData.policeUnits,
    );
    return policeUnit ? `Police unit: ${policeUnit.description}` : "";
  }, [state.formData.urnPoliceUnitText, state.apiData.policeUnits]);

  const caseProsecutorSuggest = (
    query: string,
    populateResults: (results: string[]) => void,
  ) => {
    const filteredResults = prosecutors
      .filter((result) =>
        result.description.toLowerCase().includes(query.toLowerCase()),
      )
      .map((r) => r.description);
    populateResults(filteredResults);
  };

  const caseCaseworkerSuggest = (
    query: string,
    populateResults: (results: string[]) => void,
  ) => {
    const filteredResults = caseworkers
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
    if (!isCaseProsecutorsLoading && caseProsecutorsData) {
      dispatch({
        type: "SET_CASE_PROSECUTORS",
        payload: {
          caseProsecutors: caseProsecutorsData,
        },
      });
    }
  }, [caseProsecutorsData, dispatch, isCaseProsecutorsLoading]);

  useEffect(() => {
    if (!isCaseCaseworkersLoading && caseCaseworkersData) {
      dispatch({
        type: "SET_CASE_CASEWORKERS",
        payload: {
          caseCaseworkers: caseCaseworkersData,
        },
      });
    }
  }, [caseCaseworkersData, dispatch, isCaseCaseworkersLoading]);

  useEffect(() => {
    if (!isCaseInvestigatorTitlesLoading && caseInvestigatorTitlesData) {
      dispatch({
        type: "SET_CASE_INVESTIGATOR_TITLES",
        payload: {
          caseInvestigatorTitles: caseInvestigatorTitlesData,
        },
      });
    }
  }, [caseInvestigatorTitlesData, dispatch, isCaseInvestigatorTitlesLoading]);

  useEffect(() => {
    if (!isPoliceUnitsLoading && policeUnitsData) {
      dispatch({
        type: "SET_POLICE_UNITS",
        payload: {
          policeUnits: policeUnitsData,
        },
      });
    }
  }, [policeUnitsData, dispatch, isPoliceUnitsLoading]);

  const setFormValue = (
    fieldName:
      | "caseProsecutorRadio"
      | "caseInvestigatorRadio"
      | "caseInvestigatorFirstNameText"
      | "caseInvestigatorLastNameText"
      | "caseInvestigatorShoulderNameText"
      | "caseInvestigatorShoulderNumberText",
    value: string,
  ) => {
    let inputValue = value.replaceAll(/[^0-9a-zA-Z]/g, "");
    if (
      fieldName === "caseInvestigatorFirstNameText" ||
      fieldName === "caseInvestigatorLastNameText"
    ) {
      inputValue = inputValue.replaceAll(/\d/g, "");
    }
    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: inputValue,
    }));
  };

  const handleCaseProsecutorConfirm = (value: string) => {
    const { id, description } = getSelectedUnit(prosecutors, value);
    setFormData((prevState) => ({
      ...prevState,
      caseProsecutorText: { id, description },
    }));
  };

  const handleCaseCaseworkerConfirm = (value: string) => {
    const { id, description } = getSelectedUnit(caseworkers, value);
    setFormData((prevState) => ({
      ...prevState,
      caseCaseworkerText: { id, description },
    }));
  };

  const handleCaseInvestigatorTitleConfirm = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const { shortCode, display } = getSelectedInvestigatorTitle(
      investigatorTitles,
      event.target.value,
    );

    setFormData((prevState) => ({
      ...prevState,
      caseInvestigatorTitleSelect: { shortCode, display },
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    let formValue = formData;
    const prosecutorInput = document.getElementById(
      "case-prosecutor-text",
    ) as HTMLInputElement | null;
    const inputProsecutorValue = prosecutorInput?.value ?? "";
    if (
      inputProsecutorValue !==
      state.formData.firstHearingCourtLocationText?.description
    ) {
      const { id, description } = getSelectedUnit(
        prosecutors,
        inputProsecutorValue,
      );
      formValue = {
        ...formValue,
        caseProsecutorText: { id, description },
      };
    }

    const caseworkerInput = document.getElementById(
      "case-caseworker-text",
    ) as HTMLInputElement | null;
    const inputCaseworkerValue = caseworkerInput?.value ?? "";

    if (
      inputCaseworkerValue !==
      state.formData.firstHearingCourtLocationText?.description
    ) {
      const { id, description } = getSelectedUnit(
        caseworkers,
        inputCaseworkerValue,
      );
      formValue = {
        ...formValue,
        caseCaseworkerText: { id, description },
      };
    }

    if (
      !validateFormData(prosecutors, inputProsecutorValue, inputCaseworkerValue)
    )
      return;

    dispatch({
      type: "SET_FIELDS",
      payload: {
        data: { ...formValue },
      },
    });

    if (
      state.formData.navigation.changeCaseArea ||
      state.formData.navigation.changeCaseDetails
    ) {
      dispatch({
        type: "SET_NAVIGATION_DATA",
        payload: { changeCaseArea: false, changeCaseDetails: false },
      });
    }

    if (state.formData.navigation.fromCaseSummaryPage) {
      dispatch({
        type: "SET_NAVIGATION_DATA",
        payload: { fromCaseSummaryPage: false },
      });
    }

    return navigate("/case-registration/case-summary");
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
    <div className={pageStyles.caseAssigneePage}>
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
            data-testid={"case-assignee-error-summary"}
            errorList={errorList}
            titleChildren="There is a problem"
          />
        </div>
      )}
      <h1>Who is working on the case?</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.inputWrapper}>
          <Radios
            fieldset={{
              legend: {
                children: (
                  <span className="govuk-!-font-weight-bold">
                    Do you want to add a prosecutor and caseworker?
                  </span>
                ),
              },
            }}
            errorMessage={
              formDataErrors["caseProsecutorRadio"]
                ? {
                    children:
                      formDataErrors["caseProsecutorRadio"].inputErrorText,
                  }
                : undefined
            }
            items={[
              {
                id: "case-prosecutor-radio-yes",
                children: "Yes",
                value: "yes",
                "data-testid": "case-prosecutor-radio-yes",
                conditional: {
                  children: [
                    formData.caseProsecutorRadio === "yes" && (
                      <AutoComplete
                        key="case-prosecutor-text"
                        id="case-prosecutor-text"
                        inputClasses={"govuk-input--error"}
                        source={caseProsecutorSuggest}
                        confirmOnBlur={false}
                        onConfirm={handleCaseProsecutorConfirm}
                        defaultValue={formData.caseProsecutorText?.description}
                        label={{
                          children: <b>Prosecutor name</b>,
                        }}
                        errorMessage={
                          formDataErrors["caseProsecutorText"]
                            ? formDataErrors["caseProsecutorText"]
                                .inputErrorText
                            : undefined
                        }
                      />
                    ),
                    formData.caseProsecutorRadio === "yes" && (
                      <AutoComplete
                        key="case-caseworker-text"
                        id="case-caseworker-text"
                        inputClasses={"govuk-input--error"}
                        source={caseCaseworkerSuggest}
                        confirmOnBlur={false}
                        onConfirm={handleCaseCaseworkerConfirm}
                        defaultValue={formData.caseCaseworkerText?.description}
                        label={{
                          children: <b>Caseworker name</b>,
                        }}
                        errorMessage={
                          formDataErrors["caseCaseworkerText"]
                            ? formDataErrors["caseCaseworkerText"]
                                .inputErrorText
                            : undefined
                        }
                      />
                    ),
                  ],
                },
              },
              {
                children: "No",
                value: "no",
                "data-testid": "case-prosecutor-radio-no",
              },
            ]}
            value={formData.caseProsecutorRadio}
            onChange={(value) => {
              if (value) setFormValue("caseProsecutorRadio", value);
            }}
          ></Radios>
          <Radios
            fieldset={{
              legend: {
                children: (
                  <span className="govuk-!-font-weight-bold">
                    Do you want to add a police officer or investigator?
                  </span>
                ),
              },
            }}
            errorMessage={
              formDataErrors["caseInvestigatorRadio"]
                ? {
                    children:
                      formDataErrors["caseInvestigatorRadio"].inputErrorText,
                  }
                : undefined
            }
            items={[
              {
                id: "case-investigator-radio-yes",
                children: "Yes",
                value: "yes",
                "data-testid": "case-investigator-radio-yes",
                conditional: {
                  children: [
                    <Select
                      key="case-investigator-title-select"
                      className="govuk-input--width-20 "
                      label={{
                        htmlFor: "case-investigator-title-select",
                        children: (
                          <span className="govuk-!-font-weight-bold">
                            Rank (optional)
                          </span>
                        ),
                        className: styles.investigatorTitleSelectLabel,
                      }}
                      id="case-investigator-title-select"
                      data-testid="case-investigator-title-select"
                      items={investigatorTitles.map((title) => ({
                        value: title.shortCode,
                        children: title.display,
                        disabled: !title.shortCode,
                      }))}
                      formGroup={{
                        className: styles.select,
                      }}
                      onChange={handleCaseInvestigatorTitleConfirm}
                      value={
                        formData.caseInvestigatorTitleSelect.shortCode ?? ""
                      }
                    />,
                    <Input
                      key="case-investigator-firstname-text"
                      id="case-investigator-firstname-text"
                      data-testid="case-investigator-firstname-text"
                      className="govuk-input--width-20"
                      label={{
                        children: (
                          <span className="govuk-!-font-weight-bold">
                            First name (optional)
                          </span>
                        ),
                      }}
                      type="text"
                      value={formData.caseInvestigatorFirstNameText}
                      onChange={(value: string) => {
                        setFormValue("caseInvestigatorFirstNameText", value);
                      }}
                    />,
                    <Input
                      key="case-investigator-lastname-text"
                      id="case-investigator-lastname-text"
                      data-testid="case-investigator-lastname-text"
                      className="govuk-input--width-20"
                      label={{
                        children: (
                          <span className="govuk-!-font-weight-bold">
                            Last name
                          </span>
                        ),
                      }}
                      errorMessage={
                        formDataErrors["caseInvestigatorLastNameText"]
                          ? {
                              children:
                                formDataErrors["caseInvestigatorLastNameText"]
                                  .inputErrorText,
                            }
                          : undefined
                      }
                      type="text"
                      value={formData.caseInvestigatorLastNameText}
                      onChange={(value: string) => {
                        setFormValue("caseInvestigatorLastNameText", value);
                      }}
                    />,
                    <Input
                      key="case-investigator-shoulder-number-text"
                      id="case-investigator-shoulder-number-text"
                      data-testid="case-investigator-shoulder-number-text"
                      className="govuk-input--width-20"
                      label={{
                        children: (
                          <div className={pageStyles.shoulderNumberLabel}>
                            {policeUnitLabel && <span>{policeUnitLabel}</span>}
                            <span className="govuk-!-font-weight-bold">
                              Shoulder number (optional)
                            </span>
                          </div>
                        ),
                      }}
                      type="text"
                      value={formData.caseInvestigatorShoulderNumberText}
                      onChange={(value: string) => {
                        setFormValue(
                          "caseInvestigatorShoulderNumberText",
                          value,
                        );
                      }}
                    />,
                  ],
                },
              },
              {
                id: "case-investigator-radio-no",
                children: "No",
                value: "no",
                "data-testid": "case-investigator-radio-no",
              },
            ]}
            value={formData.caseInvestigatorRadio}
            onChange={(value) => {
              if (value) setFormValue("caseInvestigatorRadio", value);
            }}
          ></Radios>
        </div>
        <SaveAndCancel onSave={handleSubmit} />
      </form>
    </div>
  );
};

export default CaseAssigneePage;
