import { expect, test } from "./utils/test";
import { CaseRegistrationHomePage } from "./pages/caseRegistrationHomePage";
import { CaseAreasPage } from "./pages/caseAreasPage";
import { CaseDetailsPage } from "./pages/caseDetailsPage";
import { AddSuspectPage } from "./pages/addSuspectPage";
import { SuspectDOBPage } from "./pages/suspectDOBPage";
import { SuspectGenderPage } from "./pages/suspectGenderPage";
import { SuspectDisabilityPage } from "./pages/suspectDisabilityPage";
import { SuspectReligionPage } from "./pages/suspectReligionPage";
import { SuspectEthnicityPage } from "./pages/suspectEthnicityPage";
import { SuspectAliasesPage } from "./pages/suspectAddAliases";
import { SuspectASNPage } from "./pages/suspectASNPage";
import { SuspectOffenderTypesPage } from "./pages/suspectOffenderTypesPage";
import { SuspectAliasesSummaryPage } from "./pages/suspectAliasesSummary";
import { SuspectSummaryPage } from "./pages/suspectSummaryPage";
import { SuspectRemoveConfirmationPage } from "./pages/suspectRemoveConfirmationPage";
import { WantToAddChargesPage } from "./pages/wantToAddChargesPage";
import { CaseMonitoringPage } from "./pages/caseMonitoringPage";
import { CaseAssigneePage } from "./pages/caseAssigneePage";
import { CaseRegistrationSummaryPage } from "./pages/caseRegistrationSummaryPage";

