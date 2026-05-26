import {
  useContext,
  useMemo,
  useRef,
  useCallback,
  useState,
  useEffect,
} from "react";
import { AutoComplete, BackLink, ErrorSummary } from "../../govuk";
import SaveAndCancel from "../../common/SaveAndCancel";
import { CaseRegistrationFormContext } from "../../../common/providers/CaseRegistrationProvider";
import { getAreasOrDivisions } from "../../../common/utils/getAreasOrDivisions";
import { getSelectedUnit } from "../../../common/utils/getSelectedUnit";
import { useNavigate } from "react-router-dom";
import styles from "../index.module.scss";
import pageStyles from "./index.module.scss";

const CaseAreasPage = () => {
  type ErrorText = {
    errorSummaryText: string;
    inputErrorText?: string;
    hasLink: boolean;
  };
  type FormDataErrors = {
    areaOrDivisionText?: ErrorText;
  };
  const errorSummaryRef = useRef<HTMLInputElement>(null);
  const { state, dispatch } = useContext(CaseRegistrationFormContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<{
    areaOrDivisionText: { id: number | null; description: string };
  }>({
    areaOrDivisionText: state.formData.areaOrDivisionText || {
      id: null,
      description: "",
    },
  });

  const [formDataErrors, setFormDataErrors] = useState<FormDataErrors>({});

  const previousRoute = useMemo(() => {
    if (state.formData.navigation.changeCaseArea) {
      return "/case-registration/case-summary";
    }

    return "/case-registration";
  }, [state.formData.navigation.changeCaseArea]);

  const errorSummaryProperties = useCallback(
    (errorKey: keyof FormDataErrors) => {
      if (errorKey === "areaOrDivisionText") {
        return {
          children: formDataErrors[errorKey]?.errorSummaryText,
          href: "#area-or-division-text",
          "data-testid": "area-or-division-text-link",
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

  const areas = useMemo(() => {
    if (state.apiData.areasAndRegisteringUnits) {
      return getAreasOrDivisions(state.apiData.areasAndRegisteringUnits);
    }
    return [];
  }, [state.apiData.areasAndRegisteringUnits]);

  useEffect(() => {
    if (errorList.length) errorSummaryRef.current?.focus();
  }, [errorList]);

  const validateFormData = (
    areas: {
      id: number;
      description: string;
    }[],
    inputAreaValue: string,
  ) => {
    const errors: FormDataErrors = {};

    if (!inputAreaValue) {
      errors.areaOrDivisionText = {
        errorSummaryText: "Select a division or area",
        inputErrorText: "Select a division or area",
        hasLink: true,
      };
    } else if (
      areas.findIndex((area) => area.description === inputAreaValue) === -1
    ) {
      errors.areaOrDivisionText = {
        errorSummaryText: "Select a valid division or area",
        hasLink: true,
      };
    }

    const isValid = !Object.entries(errors).filter(([, value]) => value).length;

    setFormDataErrors(errors);
    return isValid;
  };

  const areaSuggests = (
    query: string,
    populateResults: (results: string[]) => void,
  ) => {
    const results = areas || [];
    const filteredResults = results
      .filter((result) =>
        result.description.toLowerCase().includes(query.toLowerCase()),
      )
      .map((r) => r.description);
    populateResults(filteredResults);
  };

  const handleAreaConfirm = (value: string) => {
    const { id, description } = getSelectedUnit(areas, value);
    setFormData({ areaOrDivisionText: { id, description } });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const input = document.getElementById(
      "area-or-division-text",
    ) as HTMLInputElement | null;
    const inputValue = input?.value ?? "";
    let formValue = formData;
    if (inputValue !== formData.areaOrDivisionText.description) {
      const { id, description } = getSelectedUnit(areas, inputValue);
      setFormData({ areaOrDivisionText: { id, description } });
      formValue = { areaOrDivisionText: { id, description } };
    }

    if (!validateFormData(areas, inputValue)) return;

    if (
      state.formData.navigation.changeCaseArea &&
      state.formData.areaOrDivisionText.id !== formValue.areaOrDivisionText?.id
    ) {
      navigate("/case-registration/change-area-confirmation", {
        state: {
          areaOrDivisionText: formValue.areaOrDivisionText,
        },
      });
      return;
    }

    if (state.formData.navigation.changeCaseArea) {
      dispatch({
        type: "SET_NAVIGATION_DATA",
        payload: { changeCaseArea: false },
      });
      navigate("/case-registration/case-summary");
      return;
    }

    if (
      state.formData.areaOrDivisionText.id !== formValue.areaOrDivisionText?.id
    ) {
      dispatch({
        type: "RESET_AREA_DEPENDENT_FIELDS",
      });
    }

    dispatch({
      type: "SET_FIELDS",
      payload: {
        data: {
          ...formValue,
        },
      },
    });
    return navigate("/case-registration/case-details");
  };

  const handleBackLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (previousRoute === "/case-registration/case-summary") {
      dispatch({
        type: "SET_NAVIGATION_DATA",
        payload: { changeCaseArea: false },
      });
    }
    navigate(previousRoute);
  };
  return (
    <div className={pageStyles.caseAreasPage}>
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
            data-testid={"case-area-error-summary"}
            errorList={errorList}
            titleChildren="There is a problem"
          />
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className={styles.inputWrapper}>
          <AutoComplete
            id="area-or-division-text"
            inputClasses={"govuk-input--error"}
            label={{ children: <h1>What is the division or area?</h1> }}
            source={areaSuggests}
            confirmOnBlur={false}
            onConfirm={handleAreaConfirm}
            defaultValue={formData.areaOrDivisionText.description}
            errorMessage={
              formDataErrors["areaOrDivisionText"]
                ? formDataErrors["areaOrDivisionText"].inputErrorText
                : undefined
            }
          />
        </div>

        <SaveAndCancel onSave={handleSubmit} />
      </form>
    </div>
  );
};

export default CaseAreasPage;
