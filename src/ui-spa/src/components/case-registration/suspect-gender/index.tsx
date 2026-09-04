import { useEffect, useState, useContext, useCallback, useMemo } from "react";
import { Radios, BackLink } from "../../govuk";
import SaveAndCancel from "../../common/SaveAndCancel";
import { CaseRegistrationFormContext } from "../../../common/providers/CaseRegistrationProvider";
import { getGenders } from "../../../apis/gateway-api";
import { useQuery } from "@tanstack/react-query";
import { formatNameUtil } from "../../../common/utils/formatNameUtil";
import { useNavigate, useParams } from "react-router";
import useErrorSummaryList from "../../../common/hooks/useErrorSummaryList";
import useGetSuspectRoute from "../../../common/hooks/useGetSuspectRoute";
import ErrorSummaryWrapper from "../../common/ErrorSummaryWrapper";
import PageContentWrapper from "../../common/PageContentWrapper";
import styles from "../index.module.scss";

const SuspectGenderPage = () => {
  type ErrorText = {
    errorSummaryText: string;
    inputErrorText?: string;
  };
  type FormDataErrors = {
    suspectGenderRadio?: ErrorText;
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
  const [showSkip, setShowSkip] = useState(false);

  const [genderData, setGenderData] = useState<{
    suspectGenderRadio: { shortCode: string; description: string };
  }>({
    suspectGenderRadio: state.formData.suspects[suspectIndex]
      .suspectGenderRadio || {
      shortCode: "",
      description: "",
    },
  });

  const {
    data: gendersData,
    isLoading: isGendersLoading,
    error: gendersError,
  } = useQuery({
    queryKey: ["genders"],
    queryFn: () => getGenders(),
    enabled: !state.apiData.suspectGenders,
    retry: false,
  });

  useEffect(() => {
    if (gendersError) throw gendersError;
  }, [gendersError]);

  const { previousRoute, nextRoute } = useGetSuspectRoute(
    "suspect-gender",
    state.formData.suspects[suspectIndex].suspectAdditionalDetailsCheckboxes,
    suspectIndex,
    state.formData.suspects[suspectIndex].suspectAliases.length > 0,
  );

  const [genderFormDataErrors, setGenderFormDataErrors] =
    useState<FormDataErrors>({});

  const errorSummaryProperties = useCallback(
    (errorKey: keyof FormDataErrors) => {
      if (errorKey === "suspectGenderRadio") {
        return {
          children: genderFormDataErrors[errorKey]?.errorSummaryText,
          href: "#suspect-gender-radio-0",
          "data-testid": "suspect-gender-radio-link",
        };
      }

      return null;
    },
    [genderFormDataErrors],
  );
  const { errorSummaryRef, errorList, disableBtns, setDisableBtns } =
    useErrorSummaryList(genderFormDataErrors, errorSummaryProperties);
  const validateFormData = () => {
    const errors: FormDataErrors = {};
    const { suspectGenderRadio = { shortCode: null, description: "" } } =
      genderData;

    if (!suspectGenderRadio.shortCode) {
      errors.suspectGenderRadio = {
        errorSummaryText: "Select a gender",
        inputErrorText: "Select a gender",
      };
      setGenderFormDataErrors(errors);
      setShowSkip(true);
      return false;
    }
    if (showSkip) {
      setShowSkip(false);
    }

    return true;
  };

  useEffect(() => {
    if (!isGendersLoading && gendersData) {
      dispatch({
        type: "SET_CASE_SUSPECT_GENDERS",
        payload: {
          suspectGenders: gendersData,
        },
      });
    }
  }, [gendersData, dispatch, isGendersLoading]);

  const genderItems = useMemo(() => {
    if (!state.apiData.suspectGenders) return [];
    return state.apiData.suspectGenders
      .filter(
        (gender) =>
          gender.description != "Other" && gender.description != "Unknown",
      )
      .map((gender, index) => ({
        id: `suspect-gender-radio-${index}`,
        children: gender.description,
        value: gender.shortCode,
        "data-testid": `suspect-gender-radio-${index}`,
      }));
  }, [state.apiData.suspectGenders]);

  const setFormValue = (value: string) => {
    const selectedGender = state.apiData.suspectGenders?.find(
      (gender) => gender.shortCode === value,
    );
    if (selectedGender) {
      setGenderData({
        ...genderData,
        suspectGenderRadio: selectedGender,
      });
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateFormData()) return;
    setDisableBtns(true);

    dispatch({
      type: "SET_SUSPECT_FIELDS",
      payload: {
        index: suspectIndex,
        data: genderData,
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
          dataTestId="suspect-gender-error-summary"
          showSkip={showSkip}
          nextRoute={nextRoute}
          skipText="I do not have the gender"
        />
        <form onSubmit={handleSubmit}>
          <div className={styles.inputWrapper}>
            <Radios
              fieldset={{
                legend: {
                  children: (
                    <h1>
                      {`What is ${formatNameUtil(suspectFirstNameText, suspectLastNameText)}'s gender?`}
                    </h1>
                  ),
                },
              }}
              errorMessage={
                genderFormDataErrors["suspectGenderRadio"]
                  ? {
                      children:
                        genderFormDataErrors["suspectGenderRadio"]
                          .inputErrorText,
                    }
                  : undefined
              }
              items={genderItems}
              value={genderData.suspectGenderRadio.shortCode || ""}
              onChange={(value) => {
                if (value) setFormValue(value);
              }}
            ></Radios>
          </div>
          <SaveAndCancel onSave={handleSubmit} disabled={disableBtns} />
        </form>
      </PageContentWrapper>
    </div>
  );
};

export default SuspectGenderPage;
