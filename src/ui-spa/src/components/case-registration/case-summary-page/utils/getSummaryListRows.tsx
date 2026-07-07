import { format } from "date-fns";
import {
  type CaseRegistrationFormData,
  type CaseRegistrationActions,
} from "../../../../common/reducers/caseRegistrationReducer";
import { Tag } from "../../../../components/govuk";
import { type NavigateFunction } from "react-router-dom";
import type { CaseMonitoringCodes, PoliceUnit } from "../../../../schemas";

export const getCaseDetailsSummaryListRows = (
  dispatch: React.Dispatch<CaseRegistrationActions>,
  navigate: NavigateFunction,
  formData: CaseRegistrationFormData,
  hideActions: boolean,
) => {
  const handleAddChangeClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    url: string,
  ) => {
    event.preventDefault();

    const payload: {
      changeCaseArea?: boolean;
      changeCaseDetails?: boolean;
      fromCaseSummaryPage?: boolean;
    } = {};
    if (url === "/case-registration/areas") payload.changeCaseArea = true;
    else if (url === "/case-registration") payload.fromCaseSummaryPage = true;
    else payload.changeCaseDetails = true;

    dispatch({
      type: "SET_NAVIGATION_DATA",
      payload,
    });
    navigate(url);
  };

  const handleAddSuspectClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    url: string,
  ) => {
    event.preventDefault();
    dispatch({
      type: "SET_NAVIGATION_DATA",
      payload: { changeCaseSuspects: true },
    });
    navigate(url);
  };

  const urn = `${formData.urnPoliceForceText}${formData.urnPoliceUnitText}${formData.urnUniqueReferenceText}${formData.urnYearReferenceText}`;

  const rows = [
    {
      key: { children: <span>Area</span> },
      value: {
        children: <span>{formData.areaOrDivisionText?.description}</span>,
      },
      actions: {
        items: hideActions
          ? []
          : [
              {
                "data-testid": "change-area-link",
                children: <span>Change</span>,
                to: "/case-registration/areas",
                visuallyHiddenText: "Case Area",
                onClick: (event: React.MouseEvent<HTMLAnchorElement>) =>
                  handleAddChangeClick(event, "/case-registration/areas"),
              },
            ],
      },
    },

    {
      key: { children: <span>URN</span> },
      value: {
        children: <span>{urn}</span>,
      },
      actions: {
        items: hideActions
          ? []
          : [
              {
                "data-testid": "change-urn-link",
                id: "change-urn-link",
                children: <span>Change</span>,
                to: "/case-registration/case-details",
                visuallyHiddenText: "Case URN",
                onClick: (event: React.MouseEvent<HTMLAnchorElement>) =>
                  handleAddChangeClick(
                    event,
                    "/case-registration/case-details",
                  ),
              },
            ],
      },
    },
    {
      key: { children: <span>Registering unit</span> },
      value: {
        children: <span>{formData.registeringUnitText?.description}</span>,
      },
      actions: {
        items: hideActions
          ? []
          : [
              {
                "data-testid": "change-registering-unit-link",
                children: <span>Change</span>,
                to: "/case-registration/case-details",
                visuallyHiddenText: "Registering Unit",
                onClick: (event: React.MouseEvent<HTMLAnchorElement>) =>
                  handleAddChangeClick(
                    event,
                    "/case-registration/case-details",
                  ),
              },
            ],
      },
    },
    {
      key: { children: <span>WCU</span> },
      value: {
        children: <span>{formData.witnessCareUnitText?.description}</span>,
      },
      actions: {
        items: hideActions
          ? []
          : [
              {
                "data-testid": "change-wcu-link",
                children: <span>Change</span>,
                to: "/case-registration/case-details",
                visuallyHiddenText: "Witness Care Unit",
                onClick: (event: React.MouseEvent<HTMLAnchorElement>) =>
                  handleAddChangeClick(
                    event,
                    "/case-registration/case-details",
                  ),
              },
            ],
      },
    },
    {
      key: { children: <span>Operation name</span> },
      value: {
        children: (
          <span>
            {formData.operationNameText
              ? formData.operationNameText
              : "Not entered"}
          </span>
        ),
      },
      actions: {
        items: hideActions
          ? []
          : [
              {
                "data-testid": "change-operation-name-link",
                children: <span>Change</span>,
                to: "/case-registration",
                visuallyHiddenText: "Operation Name",
                onClick: (event: React.MouseEvent<HTMLAnchorElement>) =>
                  handleAddChangeClick(event, "/case-registration"),
              },
            ],
      },
    },
    {
      key: { children: <span>Suspects</span> },
      value: formData.suspects.length
        ? {
            children: (
              <span>
                {formData.suspects.length} suspect
                {formData.suspects.length > 1 ? "s" : ""} added
              </span>
            ),
          }
        : { children: <span>Not entered</span> },
      actions: {
        items: hideActions
          ? []
          : [
              {
                children: <span>Add a suspect</span>,
                to: `/case-registration/suspect-${formData.suspects.length}/add-suspect`,
                "data-testid": "add-suspect-link",
                onClick: (event: React.MouseEvent<HTMLAnchorElement>) =>
                  handleAddSuspectClick(
                    event,
                    `/case-registration/suspect-${formData.suspects.length}/add-suspect`,
                  ),
              },
            ],
      },
    },
  ];
  return rows;
};

