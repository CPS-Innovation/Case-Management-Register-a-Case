import {
  useRef,
  useEffect,
  useState,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { ErrorSummary, BackLink, DateInput } from "../../govuk";
import SaveAndCancel from "../../common/SaveAndCancel";
import { formatNameUtil } from "../../../common/utils/formatNameUtil";
import { CaseRegistrationFormContext } from "../../../common/providers/CaseRegistrationProvider";
import { validateDate } from "../../../common/utils/dateValidation";
import {
  getNextSuspectJourneyRoute,
  getPreviousSuspectJourneyRoute,
} from "../../../common/utils/getSuspectJourneyRoutes";
import { dobValidationConstants } from "../../../common/constants/dobValidationConstants";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../index.module.scss";

const SuspectDOBPage = () => {
  type ErrorText = {
    errorSummaryText: string;
    inputErrorFields: string[];
  };
  type FormDataErrors = {
    suspectDOBDateError?: ErrorText;
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
    suspectDOBDayText: string;
    suspectDOBMonthText: string;
    suspectDOBYearText: string;
  }>({
    suspectDOBDayText:
      state.formData.suspects[suspectIndex].suspectDOBDayText || "",
    suspectDOBMonthText:
      state.formData.suspects[suspectIndex].suspectDOBMonthText || "",
    suspectDOBYearText:
      state.formData.suspects[suspectIndex].suspectDOBYearText || "",
  });

  const previousRoute = useMemo(() => {
    return getPreviousSuspectJourneyRoute(
      "suspect-dob",
      state.formData.suspects[suspectIndex].suspectAdditionalDetailsCheckboxes,
      suspectIndex,
    );
  }, [state.formData.suspects, suspectIndex]);
  const [formDataErrors, setFormDataErrors] = useState<FormDataErrors>({});

  const errorSummaryProperties = useCallback(() => {
    if (formDataErrors.suspectDOBDateError?.inputErrorFields.includes("day")) {
      return {
        href: "#suspect-DOB-day-text",
        "data-testid": "suspect-DOB-day-text-link",
      };
    }
    if (
      formDataErrors.suspectDOBDateError?.inputErrorFields.includes("month")
    ) {
      return {
        href: "#suspect-DOB-month-text",
        "data-testid": "suspect-DOB-month-text-link",
      };
    }
    if (formDataErrors.suspectDOBDateError?.inputErrorFields.includes("year")) {
      return {
        href: "#suspect-DOB-year-text",
        "data-testid": "suspect-DOB-year-text-link",
      };
    }
  }, [formDataErrors]);

  const validateFormData = () => {
    const {
      suspectDOBDayText = "",
      suspectDOBMonthText = "",
      suspectDOBYearText = "",
    } = formData;

    if (!suspectDOBDayText && !suspectDOBMonthText && !suspectDOBYearText) {
      setFormDataErrors({
        suspectDOBDateError: {
          inputErrorFields: ["day", "month", "year"].filter(Boolean),
          errorSummaryText: "Enter the date of birth",
        },
      });
      return false;
    }

    const result = validateDate(
      +suspectDOBDayText,
      +suspectDOBMonthText,
      +suspectDOBYearText,
    );

    if (!result.errors.length) {
      return true;
    }

    let inputErrorFields = [];
    let errorSummaryText = "Date of birth must be a valid date";

    if (result.errors.includes(dobValidationConstants.INVALID_AGE)) {
      errorSummaryText = "Invalid age, should be between 10 and 120";
    }

    if (result.errors.includes(dobValidationConstants.INVALID_DAY)) {
      inputErrorFields.push("day");
    }
    if (result.errors.includes(dobValidationConstants.INVALID_MONTH)) {
      inputErrorFields.push("month");
    }
    if (result.errors.includes(dobValidationConstants.INVALID_YEAR)) {
      inputErrorFields.push("year");
    }
    if (
      result.errors.includes(dobValidationConstants.INVALID_AGE) ||
      result.errors.includes(dobValidationConstants.INVALID_DATE)
    ) {
      inputErrorFields = ["day", "month", "year"];
    }

    setFormDataErrors({
      suspectDOBDateError: { inputErrorFields, errorSummaryText },
    });
    return false;
  };

  const errorList = useMemo(() => {
    const validErrorKeys = Object.keys(formDataErrors).filter(
      (errorKey) => formDataErrors[errorKey as keyof FormDataErrors],
    );

    const errorSummary = validErrorKeys.map((key) => ({
      reactListKey: `${key}`,
      children: formDataErrors.suspectDOBDateError?.errorSummaryText,
      ...errorSummaryProperties()!,
    }));

    return errorSummary;
  }, [formDataErrors, errorSummaryProperties]);

  useEffect(() => {
    if (errorList.length) errorSummaryRef.current?.focus();
  }, [errorList]);

  const setFormValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    let field:
      | "suspectDOBDayText"
      | "suspectDOBMonthText"
      | "suspectDOBYearText" = "suspectDOBDayText";

    if (event.target.name === "suspect-DOB-month") {
      field = "suspectDOBMonthText";
    }
    if (event.target.name === "suspect-DOB-year") {
      field = "suspectDOBYearText";
    }

    const value = event.target.value;

    const newValue = value.replaceAll(/\D/g, "");

    setFormData((prevState) => ({
      ...prevState,
      [field]: newValue,
    }));
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
      "suspect-dob",
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
            data-testid={"add-suspect-error-summary"}
            errorList={errorList}
            titleChildren="There is a problem"
          />
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className={styles.inputWrapper}>
          <DateInput
            errorMessage={
              formDataErrors.suspectDOBDateError
                ? {
                    children:
                      formDataErrors.suspectDOBDateError.errorSummaryText,
                  }
                : undefined
            }
            fieldset={{
              legend: {
                children: (
                  <h1>{`What is  ${formatNameUtil(suspectFirstNameText, suspectLastNameText)}'s date of birth?`}</h1>
                ),
              },
            }}
            hint={{
              children: <span>For example, 27 3 2007</span>,
            }}
            id="suspect-DOB-date"
            data-testid="suspect-DOB-date"
            items={[
              {
                id: "suspect-DOB-day-text",
                className: `govuk-input--width-2 ${
                  formDataErrors.suspectDOBDateError?.inputErrorFields.includes(
                    "day",
                  )
                    ? "govuk-input--error"
                    : ""
                }`,
                name: "day",
                value: formData.suspectDOBDayText,
                maxLength: 2,
              },
              {
                id: "suspect-DOB-month-text",
                className: `govuk-input--width-2 ${
                  formDataErrors.suspectDOBDateError?.inputErrorFields.includes(
                    "month",
                  )
                    ? "govuk-input--error"
                    : ""
                }`,
                name: "month",
                value: formData.suspectDOBMonthText,
                maxLength: 2,
              },
              {
                id: "suspect-DOB-year-text",
                className: `govuk-input--width-4 ${
                  formDataErrors.suspectDOBDateError?.inputErrorFields.includes(
                    "year",
                  )
                    ? "govuk-input--error"
                    : ""
                }`,
                name: "year",
                value: formData.suspectDOBYearText,
                maxLength: 4,
              },
            ]}
            namePrefix="suspect-DOB"
            onChange={setFormValue}
          />
        </div>
        <SaveAndCancel onSave={handleSubmit} />
      </form>
    </div>
  );
};

export default SuspectDOBPage;
