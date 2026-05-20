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
import { useNavigate } from "react-router-dom";
import useChargesCount from "../../../common/hooks/useChargesCount";
import ChargesSummary from "./ChargesSummary";
import styles from "../index.module.scss";
import pageStyles from "./index.module.scss";

const SuspectSummaryPage = () => {
  type ErrorText = {
    errorSummaryText: string;
    inputErrorText?: string;
  };
  type FormDataErrors = {
    addMoreChargesRadio?: ErrorText;
  };
  const errorSummaryRef = useRef<HTMLInputElement>(null);
  const { state, dispatch } = useContext(CaseRegistrationFormContext);
  const navigate = useNavigate();
  const { chargesCount } = useChargesCount(state.formData.suspects);

  const [addMoreChargesRadio, setAddMoreChargesRadio] = useState<string>("");

  const [formDataErrors, setFormDataErrors] = useState<FormDataErrors>({});

  const errorSummaryProperties = useCallback(
    (errorKey: keyof FormDataErrors) => {
      if (errorKey === "addMoreChargesRadio") {
        return {
          children: formDataErrors[errorKey]?.errorSummaryText,
          href: "#add-more-charges-radio-yes",
          "data-testid": "add-more-charges-radio-link",
        };
      }
      return null;
    },
    [formDataErrors],
  );

  const validateFormData = () => {
    const errors: FormDataErrors = {};
    let isValid = true;

    if (!addMoreChargesRadio) {
      errors.addMoreChargesRadio = {
        errorSummaryText: chargesCount
          ? "Select whether you need to add another charge"
          : "Select whether you need to add a charge",
        inputErrorText: chargesCount
          ? "Select whether you need to add another charge"
          : "Select whether you need to add a charge",
      };

      isValid = false;
    }

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
  const previousRoute = useMemo(() => {
    if (state.formData.navigation.fromCaseSummaryPage) {
      return "/case-registration/case-summary";
    }

    return "/case-registration/suspect-summary";
  }, [state.formData.navigation.fromCaseSummaryPage]);

  useEffect(() => {
    if (errorList.length) errorSummaryRef.current?.focus();
  }, [errorList]);

  const getTitle = useCallback(() => {
    if (chargesCount > 1) {
      return `You have added ${chargesCount} charges`;
    }
    return `You have added ${chargesCount} charge`;
  }, [chargesCount]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateFormData()) return;

    if (addMoreChargesRadio === "yes") {
      dispatch({
        type: "SET_NAVIGATION_DATA",
        payload: { fromChargeSummaryPage: true },
      });
      navigate(`/case-registration/add-charge-suspect`);
      return;
    }
    if (state.formData.navigation.fromChargeSummaryPage) {
      dispatch({
        type: "SET_NAVIGATION_DATA",
        payload: { fromChargeSummaryPage: false },
      });
    }
    if (state.formData.navigation.fromCaseSummaryPage) {
      navigate("/case-registration/case-summary");
      return;
    }
    if (chargesCount) {
      navigate("/case-registration/first-hearing");
      return;
    }
    navigate("/case-registration/case-monitoring-codes");
  };

  const handleBackLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (previousRoute === "/case-registration/case-summary") {
      dispatch({
        type: "SET_NAVIGATION_DATA",
        payload: { fromCaseSummaryPage: false, fromChargeSummaryPage: false },
      });
    }

    navigate(previousRoute);
  };

  return (
    <div className={pageStyles.chargesSummaryPage}>
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
            data-testid={"charges-summary-error-summary"}
            errorList={errorList}
            titleChildren="There is a problem"
          />
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <h1>{getTitle()}</h1>
        {chargesCount > 0 && (
          <div
            className={pageStyles.chargesSummaryWrapper}
            data-testid="charges-summary"
          >
            <ChargesSummary />
          </div>
        )}

        <div className={styles.inputWrapper}>
          <Radios
            className="govuk-radios--inline"
            fieldset={{
              legend: {
                children: (
                  <span className="govuk-!-font-weight-bold">
                    {chargesCount
                      ? `Do you need to add another charge?`
                      : `Do you need to add a charge?`}
                  </span>
                ),
              },
            }}
            errorMessage={
              formDataErrors["addMoreChargesRadio"]
                ? {
                    children:
                      formDataErrors["addMoreChargesRadio"].errorSummaryText,
                  }
                : undefined
            }
            items={[
              {
                id: `add-more-charges-radio-yes`,
                children: "Yes",
                value: "yes",
                "data-testid": `add-more-charges-radio-yes`,
              },
              {
                id: `add-more-charges-radio-no`,
                children: "No",
                value: "no",
                "data-testid": `add-more-charges-radio-no`,
              },
            ]}
            value={addMoreChargesRadio}
            onChange={(value) => {
              if (value) setAddMoreChargesRadio(value);
            }}
          ></Radios>
        </div>
        <SaveAndCancel onSave={handleSubmit} />
      </form>
    </div>
  );
};

export default SuspectSummaryPage;
