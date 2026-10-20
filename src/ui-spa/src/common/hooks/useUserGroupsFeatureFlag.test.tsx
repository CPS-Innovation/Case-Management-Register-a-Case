import { type Mock } from "vitest";
import { renderHook } from "@testing-library/react";
import { useUserGroupsFeatureFlag } from "./useUserGroupsFeatureFlag";
import * as configModule from "../../config";
import * as msalInstanceModule from "../../auth/msal/msalInstance";
import * as auth from "../../auth";
import * as router from "react-router";

vi.mock("../../config");
vi.mock("../../auth/msal/msalInstance", () => ({
  msalInstance: {
    getAllAccounts: vi.fn(),
  },
}));
vi.mock("../../auth", () => {
  return {
    useUserDetails: vi.fn(() => ({
      username: "test_username",
    })),
  };
});
vi.mock("react-router", () => {
  return {
    useSearchParams: vi.fn(() => [new URLSearchParams("foo=bar"), vi.fn()]),
  };
});

const mockConfig = configModule as {
  FEATURE_FLAG_CASE_REGISTRATION_V2: boolean;
  PRIVATE_BETA_FEATURE_USER_GROUP2: string;
};

describe("useUserGroupsFeatureFlag", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });
  describe("null value validation", () => {
    test("Should return null, if user account is not available if it is a non automation test user", () => {
      (msalInstanceModule.msalInstance.getAllAccounts as Mock).mockReturnValue(
        [],
      );
      const { result } = renderHook(() => useUserGroupsFeatureFlag());
      expect(result.current).toBeNull();
    });

    test("Should not return null, if user account is not available if it is an automation test user", () => {
      (msalInstanceModule.msalInstance.getAllAccounts as Mock).mockReturnValue(
        [],
      );
      (auth.useUserDetails as Mock).mockReturnValue({
        username: "dev_user@example.org",
      });
      const { result } = renderHook(() => useUserGroupsFeatureFlag());
      expect(result.current).not.toBeNull();
    });

    test("Should return null, if username is not available", () => {
      (msalInstanceModule.msalInstance.getAllAccounts as Mock).mockReturnValue([
        {
          name: "test_name",
          idTokenClaims: {
            groups: ["private_beta_feature_group2"],
          },
        },
      ]);
      (auth.useUserDetails as Mock).mockReturnValue({});

      const { result } = renderHook(() => useUserGroupsFeatureFlag());
      expect(result.current).toBeNull();
    });
  });

  describe("caseRegistrationV2 feature flag", () => {
    test("Should return caseRegistrationV2 feature false, if FEATURE_FLAG_CASE_REGISTRATION_V2 is false for normal user", () => {
      (msalInstanceModule.msalInstance.getAllAccounts as Mock).mockReturnValue([
        {
          username: "test_username",
          name: "test_name",
          idTokenClaims: {
            groups: ["private_beta_feature_group2"],
          },
        },
      ]);
      mockConfig.FEATURE_FLAG_CASE_REGISTRATION_V2 = false;
      const { result } = renderHook(() => useUserGroupsFeatureFlag());
      expect(result?.current?.caseRegistrationV2).toStrictEqual(false);
    });
    test("Should return caseRegistrationV2 feature false, if FEATURE_FLAG_CASE_REGISTRATION_V2 is false for automation test user ", () => {
      (auth.useUserDetails as Mock).mockReturnValue({
        username: "dev_user@example.org",
      });
      (msalInstanceModule.msalInstance.getAllAccounts as Mock).mockReturnValue([
        {
          username: "dev_user@example.org",
          name: "dev_user",
          idTokenClaims: {
            groups: ["private_beta_feature_group2"],
          },
        },
      ]);
      mockConfig.FEATURE_FLAG_CASE_REGISTRATION_V2 = false;

      const { result } = renderHook(() => useUserGroupsFeatureFlag());
      expect(result?.current?.caseRegistrationV2).toStrictEqual(false);
    });
    test("Should return caseRegistrationV2 feature false, if FEATURE_FLAG_CASE_REGISTRATION_V2 is true and the user is not added to PRIVATE_BETA_FEATURE_USER_GROUP2 for normal user", () => {
      (msalInstanceModule.msalInstance.getAllAccounts as Mock).mockReturnValue([
        {
          username: "test_username",
          name: "test_name",
          idTokenClaims: {
            groups: ["private_beta_feature_group1"],
          },
        },
      ]);
      mockConfig.FEATURE_FLAG_CASE_REGISTRATION_V2 = true;
      mockConfig.PRIVATE_BETA_FEATURE_USER_GROUP2 =
        "private_beta_feature_group2";
      const { result } = renderHook(() => useUserGroupsFeatureFlag());
      expect(result?.current?.caseRegistrationV2).toStrictEqual(false);
    });
    test("Should return caseRegistrationV2 feature true, if FEATURE_FLAG_CASE_REGISTRATION_V2 is true and the user is added to PRIVATE_BETA_FEATURE_USER_GROUP2 for normal user", () => {
      (msalInstanceModule.msalInstance.getAllAccounts as Mock).mockReturnValue([
        {
          username: "test_username",
          name: "test_name",
          idTokenClaims: {
            groups: ["private_beta_feature_group2"],
          },
        },
      ]);
      mockConfig.FEATURE_FLAG_CASE_REGISTRATION_V2 = true;
      mockConfig.PRIVATE_BETA_FEATURE_USER_GROUP2 =
        "private_beta_feature_group2";
      const { result } = renderHook(() => useUserGroupsFeatureFlag());
      expect(result?.current?.caseRegistrationV2).toStrictEqual(true);
    });
    test("Should return caseRegistrationV2 feature true, if FEATURE_FLAG_CASE_REGISTRATION_V2 is true even if the user is not added to PRIVATE_BETA_FEATURE_USER_GROUP2 for automation user", () => {
      (auth.useUserDetails as Mock).mockReturnValue({
        username: "dev_user@example.org",
      });
      (msalInstanceModule.msalInstance.getAllAccounts as Mock).mockReturnValue([
        {
          username: "test_username",
          name: "test_name",
          idTokenClaims: {
            groups: ["private_beta_feature_group1"],
          },
        },
      ]);
      mockConfig.FEATURE_FLAG_CASE_REGISTRATION_V2 = true;
      mockConfig.PRIVATE_BETA_FEATURE_USER_GROUP2 =
        "private_beta_feature_group2";
      const { result } = renderHook(() => useUserGroupsFeatureFlag());
      expect(result?.current?.caseRegistrationV2).toStrictEqual(true);
    });

    test("Should return caseRegistrationV2 feature true, if it is an automation user with search param case-registration-v2=true, search param take priority for automation user", () => {
      (auth.useUserDetails as Mock).mockReturnValue({
        username: "dev_user@example.org",
      });
      (router.useSearchParams as Mock).mockReturnValue([
        new URLSearchParams("case-registration-v2=true"),
        vi.fn(),
      ]);

      (msalInstanceModule.msalInstance.getAllAccounts as Mock).mockReturnValue([
        {
          username: "test_username",
          name: "test_name",
          idTokenClaims: {
            groups: ["private_beta_feature_group1"],
          },
        },
      ]);
      mockConfig.FEATURE_FLAG_CASE_REGISTRATION_V2 = false;
      const { result } = renderHook(() => useUserGroupsFeatureFlag());
      expect(result?.current?.caseRegistrationV2).toStrictEqual(true);
    });
    test("Should return caseRegistrationV2 feature false, if it is an automation user with search param case-registration-v2=false, search param take priority for automation user", () => {
      (auth.useUserDetails as Mock).mockReturnValue({
        username: "dev_user@example.org",
      });
      (router.useSearchParams as Mock).mockReturnValue([
        new URLSearchParams("case-registration-v2=false"),
        vi.fn(),
      ]);

      (msalInstanceModule.msalInstance.getAllAccounts as Mock).mockReturnValue([
        {
          username: "test_username",
          name: "test_name",
          idTokenClaims: {
            groups: ["private_beta_feature_group1"],
          },
        },
      ]);
      mockConfig.FEATURE_FLAG_CASE_REGISTRATION_V2 = true;

      const { result } = renderHook(() => useUserGroupsFeatureFlag());
      expect(result?.current?.caseRegistrationV2).toStrictEqual(false);
    });
  });
});
