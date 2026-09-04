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
import { WantToAddChargesPage } from "./pages/wantToAddChargesPage";
import { CaseMonitoringPage } from "./pages/caseMonitoringPage";
import { CaseAssigneePage } from "./pages/caseAssigneePage";
import { CaseRegistrationSummaryPage } from "./pages/caseRegistrationSummaryPage";

test("Should successfully complete suspect journey with skip all additional details and some of additional details", async ({
  page,
}) => {
  await page.goto("http://localhost:5173");
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
  await suspectDOBPage.verifyPageElements();
  await suspectDOBPage.saveAndContinue();
  await suspectDOBPage.verifySkipDOBAdditionalDetails();
  await suspectDOBPage.clickSkipDOBAdditionalDetails();

  const suspectGenderPage = new SuspectGenderPage(page);
  await suspectGenderPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/suspect-gender",
  );
  await suspectGenderPage.saveAndContinue();
  await suspectGenderPage.verifySkipGenderAdditionalDetails();
  await suspectGenderPage.clickSkipGenderAdditionalDetails();

  const suspectDisabilityPage = new SuspectDisabilityPage(page);
  await suspectDisabilityPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/suspect-disability",
  );
  await suspectDisabilityPage.saveAndContinue();
  await suspectDisabilityPage.verifySkipDisabilityAdditionalDetails();
  await suspectDisabilityPage.clickSkipDisabilityAdditionalDetails();

  const suspectReligionPage = new SuspectReligionPage(page);
  await suspectReligionPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/suspect-religion",
  );
  await suspectReligionPage.saveAndContinue();
  await suspectReligionPage.verifySkipReligionAdditionalDetails();
  await suspectReligionPage.clickSkipReligionAdditionalDetails();

  const suspectEthnicityPage = new SuspectEthnicityPage(page);
  await suspectEthnicityPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/suspect-ethnicity",
  );
  await suspectEthnicityPage.saveAndContinue();
  await suspectEthnicityPage.verifySkipEthnicityAdditionalDetails();
  await suspectEthnicityPage.clickSkipEthnicityAdditionalDetails();

  const suspectAliasesPage = new SuspectAliasesPage(page);
  await suspectAliasesPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/suspect-add-aliases",
  );
  await suspectAliasesPage.saveAndContinue();
  await suspectAliasesPage.verifySkipAddAliasesAdditionalDetails();
  await suspectAliasesPage.clickSkipAddAliasesAdditionalDetails();

  const suspectASNPage = new SuspectASNPage(page);
  await suspectASNPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/suspect-asn",
  );
  await suspectASNPage.saveAndContinue();
  await suspectASNPage.verifySkipASNAdditionalDetails();
  await suspectASNPage.clickSkipASNAdditionalDetails();

  const suspectOffenderTypesPage = new SuspectOffenderTypesPage(page);
  await suspectOffenderTypesPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/suspect-offender",
  );
  await suspectOffenderTypesPage.saveAndContinue();
  await suspectOffenderTypesPage.verifySkipOffenderTypesAdditionalDetails();
  await suspectOffenderTypesPage.clickSkipOffenderTypesAdditionalDetails();

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
  await suspectSummaryPage.verifyNoSuspectSummaryDetails(0);

  //adding a second suspect with mix of skip and details
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
  //coming back to the dob and clearing the texts to check reset on skip the dob details
  await suspectSummaryPage.backLinkClick();
  await suspectDOBPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-1/suspect-dob",
  );
  await suspectDOBPage.addDOBDay("");
  await suspectDOBPage.addDOBMonth("");
  await suspectDOBPage.addDOBYear("");
  await suspectDOBPage.saveAndContinue();
  await suspectDOBPage.verifySkipDOBAdditionalDetails();
  await suspectDOBPage.clickSkipDOBAdditionalDetails();
  await suspectGenderPage.verifyBackLink(
    "/case-registration/suspect-1/suspect-dob",
  );
  await suspectGenderPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-1/suspect-gender",
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
  const suspectAliasesSummaryPage = new SuspectAliasesSummaryPage(page);
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
  //coming back to the asn and clearing the texts to check reset on skip the asn details
  await suspectOffenderTypesPage.backLinkClick();
  await suspectASNPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-1/suspect-asn",
  );
  await suspectASNPage.addASNText("");
  await suspectASNPage.saveAndContinue();
  await suspectASNPage.verifySkipASNAdditionalDetails();
  await suspectASNPage.clickSkipASNAdditionalDetails();

  await suspectOffenderTypesPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-1/suspect-offender",
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
    { key: "Gender", value: "Female" },
    { key: "Disability", value: "no" },
    { key: "Religion", value: "Christianity" },
    { key: "Ethnicity", value: "White" },
    { key: "Alias", value: "MARK, Stev" },
    { key: "Type of offender", value: "Prolific priority offender (PPO)" },
  ]);

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
    "Do you want to add charges for any of the suspects?",
  );
  await wantToAddChargesPage.errorValidations(true);
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
    urn: "12211234526",
    registeringUnit: "NORTHERN CJU (Peterborough)",
    wcu: "Cambridgeshire Non Operational WCU",
    operationName: "thunderstruck",
  });
  await caseRegistrationSummaryPage.verifyAddNewSuspectElements(2);
  await caseRegistrationSummaryPage.verifySuspectSummaryRows([
    "POTTER, Harry",
    "SMITH, Steve",
  ]);
  await caseRegistrationSummaryPage.verifySuspectSummaryDetails(0, []);
  await caseRegistrationSummaryPage.verifySuspectSummaryDetails(1, [
    { key: "Gender", value: "Female" },
    { key: "Disability", value: "no" },
    { key: "Religion", value: "Christianity" },
    { key: "Ethnicity", value: "White" },
    { key: "Alias", value: "MARK, Stev" },
    { key: "Type of offender", value: "Prolific priority offender (PPO)" },
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
