import { useState, useContext, useCallback, useMemo } from "react";
import { Input, BackLink } from "../../govuk";
import SaveAndCancel from "../../common/SaveAndCancel";
import { CaseRegistrationFormContext } from "../../../common/providers/CaseRegistrationProvider";
import { getPreviousSuspectJourneyRoute } from "../../../common/utils/getSuspectJourneyRoutes";
import { formatNameUtil } from "../../../common/utils/formatNameUtil";
import { sanitizeNameText } from "../../../common/utils/sanitizeNameText";
import useErrorSummaryList from "../../../common/hooks/useErrorSummaryList";
import { useNavigate, useParams } from "react-router-dom";
import ErrorSummaryWrapper from "../../common/ErrorSummaryWrapper";
import PageContentWrapper from "../../common/PageContentWrapper";
import styles from "../index.module.scss";
import pageStyles from "./index.module.scss";

const SuspectAliasesPage = () => {
  type ErrorText = {
    errorSummaryText: string;
    inputErrorText?: string;
  };
  type FormDataErrors = {
    suspectAliasesLastNameText?: ErrorText;
  };

  const { state, dispatch } = useContext(CaseRegistrationFormContext);
  const navigate = useNavigate();
  const { suspectId } = useParams<{
    suspectId: string;
  }>() as {
    suspectId: string;
  };

  const [alias, setAlias] = useState<{
    firstName: string;
    lastName: string;
  }>({ firstName: "", lastName: "" });

  const suspectIndex = useMemo(() => {
    const index = suspectId.replace("suspect-", "");
    return Number.parseInt(index, 10);
  }, [suspectId]);

  const suspectAliases = useMemo(() => {
    const {
      formData: { suspects },
    } = state;
    const { suspectAliases = [] } = suspects[suspectIndex] || {};

    return suspectAliases;
  }, [suspectIndex, state]);

  const previousRoute = useMemo(() => {
    return getPreviousSuspectJourneyRoute(
      "suspect-add-aliases",
      state.formData.suspects[suspectIndex].suspectAdditionalDetailsCheckboxes,
      suspectIndex,
    );
  }, [state.formData.suspects, suspectIndex]);
  const [formDataErrors, setFormDataErrors] = useState<FormDataErrors>({});

  const errorSummaryProperties = useCallback(
    (errorKey: keyof FormDataErrors) => {
      if (errorKey === "suspectAliasesLastNameText") {
        return {
          children: formDataErrors[errorKey]?.errorSummaryText,
          href: "#suspect-aliases-last-name-text",
          "data-testid": "suspect-aliases-last-name-text-link",
        };
      }
      return null;
    },
    [formDataErrors],
  );
  const { errorSummaryRef, errorList, disableBtns, setDisableBtns } =
    useErrorSummaryList(formDataErrors, errorSummaryProperties);

  const validateFormData = () => {
    const errors: FormDataErrors = {};
    const { lastName = "" } = alias || {};

    if (!lastName) {
      errors.suspectAliasesLastNameText = {
        errorSummaryText: "Enter a last name",
        inputErrorText: "Enter a last name",
      };
    }

    const isValid = !Object.entries(errors).filter(([, value]) => value).length;

    setFormDataErrors(errors);
    return isValid;
  };

  const setFormValue = (fieldName: "firstName" | "lastName", value: string) => {
    if (fieldName === "firstName" || fieldName === "lastName") {
      value = sanitizeNameText(value);
    }
    setAlias((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateFormData()) return;
    setDisableBtns(true);
    const newAliases = [...suspectAliases, alias];
    dispatch({
      type: "SET_SUSPECT_FIELDS",
      payload: {
        index: suspectIndex,
        data: {
          suspectAliases: newAliases,
        },
      },
    });

    return navigate(
      `/case-registration/suspect-${suspectIndex}/suspect-aliases-summary`,
    );
  };

  const { firstName = "", lastName = "" } = alias;
  const {
    formData: { suspects },
  } = state;
  const { suspectFirstNameText = "", suspectLastNameText = "" } =
    suspects[suspectIndex] || {};

  return (
    <div className={pageStyles.caseSuspectAliasesPage}>
      <BackLink to={previousRoute}>Back</BackLink>
      <PageContentWrapper>
        <ErrorSummaryWrapper
          errorList={errorList}
          errorSummaryRef={errorSummaryRef}
          dataTestId={"suspect-aliases-error-summary"}
        />
        <form onSubmit={handleSubmit}>
          <div className={pageStyles.headingWrapper}>
            <h1>
              {`What alias does ${formatNameUtil(suspectFirstNameText, suspectLastNameText)} use?`}
            </h1>
            <span className="govuk-hint">
              You can add more aliases on the next page if needed
            </span>
          </div>
          <div className={styles.inputWrapper}>
            <Input
              key="suspect-aliases-first-name-text"
              id="suspect-aliases-first-name-text"
              data-testid="suspect-aliases-first-name-text"
              className="govuk-input--width-20"
              label={{
                children: (
                  <span className="govuk-!-font-weight-bold">First name</span>
                ),
              }}
              hint={{ children: "Leave blank if you only have one name" }}
              type="text"
              value={firstName}
              onChange={(value: string) => {
                setFormValue("firstName", value);
              }}
            />
            <Input
              key="suspect-aliases-last-name-text"
              id="suspect-aliases-last-name-text"
              data-testid="suspect-aliases-last-name-text"
              className="govuk-input--width-20"
              errorMessage={
                formDataErrors["suspectAliasesLastNameText"]
                  ? {
                      children:
                        formDataErrors["suspectAliasesLastNameText"]
                          .errorSummaryText,
                    }
                  : undefined
              }
              label={{
                children: (
                  <span className="govuk-!-font-weight-bold">Last name</span>
                ),
              }}
              type="text"
              value={lastName}
              onChange={(value: string) => {
                setFormValue("lastName", value);
              }}
            />
          </div>
          <SaveAndCancel onSave={handleSubmit} disabled={disableBtns} />
        </form>
      </PageContentWrapper>
    </div>
  );
};

export default SuspectAliasesPage;
