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
import SuspectSummary from "./SuspectSummary";
import useChargesCount from "../../../common/hooks/useChargesCount";
import styles from "../index.module.scss";
import pageStyles from "./index.module.scss";

const SuspectSummaryPage = () => {
  type ErrorText = {
    errorSummaryText: string;
    inputErrorText?: string;
  };
  type FormDataErrors = {
    addMoreSuspectsRadio?: ErrorText;
  };
  const errorSummaryRef = useRef<HTMLInputElement>(null);
  const { state, dispatch } = useContext(CaseRegistrationFormContext);
  const navigate = useNavigate();
  const { chargesCount } = useChargesCount(state.formData.suspects);

  const [addMoreSuspectsRadio, setAddMoreSuspectsRadio] = useState<string>("");

  const [formDataErrors, setFormDataErrors] = useState<FormDataErrors>({});

  const errorSummaryProperties = useCallback(
    (errorKey: keyof FormDataErrors) => {
      if (errorKey === "addMoreSuspectsRadio") {
        return {
          children: formDataErrors[errorKey]?.errorSummaryText,
          href: "#add-more-suspects-radio-yes",
          "data-testid": "add-more-suspects-radio-link",
        };
      }
      return null;
    },
    [formDataErrors],
  );

  const validateFormData = () => {
    const errors: FormDataErrors = {};

    if (!addMoreSuspectsRadio) {
      errors.addMoreSuspectsRadio = {
        errorSummaryText: state.formData.suspects.length
          ? "Select whether you need to add another suspect"
          : "Select whether you need to add a suspect",
        inputErrorText: state.formData.suspects.length
          ? "Select whether you need to add another suspect"
          : "Select whether you need to add a suspect",
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
    if (state.formData.navigation.fromCaseSummaryPage) {
      return "/case-registration/case-summary";
    }
    return "/case-registration/case-details";
  }, [state.formData.navigation.fromCaseSummaryPage]);

  const getTitle = useCallback(() => {
    if (state.formData.suspects.length > 1) {
      return `You have added ${state.formData.suspects.length} suspects`;
    }
    return `You have added ${state.formData.suspects.length} suspect`;
  }, [state.formData.suspects.length]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateFormData()) return;

    if (addMoreSuspectsRadio === "yes") {
      dispatch({
        type: "SET_NAVIGATION_DATA",
        payload: { fromSuspectSummaryPage: true },
      });
      navigate(
        `/case-registration/suspect-${state.formData.suspects.length}/add-suspect`,
      );
      return;
    }
    if (state.formData.navigation.fromCaseSummaryPage) {
      dispatch({
        type: "SET_NAVIGATION_DATA",
        payload: { fromSuspectSummaryPage: false, fromCaseSummaryPage: false },
      });
      navigate("/case-registration/case-summary");
      return;
    } else if (state.formData.navigation.fromSuspectSummaryPage) {
      dispatch({
        type: "SET_NAVIGATION_DATA",
        payload: { fromSuspectSummaryPage: false },
      });
    }

    if (chargesCount > 0) {
      navigate("/case-registration/charges-summary");
      return;
    }
    if (state.formData.suspects.length > 0) {
      navigate("/case-registration/want-to-add-charges");
      return;
    }
    navigate("/case-registration/case-monitoring-codes");
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
    <div className={pageStyles.caseSuspectsSummaryPage}>
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
            data-testid={"suspect-summary-error-summary"}
            errorList={errorList}
            titleChildren="There is a problem"
          />
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <h1>{getTitle()}</h1>
        <div className={pageStyles.summaryWrapper}>
          <SuspectSummary />
        </div>
        <div className={styles.inputWrapper}>
          <Radios
            className="govuk-radios--inline"
            fieldset={{
              legend: {
                children: (
                  <>
                    {state.formData.suspects.length ? (
                      <span className="govuk-!-font-weight-bold">
                        Do you need to add another suspect?
                      </span>
                    ) : (
                      <span className="govuk-!-font-weight-bold">
                        Do you need to add a suspect?
                      </span>
                    )}
                  </>
                ),
              },
            }}
            errorMessage={
              formDataErrors["addMoreSuspectsRadio"]
                ? {
                    children:
                      formDataErrors["addMoreSuspectsRadio"].errorSummaryText,
                  }
                : undefined
            }
            items={[
              {
                id: "add-more-suspects-radio-yes",
                children: "Yes",
                value: "yes",
                "data-testid": "add-more-suspects-radio-yes",
              },
              {
                id: "add-more-suspects-radio-no",
                children: "No",
                value: "no",
                "data-testid": "add-more-suspects-radio-no",
              },
            ]}
            value={addMoreSuspectsRadio}
            onChange={(value) => {
              if (value) setAddMoreSuspectsRadio(value);
            }}
          ></Radios>
        </div>
        <SaveAndCancel onSave={handleSubmit} />
      </form>
    </div>
  );
};

export default SuspectSummaryPage;
