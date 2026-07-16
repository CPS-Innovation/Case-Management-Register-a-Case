import { useEffect, useState, useContext, useCallback, useMemo } from "react";
import { Radios, BackLink } from "../../govuk";
import SaveAndCancel from "../../common/SaveAndCancel";
import { CaseRegistrationFormContext } from "../../../common/providers/CaseRegistrationProvider";
import { getReligions } from "../../../apis/gateway-api";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { formatNameUtil } from "../../../common/utils/formatNameUtil";
import useErrorSummaryList from "../../../common/hooks/useErrorSummaryList";
import useGetSuspectRoute from "../../../common/hooks/useGetSuspectRoute";
import ErrorSummaryWrapper from "../../common/ErrorSummaryWrapper";
import PageContentWrapper from "../../common/PageContentWrapper";
import styles from "../index.module.scss";

const SuspectReligionPage = () => {
  type ErrorText = {
    errorSummaryText: string;
    inputErrorText?: string;
  };
  type FormDataErrors = {
    suspectReligionRadio?: ErrorText;
  };

  const { state, dispatch } = useContext(CaseRegistrationFormContext);
  const navigate = useNavigate();
  const { suspectId } = useParams<{ suspectId: string }>() as {
    suspectId: string;
  };

  const suspectIndex = useMemo(() => {
    const index = suspectId.replace("suspect-", "");
    return Number.parseInt(index, 10);
  }, [suspectId]);

  const [religionFormData, setReligionFormData] = useState<{
    suspectReligionRadio: { shortCode: string; description: string };
  }>({
    suspectReligionRadio: state.formData.suspects[suspectIndex]
      .suspectReligionRadio || {
      shortCode: "",
      description: "",
    },
  });

  const {
    data: religionsData,
    isLoading: isReligionsLoading,
    error: religionsError,
  } = useQuery({
    queryKey: ["religion"],
    queryFn: () => getReligions(),
    enabled: !state.apiData.suspectReligions,
    retry: false,
  });

  useEffect(() => {
    if (religionsError) throw religionsError;
  }, [religionsError]);

  const { previousRoute, nextRoute } = useGetSuspectRoute(
    "suspect-religion",
    state.formData.suspects[suspectIndex].suspectAdditionalDetailsCheckboxes,
    suspectIndex,
    state.formData.suspects[suspectIndex].suspectAliases.length > 0,
  );

  const [religionFormDataErrors, setReligionFormDataErrors] =
    useState<FormDataErrors>({});

  const errorSummaryProperties = useCallback(
    (errorKey: keyof FormDataErrors) => {
      if (errorKey === "suspectReligionRadio") {
        return {
          children: religionFormDataErrors[errorKey]?.errorSummaryText,
          href: "#suspect-religion-radio-0",
          "data-testid": "suspect-religion-radio-link",
        };
      }

      return null;
    },
    [religionFormDataErrors],
  );
  const { errorSummaryRef, errorList, disableBtns, setDisableBtns } =
    useErrorSummaryList(religionFormDataErrors, errorSummaryProperties);
  const validateReligionFormData = () => {
    const errors: FormDataErrors = {};

    const { suspectReligionRadio = { shortCode: null, description: "" } } =
      religionFormData;

    if (!suspectReligionRadio.shortCode) {
      errors.suspectReligionRadio = {
        errorSummaryText: "Select the defendant's religion",
        inputErrorText: "Select the defendant's religion",
      };
    }

    const isValid = !Object.entries(errors).filter(([, value]) => value).length;

    setReligionFormDataErrors(errors);
    return isValid;
  };

  useEffect(() => {
    if (!isReligionsLoading && religionsData) {
      dispatch({
        type: "SET_CASE_SUSPECT_RELIGIONS",
        payload: {
          suspectReligions: religionsData,
        },
      });
    }
  }, [religionsData, dispatch, isReligionsLoading]);

  const religionItems = useMemo(() => {
    if (!state.apiData.suspectReligions) return [];
    return state.apiData.suspectReligions.map((religion, index) => ({
      id: `suspect-religion-radio-${index}`,
      children: religion.description,
      value: religion.shortCode,
      "data-testid": `suspect-religion-radio-${index}`,
    }));
  }, [state.apiData.suspectReligions]);

  const setFormValue = (value: string) => {
    const selectedReligion = state.apiData.suspectReligions?.find(
      (religion) => religion.shortCode === value,
    );
    if (selectedReligion) {
      setReligionFormData({
        ...religionFormData,
        suspectReligionRadio: selectedReligion,
      });
    }
  };

  const handleSubmitReligion = (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateReligionFormData()) return;
    setDisableBtns(true);
    dispatch({
      type: "SET_SUSPECT_FIELDS",
      payload: {
        index: suspectIndex,
        data: religionFormData,
      },
    });

    return navigate(nextRoute);
  };

  const {
    formData: { suspects },
  } = state;

  const { suspectFirstNameText = "", suspectLastNameText = "" } =
    suspects[suspectIndex] || {};

  return (
    <div>
      <BackLink to={previousRoute}>Back</BackLink>
      <PageContentWrapper>
        <ErrorSummaryWrapper
          errorList={errorList}
          errorSummaryRef={errorSummaryRef}
          dataTestId={"suspect-religion-error-summary"}
        />
        <form onSubmit={handleSubmitReligion}>
          <div className={styles.inputWrapper}>
            <Radios
              fieldset={{
                legend: {
                  children: (
                    <h1>
                      {`What is ${formatNameUtil(suspectFirstNameText, suspectLastNameText)}'s
                    religion?`}
                    </h1>
                  ),
                },
              }}
              errorMessage={
                religionFormDataErrors["suspectReligionRadio"]
                  ? {
                      children:
                        religionFormDataErrors["suspectReligionRadio"]
                          .inputErrorText,
                    }
                  : undefined
              }
              items={religionItems}
              value={religionFormData.suspectReligionRadio.shortCode || ""}
              onChange={(value) => {
                if (value) setFormValue(value);
              }}
            ></Radios>
          </div>
          <SaveAndCancel onSave={handleSubmitReligion} disabled={disableBtns} />
        </form>
      </PageContentWrapper>
    </div>
  );
};

export default SuspectReligionPage;
