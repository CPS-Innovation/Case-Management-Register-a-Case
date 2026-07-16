import { useContext, useMemo } from "react";
import { Details, SummaryList, Tag } from "../../govuk";
import { CaseRegistrationFormContext } from "../../../common/providers/CaseRegistrationProvider";
import PersonIcon from "../../svgs/personIcon.svg?react";
import CompanyIcon from "../../svgs/companyIcon.svg?react";
import { type SuspectFormData } from "../../../common/reducers/caseRegistrationReducer";
import { getSuspectDetailsSummaryListRows } from "./utils/getSuspectDetailsSummaryListRows";
import { getChargesSummaryListRows } from "../charges-summary/utils/getChargesSummaryListRows";
import { isYouthSuspect } from "../../../common/utils/isYouthSuspect";
import { formatNameUtil } from "../../../common/utils/formatNameUtil";
import { useNavigate } from "react-router-dom";
import styles from "./SuspectSummary.module.scss";

type SuspectSummaryProps = {
  isCaseSummaryPage?: boolean;
  hideActions?: boolean;
};

const SuspectSummary: React.FC<SuspectSummaryProps> = ({
  isCaseSummaryPage = false,
  hideActions = false,
}) => {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(CaseRegistrationFormContext);

  const handleAddChargeClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    url: string,
  ) => {
    event.preventDefault();
    dispatch({
      type: "SET_NAVIGATION_DATA",
      payload: { changeCaseCharges: true },
    });
    navigate(url);
  };

  const addNewChargeRow = (suspectIndex: number, chargeIndex: number) => {
    return [
      {
        key: {
          children:
            chargeIndex === 0 ? (
              <span>Charges</span>
            ) : (
              <span>Add another charge</span>
            ),
        },
        value: {
          children: chargeIndex === 0 ? <span>No charges added</span> : <></>,
        },
        actions: {
          items: hideActions
            ? []
            : [
                {
                  children: <span>Add Charge</span>,
                  to: `/case-registration/suspect-${suspectIndex}/charge-${chargeIndex}/charges-offence-search`,
                  visuallyHiddenText: "Add new charge",
                  onClick: (event: React.MouseEvent<HTMLAnchorElement>) =>
                    handleAddChargeClick(
                      event,
                      `/case-registration/suspect-${suspectIndex}/charge-${chargeIndex}/charges-offence-search`,
                    ),
                },
              ],
        },
      },
    ];
  };

  const suspectSummaryRow = (suspect: SuspectFormData, index: number) => {
    const handleSuspectChangeClick = (
      event: React.MouseEvent<HTMLAnchorElement>,
      url: string,
    ) => {
      event.preventDefault();
      if (isCaseSummaryPage) {
        dispatch({
          type: "SET_NAVIGATION_DATA",
          payload: { changeCaseSuspects: true },
        });
      } else {
        dispatch({
          type: "SET_NAVIGATION_DATA",
          payload: { fromSuspectSummaryPage: true },
        });
      }

      navigate(url);
    };
    const suspectName =
      suspect.addSuspectRadio === "company"
        ? suspect.suspectCompanyNameText
        : formatNameUtil(
            suspect.suspectFirstNameText,
            suspect.suspectLastNameText,
          );

    return [
      {
        key: {
          children: (
            <div className={styles.suspectName}>
              {suspect.addSuspectRadio === "person" && (
                <>
                  <PersonIcon />
                  <span data-testid={`suspect-name-${index}`}>
                    {`${formatNameUtil(
                      suspect.suspectFirstNameText,
                      suspect.suspectLastNameText,
                    )}`}
                  </span>

                  {isYouthSuspect(suspect) && <Tag>Youth</Tag>}
                </>
              )}
              {suspect.addSuspectRadio === "company" && (
                <>
                  <CompanyIcon />
                  <span data-testid={`suspect-name-${index}`}>
                    {suspect.suspectCompanyNameText}
                  </span>
                </>
              )}
            </div>
          ),
        },
        value: isCaseSummaryPage
          ? {
              children: (
                <>
                  {suspect.charges.length ? (
                    <Tag className="govuk-tag--orange">Charges added</Tag>
                  ) : (
                    <Tag className="govuk-tag--grey">Pre-charge</Tag>
                  )}
                </>
              ),
            }
          : undefined,

        actions: {
          items: hideActions
            ? []
            : [
                {
                  children: <span>Remove</span>,
                  className: "govuk-link--no-visited-state",
                  to: `/case-registration/suspect-remove-confirmation`,
                  state: {
                    suspectId: suspect.suspectId,
                    backRoute: isCaseSummaryPage
                      ? `/case-registration/case-summary`
                      : `/case-registration/suspect-summary`,
                  },
                  visuallyHiddenText: `suspect ${suspectName}`,
                },
                {
                  children: <span>Change</span>,
                  className: "govuk-link--no-visited-state",
                  to: `/case-registration/suspect-${index}/add-suspect`,
                  visuallyHiddenText: `suspect details for ${suspectName}`,
                  onClick: (event: React.MouseEvent<HTMLAnchorElement>) =>
                    handleSuspectChangeClick(
                      event,
                      `/case-registration/suspect-${index}/add-suspect`,
                    ),
                },
              ],
        },
      },
    ];
  };

  const suspectDetailsSummaryListRows = useMemo(() => {
    return getSuspectDetailsSummaryListRows(state.formData.suspects);
  }, [state.formData.suspects]);

  const getDetailsTitle = (
    isCaseSummaryPage: boolean,
    suspectDetailsSummaryListRowsLength: number,
  ) => {
    if (suspectDetailsSummaryListRowsLength > 0 && !isCaseSummaryPage) {
      return "Suspect details";
    }
    if (isCaseSummaryPage) {
      return "Details and charges";
    }
    return "";
  };

  const renderSummaryList = () => {
    const {
      formData: { suspects },
    } = state;

    return (
      <>
        {suspects.map(
          (suspect, index) =>
            suspect.addSuspectRadio === "person" && (
              <div
                key={`${index}-${suspect.suspectLastNameText}`}
                data-testid={`suspect-key-${index}`}
              >
                <div
                  className={styles.suspectRowWrapper}
                  data-testid={`suspect-row-${index}`}
                >
                  <SummaryList rows={suspectSummaryRow(suspect, index)} />
                </div>

                {getDetailsTitle(
                  isCaseSummaryPage,
                  suspectDetailsSummaryListRows[index].length,
                ) && (
                  <div
                    className={styles.suspectDetailsWrapper}
                    data-testid={`suspect-details-${index}`}
                  >
                    <Details
                      summaryChildren={getDetailsTitle(
                        isCaseSummaryPage,
                        suspectDetailsSummaryListRows[index].length,
                      )}
                    >
                      {suspectDetailsSummaryListRows[index].length > 0 && (
                        <div data-testid={"suspect-additional-details"}>
                          {isCaseSummaryPage && (
                            <h3 className="govuk-heading-m">Suspect details</h3>
                          )}
                          <SummaryList
                            rows={suspectDetailsSummaryListRows[index]}
                          />
                        </div>
                      )}
                      {isCaseSummaryPage && (
                        <>
                          <div data-testid={"suspect-charges"}>
                            <h3>Charges</h3>
                            {suspect.charges.map((charge) => (
                              <div
                                key={`${charge.selectedOffence.code}-${charge.chargeId}`}
                              >
                                <SummaryList
                                  rows={getChargesSummaryListRows(
                                    charge,
                                    state.formData.victimsList,
                                    isCaseSummaryPage,
                                    suspect.suspectId,
                                    charge.chargeId,
                                    state.formData.suspects,
                                    hideActions,
                                  )}
                                />
                              </div>
                            ))}
                          </div>
                          <div
                            className={styles.addNewChargeSummary}
                            data-testid={"add-new-charge"}
                          >
                            <SummaryList
                              rows={addNewChargeRow(
                                index,
                                suspect.charges.length,
                              )}
                            />
                          </div>
                        </>
                      )}
                    </Details>
                  </div>
                )}
              </div>
            ),
        )}
        {suspects.map(
          (suspect, index) =>
            suspect.addSuspectRadio === "company" && (
              <div
                key={`${index}-${suspect.suspectCompanyNameText}`}
                data-testid={`suspect-key-${index}`}
              >
                <div className={styles.suspectRowWrapper}>
                  <div data-testid={`suspect-row-${index}`}>
                    <SummaryList rows={suspectSummaryRow(suspect, index)} />
                  </div>
                  {isCaseSummaryPage && (
                    <div data-testid={`suspect-details-${index}`}>
                      <Details summaryChildren={"Charges"}>
                        <div data-testid={`suspect-charges`}>
                          <h3>Charges</h3>
                          {suspect.charges.map((charge) => (
                            <div
                              key={`${charge.selectedOffence.code}-${charge.chargeId}`}
                            >
                              <SummaryList
                                rows={getChargesSummaryListRows(
                                  charge,
                                  state.formData.victimsList,
                                  isCaseSummaryPage,
                                  suspect.suspectId,
                                  charge.chargeId,
                                  state.formData.suspects,
                                )}
                              />
                            </div>
                          ))}
                        </div>
                        <div
                          className={styles.addNewChargeSummary}
                          data-testid={"add-new-charge"}
                        >
                          <SummaryList
                            rows={addNewChargeRow(
                              index,
                              suspect.charges.length,
                            )}
                          />
                        </div>
                      </Details>
                    </div>
                  )}
                </div>
              </div>
            ),
        )}
      </>
    );
  };

  return (
    <div className={styles.suspectSummary}>
      <div>{renderSummaryList()}</div>
    </div>
  );
};

export default SuspectSummary;
