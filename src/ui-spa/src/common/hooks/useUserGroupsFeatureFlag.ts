import { msalInstance } from "../../auth/msal/msalInstance";
import { FEATURE_FLAG_CASE_REGISTRATION_V2 } from "../../config";
import { useUserDetails } from "../../auth";
import { FeatureFlagData } from "../../schemas/featureFlagData";
import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router";

const automationTestUsers = ["dev_user@example.org"];

const shouldShowFeature = (
  username: string,
  isUIFeatureFlagOn: boolean,
  searchParam: string | null,
  groupClaims?: { groupKey: string; groups: string[] },
) => {
  const isAutomationTestUser = automationTestUsers.includes(username);

  if (isAutomationTestUser) {
    return searchParam ? searchParam === "true" : isUIFeatureFlagOn;
  }

  return groupClaims
    ? groupClaims.groups.includes(groupClaims.groupKey) && isUIFeatureFlagOn
    : isUIFeatureFlagOn;
};

export const useUserGroupsFeatureFlag = (): FeatureFlagData | null => {
  const [account] = msalInstance.getAllAccounts();
  const userDetails = useUserDetails();
  const [searchParams] = useSearchParams();

  const getFeatureFlags = useCallback(() => {
    //skip the account check for automation user, ideally if the account is not available normal user shouldn't be here
    if (
      (!account && userDetails.username !== "dev_user@example.org") ||
      !userDetails.username
    )
      return null;

    return {
      caseRegistrationV2: shouldShowFeature(
        userDetails.username,
        FEATURE_FLAG_CASE_REGISTRATION_V2,
        searchParams?.get("case-registration-v2"),
      ),
    };
  }, [searchParams, account, userDetails.username]);

  return useMemo(() => getFeatureFlags(), [getFeatureFlags]);
};