export const getFirstHearingSummaryRows = (
  dispatch: React.Dispatch<CaseRegistrationActions>,
  navigate: NavigateFunction,
  formData: CaseRegistrationFormData,
  hideActions: boolean,
) => {
  const handleAddChangeClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    dispatch({
      type: "SET_NAVIGATION_DATA",
      payload: { fromCaseSummaryPage: true },
    });
    navigate("/case-registration/first-hearing");
  };

  const rows =
    formData.firstHearingRadio === "yes"
      ? [
          {
            key: { children: <span>First hearing court location</span> },
            value: {
              children: (
                <span>
                  {formData.firstHearingCourtLocationText.description}
                </span>
              ),
            },
            actions: {
              items: hideActions
                ? []
                : [
                    {
                      "data-testid": "change-court-location-link",
                      children: <span>Change</span>,
                      to: "/case-registration/first-hearing",
                      visuallyHiddenText: "First Hearing Court Location",
                      onClick: (event: React.MouseEvent<HTMLAnchorElement>) =>
                        handleAddChangeClick(event),
                    },
                  ],
            },
          },
          {
            key: { children: <span>First hearing date</span> },
            value: {
              children: (
                <span>
                  {format(formData.firstHearingDateText, "dd MMMM yyyy")}
                </span>
              ),
            },
            actions: {
              items: hideActions
                ? []
                : [
                    {
                      "data-testid": "change-first-hearing-date-link",
                      children: <span>Change</span>,
                      to: "/case-registration/first-hearing",
                      visuallyHiddenText: "First Hearing Date",
                      onClick: (event: React.MouseEvent<HTMLAnchorElement>) =>
                        handleAddChangeClick(event),
                    },
                  ],
            },
          },
        ]
      : [
          {
            key: { children: <span>First hearing details</span> },
            value: {
              children: <span>Not entered</span>,
            },
            actions: {
              items: hideActions
                ? []
                : [
                    {
                      "data-testid": "change-first-hearing-link",
                      children: <span>Change</span>,
                      to: "/case-registration/first-hearing",
                      visuallyHiddenText: "First Hearing Details",
                      onClick: (event: React.MouseEvent<HTMLAnchorElement>) =>
                        handleAddChangeClick(event),
                    },
                  ],
            },
          },
        ];
  return rows;
};

