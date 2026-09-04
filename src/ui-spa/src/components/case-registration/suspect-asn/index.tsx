import { useState, useContext, useCallback, useMemo } from "react";
import { Input, BackLink } from "../../govuk";
import SaveAndCancel from "../../common/SaveAndCancel";
import { CaseRegistrationFormContext } from "../../../common/providers/CaseRegistrationProvider";
import { useNavigate, useParams } from "react-router";
import { sanitizeASNText } from "../../../common/utils/sanitizeASNText";
import useErrorSummaryList from "../../../common/hooks/useErrorSummaryList";
import useGetSuspectRoute from "../../../common/hooks/useGetSuspectRoute";
import ErrorSummaryWrapper from "../../common/ErrorSummaryWrapper";
import PageContentWrapper from "../../common/PageContentWrapper";
import styles from "../index.module.scss";

const SuspectASNPage = () => {
  type ErrorText = {
    errorSummaryText: string;
    inputErrorText?: string;
  };
  type FormDataErrors = {
    suspectASNText?: ErrorText;
  };

  const { state, dispatch } = useContext(CaseRegistrationFormContext);
  const navigate = useNavigate();
  const { suspectId } = useParams<{ suspectId: string }>() as {
    suspectId: string;
  };
  const [showSkip, setShowSkip] = useState(false);
  const suspectIndex = useMemo(() => {
    const index = suspectId.replace("suspect-", "");
    return Number.parseInt(index, 10);
  }, [suspectId]);

  const [asnFormData, setAsnFormData] = useState<{
    suspectASNText: string;
  }>({
    suspectASNText: state.formData.suspects[suspectIndex].suspectASNText || "",
  });

  const { previousRoute, nextRoute } = useGetSuspectRoute(
    "suspect-asn",
    state.formData.suspects[suspectIndex].suspectAdditionalDetailsCheckboxes,
    suspectIndex,
    state.formData.suspects[suspectIndex].suspectAliases.length > 0,
  );

  const [asnFormDataErrors, setAsnFormDataErrors] = useState<FormDataErrors>(
    {},
  );

  const errorSummaryProperties = useCallback(
    (errorKey: keyof FormDataErrors) => {
      if (errorKey === "suspectASNText") {
        return {
          children: asnFormDataErrors[errorKey]?.errorSummaryText,
          href: "#suspect-asn-text",
          "data-testid": "suspect-asn-text-link",
        };
      }

      return null;
    },
    [asnFormDataErrors],
  );
  const { errorSummaryRef, errorList, disableBtns, setDisableBtns } =
    useErrorSummaryList(asnFormDataErrors, errorSummaryProperties);
  const validateFormData = () => {
    const errors: FormDataErrors = {};
    const { suspectASNText = "" } = asnFormData;
    if (!suspectASNText) {
      errors.suspectASNText = {
        errorSummaryText: "Enter the Arrest Summons Number (ASN)",
        inputErrorText: "Enter the Arrest Summons Number (ASN)",
      };
      setAsnFormDataErrors(errors);
      setShowSkip(true);
      return false;
    }
    if (showSkip) {
      setShowSkip(false);
    }

    return true;
  };

  const setFormValue = (value: string) => {
    value = sanitizeASNText(value);
    setAsnFormData({ ...asnFormData, suspectASNText: value });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateFormData()) return;
    setDisableBtns(true);

    dispatch({
      type: "SET_SUSPECT_FIELDS",
      payload: {
        index: suspectIndex,
        data: asnFormData,
      },
    });

    return navigate(nextRoute);
  };

  const onSkipCallBack = useCallback(() => {
    //reset the asn values if it present when user skips
    if (state.formData.suspects[suspectIndex].suspectASNText) {
      dispatch({
        type: "SET_SUSPECT_FIELDS",
        payload: {
          index: suspectIndex,
          data: {
            suspectASNText: "",
          },
        },
      });
    }
  }, [state.formData.suspects, suspectIndex, dispatch]);

  return (
    <div>
      <BackLink to={previousRoute}>Back</BackLink>
      <PageContentWrapper>
        <ErrorSummaryWrapper
          errorList={errorList}
          errorSummaryRef={errorSummaryRef}
          dataTestId="suspect-asn-error-summary"
          showSkip={showSkip}
          nextRoute={nextRoute}
          skipText="I do not have the Arrest Summons Number"
          onSkipCallBack={onSkipCallBack}
        />
        <form onSubmit={handleSubmit}>
          <div className={styles.inputWrapper}>
            <Input
              key="suspect-asn-text"
              id="suspect-asn-text"
              data-testid="suspect-asn-text"
              errorMessage={
                asnFormDataErrors["suspectASNText"]
                  ? {
                      children:
                        asnFormDataErrors["suspectASNText"].inputErrorText,
                    }
                  : undefined
              }
              className="govuk-input--width-20"
              label={{
                children: <h1>What is the Arrest Summons Number (ASN)?</h1>,
              }}
              type="text"
              value={asnFormData.suspectASNText}
              onChange={setFormValue}
            />
          </div>
          <SaveAndCancel onSave={handleSubmit} disabled={disableBtns} />
        </form>
      </PageContentWrapper>
    </div>
  );
};

export default SuspectASNPage;
