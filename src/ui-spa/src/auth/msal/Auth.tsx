import { MsalProvider } from "@azure/msal-react";
import React, { type FC, useEffect, useState, useRef } from "react";
import { msalInstance } from "./msalInstance";
import PrivateBetaAuthorisation from "./PrivateBetaAuthorisation";

export const Auth: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const redirecting = useRef(false); // ensures only one redirect per mount/session

  useEffect(() => {
    (async () => {
      await msalInstance.initialize();

      const redirectResult = await msalInstance.handleRedirectPromise();

      if (redirectResult?.account) {
        msalInstance.setActiveAccount(redirectResult.account);
      }

      const account =
        msalInstance.getActiveAccount() ?? msalInstance.getAllAccounts()[0];

      if (!account) {
        if (!redirecting.current) {
          redirecting.current = true; // prevent multiple redirects in dev
          await msalInstance.loginRedirect({ scopes: ["User.Read"] });
        }
        return;
      }

      setIsLoggedIn(true);
    })();
  }, []);

  return isLoggedIn ? (
    <MsalProvider instance={msalInstance}>
      <PrivateBetaAuthorisation msalInstance={msalInstance}>
        {children}
      </PrivateBetaAuthorisation>
    </MsalProvider>
  ) : null;
};