export const getCaseComplexityAndMonitoringCodesSummaryListRows = (
  dispatch: React.Dispatch<CaseRegistrationActions>,
  navigate: NavigateFunction,
  formData: CaseRegistrationFormData,
  caseMonitoringCodes: CaseMonitoringCodes,
  hideActions: boolean,
) => {
  const handleAddChangeClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    url: string,
  ) => {
    event.preventDefault();
    dispatch({
      type: "SET_NAVIGATION_DATA",
      payload: { fromCaseSummaryPage: true },
    });
    navigate(url);
  };
  const sortedMonitoringCodes = () => {
    const mappedCodes = formData.caseMonitoringCodesCheckboxes.map((code) => {
      const item = caseMonitoringCodes.find((item) => item.code === code);
      return item
        ? { code: item.code, display: item.display }
        : { code, display: code };
    });

    return mappedCodes.sort((a, b) => {
      return a.display.localeCompare(b.display);
    });
  };

  const rows = [
    {
      key: { children: <span>Case complexity</span> },
      value: {
        children: <span>{formData.caseComplexityRadio?.description}</span>,
      },
      actions: {
        items: hideActions
          ? []
          : [
              {
                "data-testid": "change-case-complexity-link",
                children: <span>Change</span>,
                to: "/case-registration/case-complexity",
                visuallyHiddenText: "Case Complexity",
                onClick: (event: React.MouseEvent<HTMLAnchorElement>) =>
                  handleAddChangeClick(
                    event,
                    "/case-registration/case-complexity",
                  ),
              },
            ],
      },
    },
    {
      key: { children: <span>Monitoring codes</span> },
      value: {
        children: (
          <ul className="govuk-list govuk-list--bullet">
            {sortedMonitoringCodes().map(({ code, display }) => (
              <li key={code}>{display}</li>
            ))}
          </ul>
        ),
      },
      actions: {
        items: hideActions
          ? []
          : [
              {
                "data-testid": "change-monitoring-codes-link",
                children: <span>Change</span>,
                to: "/case-registration/case-monitoring-codes",
                visuallyHiddenText: "Monitoring Codes",
                onClick: (event: React.MouseEvent<HTMLAnchorElement>) =>
                  handleAddChangeClick(
                    event,
                    "/case-registration/case-monitoring-codes",
                  ),
              },
            ],
      },
    },
  ];
  return rows;
};

const getInvestigatorSummaryText = (formData: CaseRegistrationFormData) => {
  if (formData.caseInvestigatorTitleSelect.display) {
    return (
      <>
        <Tag gdsTagColour="blue">{`${formData.caseInvestigatorTitleSelect.display}`}</Tag>{" "}
        - {formData.caseInvestigatorLastNameText},{" "}
        {formData.caseInvestigatorFirstNameText}
      </>
    );
  }
  if (formData.caseInvestigatorFirstNameText) {
    return `${formData.caseInvestigatorLastNameText}, ${formData.caseInvestigatorFirstNameText}`;
  }
  return formData.caseInvestigatorLastNameText;
};

