import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const routeTitles: Record<string, string> = {
  "/case-registration": "Home",
  "/areas": "Case Areas",
  "/case-details": "Case Details",
  "/first-hearing": "First Hearing",
  "/case-complexity": "Case Complexity",
  "/case-monitoring-codes": "Case Monitoring Codes",
  "/case-assignee": "Case Assignee",
  "/case-summary": "Case Summary",
  "/case-registration-confirmation": "Case Registration Confirmation",
  "/add-suspect": "Add Suspect",
  "/suspect-dob": "Suspect Date of Birth",
  "/suspect-gender": "Suspect Gender",
  "/suspect-ethnicity": "Suspect Ethnicity",
  "/suspect-religion": "Suspect Religion",
  "/suspect-disability": "Suspect Disability",
  "/suspect-asn": "Suspect ASN",
  "/suspect-offender": "Suspect Offender",
  "/suspect-add-aliases": "Suspect Add Aliases",
  "/suspect-aliases-summary": "Suspect Aliases Summary",
  "/suspect-summary": "Suspect Summary",
  "/suspect-remove-confirmation": "Suspect Remove Confirmation",
  "/want-to-add-charges": "Want to Add Charges",
  "/add-charge-suspect": "Add Charge Suspect",
  "/charges-offence-search": "Charges Offence Search",
  "/add-charge-details": "Add Charge Details",
  "/charges-summary": "Charges Summary",
  "/add-charge-victim": "Add Charge Victim",
  "/charge-remove-confirmation": "Charge Remove Confirmation",
  "/charges-victim-duplicate-confirmation":
    "Charges Victim Duplicate Confirmation",
  "/change-area-confirmation": "Change Area Confirmation",
  "/change-registering-unit-confirmation":
    "Change Registering Unit Confirmation",
  "/remove-all-suspects-confirmation": "Remove All Suspects Confirmation",
};

const DEFAULT_TITLE = "Home";

export const useRouteDocumentTitle = (): { title: string } => {
  const { pathname } = useLocation();
  const [title, setTitle] = useState<string>("");
  useEffect(() => {
    const normalized = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
    const lastSlashIndex = normalized.lastIndexOf("/");
    const lastSegment = normalized.substring(lastSlashIndex);
    const title = `${routeTitles[lastSegment] ?? DEFAULT_TITLE} - Case Registration`;
    document.title = title;
    setTitle(title);
  }, [pathname]);
  return { title };
};

export default useRouteDocumentTitle;
