import {
  useRef,
  useEffect,
  useState,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { Radios, Button, ErrorSummary, BackLink } from "../../govuk";
import DateInputNative from "../../common/DateInputNative";
import { CaseRegistrationFormContext } from "../../../common/providers/CaseRegistrationProvider";
import { type GeneralRadioValue } from "../../../common/reducers/caseRegistrationReducer";
import { formatNameUtil } from "../../../common/utils/formatNameUtil";
import { isChargedWithAdultWarningActive } from "../../../common/utils/isChargedWithAdultWarningActive";
import { isValidOnOrBeforeDate } from "../../../common/utils/isValidOnOrBeforeDate";
import { useNavigate, useParams } from "react-router-dom";
import SaveAndCancel from "../../common/SaveAndCancel";
import styles from "../index.module.scss";
import pageStyles from "./index.module.scss";

const AddChargeDetailsPage = () => {
  type ErrorText = {
    errorSummaryText: string;
    inputErrorText?: string;
    hasLink: boolean;
  };
  type FormDataErrors = {
    addVictimRadio?: ErrorText;
    offenceFromDate?: ErrorText;
    offenceToDate?: ErrorText;
    chargedWithAdultRadio?: ErrorText;
  };
  const errorSummaryRef = useRef<HTMLInputElement>(null);
  const { state, dispatch } = useContext(CaseRegistrationFormContext);
  const navigate = useNavigate();
  const { suspectId, chargeId } = useParams<{
    suspectId: string;
    chargeId: string;
  }>() as {
    suspectId: string;
    chargeId: string;
  };

  const suspectIndex = useMemo(() => {
    const index = suspectId.replace("suspect-", "");
    return Number.parseInt(index, 10);
  }, [suspectId]);

  const chargeIndex = useMemo(() => {
    const index = chargeId.replace("charge-", "");
    return Number.parseInt(index, 10);
  }, [chargeId]);

  const suspectCharge = useMemo(() => {
    const {
      formData: { suspects },
    } = state;
    const charges = suspects[suspectIndex].charges || {};
    return charges[chargeIndex];
  }, [state, suspectIndex, chargeIndex]);

  const [formData, setFormData] = useState<{
    offenceFromDate: string;
    offenceToDate: string;
    addVictimRadio: GeneralRadioValue;
    chargedWithAdultRadio: GeneralRadioValue;
  }>({
    offenceFromDate: suspectCharge?.offenceFromDate || "",
    offenceToDate: suspectCharge?.offenceToDate || "",
    addVictimRadio: suspectCharge?.addVictimRadio || "",
    chargedWithAdultRadio: suspectCharge?.chargedWithAdultRadio || "",
  });

  const [showDateRange, setShowDateRange] = useState(
    suspectCharge?.offenceToDate ? true : false,
  );

  const suspectName = useMemo(() => {
    const {
      formData: { suspects },
    } = state;
    const {
      suspectFirstNameText,
      suspectLastNameText,
      suspectCompanyNameText,
    } = suspects[suspectIndex];
    return suspectCompanyNameText
      ? suspectCompanyNameText
      : formatNameUtil(suspectFirstNameText, suspectLastNameText);
  }, [state, suspectIndex]);

  const showChargedWithAdultWarning = useMemo(() => {
    const {
      formData: { suspects },
    } = state;
    return isChargedWithAdultWarningActive(
      suspects[suspectIndex].suspectOffenderTypesRadio.shortCode,
    );
  }, [state, suspectIndex]);

  const [formDataErrors, setFormDataErrors] = useState<FormDataErrors>({});

  const errorSummaryProperties = useCallback(
    (errorKey: keyof FormDataErrors) => {
      switch (errorKey) {
        case "addVictimRadio":
          return {
            children: formDataErrors[errorKey]?.errorSummaryText,
            href: "#add-victim-radio-yes",
            "data-testid": "add-victim-radio-link",
          };

        case "offenceFromDate":
          return {
            children: formDataErrors[errorKey]?.errorSummaryText,
            href: "#offence-from-date-text",
            "data-testid": "offence-from-date-text-link",
          };

        case "offenceToDate":
          return {
            children: formDataErrors[errorKey]?.errorSummaryText,
            href: "#offence-to-date-text",
            "data-testid": "offence-to-date-text-link",
          };

        case "chargedWithAdultRadio":
          return {
            children: formDataErrors[errorKey]?.errorSummaryText,
            href: "#charged-with-adult-radio-yes",
            "data-testid": "charged-with-adult-radio-link",
          };

        default:
          return null;
      }
    },
    [formDataErrors],
  );

  const validateFormData = () => {
    const errors: FormDataErrors = {};
    const { firstHearingDateText } = state.formData;
    const {
      addVictimRadio,
      offenceFromDate,
      offenceToDate,
      chargedWithAdultRadio,
    } = formData;

    if (!offenceFromDate) {
      errors.offenceFromDate = {
        errorSummaryText: "Select an offence from date",
        inputErrorText: "Select an offence from date",
        hasLink: true,
      };
    }

    if (showDateRange && !offenceToDate) {
      errors.offenceToDate = {
        errorSummaryText: "Select an offence to date",
        inputErrorText: "Select an offence to date",
        hasLink: true,
      };
    }

    if (
      offenceToDate &&
      offenceFromDate &&
      !isValidOnOrBeforeDate(offenceFromDate, offenceToDate)
    ) {
      errors.offenceFromDate = {
        errorSummaryText:
          "Enter a start date that is the same or before the end date.",
        inputErrorText:
          "Enter a start date that is the same or before the end date.",
        hasLink: true,
      };
    }

    if (
      offenceToDate &&
      firstHearingDateText &&
      !isValidOnOrBeforeDate(offenceToDate, firstHearingDateText)
    ) {
      errors.offenceToDate = {
        errorSummaryText:
          "The charge to date cannot be later than the first hearing date.",
        inputErrorText:
          "The charge to date cannot be later than the first hearing date.",
        hasLink: true,
      };
    }

    if (
      offenceFromDate &&
      firstHearingDateText &&
      !isValidOnOrBeforeDate(offenceFromDate, firstHearingDateText)
    ) {
      errors.offenceFromDate = {
        errorSummaryText:
          "The charge from date cannot be later than the first hearing date.",
        inputErrorText:
          "The charge from date cannot be later than the first hearing date.",
        hasLink: true,
      };
    }
    if (offenceFromDate && !isValidOnOrBeforeDate(offenceFromDate)) {
      errors.offenceFromDate = {
        errorSummaryText: "Enter an offence date that is today or in the past",
        inputErrorText: "Enter an offence date that is today or in the past",
        hasLink: true,
      };
    }
    if (offenceToDate && !isValidOnOrBeforeDate(offenceToDate)) {
      errors.offenceToDate = {
        errorSummaryText: "Enter an offence date that is today or in the past",
        inputErrorText: "Enter an offence date that is today or in the past",
        hasLink: true,
      };
    }

    if (!addVictimRadio) {
      errors.addVictimRadio = {
        errorSummaryText: "Select whether there is a victim",
        inputErrorText: "Select whether there is a victim",
        hasLink: true,
      };
    }

    if (showChargedWithAdultWarning && !chargedWithAdultRadio) {
      errors.chargedWithAdultRadio = {
        errorSummaryText: "Select whether suspect is charged with an adult",
        inputErrorText: "Select whether suspect is charged with an adult",
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

  const setFormValue = (
    fieldName:
      | "addVictimRadio"
      | "offenceFromDate"
      | "offenceToDate"
      | "chargedWithAdultRadio",
    value: string,
  ) => {
    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };

  const handleDateRangeButtonClick = () => {
    setShowDateRange(!showDateRange);
    if (showDateRange) {
      setFormData((prevState) => ({
        ...prevState,
        offenceToDate: "",
      }));
    }
  };

  const handleDateChange = (
    fieldName: "offenceFromDate" | "offenceToDate",
    value: string,
  ) => {
    setFormValue(fieldName, value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateFormData()) return;

    dispatch({
      type: "SET_CHARGE_FIELDS",
      payload: {
        suspectIndex: suspectIndex,
        chargeIndex: chargeIndex,
        data: formData,
      },
    });

    const { addVictimRadio } = formData;
    if (addVictimRadio === "yes")
      return navigate(
        `/case-registration/suspect-${suspectIndex}/charge-${chargeIndex}/add-charge-victim`,
      );

    return navigate("/case-registration/charges-summary");
  };

  return (
    <div className={pageStyles.addChargeDetailsPage}>
      <BackLink
        to={`/case-registration/suspect-${suspectIndex}/charge-${chargeIndex}/charges-offence-search`}
      >
        Back
      </BackLink>
      {!!errorList.length && (
        <div
          ref={errorSummaryRef}
          tabIndex={-1}
          className={styles.errorSummaryWrapper}
        >
          <ErrorSummary
            data-testid={"charges-details-error-summary"}
            errorList={errorList}
            titleChildren="There is a problem"
          />
        </div>
      )}

      <h1>Add charges</h1>
      <div>
        <h2 className="govuk-heading-s govuk-!-margin-bottom-2">
          {suspectName}
        </h2>
        <h2 className="govuk-heading-s govuk-!-margin-bottom-2">
          {suspectCharge.selectedOffence?.code} -{" "}
          {suspectCharge.selectedOffence?.description}
        </h2>
      </div>
      <hr className={pageStyles.resultsDivider} />
      <form onSubmit={handleSubmit}>
        <div
          className={styles.inputWrapper}
          data-testid="add-charge-details-dates-inputs"
        >
          <span className="govuk-!-font-weight-bold">
            When was the offence?
          </span>
          <div className={pageStyles.dateInputsWrapper}>
            <DateInputNative
              key="offence-from-date-text"
              id="offence-from-date-text"
              data-testid="offence-from-date-text"
              className={pageStyles.dateInput}
              value={formData.offenceFromDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleDateChange("offenceFromDate", e.target.value)
              }
              errorMessage={
                formDataErrors["offenceFromDate"]
                  ? formDataErrors["offenceFromDate"].inputErrorText
                  : undefined
              }
            />
            {showDateRange && (
              <>
                <span className={pageStyles.dateRangeSeparator}> to </span>
                <DateInputNative
                  key="offence-to-date-text"
                  id="offence-to-date-text"
                  data-testid="offence-to-date-text"
                  className={pageStyles.dateInput}
                  value={formData.offenceToDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleDateChange("offenceToDate", e.target.value)
                  }
                  errorMessage={
                    formDataErrors["offenceToDate"]
                      ? formDataErrors["offenceToDate"].inputErrorText
                      : undefined
                  }
                />
              </>
            )}
            <Button
              className="govuk-button--secondary"
              name="secondary"
              type="button"
              onClick={() => handleDateRangeButtonClick()}
            >
              {showDateRange ? "Single date" : "Date range"}
            </Button>
          </div>
          <Radios
            data-testid="add-victim-radio"
            fieldset={{
              legend: {
                children: (
                  <span className="govuk-!-font-weight-bold">
                    Is there a victim?
                  </span>
                ),
              },
            }}
            errorMessage={
              formDataErrors["addVictimRadio"]
                ? {
                    children: formDataErrors["addVictimRadio"].inputErrorText,
                  }
                : undefined
            }
            items={[
              {
                id: "add-victim-radio-yes",
                children: "Yes",
                value: "yes",
                "data-testid": "add-victim-radio-yes",
              },
              {
                id: "add-victim-radio-no",
                children: "No",
                value: "no",
                "data-testid": "add-victim-radio-no",
              },
            ]}
            value={formData.addVictimRadio || ""}
            onChange={(value) => {
              if (value) setFormValue("addVictimRadio", value);
            }}
          ></Radios>
          {showChargedWithAdultWarning && (
            <Radios
              data-testid="charged-with-adult-radio"
              fieldset={{
                legend: {
                  children: (
                    <span className="govuk-!-font-weight-bold">
                      {`Is ${suspectName} charged with an adult?`}
                    </span>
                  ),
                },
              }}
              errorMessage={
                formDataErrors["chargedWithAdultRadio"]
                  ? {
                      children:
                        formDataErrors["chargedWithAdultRadio"].inputErrorText,
                    }
                  : undefined
              }
              items={[
                {
                  id: "charged-with-adult-radio-yes",
                  children: "Yes",
                  value: "yes",
                  "data-testid": "charged-with-adult-radio-yes",
                },
                {
                  id: "charged-with-adult-radio-no",
                  children: "No",
                  value: "no",
                  "data-testid": "charged-with-adult-radio-no",
                },
              ]}
              value={formData.chargedWithAdultRadio || ""}
              onChange={(value) => {
                if (value) setFormValue("chargedWithAdultRadio", value);
              }}
            ></Radios>
          )}
        </div>
        <SaveAndCancel onSave={handleSubmit} />
      </form>
    </div>
  );
};

export default AddChargeDetailsPage;
