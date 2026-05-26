import {
  useRef,
  useEffect,
  useState,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { Radios, ErrorSummary, BackLink, Input, Checkboxes } from "../../govuk";
import SaveAndCancel from "../../common/SaveAndCancel";
import { CaseRegistrationFormContext } from "../../../common/providers/CaseRegistrationProvider";
import { type VictimAdditionalDetailsValue } from "../../../common/reducers/caseRegistrationReducer";
import { formatNameUtil } from "../../../common/utils/formatNameUtil";
import { sanitizeNameText } from "../../../common/utils/sanitizeNameText";
import { DEFAULT_VICTIM_ADDITIONAL_DETAIL_VALUE } from "../../../common/constants/general";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import styles from "../index.module.scss";
import pageStyles from "./index.module.scss";

const AddChargeVictimPage = () => {
  type ErrorText = {
    errorSummaryText: string;
    inputErrorText?: string;
    hasLink: boolean;
  };
  type FormDataErrors = {
    selectedVictimRadio?: ErrorText;
    victimLastNameText?: ErrorText;
    victimAdditionalDetails?: ErrorText;
  };
  const errorSummaryRef = useRef<HTMLInputElement>(null);
  const { state, dispatch } = useContext(CaseRegistrationFormContext);
  const [victimDetails, setVictimDetails] = useState<{
    selectedVictimRadio: string;
    victimFirstNameText: string;
    victimLastNameText: string;
    victimAdditionalDetailsCheckboxes: VictimAdditionalDetailsValue[];
  }>({
    selectedVictimRadio: "",
    victimFirstNameText: "",
    victimLastNameText: "",
    victimAdditionalDetailsCheckboxes: [DEFAULT_VICTIM_ADDITIONAL_DETAIL_VALUE],
  });
  const navigate = useNavigate();
  const { suspectId, chargeId } = useParams<{
    suspectId: string;
    chargeId: string;
  }>() as {
    suspectId: string;
    chargeId: string;
  };

  const suspectIndex = useMemo(() => {
    const index = suspectId.replace("suspect-", "");
    return Number.parseInt(index, 10);
  }, [suspectId]);

  const chargeIndex = useMemo(() => {
    const index = chargeId.replace("charge-", "");
    return Number.parseInt(index, 10);
  }, [chargeId]);

  const suspectCharge = useMemo(() => {
    const {
      formData: { suspects },
    } = state;
    const charges = suspects[suspectIndex].charges || {};
    return charges[chargeIndex];
  }, [state, suspectIndex, chargeIndex]);

  const suspectName = useMemo(() => {
    const {
      formData: { suspects },
    } = state;
    const {
      suspectFirstNameText,
      suspectLastNameText,
      suspectCompanyNameText,
    } = suspects[suspectIndex];
    return suspectCompanyNameText
      ? suspectCompanyNameText
      : formatNameUtil(suspectFirstNameText, suspectLastNameText);
  }, [state, suspectIndex]);

  const [formDataErrors, setFormDataErrors] = useState<FormDataErrors>({});

  const errorSummaryProperties = useCallback(
    (errorKey: keyof FormDataErrors) => {
      switch (errorKey) {
        case "selectedVictimRadio":
          return {
            children: formDataErrors[errorKey]?.errorSummaryText,
            href: "#add-victim-radio-0",
            "data-testid": "victim-radio-link",
          };

        case "victimLastNameText":
          return {
            children: formDataErrors[errorKey]?.errorSummaryText,
            href: "#victim-lastname-text",
            "data-testid": "victim-lastname-link",
          };

        default:
          return null;
      }
    },
    [formDataErrors],
  );

  const validateFormData = () => {
    const errors: FormDataErrors = {};
    const { selectedVictimRadio, victimLastNameText } = victimDetails;
    const victimsList = state.formData.victimsList || [];
    if (victimsList.length > 0 && !selectedVictimRadio) {
      errors.selectedVictimRadio = {
        errorSummaryText: "Select an option",
        inputErrorText: "Select an option",
        hasLink: true,
      };
    }

    if (victimsList.length === 0 || selectedVictimRadio === "new-victim") {
      if (!victimLastNameText) {
        errors.victimLastNameText = {
          errorSummaryText: "Enter the victim's last name",
          inputErrorText: "Enter the victim's last name",
          hasLink: true,
        };
      }
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

  const setFormValue = useCallback(
    (
      fieldName:
        | "selectedVictimRadio"
        | "victimFirstNameText"
        | "victimLastNameText",
      value: string,
    ) => {
      if (fieldName === "selectedVictimRadio") {
        if (value === "new-victim") {
          setVictimDetails({
            selectedVictimRadio: value,
            victimFirstNameText: "",
            victimLastNameText: "",
            victimAdditionalDetailsCheckboxes: [
              DEFAULT_VICTIM_ADDITIONAL_DETAIL_VALUE,
            ],
          });
          return;
        } else {
          const selectedVictim = state.formData.victimsList.find((victim) => {
            return victim.victimId === value;
          });
          if (selectedVictim) {
            setVictimDetails({
              selectedVictimRadio: value,
              victimFirstNameText: selectedVictim.victimFirstNameText,
              victimLastNameText: selectedVictim.victimLastNameText,
              victimAdditionalDetailsCheckboxes:
                selectedVictim.victimAdditionalDetailsCheckboxes,
            });
          }
          return;
        }
      }
      setVictimDetails((prevState) => ({
        ...prevState,
        [fieldName]: sanitizeNameText(value),
      }));
    },
    [state.formData.victimsList],
  );

  const setAdditionalDetailsCheckboxes = useCallback(
    (value: VictimAdditionalDetailsValue) => {
      const currentValues =
        victimDetails.victimAdditionalDetailsCheckboxes ?? [];
      let newValues: VictimAdditionalDetailsValue[] = [];
      if (currentValues.includes(value)) {
        newValues = currentValues.filter((item) => item !== value);
      } else {
        newValues = [...currentValues, value];
      }
      setVictimDetails((prevState) => ({
        ...prevState,
        ["victimAdditionalDetailsCheckboxes"]: newValues,
      }));
    },
    [victimDetails],
  );

  const renderVictimAdditionalDetails = useCallback(
    (victimKey: string) => {
      const victimType = [
        { name: "The victim is vulnerable", value: "Vulnerable" },
        { name: "The victim has been intimidated", value: "Intimidated" },
        { name: "The victim is a witness", value: "Witness" },
      ] as { name: string; value: VictimAdditionalDetailsValue }[];
      return (
        <Checkboxes
          data-testid="victim-additional-details-checkboxes"
          fieldset={{
            legend: {
              children: (
                <span className="govuk-!-font-weight-bold">
                  Victim details (optional)
                </span>
              ),
            },
          }}
          items={victimType.map((victimType, index) => ({
            id: `case-victim-type-${victimKey}-${index}`,
            children: victimType.name,
            value: victimType.value,
            "data-testid": `case-victim-type-${victimKey}-${index}`,
            checked: victimDetails.victimAdditionalDetailsCheckboxes?.includes(
              victimType.value,
            ),
          }))}
          onChange={(event) => {
            const { value } = event.target;
            if (value)
              setAdditionalDetailsCheckboxes(
                value as VictimAdditionalDetailsValue,
              );
          }}
        />
      );
    },
    [victimDetails, setAdditionalDetailsCheckboxes],
  );

  const renderNewVictimFields = useCallback(() => {
    return (
      <div data-testid="new-victim-fields">
        <Input
          key="victim-firstname-text"
          id="victim-firstname-text"
          data-testid="victim-firstname-text"
          className="govuk-input--width-20"
          label={{
            children: (
              <span className="govuk-!-font-weight-bold">
                Victim first name (optional)
              </span>
            ),
          }}
          type="text"
          value={victimDetails.victimFirstNameText}
          onChange={(value: string) => {
            setFormValue("victimFirstNameText", value);
          }}
        />

        <Input
          key="victim-lastname-text"
          id="victim-lastname-text"
          data-testid="victim-lastname-text"
          className="govuk-input--width-20"
          label={{
            children: (
              <span className="govuk-!-font-weight-bold">
                Victim last name{" "}
              </span>
            ),
          }}
          errorMessage={
            formDataErrors["victimLastNameText"]
              ? {
                  children: formDataErrors["victimLastNameText"].inputErrorText,
                }
              : undefined
          }
          type="text"
          value={victimDetails.victimLastNameText}
          onChange={(value: string) => {
            setFormValue("victimLastNameText", value);
          }}
        />
      </div>
    );
  }, [victimDetails, formDataErrors, setFormValue]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateFormData()) return;

    const isVictimNameExists = state.formData.victimsList.some((victim) => {
      return (
        victim.victimFirstNameText.toLowerCase() ===
          victimDetails.victimFirstNameText.toLowerCase() &&
        victim.victimLastNameText.toLowerCase() ===
          victimDetails.victimLastNameText.toLowerCase()
      );
    });
    if (
      isVictimNameExists &&
      victimDetails.selectedVictimRadio === "new-victim"
    ) {
      navigate("/case-registration/charges-victim-duplicate-confirmation", {
        state: {
          suspectIndex: suspectIndex,
          chargeIndex: chargeIndex,
          victimFirstName: victimDetails.victimFirstNameText,
          victimLastName: victimDetails.victimLastNameText,
          victimAdditionalDetailsCheckboxes:
            victimDetails.victimAdditionalDetailsCheckboxes,
          backRoute: location.pathname,
        },
      });
      return;
    }

    if (
      !state.formData.victimsList.length ||
      victimDetails.selectedVictimRadio === "new-victim"
    ) {
      const newVictim = {
        victimId: uuidv4(),
        victimFirstNameText: victimDetails.victimFirstNameText,
        victimLastNameText: victimDetails.victimLastNameText,
        victimAdditionalDetailsCheckboxes:
          victimDetails.victimAdditionalDetailsCheckboxes,
      };
      dispatch({
        type: "SET_FIELDS",
        payload: {
          data: {
            victimsList: [
              ...state.formData.victimsList,
              {
                ...newVictim,
              },
            ],
          },
        },
      });

      dispatch({
        type: "SET_CHARGE_FIELDS",
        payload: {
          suspectIndex: suspectIndex,
          chargeIndex: chargeIndex,
          data: {
            victim: {
              victimId: newVictim.victimId,
            },
          },
        },
      });
    } else if (victimDetails.selectedVictimRadio !== "new-victim") {
      const selectedVictim = state.formData.victimsList.find((victim) => {
        return victim.victimId === victimDetails.selectedVictimRadio;
      });

      const filteredVictimsList = state.formData.victimsList.filter(
        (victim) => victim.victimId !== victimDetails.selectedVictimRadio,
      );
      if (selectedVictim) {
        dispatch({
          type: "SET_FIELDS",
          payload: {
            data: {
              victimsList: [
                ...filteredVictimsList,
                {
                  ...selectedVictim,
                  victimAdditionalDetailsCheckboxes:
                    victimDetails.victimAdditionalDetailsCheckboxes,
                },
              ],
            },
          },
        });
        dispatch({
          type: "SET_CHARGE_FIELDS",
          payload: {
            suspectIndex: suspectIndex,
            chargeIndex: chargeIndex,
            data: {
              victim: {
                victimId: selectedVictim.victimId,
              },
            },
          },
        });
      }
    }

    return navigate("/case-registration/charges-summary");
  };

  const availableVictimItems = useMemo(() => {
    const availableVictims = state.formData.victimsList.map((victim, index) => {
      return {
        id: `add-victim-radio-${index}`,
        children: formatNameUtil(
          victim.victimFirstNameText,
          victim.victimLastNameText,
        ),
        value: victim.victimId,
        conditional: {
          children: [renderVictimAdditionalDetails(`victim-${index}`)],
        },
        "data-testid": `add-victim-radio-${index}`,
      };
    });
    return [
      ...availableVictims,
      {
        id: `add-victim-radio-add-new-victim`,
        children: "Add new victim",
        value: "new-victim",
        "data-testid": `add-victim-radio-add-new-victim`,
        conditional: {
          children: [
            renderNewVictimFields(),
            renderVictimAdditionalDetails(`victim-new`),
          ],
        },
      },
    ];
  }, [
    state.formData.victimsList,
    renderNewVictimFields,
    renderVictimAdditionalDetails,
  ]);

  return (
    <div>
      <BackLink
        to={`/case-registration/suspect-${suspectIndex}/charge-${chargeIndex}/add-charge-details`}
      >
        Back
      </BackLink>
      {!!errorList.length && (
        <div
          ref={errorSummaryRef}
          tabIndex={-1}
          className={styles.errorSummaryWrapper}
        >
          <ErrorSummary
            data-testid={"add-charge-victim-error-summary"}
            errorList={errorList}
            titleChildren="There is a problem"
          />
        </div>
      )}

      <h1>Add a victim to this charge</h1>
      <div>
        <h2 className="govuk-heading-s govuk-!-margin-bottom-2">
          {suspectName}
        </h2>
        <h2 className="govuk-heading-s govuk-!-margin-bottom-2">
          {suspectCharge.selectedOffence?.code} -{" "}
          {suspectCharge.selectedOffence?.description}
        </h2>
      </div>
      <hr className={pageStyles.resultsDivider} />
      <form onSubmit={handleSubmit}>
        <div className={styles.inputWrapper}>
          {state.formData.victimsList.length !== 0 && (
            <Radios
              fieldset={{
                legend: {
                  children: (
                    <span className="govuk-!-font-weight-bold">
                      Select or add a victim
                    </span>
                  ),
                },
              }}
              errorMessage={
                formDataErrors["selectedVictimRadio"]
                  ? {
                      children:
                        formDataErrors["selectedVictimRadio"].inputErrorText,
                    }
                  : undefined
              }
              items={availableVictimItems}
              value={victimDetails.selectedVictimRadio}
              onChange={(value) => {
                if (value) setFormValue("selectedVictimRadio", value);
              }}
            ></Radios>
          )}

          <>
            {state.formData.victimsList.length === 0 && (
              <>
                {renderNewVictimFields()}
                <div>{renderVictimAdditionalDetails("victim-new")}</div>
              </>
            )}
          </>
        </div>
        <SaveAndCancel onSave={handleSubmit} />
      </form>
    </div>
  );
};

export default AddChargeVictimPage;
