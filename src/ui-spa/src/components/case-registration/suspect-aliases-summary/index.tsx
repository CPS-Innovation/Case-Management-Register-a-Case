import {
  useRef,
  useEffect,
  useState,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { Radios, ErrorSummary, BackLink, SummaryList } from "../../govuk";
import SaveAndCancel from "../../common/SaveAndCancel";
import { CaseRegistrationFormContext } from "../../../common/providers/CaseRegistrationProvider";
import {
  getNextSuspectJourneyRoute,
  getPreviousSuspectJourneyRoute,
} from "../../../common/utils/getSuspectJourneyRoutes";
import { formatNameUtil } from "../../../common/utils/formatNameUtil";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../index.module.scss";
import pageStyles from "./index.module.scss";

const SuspectAliasesSummaryPage = () => {
  type ErrorText = {
    errorSummaryText: string;
    inputErrorText?: string;
  };
  type FormDataErrors = {
    addMoreAliasesRadio?: ErrorText;
  };
  const errorSummaryRef = useRef<HTMLInputElement>(null);
  const { state, dispatch } = useContext(CaseRegistrationFormContext);
  const navigate = useNavigate();
  const { suspectId } = useParams<{
    suspectId: string;
  }>() as {
    suspectId: string;
  };

  const [addMoreAliasesRadio, setAddMoreAliasesRadio] = useState<string>("");
  const suspectIndex = useMemo(() => {
    const index = suspectId.replace("suspect-", "");
    return Number.parseInt(index, 10);
  }, [suspectId]);

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
      if (errorKey === "addMoreAliasesRadio") {
        return {
          children: formDataErrors[errorKey]?.errorSummaryText,
          href: "#suspect-add-more-aliases-radio-yes",
          "data-testid": "suspect-add-more-aliases-radio-link",
        };
      }
      return null;
    },
    [formDataErrors],
  );

  const validateFormData = () => {
    const errors: FormDataErrors = {};

    if (!addMoreAliasesRadio) {
      errors.addMoreAliasesRadio = {
        errorSummaryText: suspectAliases.length
          ? "Select if you need to add another alias"
          : "Select if you need to add an alias",
        inputErrorText: suspectAliases.length
          ? "Select if you need to add another alias"
          : "Select if you need to add an alias",
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

  const getAliasesSummaryListRows = (
    suspectAliases: { firstName: string; lastName: string }[],
  ) => {
    const rows = suspectAliases.map((alias, index) => ({
      key: {
        children: <p>{formatNameUtil(alias.firstName, alias.lastName)}</p>,
      },
      value: undefined,
      actions: {
        items: [
          {
            children: <span>Remove</span>,
            to: "#",
            className: "govuk-link--no-visited-state",
            visuallyHiddenText: "remove a suspect alias",
            role: "button",
            onClick: () => handleRemoveAlias(index),
          },
        ],
      },
    }));

    return rows;
  };
  const handleRemoveAlias = (index: number) => {
    const {
      formData: { suspects },
    } = state;
    const suspectAliases = suspects[suspectIndex]?.suspectAliases || [];
    const newAliases = suspectAliases.filter((_, i) => i !== index);
    dispatch({
      type: "SET_SUSPECT_FIELDS",
      payload: {
        index: suspectIndex,
        data: {
          suspectAliases: newAliases,
        },
      },
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateFormData()) return;

    if (addMoreAliasesRadio === "yes") {
      return navigate(
        `/case-registration/suspect-${suspectIndex}/suspect-add-aliases`,
      );
    }

    const nextRoute = getNextSuspectJourneyRoute(
      "suspect-add-aliases",
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
  const suspectAliases = suspects[suspectIndex]?.suspectAliases || [];

  return (
    <div className={pageStyles.caseSuspectAliasesSummaryPage}>
      <BackLink to={previousRoute}>Back</BackLink>
      {!!errorList.length && (
        <div
          ref={errorSummaryRef}
          tabIndex={-1}
          className={styles.errorSummaryWrapper}
        >
          <ErrorSummary
            data-testid={"suspect-aliases-summary-error-summary"}
            errorList={errorList}
            titleChildren="There is a problem"
          />
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <h1>
          {`Aliases for ${formatNameUtil(suspectFirstNameText, suspectLastNameText)}`}
        </h1>
        {!!suspectAliases.length && (
          <div className={pageStyles.summaryListWrapper}>
            <SummaryList
              data-testid="suspect-aliases-summary-list"
              rows={getAliasesSummaryListRows(suspectAliases)}
            />
          </div>
        )}
        {!suspectAliases.length && (
          <div
            className={pageStyles.noAliasesText}
            data-testid="suspect-no-aliases"
          >
            <span>There are no aliases</span>
          </div>
        )}
        <div className={styles.inputWrapper}>
          <Radios
            className="govuk-radios--inline"
            fieldset={{
              legend: {
                children: (
                  <>
                    {suspectAliases.length ? (
                      <span className="govuk-!-font-weight-bold">
                        {`Do you need to add another alias for ${formatNameUtil(
                          suspectFirstNameText,
                          suspectLastNameText,
                        )}?`}
                      </span>
                    ) : (
                      <span className="govuk-!-font-weight-bold">
                        {`Do you need to add an alias for ${formatNameUtil(
                          suspectFirstNameText,
                          suspectLastNameText,
                        )}?`}
                      </span>
                    )}
                  </>
                ),
              },
            }}
            errorMessage={
              formDataErrors["addMoreAliasesRadio"]
                ? {
                    children:
                      formDataErrors["addMoreAliasesRadio"].inputErrorText,
                  }
                : undefined
            }
            items={[
              {
                id: `suspect-add-more-aliases-radio-yes`,
                children: "Yes",
                value: "yes",
                "data-testid": `suspect-add-more-aliases-radio-yes`,
              },
              {
                id: `suspect-add-more-aliases-radio-no`,
                children: "No",
                value: "no",
                "data-testid": `suspect-add-more-aliases-radio-no`,
              },
            ]}
            value={addMoreAliasesRadio}
            onChange={(value) => {
              if (value) setAddMoreAliasesRadio(value);
            }}
          ></Radios>
        </div>
        <SaveAndCancel onSave={handleSubmit} />
      </form>
    </div>
  );
};

export default SuspectAliasesSummaryPage;
