import type {
  SuspectFormData,
  ChargesFormData,
  Victim,
} from "../../../../common/reducers/caseRegistrationReducer";
import { Tag } from "../../../govuk";
import { formatNameUtil } from "../../../../common/utils/formatNameUtil";
import { isChargedWithAdultWarningActive } from "../../../../common/utils/isChargedWithAdultWarningActive";
import { format } from "date-fns";
import styles from "./index.module.scss";

export const getChargesSummaryListRows = (
  charge: ChargesFormData,
  victimList: Victim[],
  isCaseSummaryPage: boolean = false,
  suspectId: string,
  chargeId: string,
  suspects: SuspectFormData[],
  hideActions: boolean = false,
) => {
  const suspect = suspects.find((s) => s.suspectId === suspectId);
  const showChargedWithAdultWarning =
    suspect &&
    isChargedWithAdultWarningActive(
      suspect.suspectOffenderTypesRadio.shortCode,
    );
  const victim = victimList.find((v) => v.victimId === charge.victim?.victimId);
  const rows = [
    isCaseSummaryPage && {
      key: { children: <b>{charge.selectedOffence.code}</b> },
      value: { children: <span>{charge.selectedOffence.description}</span> },
      actions: {
        items: hideActions
          ? []
          : [
              {
                children: <span>Remove</span>,
                to: `/case-registration/charge-remove-confirmation`,
                state: {
                  suspectId,
                  chargeId,
                  backRoute: isCaseSummaryPage
                    ? `/case-registration/case-summary`
                    : `/case-registration/charges-summary`,
                },
                visuallyHiddenText: `charge ${charge.selectedOffence.description}`,
                className: "govuk-link--no-visited-state",
              },
            ],
      },
    },
    {
      key: { children: <b>Date of offence</b> },
      value: {
        children: (
          <span>
            {charge.offenceToDate
              ? `${format(charge.offenceFromDate, "dd MMMM yyyy")} to ${format(charge.offenceToDate, "dd MMMM yyyy")}`
              : format(charge.offenceFromDate, "dd MMMM yyyy")}
          </span>
        ),
      },
    },
    victim && {
      key: { children: <b>Victim</b> },
      value: {
        children: (
          <div>
            <span>
              {formatNameUtil(
                victim?.victimFirstNameText,
                victim?.victimLastNameText,
              )}
            </span>
            <div className={styles.tagsContainer}>
              {victim?.victimAdditionalDetailsCheckboxes.map(
                (detail, index) => (
                  <Tag key={index} gdsTagColour="blue">
                    {detail}
                  </Tag>
                ),
              )}
            </div>
          </div>
        ),
      },
    },
    showChargedWithAdultWarning && {
      key: { children: <b>Charged with an adult</b> },
      value: {
        children: (
          <span>{charge.chargedWithAdultRadio === "yes" ? "Yes" : "No"}</span>
        ),
      },
    },
  ];

  return rows.filter((row) => !!row);
};
