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
import { formatNameUtil } from "../../../common/utils/formatNameUtil";
import styles from "../index.module.scss";

const AddChargeSuspectPage = () => {
  type ErrorText = {
    errorSummaryText: string;
    inputErrorText?: string;
  };
  type FormDataErrors = {
    addChargeSuspectRadio?: ErrorText;
  };

  const [addChargeSuspectRadio, setAddChargeSuspectRadio] = useState<{
    suspectId: string;
  }>({ suspectId: "" });

  const errorSummaryRef = useRef<HTMLInputElement>(null);
  const { state } = useContext(CaseRegistrationFormContext);
  const navigate = useNavigate();
  const { chargesCount } = useChargesCount(state.formData.suspects);

  const previousRoute = useMemo(() => {
    if (chargesCount) {
      return "/case-registration/charges-summary";
    }

    return "/case-registration/want-to-add-charges";
  }, [chargesCount]);

  const [formDataErrors, setFormDataErrors] = useState<FormDataErrors>({});

  const errorSummaryProperties = useCallback(
    (errorKey: keyof FormDataErrors) => {
      if (errorKey === "addChargeSuspectRadio") {
        return {
          children: formDataErrors[errorKey]?.errorSummaryText,
          href: "#suspect-radio-0",
          "data-testid": "suspect-radio-link",
        };
      }

      return null;
    },
    [formDataErrors],
  );

  const validateFormData = () => {
    const errors: FormDataErrors = {};
    let isValid = true;

    if (!addChargeSuspectRadio.suspectId) {
      errors.addChargeSuspectRadio = {
        errorSummaryText: "Select which suspect you need to add charges for",
        inputErrorText: "Select which suspect you need to add charges for",
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

  useEffect(() => {
    if (errorList.length) errorSummaryRef.current?.focus();
  }, [errorList]);

  const suspectItems = useMemo(() => {
    if (!state.formData.suspects) return [];
    const existingSuspects = state.formData.suspects.map((suspect, index) => ({
      id: `suspect-radio-${index}`,
      children: suspect.suspectCompanyNameText
        ? suspect.suspectCompanyNameText
        : formatNameUtil(
            suspect.suspectFirstNameText,
            suspect.suspectLastNameText,
          ),
      value: `${index}`,
      "data-testid": `suspect-radio-${index}`,
    }));
    return [
      ...existingSuspects,
      { divider: "or", value: "or" },
      {
        id: "suspect-radio-new",
        children: "Suspect not listed",
        hint: {
          children: "Select this option to add their details on the next page",
        },
        value: "add-new-suspect",
        "data-testid": "suspect-radio-new",
      },
    ];
  }, [state.formData.suspects]);

  const setFormValue = (value: string) => {
    setAddChargeSuspectRadio({
      suspectId: value,
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateFormData()) return;
    const { suspects } = state.formData;
    const suspectId = !suspects.length ? 0 : suspects.length;

    if (addChargeSuspectRadio.suspectId === "add-new-suspect") {
      return navigate(`/case-registration/suspect-${suspectId}/add-suspect`);
    }

    const charges =
      suspects[parseInt(addChargeSuspectRadio.suspectId)].charges || [];
    const chargeId =
      charges.length > 0 ? `charge-${charges.length}` : "charge-0";

    const nextRoute = `/case-registration/suspect-${addChargeSuspectRadio.suspectId}/${chargeId}/charges-offence-search`;
    return navigate(nextRoute);
  };

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
            data-testid={"add-charge-suspect-error-summary"}
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
                  <h1>Which suspect to do you want to add charges for?</h1>
                ),
              },
            }}
            errorMessage={
              formDataErrors["addChargeSuspectRadio"]
                ? {
                    children:
                      formDataErrors["addChargeSuspectRadio"].inputErrorText,
                  }
                : undefined
            }
            items={suspectItems}
            value={addChargeSuspectRadio.suspectId || ""}
            onChange={(value) => {
              if (value) setFormValue(value);
            }}
          ></Radios>
        </div>
        <SaveAndCancel onSave={handleSubmit} />
      </form>
    </div>
  );
};

export default AddChargeSuspectPage;
