import {
  useRef,
  useEffect,
  useState,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { Input, Radios, ErrorSummary, BackLink, Checkboxes } from "../../govuk";
import SaveAndCancel from "../../common/SaveAndCancel";
import { CaseRegistrationFormContext } from "../../../common/providers/CaseRegistrationProvider";
import {
  type SuspectAdditionalDetailValue,
  type SuspectTypeValue,
} from "../../../common/reducers/caseRegistrationReducer";
import { getNextSuspectJourneyRoute } from "../../../common/utils/getSuspectJourneyRoutes";
import { sanitizeNameText } from "../../../common/utils/sanitizeNameText";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../index.module.scss";

const AddSuspectPage = () => {
  type ErrorText = {
    errorSummaryText: string;
    inputErrorText?: string;
    hasLink: boolean;
  };
  type FormDataErrors = {
    addSuspectRadio?: ErrorText;
    suspectLastNameText?: ErrorText;
    suspectCompanyNameText?: ErrorText;
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
    addSuspectRadio: SuspectTypeValue;
    suspectFirstNameText: string;
    suspectLastNameText: string;
    suspectCompanyNameText: string;
    suspectAdditionalDetailsCheckboxes: SuspectAdditionalDetailValue[];
  }>({
    addSuspectRadio:
      state.formData.suspects[suspectIndex]?.addSuspectRadio || "",
    suspectFirstNameText:
      state.formData.suspects[suspectIndex]?.suspectFirstNameText || "",
    suspectLastNameText:
      state.formData.suspects[suspectIndex]?.suspectLastNameText || "",
    suspectCompanyNameText:
      state.formData.suspects[suspectIndex]?.suspectCompanyNameText || "",
    suspectAdditionalDetailsCheckboxes:
      state.formData.suspects[suspectIndex]
        ?.suspectAdditionalDetailsCheckboxes || [],
  });

  const suspectAdditionalDetails: SuspectAdditionalDetailValue[] = useMemo(
    () => [
      "Date of birth",
      "Gender",
      "Disability",
      "Religion",
      "Ethnicity",
      "Alias details",
      "Arrest Summons Number (ASN)",
      "Type of offender",
    ],
    [],
  );

  const [formDataErrors, setFormDataErrors] = useState<FormDataErrors>({});

  const errorSummaryProperties = useCallback(
    (errorKey: keyof FormDataErrors) => {
      switch (errorKey) {
        case "addSuspectRadio":
          return {
            children: formDataErrors[errorKey]?.errorSummaryText,
            href: "#add-suspect-radio-person",
            "data-testid": "add-suspect-radio-link",
          };
        case "suspectLastNameText":
          return {
            children: formDataErrors[errorKey]?.errorSummaryText,
            href: "#suspect-last-name-text",
            "data-testid": "suspect-last-name-text-link",
          };

        case "suspectCompanyNameText":
          return {
            children: formDataErrors[errorKey]?.errorSummaryText,
            href: "#suspect-company-name-text",
            "data-testid": "suspect-company-name-text-link",
          };
        default:
          return null;
      }
    },
    [formDataErrors],
  );

  const validateFormData = () => {
    const errors: FormDataErrors = {};
    const {
      addSuspectRadio = "",
      suspectLastNameText = "",
      suspectCompanyNameText = "",
    } = formData;

    if (!addSuspectRadio) {
      errors.addSuspectRadio = {
        errorSummaryText: "Select whether the suspect is a person or a company",
        inputErrorText: "Select whether the suspect is a person or a company",
        hasLink: true,
      };
    }

    if (addSuspectRadio == "person" && !suspectLastNameText) {
      errors.suspectLastNameText = {
        errorSummaryText: "Enter the last name",
        inputErrorText: "Enter the last name",
        hasLink: true,
      };
    }

    if (addSuspectRadio == "company" && !suspectCompanyNameText) {
      errors.suspectCompanyNameText = {
        errorSummaryText: "Enter the company name",
        inputErrorText: "Enter the company name",
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
    if (errorList.length) errorSummaryRef.current?.focus();
  }, [errorList]);

  const previousRoute = useMemo(() => {
    if (
      state.formData.navigation.fromCaseSummaryPage &&
      !state.formData.navigation.fromSuspectSummaryPage
    ) {
      return "/case-registration/case-summary";
    }
    if (state.formData.navigation.fromSuspectSummaryPage) {
      return "/case-registration/suspect-summary";
    }

    return "/case-registration/case-details";
  }, [
    state.formData.navigation.fromCaseSummaryPage,
    state.formData.navigation.fromSuspectSummaryPage,
  ]);

  const setFormValue = (
    fieldName:
      | "addSuspectRadio"
      | "suspectFirstNameText"
      | "suspectLastNameText"
      | "suspectAdditionalDetailsCheckboxes"
      | "suspectCompanyNameText",
    value: string | SuspectAdditionalDetailValue[],
  ) => {
    const resetValues: {
      suspectFirstNameText?: string;
      suspectLastNameText?: string;
      suspectAdditionalDetailsCheckboxes?: SuspectAdditionalDetailValue[];
      suspectCompanyNameText?: string;
    } = {};
    if (
      fieldName === "suspectFirstNameText" ||
      fieldName === "suspectLastNameText"
    ) {
      value = sanitizeNameText(value as string);
    }

    setFormData((prevState) => ({
      ...prevState,
      ...resetValues,
      [fieldName]: value,
    }));
  };

  const handleAdditionalDetailsChange = (
    value: SuspectAdditionalDetailValue,
  ) => {
    const currentValues = formData.suspectAdditionalDetailsCheckboxes;
    let newValues: SuspectAdditionalDetailValue[] = [];
    if (currentValues.includes(value)) {
      newValues = currentValues.filter((item) => item !== value);
    } else {
      newValues = [...currentValues, value];
    }

    setFormValue("suspectAdditionalDetailsCheckboxes", newValues);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateFormData()) return;

    dispatch({
      type: "SET_SUSPECT_FIELDS",
      payload: { index: suspectIndex, data: formData },
    });

    dispatch({
      type: "RESET_SUSPECT_FIELD",
      payload: { index: suspectIndex },
    });

    if (formData.addSuspectRadio === "company") {
      navigate("/case-registration/suspect-summary");
      return;
    }

    const nextRoute = getNextSuspectJourneyRoute(
      "add-suspect",
      formData.suspectAdditionalDetailsCheckboxes,
      suspectIndex,
      state.formData.suspects[suspectIndex]?.suspectAliases?.length > 0,
    );

    return navigate(nextRoute);
  };

  const handleBackLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (previousRoute === "/case-registration/case-summary") {
      dispatch({
        type: "SET_NAVIGATION_DATA",
        payload: { fromCaseSummaryPage: false, fromSuspectSummaryPage: false },
      });
    }
    navigate(previousRoute);
  };

  return (
    <div>
      <BackLink to={previousRoute} onClick={handleBackLinkClick}>
        Back
      </BackLink>
      {!!errorList.length && (
        <div
          ref={errorSummaryRef}
          tabIndex={-1}
          className={styles.errorSummaryWrapper}
        >
          <ErrorSummary
            data-testid={"add-suspect-error-summary"}
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
                children: <h1>Add a suspect</h1>,
              },
            }}
            hint={{
              children: "Choose the type of suspect you want to add",
            }}
            errorMessage={
              formDataErrors["addSuspectRadio"]
                ? {
                    children: formDataErrors["addSuspectRadio"].inputErrorText,
                  }
                : undefined
            }
            items={[
              {
                id: "add-suspect-radio-person",
                children: "Person",
                value: "person",
                "data-testid": "add-suspect-radio-person",
                conditional: {
                  children: [
                    <Input
                      key="suspect-first-name-text"
                      id="suspect-first-name-text"
                      data-testid="suspect-first-name-text"
                      className="govuk-input--width-20"
                      label={{
                        children: <b>First name (optional)</b>,
                      }}
                      type="text"
                      value={formData.suspectFirstNameText}
                      onChange={(value: string) => {
                        setFormValue("suspectFirstNameText", value);
                      }}
                    />,
                    <Input
                      key="suspect-last-name-text"
                      id="suspect-last-name-text"
                      data-testid="suspect-last-name-text"
                      className="govuk-input--width-20"
                      label={{
                        children: <b>Last name</b>,
                      }}
                      errorMessage={
                        formDataErrors["suspectLastNameText"]
                          ? {
                              children:
                                formDataErrors["suspectLastNameText"]
                                  .inputErrorText,
                            }
                          : undefined
                      }
                      type="text"
                      value={formData.suspectLastNameText}
                      onChange={(value: string) => {
                        setFormValue("suspectLastNameText", value);
                      }}
                    />,
                    <Checkboxes
                      key="case-additional-details-checkboxes"
                      data-testid="suspect-additional-details-checkboxes"
                      fieldset={{
                        legend: {
                          children: (
                            <span className="govuk-!-font-weight-bold">
                              Do you want to add any additional details about
                              this suspect?
                            </span>
                          ),
                        },
                      }}
                      hint={{
                        children: "Select all that apply.",
                      }}
                      items={suspectAdditionalDetails.map((detail, index) => ({
                        id: `case-additional-details-${index}`,
                        children: detail,
                        value: detail,
                        "data-testid": `case-additional-details-${index}`,
                        checked:
                          formData.suspectAdditionalDetailsCheckboxes?.includes(
                            detail,
                          ),
                      }))}
                      onChange={(event) => {
                        const { value } = event.target;
                        if (value)
                          handleAdditionalDetailsChange(
                            value as SuspectAdditionalDetailValue,
                          );
                      }}
                    />,
                  ],
                },
              },
              {
                children: "Company",
                value: "company",
                "data-testid": "add-suspect-company-name-text",
                conditional: {
                  children: [
                    <Input
                      key="suspect-company-name-text"
                      id="suspect-company-name-text"
                      data-testid="suspect-company-name-text"
                      className="govuk-input--width-20"
                      label={{
                        children: <b>Company name</b>,
                      }}
                      errorMessage={
                        formDataErrors["suspectCompanyNameText"]
                          ? {
                              children:
                                formDataErrors["suspectCompanyNameText"]
                                  .inputErrorText,
                            }
                          : undefined
                      }
                      type="text"
                      value={formData.suspectCompanyNameText}
                      onChange={(value: string) => {
                        setFormValue("suspectCompanyNameText", value);
                      }}
                    />,
                  ],
                },
              },
            ]}
            value={formData.addSuspectRadio}
            onChange={(value) => {
              if (value) setFormValue("addSuspectRadio", value);
            }}
          ></Radios>
        </div>
        <SaveAndCancel onSave={handleSubmit} />
      </form>
    </div>
  );
};

export default AddSuspectPage;
