import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { Radios, Button, ErrorSummary } from "../../govuk";
import { type GeneralRadioValue } from "../../../common/reducers/caseRegistrationReducer";
import { HOME_PAGE_URL } from "../../../config";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "../index.module.scss";

const CancelCaseRegistrationConfirmationPage = () => {
  const navigate = useNavigate();
  const {
    state: { backRoute },
  }: {
    state: {
      backRoute: string;
    };
  } = useLocation();
  type ErrorText = {
    errorSummaryText: string;
    inputErrorText?: string;
  };
  type FormDataErrors = {
    cancelRegistrationRadio?: ErrorText;
  };
  const errorSummaryRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<{
    cancelRegistrationRadio?: GeneralRadioValue;
  }>({
    cancelRegistrationRadio: "",
  });

  const [formDataErrors, setFormDataErrors] = useState<FormDataErrors>({});

  const errorSummaryProperties = useCallback(
    (errorKey: keyof FormDataErrors) => {
      return {
        children: formDataErrors[errorKey]?.errorSummaryText,
        href: "#cancel-registration-radio-yes",
        "data-testid": "cancel-registration-radio-link",
      };
    },
    [formDataErrors],
  );

  const validateFormData = () => {
    const errors: FormDataErrors = {};
    const { cancelRegistrationRadio = "" } = formData;

    if (!cancelRegistrationRadio) {
      errors.cancelRegistrationRadio = {
        errorSummaryText: "Select whether you want to cancel registration",
        inputErrorText: "Select whether you want to cancel registration",
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
      ...errorSummaryProperties(errorKey as keyof FormDataErrors),
    }));

    return errorSummary;
  }, [formDataErrors, errorSummaryProperties]);

  useEffect(() => {
    if (errorList.length) errorSummaryRef.current?.focus();
  }, [errorList]);

  const setFormValue = (value: string) => {
    setFormData({
      ...formData,
      cancelRegistrationRadio: value as GeneralRadioValue,
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateFormData()) return;

    if (formData.cancelRegistrationRadio === "yes") {
      globalThis.location.href = HOME_PAGE_URL;
      return;
    }
    navigate(backRoute);
  };

  return (
    <div>
      {!!errorList.length && (
        <div
          ref={errorSummaryRef}
          tabIndex={-1}
          className={styles.errorSummaryWrapper}
        >
          <ErrorSummary
            data-testid={"cancel-case-registration-error-summary"}
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
                children: <h1>Are you sure you want to cancel?</h1>,
              },
            }}
            errorMessage={
              formDataErrors["cancelRegistrationRadio"]
                ? {
                    children:
                      formDataErrors["cancelRegistrationRadio"].inputErrorText,
                  }
                : undefined
            }
            items={[
              {
                id: "cancel-registration-radio-yes",
                children: "Yes, cancel registration and delete the information",
                value: "yes",
                "data-testid": "cancel-registration-radio-yes",
              },
              {
                id: "cancel-registration-radio-no",
                children: "No, go back and continue registration",
                value: "no",
                "data-testid": "cancel-registration-radio-no",
              },
            ]}
            value={formData.cancelRegistrationRadio}
            onChange={(value) => {
              if (value) setFormValue(value);
            }}
          ></Radios>
        </div>
        <Button type="submit" onClick={() => handleSubmit}>
          Continue
        </Button>
      </form>
    </div>
  );
};

export default CancelCaseRegistrationConfirmationPage;
