import {
  useContext,
  useMemo,
  useRef,
  useCallback,
  useState,
  useEffect,
} from "react";
import { AutoComplete, BackLink, ErrorSummary, Input } from "../../govuk";
import SaveAndCancel from "../../common/SaveAndCancel";
import { CaseRegistrationFormContext } from "../../../common/providers/CaseRegistrationProvider";
import { getRegisteringUnits } from "../../../common/utils/getRegisteringUnits";
import { getWitnessCareUnits } from "../../../common/utils/getWitnessCareUnits";
import { useIsAreaSensitive } from "../../../common/hooks/useIsAreaSensitive";
import { getSelectedUnit } from "../../../common/utils/getSelectedUnit";
import { useQuery } from "@tanstack/react-query";
import { validateUrn } from "../../../apis/gateway-api";
import { useNavigate } from "react-router-dom";
import styles from "../index.module.scss";
import pageStyles from "./index.module.scss";

const CaseDetailsPage = () => {
  type ErrorText = {
    errorSummaryText: string;
    inputErrorText?: string;
    hasLink: boolean;
    errorIds?: string[];
  };
  type FormDataErrors = {
    urnErrorText?: ErrorText;
    registeringUnitErrorText?: ErrorText;
    witnessCareUnitErrorText?: ErrorText;
  };

  const errorSummaryRef = useRef<HTMLInputElement>(null);
  const { state, dispatch } = useContext(CaseRegistrationFormContext);
  const navigate = useNavigate();
  const isAreaSensitive = useIsAreaSensitive();

  const [formData, setFormData] = useState<{
    urnPoliceForceText: string;
    urnPoliceUnitText: string;
    urnUniqueReferenceText: string;
    urnYearReferenceText: string;
    registeringUnitText: { id: number | null; description: string };
    witnessCareUnitText: { id: number | null; description: string };
  }>({
    urnPoliceForceText: state.formData.urnPoliceForceText || "",
    urnPoliceUnitText: state.formData.urnPoliceUnitText || "",
    urnUniqueReferenceText: state.formData.urnUniqueReferenceText || "",
    urnYearReferenceText: state.formData.urnYearReferenceText || "",
    registeringUnitText: state.formData.registeringUnitText || {
      id: null,
      description: "",
    },
    witnessCareUnitText: state.formData.witnessCareUnitText || {
      id: null,
      description: "",
    },
  });
  const [formDataErrors, setFormDataErrors] = useState<FormDataErrors>({});

  const previousRoute = useMemo(() => {
    if (state.formData.navigation.changeCaseDetails) {
      return "/case-registration/case-summary";
    }
    if (isAreaSensitive) return "/case-registration";

    return "/case-registration/areas";
  }, [state.formData.navigation.changeCaseDetails, isAreaSensitive]);

  const { refetch: refetchValidateUrn, error: validateUrnError } = useQuery({
    queryKey: ["validate-urn"],
    queryFn: () =>
      validateUrn(
        `${formData.urnPoliceForceText}${formData.urnPoliceUnitText}${formData.urnUniqueReferenceText}${formData.urnYearReferenceText}`,
      ),
    enabled: false,
    retry: false,
  });
  const errorSummaryProperties = useCallback(
    (errorKey: keyof FormDataErrors) => {
      switch (errorKey) {
        case "urnErrorText":
          return {
            children: formDataErrors[errorKey]?.errorSummaryText,
            href: `#${formDataErrors[errorKey]?.errorIds?.[0]}`,
            "data-testid": "urn-error-text-link",
          };
        case "registeringUnitErrorText":
          return {
            children: formDataErrors[errorKey]?.errorSummaryText,
            href: "#registering-unit-text",
            "data-testid": "registering-unit-error-text-link",
          };
        case "witnessCareUnitErrorText":
          return {
            children: formDataErrors[errorKey]?.errorSummaryText,
            href: "#witness-care-unit-text",
            "data-testid": "witness-care-unit-error-text-link",
          };
        default:
          return null;
      }
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

  useEffect(() => {
    if (validateUrnError) throw validateUrnError;
  }, [validateUrnError]);

  useEffect(() => {
    if (errorList.length) errorSummaryRef.current?.focus();
  }, [errorList]);

  const registeringUnits = useMemo(() => {
    if (state.apiData.areasAndRegisteringUnits) {
      return getRegisteringUnits(
        state.apiData.areasAndRegisteringUnits,
        state.formData.areaOrDivisionText.description,
      );
    }
    return [] as { id: number; description: string }[];
  }, [
    state.apiData.areasAndRegisteringUnits,
    state.formData.areaOrDivisionText,
  ]);

  const witnessCareUnits = useMemo(() => {
    if (state.apiData.areasAndWitnessCareUnits) {
      return getWitnessCareUnits(
        state.apiData.areasAndWitnessCareUnits,
        state.formData.areaOrDivisionText.description,
      );
    }
    return [] as { id: number; description: string }[];
  }, [
    state.apiData.areasAndWitnessCareUnits,
    state.formData.areaOrDivisionText,
  ]);
  const registeringUnitSuggest = (
    query: string,
    populateResults: (results: string[]) => void,
  ) => {
    const filteredResults = registeringUnits
      .filter((result) =>
        result.description.toLowerCase().includes(query.toLowerCase()),
      )
      .map((r) => r.description);
    populateResults(filteredResults);
  };

  const witnessCareUnitSuggest = (
    query: string,
    populateResults: (results: string[]) => void,
  ) => {
    const filteredResults = witnessCareUnits
      .filter((result) =>
        result.description.toLowerCase().includes(query.toLowerCase()),
      )
      .map((r) => r.description);
    populateResults(filteredResults);
  };

  const handleWitnessCareUnitConfirm = (value: string) => {
    const { id, description } = getSelectedUnit(witnessCareUnits, value);
    setFormData((prev) => ({
      ...prev,
      witnessCareUnitText: { id, description },
    }));
  };

  const handleRegisteringUnitConfirm = (value: string) => {
    const { id, description } = getSelectedUnit(registeringUnits, value);
    setFormData((prev) => ({
      ...prev,
      registeringUnitText: { id, description },
    }));
  };

  const handleUrnValueChange = (
    field:
      | "urnPoliceForceText"
      | "urnPoliceUnitText"
      | "urnUniqueReferenceText"
      | "urnYearReferenceText",
    value: string,
  ) => {
    let newValue = value.replaceAll(/[^0-9a-zA-Z]/g, "");
    if (field !== "urnPoliceUnitText")
      newValue = newValue.replaceAll(/\D/g, "");
    setFormData((prev) => ({
      ...prev,
      [field]: newValue,
    }));
  };

  const urnPartsMinimumLengthValidation = () => {
    const errors: FormDataErrors = {};

    const {
      urnPoliceForceText,
      urnPoliceUnitText,
      urnUniqueReferenceText,
      urnYearReferenceText,
    } = formData;

    if (!urnPoliceForceText) {
      errors.urnErrorText = {
        errorSummaryText: "Enter the URN",
        inputErrorText: "Enter the URN",
        hasLink: true,
        errorIds: [
          ...(errors.urnErrorText?.errorIds || []),
          "urn-police-force-text",
        ],
      };
    }
    if (!urnPoliceUnitText) {
      errors.urnErrorText = {
        errorSummaryText: "Enter the URN",
        inputErrorText: "Enter the URN",
        hasLink: true,
        errorIds: [
          ...(errors.urnErrorText?.errorIds || []),
          "urn-police-unit-text",
        ],
      };
    }
    if (!urnUniqueReferenceText) {
      errors.urnErrorText = {
        errorSummaryText: "Enter the URN",
        inputErrorText: "Enter the URN",
        hasLink: true,
        errorIds: [
          ...(errors.urnErrorText?.errorIds || []),
          "urn-unique-reference-text",
        ],
      };
    }
    if (!urnYearReferenceText) {
      errors.urnErrorText = {
        errorSummaryText: "Enter the URN",
        inputErrorText: "Enter the URN",
        hasLink: true,
        errorIds: [
          ...(errors.urnErrorText?.errorIds || []),
          "urn-year-reference-text",
        ],
      };
    }
    if (errors.urnErrorText) return errors;

    if (urnPoliceForceText && urnPoliceForceText.length < 2) {
      errors.urnErrorText = {
        errorSummaryText: "Part 1 of the URN must be of 2 characters",
        inputErrorText: "Enter a valid URN",
        hasLink: true,
        errorIds: ["urn-police-force-text"],
      };
      return errors;
    }
    if (urnPoliceUnitText && urnPoliceUnitText.length < 2) {
      errors.urnErrorText = {
        errorSummaryText: "Part 2 of the URN must be of 2 characters",
        inputErrorText: "Enter a valid URN",
        hasLink: true,
        errorIds: ["urn-police-unit-text"],
      };
      return errors;
    }
    if (urnUniqueReferenceText && urnUniqueReferenceText.length < 5) {
      errors.urnErrorText = {
        errorSummaryText: "Part 3 of the URN must be of 5 characters",
        inputErrorText: "Enter a valid URN",
        hasLink: true,
        errorIds: ["urn-unique-reference-text"],
      };
      return errors;
    }
    if (urnYearReferenceText && urnYearReferenceText.length < 2) {
      errors.urnErrorText = {
        errorSummaryText: "Part 4 of the URN must be of 2 characters",
        inputErrorText: "Enter a valid URN",
        hasLink: true,
        errorIds: ["urn-year-reference-text"],
      };
    }
    return errors;
  };
  const validateFormData = (
    registeringUnitInputValue: string,
    witnessCareUnitInputValue: string,
  ) => {
    const errors: FormDataErrors = {};

    if (!isAreaSensitive) {
      if (!registeringUnitInputValue) {
        errors.registeringUnitErrorText = {
          errorSummaryText: "Select the registering unit",
          inputErrorText: "Select the registering unit",
          hasLink: true,
        };
      } else if (
        !registeringUnits.some(
          (ru) => ru.description === registeringUnitInputValue,
        )
      ) {
        errors.registeringUnitErrorText = {
          errorSummaryText: "Select a valid registering unit",
          inputErrorText: "Select a valid registering unit",
          hasLink: true,
        };
      }
    }

    if (witnessCareUnits.length) {
      if (!witnessCareUnitInputValue) {
        errors.witnessCareUnitErrorText = {
          errorSummaryText: "Select the witness care unit",
          inputErrorText: "Select the witness care unit",
          hasLink: true,
        };
      } else if (
        !witnessCareUnits.some(
          (wcu) => wcu.description === witnessCareUnitInputValue,
        )
      ) {
        errors.witnessCareUnitErrorText = {
          errorSummaryText: "Select a valid witness care unit",
          inputErrorText: "Select a valid witness care unit",
          hasLink: true,
        };
      }
    }

    const urnPartErrors = urnPartsMinimumLengthValidation();
    const combinedErrors = { ...urnPartErrors, ...errors };

    const isValid = !Object.entries(combinedErrors).filter(([, value]) => value)
      .length;

    setFormDataErrors(combinedErrors);
    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    let formValue = formData;
    const registeringUnitInput = document.getElementById(
      "registering-unit-text",
    ) as HTMLInputElement | null;
    const registeringUnitInputValue = registeringUnitInput?.value ?? "";
    if (
      formData.registeringUnitText?.description !== registeringUnitInputValue
    ) {
      const { id, description } = getSelectedUnit(
        registeringUnits,
        registeringUnitInputValue,
      );
      formValue = { ...formValue, registeringUnitText: { id, description } };
    }
    const witnessCareUnitInput = document.getElementById(
      "witness-care-unit-text",
    ) as HTMLInputElement;

    const witnessCareUnitInputValue = witnessCareUnitInput?.value ?? "";
    if (
      formData.witnessCareUnitText?.description !== witnessCareUnitInputValue
    ) {
      const { id, description } = getSelectedUnit(
        witnessCareUnits,
        witnessCareUnitInputValue,
      );
      formValue = { ...formValue, witnessCareUnitText: { id, description } };
    }
    if (!validateFormData(registeringUnitInputValue, witnessCareUnitInputValue))
      return;
    const { data } = await refetchValidateUrn();
    if (data) {
      setFormDataErrors((prev) => ({
        ...prev,
        urnErrorText: {
          errorSummaryText:
            "URN already exists, please change reference text and try again",
          hasLink: true,
          errorIds: ["urn-unique-reference-text"],
        },
      }));
      return;
    }
    if (
      state.formData.navigation.changeCaseDetails &&
      state.formData.registeringUnitText.id !==
        formValue.registeringUnitText?.id
    ) {
      navigate("/case-registration/change-registering-unit-confirmation", {
        state: {
          formData: formValue,
        },
      });
      return;
    }

    if (
      state.formData.registeringUnitText.id !==
      formValue.registeringUnitText?.id
    ) {
      dispatch({
        type: "RESET_RU_DEPENDENT_FIELDS",
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

    if (state.formData.navigation.changeCaseDetails) {
      dispatch({
        type: "SET_NAVIGATION_DATA",
        payload: { changeCaseDetails: false },
      });
      navigate("/case-registration/case-summary");
      return;
    }
    if (state.formData.navigation.changeCaseArea) {
      if (state.formData.firstHearingRadio) {
        navigate("/case-registration/first-hearing");
        return;
      }
      navigate("/case-registration/case-assignee");
      return;
    }

    if (state.formData.suspectDetailsRadio === "yes") {
      const suspectIndex = state.formData.suspects.length
        ? state.formData.suspects.length - 1
        : 0;
      if (!state.formData.suspects.length) {
        return navigate(
          `/case-registration/suspect-${suspectIndex}/add-suspect`,
        );
      }
      return navigate(`/case-registration/suspect-summary`);
    }

    return navigate("/case-registration/case-monitoring-codes");
  };

  const handleBackLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (previousRoute === "/case-registration/case-summary") {
      dispatch({
        type: "SET_NAVIGATION_DATA",
        payload: { changeCaseDetails: false },
      });
    }
    navigate(previousRoute);
  };

  return (
    <div className={pageStyles.caseDetailsPage}>
      {!state.formData.navigation.changeCaseArea && (
        <BackLink to={previousRoute} onClick={handleBackLinkClick}>
          Back
        </BackLink>
      )}
      <h1>Case details</h1>
      {!!errorList.length && (
        <div
          ref={errorSummaryRef}
          tabIndex={-1}
          className={styles.errorSummaryWrapper}
        >
          <ErrorSummary
            data-testid={"case-details-error-summary"}
            errorList={errorList}
            titleChildren="There is a problem"
          />
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className={styles.inputWrapper}>
          <fieldset
            className={`govuk-fieldset  govuk-form-group ${formDataErrors.urnErrorText?.errorSummaryText ? "govuk-form-group--error" : ""}`}
          >
            <legend className="govuk-fieldset__legend ">
              <span className="govuk-!-font-weight-bold">What is the URN?</span>
            </legend>
            {formDataErrors.urnErrorText?.errorSummaryText && (
              <p className="govuk-error-message">
                <span className="govuk-visually-hidden">Error:</span>{" "}
                {formDataErrors.urnErrorText?.errorSummaryText}
              </p>
            )}
            <div className={pageStyles.urnInputsWrapper}>
              <Input
                id="urn-police-force-text"
                maxLength={2}
                className={`govuk-input--width-2 ${formDataErrors.urnErrorText?.errorIds?.includes("urn-police-force-text") ? "govuk-input--error" : ""}`}
                data-testid="urn-police-force-text"
                label={{
                  children: "Police force",
                  className: "govuk-visually-hidden",
                }}
                value={formData.urnPoliceForceText}
                onChange={(val: string) =>
                  handleUrnValueChange("urnPoliceForceText", val)
                }
              />
              <Input
                id="urn-police-unit-text"
                maxLength={2}
                className={`govuk-input--width-2 ${formDataErrors.urnErrorText?.errorIds?.includes("urn-police-unit-text") ? "govuk-input--error" : ""}`}
                data-testid="urn-police-unit-text"
                label={{
                  children: "Police unit",
                  className: "govuk-visually-hidden",
                }}
                value={formData.urnPoliceUnitText}
                onChange={(val: string) =>
                  handleUrnValueChange("urnPoliceUnitText", val)
                }
              />
              <Input
                id="urn-unique-reference-text"
                maxLength={5}
                className={`govuk-input--width-5 ${formDataErrors.urnErrorText?.errorIds?.includes("urn-unique-reference-text") ? "govuk-input--error" : ""}`}
                data-testid="urn-unique-reference-text"
                label={{
                  children: "Unique reference",
                  className: "govuk-visually-hidden",
                }}
                value={formData.urnUniqueReferenceText}
                onChange={(val: string) =>
                  handleUrnValueChange("urnUniqueReferenceText", val)
                }
              />
              <Input
                id="urn-year-reference-text"
                maxLength={2}
                className={`govuk-input--width-2 ${formDataErrors.urnErrorText?.errorIds?.includes("urn-year-reference-text") ? "govuk-input--error" : ""}`}
                data-testid="urn-year-reference-text"
                label={{
                  children: "Year reference",
                  className: "govuk-visually-hidden",
                }}
                value={formData.urnYearReferenceText}
                onChange={(val: string) =>
                  handleUrnValueChange("urnYearReferenceText", val)
                }
              />
            </div>
          </fieldset>

          {!isAreaSensitive && (
            <AutoComplete
              id="registering-unit-text"
              inputClasses={"govuk-input--error"}
              source={registeringUnitSuggest}
              confirmOnBlur={false}
              onConfirm={handleRegisteringUnitConfirm}
              defaultValue={formData.registeringUnitText?.description}
              label={{
                children: (
                  <span className="govuk-!-font-weight-bold">
                    What is the registering unit?
                  </span>
                ),
              }}
              errorMessage={
                formDataErrors["registeringUnitErrorText"]
                  ? formDataErrors["registeringUnitErrorText"].inputErrorText
                  : undefined
              }
            />
          )}

          {!!witnessCareUnits.length && (
            <AutoComplete
              id="witness-care-unit-text"
              inputClasses={"govuk-input--error"}
              source={witnessCareUnitSuggest}
              confirmOnBlur={false}
              onConfirm={handleWitnessCareUnitConfirm}
              defaultValue={formData.witnessCareUnitText?.description}
              label={{
                children: (
                  <span className="govuk-!-font-weight-bold">
                    What is the witness care unit (WCU)?
                  </span>
                ),
              }}
              errorMessage={
                formDataErrors["witnessCareUnitErrorText"]
                  ? formDataErrors["witnessCareUnitErrorText"].inputErrorText
                  : undefined
              }
            />
          )}
        </div>
        <SaveAndCancel onSave={handleSubmit} />
      </form>
    </div>
  );
};

export default CaseDetailsPage;
