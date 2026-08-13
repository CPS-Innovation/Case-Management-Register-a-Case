import { PublicClientApplication } from "@azure/msal-browser";
import { CLIENT_ID, TENANT_ID } from "../../config";

export const msalInstance = new PublicClientApplication({
  auth: {
    clientId: CLIENT_ID,
    authority: `https://login.microsoftonline.com/${TENANT_ID}`,
    // msal-browser v5 routes every flow through a redirect bridge page so it
    // works when the authority sends Cross-Origin-Opener-Policy headers. This
    // URI must also be registered on the Entra app registration.
    redirectUri: "/redirect.html",
    postLogoutRedirectUri: "/",
  },
});
