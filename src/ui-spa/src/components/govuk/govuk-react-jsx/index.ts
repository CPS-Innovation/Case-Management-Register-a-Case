//This is a workaround for managing the gov-uk-react library's component as it was throwing error after update of react-router to 8 as it was using Link component from "react-router-dom".
//which is no longer available with version 8.
//This could be a new way to manage the dependency on the govuk-react-jsx library by copying the component we use and manage it internally

// @ts-expect-error: Could not find a declaration file for module './summary-list'.
export { SummaryList } from "./summary-list";
