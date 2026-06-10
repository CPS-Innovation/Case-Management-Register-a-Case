import { useEffect, useState, useContext, useCallback, useMemo } from "react";
import { Radios, BackLink } from "../../govuk";
import SaveAndCancel from "../../common/SaveAndCancel";
import { CaseRegistrationFormContext } from "../../../common/providers/CaseRegistrationProvider";
import { getGenders } from "../../../apis/gateway-api";
import { useQuery } from "@tanstack/react-query";
import { formatNameUtil } from "../../../common/utils/formatNameUtil";
import { useNavigate, useParams } from "react-router-dom";
import useErrorSummaryList from "../../../common/hooks/useErrorSummaryList";
import useGetSuspectRoute from "../../../common/hooks/useGetSuspectRoute";
import ErrorSummaryWrapper from "../../common/ErrorSummaryWrapper";
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

  const [formData, setFormData] = useState<{
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

  const [formDataErrors, setFormDataErrors] = useState<FormDataErrors>({});

  const errorSummaryProperties = useCallback(
    (errorKey: keyof FormDataErrors) => {
      if (errorKey === "suspectGenderRadio") {
        return {
          children: formDataErrors[errorKey]?.errorSummaryText,
          href: "#suspect-gender-radio-0",
          "data-testid": "suspect-gender-radio-link",
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
    const { suspectGenderRadio = { shortCode: null, description: "" } } =
      formData;

    if (!suspectGenderRadio.shortCode) {
      errors.suspectGenderRadio = {
        errorSummaryText: "Select a gender",
        inputErrorText: "Select a gender",
      };
    }

    const isValid = !Object.entries(errors).filter(([, value]) => value).length;

    setFormDataErrors(errors);
    return isValid;
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
      setFormData({
        ...formData,
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
        data: formData,
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

      <ErrorSummaryWrapper
        errorList={errorList}
        errorSummaryRef={errorSummaryRef}
        dataTestId="suspect-gender-error-summary"
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
              formDataErrors["suspectGenderRadio"]
                ? {
                    children:
                      formDataErrors["suspectGenderRadio"].inputErrorText,
                  }
                : undefined
            }
            items={genderItems}
            value={formData.suspectGenderRadio.shortCode || ""}
            onChange={(value) => {
              if (value) setFormValue(value);
            }}
          ></Radios>
        </div>
        <SaveAndCancel onSave={handleSubmit} disabled={disableBtns} />
      </form>
    </div>
  );
};

export default SuspectGenderPage;
