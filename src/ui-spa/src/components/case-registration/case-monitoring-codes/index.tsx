import { useEffect, useState, useContext, useCallback, useMemo } from "react";
import { Checkboxes, ErrorSummary, BackLink } from "../../govuk";
import SaveAndCancel from "../../common/SaveAndCancel";
import { CaseRegistrationFormContext } from "../../../common/providers/CaseRegistrationProvider";
import { getCaseMonitoringCodes } from "../../../apis/gateway-api";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { type CaseMonitoringCodes } from "../../../schemas";
import { isMonitoringCodeOptional } from "../../../common/utils/isMonitoringCodeOptional";
import useChargesCount from "../../../common/hooks/useChargesCount";
import useErrorSummaryList from "../../../common/hooks/useErrorSummaryList";
import { PRE_CHARGE_DECISION_CODE } from "../../../common/constants/general";
import pageStyles from "./index.module.scss";
import styles from "../index.module.scss";

const CaseMonitoringCodesPage = () => {
  type ErrorText = {
    errorSummaryText: string;
    inputErrorText?: string;
    hasLink: boolean;
  };
  type FormDataErrors = {
    caseMonitoringCodesCheckboxes?: ErrorText;
  };

  const { state, dispatch } = useContext(CaseRegistrationFormContext);
  const navigate = useNavigate();
  const { chargesCount } = useChargesCount(state.formData.suspects);

  const [formData, setFormData] = useState<{
    caseMonitoringCodesCheckboxes: string[];
  }>({
    caseMonitoringCodesCheckboxes:
      state.formData.caseMonitoringCodesCheckboxes || [],
  });

  const {
    data: caseMonitoringCodesData,
    isLoading: isCaseMonitoringCodesLoading,
    error: caseMonitoringCodesError,
  } = useQuery({
    queryKey: ["case-monitoring-codes"],
    queryFn: () => getCaseMonitoringCodes(),
    enabled: !state.apiData.caseMonitoringCodes,
    retry: false,
  });

  const isOptional = useMemo(() => {
    return isMonitoringCodeOptional(state.formData.suspects);
  }, [state.formData.suspects]);

  const [formDataErrors, setFormDataErrors] = useState<FormDataErrors>({});

  const errorSummaryProperties = useCallback(
    (errorKey: keyof FormDataErrors) => {
      if (errorKey === "caseMonitoringCodesCheckboxes") {
        return {
          children: formDataErrors[errorKey]?.errorSummaryText,
          href: "#case-monitoring-codes",
          "data-testid": "case-monitoring-codes-link",
        };
      }
      return null;
    },
    [formDataErrors],
  );
  const { errorSummaryRef, errorList, disableBtns, setDisableBtns } =
    useErrorSummaryList(formDataErrors, errorSummaryProperties);

  const caseMonitoringCodes = useMemo(() => {
    if (state.apiData.caseMonitoringCodes) {
      return state.apiData.caseMonitoringCodes.sort((a, b) =>
        a.description.localeCompare(b.description),
      );
    }
    return [] as CaseMonitoringCodes;
  }, [state.apiData.caseMonitoringCodes]);

  const previousRoute = useMemo(() => {
    if (state.formData.navigation.fromCaseSummaryPage) {
      return "/case-registration/case-summary";
    }
    if (chargesCount) {
      return "/case-registration/first-hearing";
    }
    if (state.formData.suspects.length > 0) {
      return "/case-registration/want-to-add-charges";
    }
    return "/case-registration/case-details";
  }, [
    chargesCount,
    state.formData.suspects.length,
    state.formData.navigation.fromCaseSummaryPage,
  ]);

  useEffect(() => {
    if (caseMonitoringCodesError) throw caseMonitoringCodesError;
  }, [caseMonitoringCodesError]);

  useEffect(() => {
    if (!isCaseMonitoringCodesLoading && caseMonitoringCodesData) {
      dispatch({
        type: "SET_CASE_MONITORING_CODES",
        payload: {
          caseMonitoringCodes: caseMonitoringCodesData,
        },
      });
    }
  }, [caseMonitoringCodesData, dispatch, isCaseMonitoringCodesLoading]);

  useEffect(() => {
    if (!isOptional && !state.formData.caseMonitoringCodesCheckboxes?.length) {
      setFormData({
        caseMonitoringCodesCheckboxes: [
          ...formData.caseMonitoringCodesCheckboxes,
          PRE_CHARGE_DECISION_CODE,
        ],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setFormValue = (value: string) => {
    const currentValues = formData.caseMonitoringCodesCheckboxes ?? [];
    let newValues: string[] = [];
    if (currentValues.includes(value)) {
      newValues = currentValues.filter((item) => item !== value);
    } else {
      newValues = [...currentValues, value];
    }
    setFormData({
      caseMonitoringCodesCheckboxes: newValues,
    });
  };

  const validateFormData = () => {
    const errors: FormDataErrors = {};

    const { caseMonitoringCodesCheckboxes } = formData;

    if (!isOptional && !caseMonitoringCodesCheckboxes?.length) {
      errors.caseMonitoringCodesCheckboxes = {
        errorSummaryText: "Please select at least one monitoring code",
        inputErrorText: "Please select an option",
        hasLink: true,
      };
    }

    const isValid = !Object.entries(errors).filter(([, value]) => value).length;

    setFormDataErrors(errors);
    return isValid;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateFormData()) return;
    setDisableBtns(true);
    dispatch({
      type: "SET_FIELDS",
      payload: { data: { ...formData } },
    });
    if (
      state.formData.navigation.fromCaseSummaryPage ||
      state.formData.navigation.changeCaseSuspects ||
      state.formData.navigation.changeCaseCharges
    ) {
      dispatch({
        type: "SET_NAVIGATION_DATA",
        payload: {
          fromCaseSummaryPage: false,
          changeCaseSuspects: false,
          changeCaseCharges: false,
        },
      });
      navigate("/case-registration/case-summary");
      return;
    }

    return navigate("/case-registration/case-assignee");
  };

  const handleBackLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (previousRoute === "/case-registration/case-summary") {
      dispatch({
        type: "SET_NAVIGATION_DATA",
        payload: { fromCaseSummaryPage: false },
      });
    }
    navigate(previousRoute);
  };

  return (
    <div className={pageStyles.caseMonitoringCodesPage}>
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
            data-testid={"monitoring-codes-error-summary"}
            errorList={errorList}
            titleChildren="There is a problem"
          />
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div
          className={pageStyles.inputWrapper}
          style={
            {
              ["--rows"]: Math.ceil(caseMonitoringCodes.length / 2),
            } as React.CSSProperties
          }
        >
          <Checkboxes
            fieldset={{
              legend: {
                children: <h1>Add monitoring codes</h1>,
              },
            }}
            hint={
              isOptional
                ? {
                    children:
                      "These are optional. You can continue without adding monitoring codes.",
                  }
                : undefined
            }
            errorMessage={
              formDataErrors["caseMonitoringCodesCheckboxes"]
                ? {
                    children:
                      formDataErrors["caseMonitoringCodesCheckboxes"]
                        .errorSummaryText,
                  }
                : undefined
            }
            items={caseMonitoringCodes.map((monitoringCodes, index) => ({
              id: `case-monitoring-codes-${index}`,
              children: monitoringCodes.display,
              value: monitoringCodes.code.toString(),
              "data-testid": `case-monitoring-codes-${index}`,
              checked: formData.caseMonitoringCodesCheckboxes?.includes(
                monitoringCodes.code.toString(),
              ),
              disabled: !isOptional && monitoringCodes.code === "CSEA",
            }))}
            onChange={(event) => {
              const { value } = event.target;
              if (value) setFormValue(value);
            }}
          />
        </div>
        <SaveAndCancel onSave={handleSubmit} disabled={disableBtns} />
      </form>
    </div>
  );
};

export default CaseMonitoringCodesPage;
