import { useMemo } from "react";
import { type SuspectAdditionalDetailValue } from "../../common/reducers/caseRegistrationReducer";
import { getPreviousSuspectJourneyRoute } from "../../common/utils/getSuspectJourneyRoutes";

export default function usePreviousSuspectRoute(
  currentRoute: string,
  suspectAdditionalDetailsCheckboxes: SuspectAdditionalDetailValue[],
  suspectIndex: number,
) {
  return useMemo(() => {
    return getPreviousSuspectJourneyRoute(
      currentRoute,
      suspectAdditionalDetailsCheckboxes,
      suspectIndex,
    );
  }, [currentRoute, suspectAdditionalDetailsCheckboxes, suspectIndex]);
}