export const getWhosIsWorkingOnTheCaseSummaryListRows = (
  dispatch: React.Dispatch<CaseRegistrationActions>,
  navigate: NavigateFunction,
  formData: CaseRegistrationFormData,
  hideActions: boolean,
  policeUnit?: PoliceUnit,
) => {
  const handleAddChangeClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    url: string,
  ) => {
    event.preventDefault();
    dispatch({
      type: "SET_NAVIGATION_DATA",
      payload: { fromCaseSummaryPage: true },
    });
    navigate(url);
  };
  const investigatorDetailsList =
    formData.caseInvestigatorRadio === "yes"
      ? [
          {
            key: { children: <span>Police officer or investigator</span> },
            value: {
              children: <span>{getInvestigatorSummaryText(formData)}</span>,
            },
            actions: {
              items: hideActions
                ? []
                : [
                    {
                      "data-testid": "change-case-investigator-link",
                      children: <span>Change</span>,
                      to: "/case-registration/case-assignee",
                      visuallyHiddenText: "Police officer or investigator",
                      onClick: (event: React.MouseEvent<HTMLAnchorElement>) =>
                        handleAddChangeClick(
                          event,
                          "/case-registration/case-assignee",
                        ),
                    },
                  ],
            },
          },
          {
            key: { children: <span>Shoulder number</span> },
            value: {
              children: (
                <span>
                  {formData.caseInvestigatorShoulderNumberText
                    ? formData.caseInvestigatorShoulderNumberText
                    : "Not entered"}
                </span>
              ),
            },
            actions: {
              items: hideActions
                ? []
                : [
                    {
                      "data-testid": "change-shoulder-number-link",
                      children: <span>Change</span>,
                      to: "/case-registration/case-assignee",
                      visuallyHiddenText: "Shoulder Number",
                      onClick: (event: React.MouseEvent<HTMLAnchorElement>) =>
                        handleAddChangeClick(
                          event,
                          "/case-registration/case-assignee",
                        ),
                    },
                  ],
            },
          },
          {
            key: { children: <span>Police unit</span> },
            value: {
              children: (
                <span>
                  {policeUnit ? policeUnit.description : "Not entered"}
                </span>
              ),
            },
            actions: {
              items: hideActions
                ? []
                : [
                    {
                      "data-testid": "change-police-unit-link",
                      children: <span>Change</span>,
                      to: "/case-registration/case-assignee",
                      visuallyHiddenText: "Police Unit",
                      onClick: (event: React.MouseEvent<HTMLAnchorElement>) =>
                        handleAddChangeClick(
                          event,
                          "/case-registration/case-assignee",
                        ),
                    },
                  ],
            },
          },
        ]
      : [
          {
            key: { children: <span>Police officer or investigator</span> },
            value: {
              children: <span>Not entered</span>,
            },
            actions: {
              items: hideActions
                ? []
                : [
                    {
                      "data-testid":
                        "change-police-officer-or-investigator-link",
                      children: <span>Change</span>,
                      to: "/case-registration/case-assignee",
                      visuallyHiddenText: "Police officer or investigator",
                      onClick: (event: React.MouseEvent<HTMLAnchorElement>) =>
                        handleAddChangeClick(
                          event,
                          "/case-registration/case-assignee",
                        ),
                    },
                  ],
            },
          },
        ];

  const rows = [
    {
      key: { children: <span>Prosecutor</span> },
      value: {
        children: (
          <span>
            {formData.caseProsecutorText.description
              ? formData.caseProsecutorText.description
              : "Not entered"}
          </span>
        ),
      },
      actions: {
        items: hideActions
          ? []
          : [
              {
                "data-testid": "change-prosecutor-link",
                children: <span>Change</span>,
                to: "/case-registration/case-assignee",
                visuallyHiddenText: "Prosecutor",
                onClick: (event: React.MouseEvent<HTMLAnchorElement>) =>
                  handleAddChangeClick(
                    event,
                    "/case-registration/case-assignee",
                  ),
              },
            ],
      },
    },
    {
      key: { children: <span>Caseworker</span> },
      value: {
        children: (
          <span>
            {formData.caseCaseworkerText?.description
              ? formData.caseCaseworkerText?.description
              : "Not entered"}
          </span>
        ),
      },
      actions: {
        items: hideActions
          ? []
          : [
              {
                "data-testid": "change-caseworker-link",
                children: <span>Change</span>,
                to: "/case-registration/case-assignee",
                visuallyHiddenText: "Caseworker",
                onClick: (event: React.MouseEvent<HTMLAnchorElement>) =>
                  handleAddChangeClick(
                    event,
                    "/case-registration/case-assignee",
                  ),
              },
            ],
      },
    },
    ...investigatorDetailsList,
  ];
  return rows;
};
