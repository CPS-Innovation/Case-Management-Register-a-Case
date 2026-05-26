import {
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import { BackLink, SummaryList, ErrorSummary } from "../../govuk";
import SaveAndCancel from "../../common/SaveAndCancel";
import { CaseRegistrationFormContext } from "../../../common/providers/CaseRegistrationProvider";
import {
  getCaseDetailsSummaryListRows,
  getFirstHearingSummaryRows,
  getCaseComplexityAndMonitoringCodesSummaryListRows,
  getWhosIsWorkingOnTheCaseSummaryListRows,
} from "./utils/getSummaryListRows";
import useChargesCount from "../../../common/hooks/useChargesCount";
import { getCaseRegistrationRequestData } from "../../../common/utils/getCaseRegistrationRequestData";
import { useMutation, useQuery } from "@tanstack/react-query";
import { submitCaseRegistration, validateUrn } from "../../../apis/gateway-api";
import { getPoliceUnit } from "../../../common/utils/getPoliceUnit";
import SuspectSummary from "../suspect-summary/SuspectSummary";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";

const CaseSummaryPage = () => {
  type ErrorText = {
    errorSummaryText: string;
    inputErrorText?: string;
    hasLink: boolean;
    errorIds?: string[];
  };
  type FormDataErrors = {
    urnErrorText?: ErrorText;
    genericError?: ErrorText;
  };
  const { state, dispatch } = useContext(CaseRegistrationFormContext);
  const navigate = useNavigate();
  const { chargesCount } = useChargesCount(state.formData.suspects);

  const submitCaseRegistrationMutation = useMutation({
    mutationFn: submitCaseRegistration,
  });
  const [formDataErrors, setFormDataErrors] = useState<FormDataErrors>({});
  const errorSummaryRef = useRef<HTMLInputElement>(null);

  const errorSummaryProperties = useCallback(
    (errorKey: keyof FormDataErrors) => {
      if (errorKey === "urnErrorText") {
        return {
          children: formDataErrors[errorKey]?.errorSummaryText,
          href: `#${formDataErrors[errorKey]?.errorIds?.[0]}`,
          "data-testid": "urn-error-change-link",
        };
      }
      if (errorKey === "genericError") {
        return {
          children: formDataErrors[errorKey]?.errorSummaryText,
          "data-testid": "generic-error-text",
        };
      }
      return null;
    },
    [formDataErrors],
  );

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

  const policeUnit = useMemo(
    () =>
      getPoliceUnit(
        state.formData.urnPoliceUnitText,
        state.apiData.policeUnits ?? [],
      ),
    [state.formData.urnPoliceUnitText, state.apiData.policeUnits],
  );

  const validateUrnQuery = useQuery({
    queryKey: [
      "validate-urn",
      `${state.formData.urnPoliceForceText}${state.formData.urnPoliceUnitText}${state.formData.urnUniqueReferenceText}${state.formData.urnYearReferenceText}`,
    ],
    queryFn: () =>
      validateUrn(
        `${state.formData.urnPoliceForceText}${state.formData.urnPoliceUnitText}${state.formData.urnUniqueReferenceText}${state.formData.urnYearReferenceText}`,
      ),
    enabled: false,
    retry: false,
  });

  const disableSummaryActions = useMemo(() => {
    return (
      submitCaseRegistrationMutation.isPending || validateUrnQuery.isFetching
    );
  }, [submitCaseRegistrationMutation.isPending, validateUrnQuery.isFetching]);

  useEffect(() => {
    if (submitCaseRegistrationMutation.error) {
      throw submitCaseRegistrationMutation.error;
    }
  }, [submitCaseRegistrationMutation.error]);

  useEffect(() => {
    if (validateUrnQuery.error) throw validateUrnQuery.error;
  }, [validateUrnQuery.error]);

  useEffect(() => {
    if (errorList.length) errorSummaryRef.current?.focus();
  }, [errorList]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormDataErrors({});
    const result = await validateUrnQuery.refetch();
    if (result.error) {
      return;
    }
    if (result.data) {
      setFormDataErrors((prev) => ({
        ...prev,
        urnErrorText: {
          errorSummaryText:
            "URN already exists, please change urn and try again",
          hasLink: true,
          errorIds: ["change-urn-link"],
        },
      }));
      return;
    }

    const requestData = getCaseRegistrationRequestData(
      state.formData,
      state.apiData.caseMonitoringCodes!,
      policeUnit,
    );

    submitCaseRegistrationMutation.mutate(requestData, {
      onSuccess: (data) => {
        if (data.caseId) {
          navigate("/case-registration/case-registration-confirmation");
          return;
        }

        setFormDataErrors({
          genericError: {
            errorSummaryText: "Failed to register a case, please try again",
            hasLink: false,
          },
        });
      },
    });
  };

  const caseDetailsSummaryListRows = useMemo(
    () =>
      getCaseDetailsSummaryListRows(
        dispatch,
        navigate,
        state.formData,
        disableSummaryActions,
      ),
    [dispatch, navigate, state.formData, disableSummaryActions],
  );

  const caseFirstHearingSummaryListRows = useMemo(
    () =>
      getFirstHearingSummaryRows(
        dispatch,
        navigate,
        state.formData,
        disableSummaryActions,
      ),
    [dispatch, navigate, state.formData, disableSummaryActions],
  );

  const caseComplexityAndMonitoringCodesSummaryListRows = useMemo(
    () =>
      getCaseComplexityAndMonitoringCodesSummaryListRows(
        dispatch,
        navigate,
        state.formData,
        state.apiData.caseMonitoringCodes!,
        disableSummaryActions,
      ),
    [
      dispatch,
      navigate,
      state.formData,
      state.apiData.caseMonitoringCodes,
      disableSummaryActions,
    ],
  );
  const whoseWorkingOnTheCaseSummaryListRows = useMemo(
    () =>
      getWhosIsWorkingOnTheCaseSummaryListRows(
        dispatch,
        navigate,
        state.formData,
        disableSummaryActions,
        policeUnit,
      ),
    [dispatch, navigate, state.formData, policeUnit, disableSummaryActions],
  );

  return (
    <div className={styles.caseSummaryPage}>
      {!disableSummaryActions && (
        <BackLink to="/case-registration/case-assignee">Back</BackLink>
      )}

      <h1>Check your answers before creating the case</h1>

      {!!errorList.length && (
        <div
          ref={errorSummaryRef}
          tabIndex={-1}
          className={styles.errorSummaryWrapper}
        >
          <ErrorSummary
            data-testid={"case-summary-error-summary"}
            errorList={errorList}
            titleChildren="There is a problem"
          />
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div data-testid="case-details-summary">
          <h2>Case details</h2>
          <SummaryList rows={caseDetailsSummaryListRows} />
        </div>
        {!!state.formData.suspects.length && (
          <div data-testid="case-suspect-summary">
            <h2>Suspects</h2>
            <SuspectSummary
              isCaseSummaryPage={true}
              hideActions={disableSummaryActions}
            />
          </div>
        )}
        {!!chargesCount && (
          <div data-testid="case-first-hearing-summary">
            <h2>First hearing details</h2>
            <SummaryList rows={caseFirstHearingSummaryListRows} />
          </div>
        )}
        <div data-testid="case-complexity-and-monitoring-codes-summary">
          <h2>Case complexity and monitoring codes</h2>
          <SummaryList rows={caseComplexityAndMonitoringCodesSummaryListRows} />
        </div>
        <div data-testid="case-assignee-summary">
          <h2>Working on the case</h2>
          <SummaryList rows={whoseWorkingOnTheCaseSummaryListRows} />
        </div>
        <SaveAndCancel
          onSave={handleSubmit}
          isCaseSummaryPage={true}
          disabled={disableSummaryActions}
        />
      </form>
    </div>
  );
};

export default CaseSummaryPage;
