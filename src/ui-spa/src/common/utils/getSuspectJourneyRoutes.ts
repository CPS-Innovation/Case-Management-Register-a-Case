import { type SuspectAdditionalDetailValue } from "../reducers/caseRegistrationReducer";

const routeSequence: {
  route: string;
  description: SuspectAdditionalDetailValue | "Add suspect";
}[] = [
  {
    route: "add-suspect",
    description: "Add suspect",
  },
  {
    route: "suspect-dob",
    description: "Date of birth",
  },
  {
    route: "suspect-offender",
    description: "Type of offender",
  },
  {
    route: "suspect-gender",
    description: "Gender",
  },
  {
    route: "suspect-disability",
    description: "Disability",
  },
  {
    route: "suspect-religion",
    description: "Religion",
  },
  {
    route: "suspect-ethnicity",
    description: "Ethnicity",
  },
  {
    route: "suspect-add-aliases",
    description: "Alias details",
  },
  {
    route: "suspect-asn",
    description: "Arrest Summons Number (ASN)",
  },
];

export const getNextSuspectJourneyRoute = (
  currentRoute: string,
  suspectAdditionalDetailsCheckboxes: SuspectAdditionalDetailValue[],
  currentSuspectIndex: number,
  hasAliases: boolean = false,
): string => {
  const shouldInclude = (description: SuspectAdditionalDetailValue) => {
    return suspectAdditionalDetailsCheckboxes.includes(description);
  };

  const filteredSequence = routeSequence.filter((item) => {
    if (item.description !== "Add suspect") {
      return shouldInclude(item.description);
    }
    return false;
  });

  const currentIndex = filteredSequence.findIndex(
    (item) => item.route === currentRoute,
  );

  if (filteredSequence[currentIndex + 1]?.route) {
    if (
      filteredSequence[currentIndex + 1].route === "suspect-add-aliases" &&
      hasAliases
    ) {
      return `/case-registration/suspect-${currentSuspectIndex}/suspect-aliases-summary`;
    }
    return `/case-registration/suspect-${currentSuspectIndex}/${filteredSequence[currentIndex + 1].route}`;
  }

  return `/case-registration/suspect-summary`;
};

export const getPreviousSuspectJourneyRoute = (
  currentRoute: string,
  suspectAdditionalDetailsCheckboxes: SuspectAdditionalDetailValue[],
  currentSuspectIndex: number,
): string => {
  const shouldInclude = (description: SuspectAdditionalDetailValue) => {
    return suspectAdditionalDetailsCheckboxes.includes(description);
  };

  const filteredSequence = routeSequence.filter((item) => {
    if (item.description !== "Add suspect") {
      return shouldInclude(item.description);
    }
    return false;
  });

  const currentIndex = filteredSequence.findIndex(
    (item) => item.route === currentRoute,
  );

  if (filteredSequence[currentIndex - 1]?.route) {
    if (filteredSequence[currentIndex - 1].route === "suspect-add-aliases") {
      return `/case-registration/suspect-${currentSuspectIndex}/suspect-aliases-summary`;
    }
    return `/case-registration/suspect-${currentSuspectIndex}/${filteredSequence[currentIndex - 1].route}`;
  }

  return `/case-registration/suspect-${currentSuspectIndex}/add-suspect`;
};
