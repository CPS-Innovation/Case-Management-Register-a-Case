import { useMemo } from "react";
import { type SuspectAdditionalDetailValue } from "../reducers/caseRegistrationReducer";
import {
  getPreviousSuspectJourneyRoute,
  getNextSuspectJourneyRoute,
} from "../utils/getSuspectJourneyRoutes";

export default function useGetSuspectRoute(
  currentRoute: string,
  suspectAdditionalDetailsCheckboxes: SuspectAdditionalDetailValue[],
  suspectIndex: number,
  hasAliases: boolean,
) {
  const previousRoute = useMemo(() => {
    return getPreviousSuspectJourneyRoute(
      currentRoute,
      suspectAdditionalDetailsCheckboxes,
      suspectIndex,
    );
  }, [currentRoute, suspectAdditionalDetailsCheckboxes, suspectIndex]);

  const nextRoute = useMemo(() => {
    return getNextSuspectJourneyRoute(
      currentRoute,
      suspectAdditionalDetailsCheckboxes,
      suspectIndex,
      hasAliases,
    );
  }, [
    currentRoute,
    suspectAdditionalDetailsCheckboxes,
    suspectIndex,
    hasAliases,
  ]);

  return { previousRoute, nextRoute };
}