test("Should successfully complete suspect journey", async ({ page }) => {
  await page.goto("http://localhost:5173");
  // await expect(page).toHaveTitle(/Case Management Register a Case/);
  const caseRegistrationHomePage = new CaseRegistrationHomePage(page);
  await caseRegistrationHomePage.verifyUrl();
  await caseRegistrationHomePage.verifyPageElements();
  await caseRegistrationHomePage.errorValidations();
  await caseRegistrationHomePage.addOperationName("thunderstruck");
  await caseRegistrationHomePage.addSuspect();
  await caseRegistrationHomePage.saveAndContinue();
  await caseRegistrationHomePage.verifyErrorSummaryClear();

  const caseAreasPage = new CaseAreasPage(page);
  await caseAreasPage.verifyUrl();
  await caseAreasPage.verifyBackLink("/case-registration");
  await caseAreasPage.backLinkClick();
  await caseRegistrationHomePage.verifyUrl();
  await caseRegistrationHomePage.saveAndContinue();
  await caseAreasPage.verifyUrl();
  await caseAreasPage.verifyPageElements();
  await caseAreasPage.errorValidations();
  await caseAreasPage.enterAreaOrDivision("CAMBRIDGESHIRE");
  await caseAreasPage.saveAndContinue();
  await caseAreasPage.verifyErrorSummaryClear();

  const caseDetailsPage = new CaseDetailsPage(page);
  await caseDetailsPage.verifyUrl();
  await caseDetailsPage.verifyBackLink("/case-registration/areas");
  await caseDetailsPage.backLinkClick();
  await caseAreasPage.verifyUrl();
  await caseAreasPage.saveAndContinue();
  await caseDetailsPage.verifyUrl();
  await caseDetailsPage.verifyPageElements();
  await caseDetailsPage.errorValidations();
  await caseDetailsPage.enterUrnPoliceForce("12");
  await caseDetailsPage.enterUrnPoliceUnit("21");
  await caseDetailsPage.enterUrnUniqueReference("12345");
  await caseDetailsPage.enterUrnYearReference("26");
  await caseDetailsPage.enterRegisteringUnit("NORTHERN CJU (Peterborough)");
  await caseDetailsPage.enterWitnessCareUnit(
    "Cambridgeshire Non Operational WCU",
  );
  await caseDetailsPage.saveAndContinue();
  await caseDetailsPage.verifyErrorSummaryClear();

  const addSuspectPage = new AddSuspectPage(page);
  await addSuspectPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/add-suspect",
  );
  await addSuspectPage.verifyBackLink("/case-registration/case-details");
  await addSuspectPage.backLinkClick();
  await caseDetailsPage.verifyUrl();
  await caseDetailsPage.saveAndContinue();
  await addSuspectPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/add-suspect",
  );
  await addSuspectPage.verifyBasePageElements();
  await addSuspectPage.addPersonSuspect();
  await addSuspectPage.verifyAdditionalElements();
  await addSuspectPage.addPersonSuspect();
  await addSuspectPage.addSuspectFirstName("harry");
  await addSuspectPage.addSuspectLastName("potter");
  await addSuspectPage.selectAdditionalDetailsDOB(true);
  await addSuspectPage.selectAdditionalDetailsGender(true);
  await addSuspectPage.selectAdditionalDetailsDisability(true);
  await addSuspectPage.selectAdditionalDetailsReligion(true);
  await addSuspectPage.selectAdditionalDetailsEthnicity(true);
  await addSuspectPage.selectAdditionalDetailsASN(true);
  await addSuspectPage.selectAdditionalDetailsAlias(true);
  await addSuspectPage.selectAdditionalDetailsOffenderType(true);
  await addSuspectPage.verifySelectedAdditionalDetails([
    "Date of birth",
    "Gender",
    "Disability",
    "Religion",
    "Ethnicity",
    "Alias details",
    "Arrest Summons Number (ASN)",
    "Type of offender",
  ]);
  await addSuspectPage.saveAndContinue();

  const suspectDOBPage = new SuspectDOBPage(page);
  await suspectDOBPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/suspect-dob",
  );
  await suspectDOBPage.verifyBackLink(
    "/case-registration/suspect-0/add-suspect",
  );
  await suspectDOBPage.backLinkClick();
  await addSuspectPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/add-suspect",
  );
  await addSuspectPage.saveAndContinue();
  await suspectDOBPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/suspect-dob",
  );
  await suspectDOBPage.verifyPageElements();
  await suspectDOBPage.errorValidations();
  await suspectDOBPage.addDOBDay("27");
  await suspectDOBPage.addDOBMonth("03");
  await suspectDOBPage.addDOBYear("2007");
  await suspectDOBPage.saveAndContinue();

  const suspectGenderPage = new SuspectGenderPage(page);
  await suspectGenderPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/suspect-gender",
  );
  await suspectGenderPage.verifyBackLink(
    "/case-registration/suspect-0/suspect-dob",
  );
  await suspectGenderPage.backLinkClick();
  await suspectDOBPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/suspect-dob",
  );
  await suspectDOBPage.saveAndContinue();
  await suspectGenderPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/suspect-gender",
  );
  await suspectGenderPage.verifyPageElements("POTTER, Harry");
  await suspectGenderPage.errorValidations();
  await suspectGenderPage.selectGenderMale();
  await suspectGenderPage.saveAndContinue();

  const suspectDisabilityPage = new SuspectDisabilityPage(page);
  await suspectDisabilityPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/suspect-disability",
  );
  await suspectDisabilityPage.verifyBackLink(
    "/case-registration/suspect-0/suspect-gender",
  );
  await suspectDisabilityPage.backLinkClick();
  await suspectGenderPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/suspect-gender",
  );
  await suspectGenderPage.saveAndContinue();
  await suspectDisabilityPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/suspect-disability",
  );
  await suspectDisabilityPage.verifyPageElements("POTTER, Harry");
  await suspectDisabilityPage.errorValidations();
  await suspectDisabilityPage.selectDisabilityYes();
  await suspectDisabilityPage.saveAndContinue();

  const suspectReligionPage = new SuspectReligionPage(page);
  await suspectReligionPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/suspect-religion",
  );
  await suspectReligionPage.verifyBackLink(
    "/case-registration/suspect-0/suspect-disability",
  );
  await suspectReligionPage.backLinkClick();
  await suspectDisabilityPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/suspect-disability",
  );
  await suspectDisabilityPage.saveAndContinue();
  await suspectReligionPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/suspect-religion",
  );
  await suspectReligionPage.verifyPageElements();
  await suspectReligionPage.errorValidations();
  await suspectReligionPage.selectReligionChristianity();
  await suspectReligionPage.saveAndContinue();

  const suspectEthnicityPage = new SuspectEthnicityPage(page);
  await suspectEthnicityPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/suspect-ethnicity",
  );
  await suspectEthnicityPage.verifyBackLink(
    "/case-registration/suspect-0/suspect-religion",
  );
  await suspectEthnicityPage.backLinkClick();
  await suspectReligionPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/suspect-religion",
  );
  await suspectReligionPage.saveAndContinue();
  await suspectEthnicityPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/suspect-ethnicity",
  );
  await suspectEthnicityPage.verifyPageElements();
  await suspectEthnicityPage.errorValidations();
  await suspectEthnicityPage.selectEthnicityBlack();
  await suspectEthnicityPage.saveAndContinue();

  const suspectAliasesPage = new SuspectAliasesPage(page);
  await suspectAliasesPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/suspect-add-aliases",
  );
  await suspectAliasesPage.verifyBackLink(
    "/case-registration/suspect-0/suspect-ethnicity",
  );
  await suspectAliasesPage.backLinkClick();
  await suspectEthnicityPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/suspect-ethnicity",
  );
  await suspectEthnicityPage.saveAndContinue();
  await suspectAliasesPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/suspect-add-aliases",
  );
  await suspectAliasesPage.verifyPageElements();
  await suspectAliasesPage.errorValidations();
  await suspectAliasesPage.addFirstName("Harry");
  await suspectAliasesPage.addLastName("Potter");
  await suspectAliasesPage.saveAndContinue();

  const suspectAliasesSummaryPage = new SuspectAliasesSummaryPage(page);
  await suspectAliasesSummaryPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/suspect-aliases-summary",
  );
  await suspectAliasesSummaryPage.verifyBackLink(
    "/case-registration/suspect-0/suspect-ethnicity",
  );
  await suspectAliasesSummaryPage.backLinkClick();
  await suspectEthnicityPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/suspect-ethnicity",
  );
  await suspectEthnicityPage.saveAndContinue();
  await suspectAliasesSummaryPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/suspect-aliases-summary",
  );
  await suspectAliasesSummaryPage.verifyPageElements();
  await suspectAliasesSummaryPage.errorValidations();
  await suspectAliasesSummaryPage.verifySuspectAliasesList(["POTTER, Harry"]);
  await suspectAliasesSummaryPage.selectAddMoreAliasesNo();
  await suspectAliasesSummaryPage.saveAndContinue();

  const suspectASNPage = new SuspectASNPage(page);
  await suspectASNPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/suspect-asn",
  );
  await suspectASNPage.verifyBackLink(
    "/case-registration/suspect-0/suspect-aliases-summary",
  );
  await suspectASNPage.backLinkClick();
  await suspectAliasesSummaryPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/suspect-aliases-summary",
  );
  await suspectAliasesSummaryPage.selectAddMoreAliasesNo();
  await suspectAliasesSummaryPage.saveAndContinue();
  await suspectASNPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/suspect-asn",
  );
  await suspectASNPage.verifyPageElements();
  await suspectASNPage.errorValidations();
  await suspectASNPage.addASNText("123456");
  await suspectASNPage.saveAndContinue();

  const suspectOffenderTypesPage = new SuspectOffenderTypesPage(page);
  await suspectOffenderTypesPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/suspect-offender",
  );
  await suspectOffenderTypesPage.verifyBackLink(
    "/case-registration/suspect-0/suspect-asn",
  );
  await suspectOffenderTypesPage.backLinkClick();
  await suspectASNPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/suspect-asn",
  );
  await suspectASNPage.saveAndContinue();
  await suspectOffenderTypesPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/suspect-offender",
  );
  await suspectOffenderTypesPage.verifyBasePageElements();
  await suspectOffenderTypesPage.errorValidations();
  await suspectOffenderTypesPage.verifyPYOElements();
  await suspectOffenderTypesPage.verifyYOElements();
  await suspectOffenderTypesPage.selectOffenderTypePYO();
  await suspectOffenderTypesPage.addArrestDate("2024-01-01");
  await suspectOffenderTypesPage.saveAndContinue();

  const suspectSummaryPage = new SuspectSummaryPage(page);
  await suspectSummaryPage.verifyUrl();
  await suspectSummaryPage.verifyBackLink("/case-registration/case-details");
  await suspectSummaryPage.backLinkClick();
  await caseDetailsPage.verifyUrl();
  await caseDetailsPage.saveAndContinue();
  await suspectSummaryPage.verifyUrl();
  await suspectSummaryPage.verifyPageElements("You have added 1 suspect");
  await suspectSummaryPage.errorValidations();
  await suspectSummaryPage.verifySuspectSummaryRows(["POTTER, Harry"]);
  await suspectSummaryPage.verifySuspectSummaryDetails(0, [
    { key: "Date of birth", value: "27/03/2007" },
    { key: "Gender", value: "Male" },
    { key: "Disability", value: "yes" },
    { key: "Religion", value: "Christianity" },
    { key: "Ethnicity", value: "Black" },
    { key: "Alias", value: "POTTER, Harry" },
    { key: "Arrest Summons Number", value: "123456" },
    { key: "Type of offender", value: "Prolific youth offender (PYO)" },
    { key: "Arrest date", value: "01 January 2024" },
  ]);
  await suspectSummaryPage.selectAddMoreSuspectYes();
  await suspectSummaryPage.saveAndContinue();
  await addSuspectPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-1/add-suspect",
  );

  await addSuspectPage.verifyBackLink("/case-registration/suspect-summary");
  await addSuspectPage.verifyBasePageElements();
  await addSuspectPage.addPersonSuspect();
  await addSuspectPage.verifyAdditionalElements();
  await addSuspectPage.addPersonSuspect();
  await addSuspectPage.addSuspectFirstName("steve");
  await addSuspectPage.addSuspectLastName("smith");
  await addSuspectPage.selectAdditionalDetailsDOB(true);
  await addSuspectPage.selectAdditionalDetailsGender(true);
  await addSuspectPage.selectAdditionalDetailsDisability(true);
  await addSuspectPage.selectAdditionalDetailsReligion(true);
  await addSuspectPage.selectAdditionalDetailsEthnicity(true);
  await addSuspectPage.selectAdditionalDetailsASN(true);
  await addSuspectPage.selectAdditionalDetailsAlias(true);
  await addSuspectPage.selectAdditionalDetailsOffenderType(true);
  await addSuspectPage.verifySelectedAdditionalDetails([
    "Date of birth",
    "Gender",
    "Disability",
    "Religion",
    "Ethnicity",
    "Alias details",
    "Arrest Summons Number (ASN)",
    "Type of offender",
  ]);
  await addSuspectPage.saveAndContinue();

  await suspectDOBPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-1/suspect-dob",
  );
  await suspectDOBPage.verifyBackLink(
    "/case-registration/suspect-1/add-suspect",
  );
  await suspectDOBPage.addDOBDay("15");
  await suspectDOBPage.addDOBMonth("06");
  await suspectDOBPage.addDOBYear("2007");
  await suspectDOBPage.saveAndContinue();

  await suspectGenderPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-1/suspect-gender",
  );
  await suspectGenderPage.verifyBackLink(
    "/case-registration/suspect-1/suspect-dob",
  );
  await suspectGenderPage.selectGenderFemale();
  await suspectGenderPage.saveAndContinue();

  await suspectDisabilityPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-1/suspect-disability",
  );
  await suspectDisabilityPage.verifyBackLink(
    "/case-registration/suspect-1/suspect-gender",
  );
  await suspectDisabilityPage.selectDisabilityNo();
  await suspectDisabilityPage.saveAndContinue();

  await suspectReligionPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-1/suspect-religion",
  );
  await suspectReligionPage.verifyBackLink(
    "/case-registration/suspect-1/suspect-disability",
  );
  await suspectReligionPage.selectReligionChristianity();
  await suspectReligionPage.saveAndContinue();

  await suspectEthnicityPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-1/suspect-ethnicity",
  );
  await suspectEthnicityPage.verifyBackLink(
    "/case-registration/suspect-1/suspect-religion",
  );
  await suspectEthnicityPage.selectEthnicityWhite();
  await suspectEthnicityPage.saveAndContinue();

  await suspectAliasesPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-1/suspect-add-aliases",
  );
  await suspectAliasesPage.verifyBackLink(
    "/case-registration/suspect-1/suspect-ethnicity",
  );
  await suspectAliasesPage.addFirstName("Stev");
  await suspectAliasesPage.addLastName("mark");
  await suspectAliasesPage.saveAndContinue();

  await suspectAliasesSummaryPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-1/suspect-aliases-summary",
  );
  await suspectAliasesSummaryPage.verifyBackLink(
    "/case-registration/suspect-1/suspect-ethnicity",
  );
  await suspectAliasesSummaryPage.verifySuspectAliasesList(["MARK, Stev"]);
  await suspectAliasesSummaryPage.selectAddMoreAliasesNo();
  await suspectAliasesSummaryPage.saveAndContinue();

  await suspectASNPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-1/suspect-asn",
  );
  await suspectASNPage.verifyBackLink(
    "/case-registration/suspect-1/suspect-aliases-summary",
  );
  await suspectASNPage.addASNText("1234");
  await suspectASNPage.saveAndContinue();

  await suspectOffenderTypesPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-1/suspect-offender",
  );
  await suspectOffenderTypesPage.verifyBackLink(
    "/case-registration/suspect-1/suspect-asn",
  );
  await suspectOffenderTypesPage.selectOffenderTypePPO();
  await suspectOffenderTypesPage.saveAndContinue();

  await suspectSummaryPage.verifyUrl();
  await suspectSummaryPage.verifyBackLink("/case-registration/case-details");
  await suspectSummaryPage.verifyPageElements("You have added 2 suspects");
  await suspectSummaryPage.errorValidations();
  await suspectSummaryPage.verifySuspectSummaryRows([
    "POTTER, Harry",
    "SMITH, Steve",
  ]);
  await suspectSummaryPage.verifySuspectSummaryDetails(1, [
    { key: "Date of birth", value: "15/06/2007" },
    { key: "Gender", value: "Female" },
    { key: "Disability", value: "no" },
    { key: "Religion", value: "Christianity" },
    { key: "Ethnicity", value: "White" },
    { key: "Alias", value: "MARK, Stev" },
    { key: "Arrest Summons Number", value: "1234" },
    { key: "Type of offender", value: "Prolific priority offender (PPO)" },
  ]);
  await suspectSummaryPage.changeSuspect(1);
  await addSuspectPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-1/add-suspect",
  );
  await addSuspectPage.verifyPersonSuspectSelected("steve", "smith");
  await addSuspectPage.verifySelectedAdditionalDetails([
    "Date of birth",
    "Gender",
    "Disability",
    "Religion",
    "Ethnicity",
    "Alias details",
    "Arrest Summons Number (ASN)",
    "Type of offender",
  ]);
  await addSuspectPage.selectAdditionalDetailsDisability(false);
  await addSuspectPage.selectAdditionalDetailsReligion(false);
  await addSuspectPage.selectAdditionalDetailsEthnicity(false);
  await addSuspectPage.selectAdditionalDetailsASN(false);
  await addSuspectPage.selectAdditionalDetailsAlias(false);
  await addSuspectPage.selectAdditionalDetailsOffenderType(false);
  await addSuspectPage.verifySelectedAdditionalDetails([
    "Date of birth",
    "Gender",
  ]);
  await addSuspectPage.saveAndContinue();

  await suspectDOBPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-1/suspect-dob",
  );
  await suspectDOBPage.addDOBDay("15");
  await suspectDOBPage.addDOBMonth("06");
  await suspectDOBPage.addDOBYear("2007");
  await suspectDOBPage.saveAndContinue();

  await suspectGenderPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-1/suspect-gender",
  );
  await suspectGenderPage.selectGenderFemale();
  await suspectGenderPage.saveAndContinue();
  await suspectSummaryPage.verifyUrl();
  await suspectSummaryPage.verifyPageElements("You have added 2 suspects");
  await suspectSummaryPage.errorValidations();
  await suspectSummaryPage.verifySuspectSummaryRows([
    "POTTER, Harry",
    "SMITH, Steve",
  ]);
  await suspectSummaryPage.verifySuspectSummaryDetails(1, [
    { key: "Date of birth", value: "15/06/2007" },
    { key: "Gender", value: "Female" },
  ]);
  await suspectSummaryPage.removeSuspect(1);
  const suspectRemoveConfirmationPage = new SuspectRemoveConfirmationPage(page);
  await suspectRemoveConfirmationPage.verifyUrl();
  await suspectRemoveConfirmationPage.verifyPageElements("SMITH, Steve");
  await suspectRemoveConfirmationPage.cancel();
  await suspectSummaryPage.verifyPageElements("You have added 2 suspects");
  await suspectSummaryPage.verifySuspectSummaryRows([
    "POTTER, Harry",
    "SMITH, Steve",
  ]);
  await suspectSummaryPage.removeSuspect(1);
  await suspectRemoveConfirmationPage.verifyUrl();
  await suspectRemoveConfirmationPage.verifyPageElements("SMITH, Steve");
  await suspectRemoveConfirmationPage.saveAndContinue();
  await suspectSummaryPage.verifyUrl();
  await suspectSummaryPage.verifyPageElements("You have added 1 suspect");
  await suspectSummaryPage.verifySuspectSummaryRows(["POTTER, Harry"]);
  await suspectSummaryPage.selectAddMoreSuspectNo();
  await suspectSummaryPage.saveAndContinue();

  const wantToAddChargesPage = new WantToAddChargesPage(page);
  await wantToAddChargesPage.verifyUrl();
  await wantToAddChargesPage.verifyBackLink(
    "/case-registration/suspect-summary",
  );
  await wantToAddChargesPage.backLinkClick();
  await suspectSummaryPage.verifyUrl();
  await suspectSummaryPage.selectAddMoreSuspectNo();
  await suspectSummaryPage.saveAndContinue();
  await wantToAddChargesPage.verifyUrl();
  await wantToAddChargesPage.verifyPageElements(
    "Do you want to add charges for the suspect?",
  );
  await wantToAddChargesPage.errorValidations();
  await wantToAddChargesPage.selectAddChargesNo();
  await wantToAddChargesPage.saveAndContinue();

  const caseMonitoringPage = new CaseMonitoringPage(page);
  await caseMonitoringPage.verifyUrl();
  await caseMonitoringPage.verifyBackLink(
    "/case-registration/want-to-add-charges",
  );
  await caseMonitoringPage.backLinkClick();
  await wantToAddChargesPage.verifyUrl();
  await wantToAddChargesPage.saveAndContinue();
  await caseMonitoringPage.verifyUrl();
  await caseMonitoringPage.verifyPageElements(45);
  await caseMonitoringPage.verifyPreChargeCheckboxChecked();
  await caseMonitoringPage.selectMonitoringCode("Asset Recovery");
  await caseMonitoringPage.saveAndContinue();
  await caseMonitoringPage.verifyErrorSummaryClear();

  const caseAssigneePage = new CaseAssigneePage(page);
  await caseAssigneePage.verifyUrl();
  await caseAssigneePage.verifyBackLink(
    "/case-registration/case-monitoring-codes",
  );
  await caseAssigneePage.backLinkClick();
  await caseMonitoringPage.verifyUrl();
  await caseMonitoringPage.saveAndContinue();
  await caseAssigneePage.verifyUrl();
  await caseAssigneePage.verifyPageElements();
  await caseAssigneePage.errorValidations();
  await caseAssigneePage.addProsecutorYes();
  await caseAssigneePage.addInvestigatorYes();
  await caseAssigneePage.enterProsecutorName("Prosecutor A");
  await caseAssigneePage.enterCaseworkerName("Caseworker A");
  await caseAssigneePage.addInvestigatorFirstName("Investigator F");
  await caseAssigneePage.addInvestigatorLastName("Investigator L");
  await caseAssigneePage.addInvestigatorShoulderNumber("12345");
  await caseAssigneePage.saveAndContinue();
  await expect(page).toHaveURL(
    "http://localhost:5173/case-registration/case-summary",
  );

  const caseRegistrationSummaryPage = new CaseRegistrationSummaryPage(page);
  await caseRegistrationSummaryPage.verifyUrl();
  await caseRegistrationSummaryPage.verifyBackLink(
    "/case-registration/case-assignee",
  );
  await caseRegistrationSummaryPage.backLinkClick();
  await caseAssigneePage.verifyUrl();
  await caseAssigneePage.saveAndContinue();
  await caseRegistrationSummaryPage.verifyUrl();
  await caseRegistrationSummaryPage.verifyCaseDetailsElements({
    area: "CAMBRIDGESHIRE",
    urn: "122112345/26",
    registeringUnit: "NORTHERN CJU (Peterborough)",
    wcu: "Cambridgeshire Non Operational WCU",
    operationName: "thunderstruck",
  });
  await caseRegistrationSummaryPage.verifyAddNewSuspectElements(1);
  await caseRegistrationSummaryPage.verifySuspectSummaryRows(["POTTER, Harry"]);
  await caseRegistrationSummaryPage.verifySuspectSummaryDetails(0, [
    { key: "Date of birth", value: "27/03/2007" },
    { key: "Gender", value: "Male" },
    { key: "Disability", value: "yes" },
    { key: "Religion", value: "Christianity" },
    { key: "Ethnicity", value: "Black" },
    { key: "Alias", value: "POTTER, Harry" },
    { key: "Arrest Summons Number", value: "123456" },
    { key: "Type of offender", value: "Prolific youth offender (PYO)" },
    { key: "Arrest date", value: "01 January 2024" },
  ]);
  await caseRegistrationSummaryPage.verifyComplexityAndMonitoringCodesElements({
    complexity: "Basic",
    monitoringCodes: ["Asset Recovery", "Pre-Charge Decision"],
  });
  await caseRegistrationSummaryPage.verifyWorkingOnTheCaseElements({
    prosecutor: "Prosecutor A",
    caseworker: "Caseworker A",
    investigator: "InvestigatorL, InvestigatorF",
    shoulderNumber: "12345",
    policeUnit: "Not entered",
  });
});
