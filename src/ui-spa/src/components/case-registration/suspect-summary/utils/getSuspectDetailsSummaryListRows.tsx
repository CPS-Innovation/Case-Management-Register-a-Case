import { type SuspectFormData } from "../../../../common/reducers/caseRegistrationReducer";
import { formatNameUtil } from "../../../../common/utils/formatNameUtil";
import { format } from "date-fns";
import pageStyles from "../SuspectSummary.module.scss";

const getAliasesList = (aliases: { firstName: string; lastName: string }[]) => {
  if (!aliases || aliases.length === 0) {
    return [];
  }

  return aliases.map((alias) => ({
    key: { children: <span>Alias</span> },
    value: {
      children: <span>{formatNameUtil(alias.firstName, alias.lastName)}</span>,
    },
  }));
};

const getOffenderTypeList = (suspectOffenderTypesRadio: {
  shortCode: string;
  display: string;
  arrestDate: string;
}) => {
  if (!suspectOffenderTypesRadio.shortCode) return [];

  if (suspectOffenderTypesRadio.shortCode === "PP")
    return [
      {
        key: { children: <span>Type of offender</span> },
        value: {
          children: <span>{suspectOffenderTypesRadio.display}</span>,
        },
      },
    ];
  return [
    {
      key: { children: <span>Type of offender</span> },
      value: {
        children: <span>{suspectOffenderTypesRadio.display}</span>,
      },
    },
    !Number.isNaN(new Date(suspectOffenderTypesRadio.arrestDate).getTime()) && {
      key: {
        children: <span>Arrest date </span>,
      },
      value: {
        children: (
          <span>
            {format(
              new Date(suspectOffenderTypesRadio.arrestDate),
              "dd MMMM yyyy",
            )}
          </span>
        ),
      },
    },
  ];
};

export const getSuspectDetailsSummaryListRows = (
  suspects: SuspectFormData[],
) => {
  if (!suspects || suspects.length === 0) {
    return [];
  }

  const suspectSummaryList = suspects.map((suspect) => [
    suspect.suspectDOBDayText && {
      key: { children: <span>Date of birth</span> },
      value: {
        children: (
          <span>{`${suspect.suspectDOBDayText}/${suspect.suspectDOBMonthText}/${suspect.suspectDOBYearText}`}</span>
        ),
      },
    },
    ...getOffenderTypeList(suspect.suspectOffenderTypesRadio),
    suspect.suspectGenderRadio.description && {
      key: { children: <span>Gender</span> },
      value: {
        children: <span>{suspect.suspectGenderRadio.description}</span>,
      },
    },

    suspect.suspectDisabilityRadio && {
      key: { children: <span>Disability</span> },
      value: {
        children: (
          <span className={pageStyles.capitalizeText}>
            {suspect.suspectDisabilityRadio}
          </span>
        ),
      },
    },
    suspect.suspectReligionRadio.description && {
      key: { children: <span>Religion</span> },
      value: {
        children: <span>{suspect.suspectReligionRadio.description}</span>,
      },
    },
    suspect.suspectEthnicityRadio.description && {
      key: { children: <span>Ethnicity</span> },
      value: {
        children: <span>{suspect.suspectEthnicityRadio.description}</span>,
      },
    },
    ...getAliasesList(suspect.suspectAliases),
    suspect.suspectASNText && {
      key: { children: <span>Arrest Summons Number</span> },
      value: {
        children: <span>{suspect.suspectASNText}</span>,
      },
    },
  ]);
  return suspectSummaryList.map((rows) => rows.filter((row) => !!row));
};
