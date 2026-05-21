import { expect, test } from "./utils/test";
import { CaseRegistrationHomePage } from "./pages/caseRegistrationHomePage";
import { CaseAreasPage } from "./pages/caseAreasPage";
import { CaseDetailsPage } from "./pages/caseDetailsPage";
import { AddSuspectPage } from "./pages/addSuspectPage";
import { SuspectGenderPage } from "./pages/suspectGenderPage";
import { SuspectDisabilityPage } from "./pages/suspectDisabilityPage";
import { SuspectASNPage } from "./pages/suspectASNPage";
import { ChargesSummaryPage } from "./pages/chargesSummaryPage";
import { AddChargeVictimPage } from "./pages/addChargeVictimPage";
import { ChargesOffenceSearchPagePage } from "./pages/chargesOffenceSearchPage";
import { AddChargeDetailsPage } from "./pages/addChargeDetailsPage";
import { SuspectSummaryPage } from "./pages/suspectSummaryPage";
import { SuspectRemoveConfirmationPage } from "./pages/suspectRemoveConfirmationPage";
import { WantToAddChargesPage } from "./pages/wantToAddChargesPage";
import { CaseMonitoringPage } from "./pages/caseMonitoringPage";
import { CaseAssigneePage } from "./pages/caseAssigneePage";
import { CaseRegistrationSummaryPage } from "./pages/caseRegistrationSummaryPage";
import { FirstHearingDetailsPage } from "./pages/firstHearingDetailsPage";
import { fi } from "zod/locales";

test("Should successfully complete multiple suspect journey", async ({
  page,
}) => {
  await page.goto("http://localhost:5173");
  await expect(page).toHaveTitle(/Case Management Register a Case/);
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
  await addSuspectPage.saveAndContinue();
  const suspectSummaryPage = new SuspectSummaryPage(page);
  await suspectSummaryPage.verifyUrl();
  await suspectSummaryPage.verifyPageElements("You have added 1 suspect");
  await suspectSummaryPage.verifySuspectSummaryRows(["POTTER, Harry"]);
  await suspectSummaryPage.removeSuspect(0);
  const suspectRemoveConfirmationPage = new SuspectRemoveConfirmationPage(page);
  await suspectRemoveConfirmationPage.verifyUrl();
  await suspectRemoveConfirmationPage.verifyPageElements("POTTER, Harry");
  await suspectRemoveConfirmationPage.verifyBackLink(
    "/case-registration/suspect-summary",
  );
  await suspectRemoveConfirmationPage.cancel();
  await suspectSummaryPage.verifyUrl();
  await suspectSummaryPage.verifyPageElements("You have added 1 suspect");
  await suspectSummaryPage.removeSuspect(0);
  await suspectRemoveConfirmationPage.verifyUrl();
  await suspectRemoveConfirmationPage.verifyPageElements("POTTER, Harry");
  await suspectRemoveConfirmationPage.saveAndContinue();
  await suspectSummaryPage.verifyUrl();
  await suspectSummaryPage.verifyNoSuspects();
  await suspectSummaryPage.selectAddMoreSuspectYes();
  await suspectSummaryPage.saveAndContinue();
  await addSuspectPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/add-suspect",
  );
  await addSuspectPage.addPersonSuspect();
  await addSuspectPage.addSuspectFirstName("harry");
  await addSuspectPage.addSuspectLastName("potter");
  await addSuspectPage.saveAndContinue();
  await suspectSummaryPage.verifyUrl();
  await suspectSummaryPage.verifyPageElements("You have added 1 suspect");
  await suspectSummaryPage.verifySuspectSummaryRows(["POTTER, Harry"]);
  await suspectSummaryPage.selectAddMoreSuspectYes();
  await suspectSummaryPage.saveAndContinue();
  await addSuspectPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-1/add-suspect",
  );
  await addSuspectPage.addCompanySuspect();
  await addSuspectPage.addSuspectCompanyName("Wizard Wheezes");
  await addSuspectPage.saveAndContinue();
  await suspectSummaryPage.verifyUrl();
  await suspectSummaryPage.verifyPageElements("You have added 2 suspects");
  await suspectSummaryPage.verifySuspectSummaryRows([
    "POTTER, Harry",
    "Wizard Wheezes",
  ]);
  await suspectSummaryPage.selectAddMoreSuspectYes();
  await suspectSummaryPage.saveAndContinue();
  await addSuspectPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-2/add-suspect",
  );
  await addSuspectPage.addPersonSuspect();
  await addSuspectPage.addSuspectFirstName("smith");
  await addSuspectPage.addSuspectLastName("steve");
  await addSuspectPage.saveAndContinue();
  await suspectSummaryPage.verifyUrl();
  await suspectSummaryPage.verifyPageElements("You have added 3 suspects");
  await suspectSummaryPage.verifySuspectSummaryRows([
    "POTTER, Harry",
    "Wizard Wheezes",
    "STEVE, Smith",
  ]);
  await suspectSummaryPage.changeSuspect(2);
  await addSuspectPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-2/add-suspect",
  );
  await addSuspectPage.verifyPersonSuspectSelected("smith", "steve");
  await addSuspectPage.verifySelectedAdditionalDetails([]);
  await addSuspectPage.addSuspectFirstName("martin");
  await addSuspectPage.selectAdditionalDetailsGender(true);
  await addSuspectPage.selectAdditionalDetailsASN(true);
  await addSuspectPage.verifySelectedAdditionalDetails([
    "Gender",
    "Arrest Summons Number (ASN)",
  ]);
  await addSuspectPage.saveAndContinue();
  const suspectGenderPage = new SuspectGenderPage(page);
  await suspectGenderPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-2/suspect-gender",
  );
  await suspectGenderPage.verifyBackLink(
    "/case-registration/suspect-2/add-suspect",
  );
  await suspectGenderPage.verifyPageElements("STEVE, Martin");
  await suspectGenderPage.errorValidations();
  await suspectGenderPage.selectGenderMale();
  await suspectGenderPage.saveAndContinue();

  const suspectASNPage = new SuspectASNPage(page);
  await suspectASNPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-2/suspect-asn",
  );
  await suspectASNPage.verifyBackLink(
    "/case-registration/suspect-2/suspect-gender",
  );
  await suspectASNPage.verifyPageElements();
  await suspectASNPage.errorValidations();
  await suspectASNPage.addASNText("123456");
  await suspectASNPage.saveAndContinue();
  await suspectSummaryPage.verifyUrl();
  await suspectSummaryPage.verifyPageElements("You have added 3 suspects");
  await suspectSummaryPage.verifySuspectSummaryRows([
    "POTTER, Harry",
    "Wizard Wheezes",
    "STEVE, Martin",
  ]);

  await suspectSummaryPage.verifySuspectSummaryDetails(2, [
    { key: "Gender", value: "Male" },
    { key: "Arrest Summons Number", value: "123456" },
  ]);

  await suspectSummaryPage.removeSuspect(1);
  await suspectRemoveConfirmationPage.verifyUrl();
  await suspectRemoveConfirmationPage.verifyPageElements("Wizard Wheezes");
  await suspectRemoveConfirmationPage.verifyBackLink(
    "/case-registration/suspect-summary",
  );
  await suspectRemoveConfirmationPage.cancel();
  await suspectSummaryPage.verifyUrl();
  await suspectSummaryPage.verifyPageElements("You have added 3 suspects");
  await suspectSummaryPage.removeSuspect(1);
  await suspectRemoveConfirmationPage.verifyUrl();
  await suspectRemoveConfirmationPage.verifyPageElements("Wizard Wheezes");
  await suspectRemoveConfirmationPage.saveAndContinue();
  await suspectSummaryPage.verifyUrl();
  await suspectSummaryPage.verifyPageElements("You have added 2 suspects");
  await suspectSummaryPage.verifySuspectSummaryRows([
    "POTTER, Harry",
    "STEVE, Martin",
  ]);
  await suspectSummaryPage.changeSuspect(1);
  await addSuspectPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-1/add-suspect",
  );
  await addSuspectPage.verifyPersonSuspectSelected("martin", "steve");
  await addSuspectPage.verifySelectedAdditionalDetails([
    "Gender",
    "Arrest Summons Number (ASN)",
  ]);
  await addSuspectPage.selectAdditionalDetailsGender(false);
  await addSuspectPage.verifySelectedAdditionalDetails([
    "Arrest Summons Number (ASN)",
  ]);
  await addSuspectPage.saveAndContinue();
  await suspectASNPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-1/suspect-asn",
  );
  await suspectASNPage.verifyBackLink(
    "/case-registration/suspect-1/add-suspect",
  );
  await suspectASNPage.verifyPageElements();
  await suspectASNPage.verifyASNText("123456");
  await suspectASNPage.addASNText("1234567");
  await suspectASNPage.saveAndContinue();
  await suspectSummaryPage.verifyUrl();
  await suspectSummaryPage.verifyPageElements("You have added 2 suspects");
  await suspectSummaryPage.verifySuspectSummaryRows([
    "POTTER, Harry",
    "STEVE, Martin",
  ]);

  await suspectSummaryPage.verifySuspectSummaryDetails(1, [
    { key: "Arrest Summons Number", value: "1234567" },
  ]);
  await suspectSummaryPage.selectAddMoreSuspectYes();
  await suspectSummaryPage.saveAndContinue();
  await addSuspectPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-2/add-suspect",
  );
  await addSuspectPage.addCompanySuspect();
  await addSuspectPage.addSuspectCompanyName("ABC Limited");
  await addSuspectPage.saveAndContinue();
  await suspectSummaryPage.verifyUrl();
  await suspectSummaryPage.verifyPageElements("You have added 3 suspects");
  await suspectSummaryPage.verifySuspectSummaryRows([
    "POTTER, Harry",
    "STEVE, Martin",
    "ABC Limited",
  ]);
  await suspectSummaryPage.selectAddMoreSuspectYes();
  await suspectSummaryPage.saveAndContinue();
  await addSuspectPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-3/add-suspect",
  );
  await addSuspectPage.addPersonSuspect();
  await addSuspectPage.addSuspectFirstName("brian");
  await addSuspectPage.addSuspectLastName("adams");
  await addSuspectPage.saveAndContinue();
  await suspectSummaryPage.verifyUrl();
  await suspectSummaryPage.verifyPageElements("You have added 4 suspects");
  await suspectSummaryPage.verifySuspectSummaryRows([
    "POTTER, Harry",
    "STEVE, Martin",
    "ABC Limited",
    "ADAMS, Brian",
  ]);
  await suspectSummaryPage.selectAddMoreSuspectYes();
  await suspectSummaryPage.saveAndContinue();
  await addSuspectPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-4/add-suspect",
  );
  await addSuspectPage.addCompanySuspect();
  await addSuspectPage.addSuspectCompanyName("Data Limited");
  await addSuspectPage.saveAndContinue();
  await suspectSummaryPage.verifyUrl();
  await suspectSummaryPage.verifyPageElements("You have added 5 suspects");
  await suspectSummaryPage.verifySuspectSummaryRows([
    "POTTER, Harry",
    "STEVE, Martin",
    "ABC Limited",
    "ADAMS, Brian",
    "Data Limited",
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
  await caseMonitoringPage.saveAndContinue();

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
  await caseAssigneePage.addProsecutorNo();
  await caseAssigneePage.addInvestigatorNo();
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
  await caseRegistrationSummaryPage.verifyComplexityAndMonitoringCodesElements({
    complexity: "Basic",
    monitoringCodes: ["Pre-Charge Decision"],
  });
  await caseRegistrationSummaryPage.verifyWorkingOnTheCaseElements(
    {
      prosecutor: "Not entered",
      caseworker: "Not entered",
      investigator: "Not entered",
      shoulderNumber: "Not entered",
      policeUnit: "Not entered",
    },
    false,
  );

  await suspectSummaryPage.verifySuspectSummaryRows([
    "POTTER, Harry",
    "STEVE, Martin",
    "ABC Limited",
    "ADAMS, Brian",
    "Data Limited",
  ]);
  await caseRegistrationSummaryPage.verifySuspectSummaryDetails(0, []);
  await caseRegistrationSummaryPage.verifyChargesSummaryDetails(0, []);
  await caseRegistrationSummaryPage.verifyAddNewChargeDetails(
    0,
    "/case-registration/suspect-0/charge-0/charges-offence-search",
    "person",
    false,
  );

  await caseRegistrationSummaryPage.verifySuspectSummaryDetails(1, [
    {
      key: "Arrest Summons Number",
      value: "1234567",
    },
  ]);
  await caseRegistrationSummaryPage.verifyChargesSummaryDetails(1, []);
  await caseRegistrationSummaryPage.verifyAddNewChargeDetails(
    1,
    "/case-registration/suspect-1/charge-0/charges-offence-search",
    "person",
    false,
  );
  await caseRegistrationSummaryPage.verifySuspectSummaryDetails(
    2,
    [],
    "company",
  );
  await caseRegistrationSummaryPage.verifyChargesSummaryDetails(
    2,
    [],
    "company",
  );
  await caseRegistrationSummaryPage.verifyAddNewChargeDetails(
    2,
    "/case-registration/suspect-2/charge-0/charges-offence-search",
    "company",
    false,
  );
  await caseRegistrationSummaryPage.verifySuspectSummaryDetails(3, []);
  await caseRegistrationSummaryPage.verifyChargesSummaryDetails(3, []);
  await caseRegistrationSummaryPage.verifyAddNewChargeDetails(
    3,
    "/case-registration/suspect-3/charge-0/charges-offence-search",
    "person",
    false,
  );
  await caseRegistrationSummaryPage.verifySuspectSummaryDetails(
    4,
    [],
    "company",
  );
  await caseRegistrationSummaryPage.verifyChargesSummaryDetails(
    4,
    [],
    "company",
  );
  await caseRegistrationSummaryPage.verifyAddNewChargeDetails(
    4,
    "/case-registration/suspect-4/charge-0/charges-offence-search",
    "company",
    false,
  );

  await caseRegistrationSummaryPage.changeSuspect(3);
  await addSuspectPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-3/add-suspect",
  );
  await addSuspectPage.verifyBackLink("/case-registration/case-summary");
  await addSuspectPage.verifyPersonSuspectSelected("brian", "adams");
  await addSuspectPage.verifySelectedAdditionalDetails([]);
  await addSuspectPage.selectAdditionalDetailsDisability(true);
  await addSuspectPage.verifySelectedAdditionalDetails(["Disability"]);
  await addSuspectPage.saveAndContinue();
  const suspectDisabilityPage = new SuspectDisabilityPage(page);
  await suspectDisabilityPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-3/suspect-disability",
  );
  await suspectDisabilityPage.verifyBackLink(
    "/case-registration/suspect-3/add-suspect",
  );
  await suspectDisabilityPage.verifyPageElements("ADAMS, Brian");
  await suspectDisabilityPage.errorValidations();
  await suspectDisabilityPage.selectDisabilityYes();
  await suspectDisabilityPage.saveAndContinue();
  await suspectSummaryPage.verifyUrl();
  await suspectSummaryPage.verifyPageElements("You have added 5 suspects");
  await suspectSummaryPage.verifySuspectSummaryRows([
    "POTTER, Harry",
    "STEVE, Martin",
    "ABC Limited",
    "ADAMS, Brian",
    "Data Limited",
  ]);
  await suspectSummaryPage.verifySuspectSummaryDetails(3, [
    { key: "Disability", value: "yes" },
  ]);
  await suspectSummaryPage.selectAddMoreSuspectNo();
  await suspectSummaryPage.saveAndContinue();
  await wantToAddChargesPage.verifyUrl();
  await wantToAddChargesPage.verifyPageElements(
    "Do you want to add charges for any of the suspects?",
  );
  await wantToAddChargesPage.selectAddChargesNo();
  await wantToAddChargesPage.saveAndContinue();
  await caseRegistrationSummaryPage.verifyUrl();
  await suspectSummaryPage.verifySuspectSummaryRows([
    "POTTER, Harry",
    "STEVE, Martin",
    "ABC Limited",
    "ADAMS, Brian",
    "Data Limited",
  ]);
  await caseRegistrationSummaryPage.verifySuspectSummaryDetails(3, [
    {
      key: "Disability",
      value: "yes",
    },
  ]);
  await caseRegistrationSummaryPage.verifyChargesSummaryDetails(3, []);
  await caseRegistrationSummaryPage.verifyAddNewChargeDetails(
    3,
    "/case-registration/suspect-3/charge-0/charges-offence-search",
    "person",
    false,
  );
  await caseRegistrationSummaryPage.changeSuspect(2);
  await addSuspectPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-2/add-suspect",
  );
  await addSuspectPage.verifyCompanySuspectSelected("ABC Limited");
  await addSuspectPage.verifyBackLink("/case-registration/case-summary");
  await addSuspectPage.verifyCompanySuspectSelected("ABC Limited");
  await addSuspectPage.addSuspectCompanyName("ABCDE Limited");
  await addSuspectPage.saveAndContinue();
  await suspectSummaryPage.verifyUrl();
  await suspectSummaryPage.verifySuspectSummaryRows([
    "POTTER, Harry",
    "STEVE, Martin",
    "ABCDE Limited",
    "ADAMS, Brian",
    "Data Limited",
  ]);
  await suspectSummaryPage.selectAddMoreSuspectNo();
  await suspectSummaryPage.saveAndContinue();
  await wantToAddChargesPage.verifyUrl();
  await wantToAddChargesPage.verifyPageElements(
    "Do you want to add charges for any of the suspects?",
  );
  await wantToAddChargesPage.selectAddChargesNo();
  await wantToAddChargesPage.saveAndContinue();
  await caseRegistrationSummaryPage.verifyUrl();
  await suspectSummaryPage.verifySuspectSummaryRows([
    "POTTER, Harry",
    "STEVE, Martin",
    "ABCDE Limited",
    "ADAMS, Brian",
    "Data Limited",
  ]);

  await caseRegistrationSummaryPage.removeSuspect(2);
  await suspectRemoveConfirmationPage.verifyUrl();
  await suspectRemoveConfirmationPage.verifyPageElements("ABCDE Limited", true);
  await suspectRemoveConfirmationPage.verifyBackLink(
    "/case-registration/case-summary",
  );
  await suspectRemoveConfirmationPage.cancel();
  await caseRegistrationSummaryPage.verifyUrl();
  await caseRegistrationSummaryPage.verifySuspectSummaryRows([
    "POTTER, Harry",
    "STEVE, Martin",
    "ABCDE Limited",
    "ADAMS, Brian",
    "Data Limited",
  ]);
  await caseRegistrationSummaryPage.removeSuspect(2);
  await suspectRemoveConfirmationPage.verifyUrl();
  await suspectRemoveConfirmationPage.verifyPageElements("ABCDE Limited", true);
  await suspectRemoveConfirmationPage.saveAndContinue();
  await caseRegistrationSummaryPage.verifyUrl();
  await caseRegistrationSummaryPage.verifySuspectSummaryRows([
    "POTTER, Harry",
    "STEVE, Martin",
    "ADAMS, Brian",
    "Data Limited",
  ]);
  await caseRegistrationSummaryPage.changeSuspect(2);
  await addSuspectPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-2/add-suspect",
  );
  await addSuspectPage.verifyBackLink("/case-registration/case-summary");
  await addSuspectPage.verifyPersonSuspectSelected("brian", "adams");
  await addSuspectPage.verifySelectedAdditionalDetails(["Disability"]);
  await addSuspectPage.saveAndContinue();
  await suspectDisabilityPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-2/suspect-disability",
  );
  await suspectDisabilityPage.verifyBackLink(
    "/case-registration/suspect-2/add-suspect",
  );
  await suspectDisabilityPage.verifyPageElements("ADAMS, Brian");
  await suspectDisabilityPage.selectDisabilityNo();
  await suspectDisabilityPage.saveAndContinue();
  await suspectSummaryPage.verifyUrl();
  await suspectSummaryPage.verifyPageElements("You have added 4 suspects");
  await suspectSummaryPage.verifySuspectSummaryRows([
    "POTTER, Harry",
    "STEVE, Martin",
    "ADAMS, Brian",
    "Data Limited",
  ]);
  await suspectSummaryPage.verifySuspectSummaryDetails(2, [
    { key: "Disability", value: "no" },
  ]);
  await suspectSummaryPage.selectAddMoreSuspectNo();
  await suspectSummaryPage.saveAndContinue();
  await wantToAddChargesPage.verifyUrl();
  await wantToAddChargesPage.verifyPageElements(
    "Do you want to add charges for any of the suspects?",
  );
  await wantToAddChargesPage.selectAddChargesNo();
  await wantToAddChargesPage.saveAndContinue();
  await caseRegistrationSummaryPage.verifyUrl();
  await suspectSummaryPage.verifySuspectSummaryRows([
    "POTTER, Harry",
    "STEVE, Martin",
    "ADAMS, Brian",
    "Data Limited",
  ]);
  await caseRegistrationSummaryPage.verifySuspectSummaryDetails(2, [
    {
      key: "Disability",
      value: "no",
    },
  ]);
  await caseRegistrationSummaryPage.verifyChargesSummaryDetails(2, []);
  await caseRegistrationSummaryPage.verifyAddNewChargeDetails(
    2,
    "/case-registration/suspect-2/charge-0/charges-offence-search",
    "person",
    false,
  );
  await caseRegistrationSummaryPage.addSuspectCharge(3);
  const chargesOffenceSearchPage = new ChargesOffenceSearchPagePage(page);

  await chargesOffenceSearchPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-3/charge-0/charges-offence-search",
  );
  await chargesOffenceSearchPage.verifyBackLink(
    "/case-registration/case-summary",
  );
  await chargesOffenceSearchPage.verifyPageElements("Data Limited");
  await chargesOffenceSearchPage.errorValidations();
  await chargesOffenceSearchPage.addOffenceSearchText("test");
  await chargesOffenceSearchPage.searchOffence();
  await chargesOffenceSearchPage.validateOffenceSearchResults("test", 3, 0);
  await chargesOffenceSearchPage.addOffence(1);
  const addChargeDetailsPage = new AddChargeDetailsPage(page);
  await addChargeDetailsPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-3/charge-0/add-charge-details",
  );
  await addChargeDetailsPage.verifyBackLink(
    "/case-registration/suspect-3/charge-0/charges-offence-search",
  );
  await addChargeDetailsPage.verifyPageElements(
    "Data Limited",
    "PB92005 - Attempt to injure a badger",
  );
  await addChargeDetailsPage.errorValidations();
  await addChargeDetailsPage.clickDateRange();
  await addChargeDetailsPage.fillOffenceFromDate("2022-02-02");
  await addChargeDetailsPage.fillOffenceToDate("2022-02-03");
  await addChargeDetailsPage.selectAddVictimYes();
  await addChargeDetailsPage.saveAndContinue();
  const addChargeVictimPage = new AddChargeVictimPage(page);
  await addChargeVictimPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-3/charge-0/add-charge-victim",
  );
  await addChargeVictimPage.verifyBackLink(
    "/case-registration/suspect-3/charge-0/add-charge-details",
  );
  await addChargeVictimPage.verifyPageElements(
    "Data Limited",
    "PB92005 - Attempt to injure a badger",
  );
  await addChargeVictimPage.verifyAddFirstVictimElements();
  await addChargeVictimPage.errorValidationsNewVictims();
  await addChargeVictimPage.fillVictimFirstName("steve");
  await addChargeVictimPage.fillVictimLastName("smith");
  await addChargeVictimPage.selectVictimIsVulnerable(true);
  await addChargeVictimPage.selectVictimIsIntimidated(true);
  await addChargeVictimPage.selectVictimIsWitness(true);
  await addChargeVictimPage.saveAndContinue();
  const chargesSummaryPage = new ChargesSummaryPage(page);
  await chargesSummaryPage.verifyUrl();
  await chargesSummaryPage.verifyBackLink("/case-registration/case-summary");
  await chargesSummaryPage.errorValidations();
  await chargesSummaryPage.verifyChargesSummaryRow(
    {
      suspectName: "Data Limited",
      charges: [
        {
          offenceCode: "PB92005",
          offenceDescription: "Attempt to injure a badger",
          chargeDetails: {
            dateOfOffence: "02 February 2022 to 03 February 2022",
            victim: {
              name: "SMITH, Steve",
              properties: "WitnessVulnerableIntimidated",
            },
          },
        },
      ],
    },
    0,
  );
  await chargesSummaryPage.selectAddMoreChargesNo();
  await chargesSummaryPage.saveAndContinue();
  const firstHearingDetailsPage = new FirstHearingDetailsPage(page);
  await firstHearingDetailsPage.verifyUrl();
  await firstHearingDetailsPage.verifyBackLink(
    "/case-registration/charges-summary",
  );
  await firstHearingDetailsPage.errorValidations();
  await firstHearingDetailsPage.selectAddFirstHearingDetailsNo();
  await firstHearingDetailsPage.saveAndContinue();
  await caseRegistrationSummaryPage.verifyUrl();
  await caseRegistrationSummaryPage.verifyAddNewSuspectElements(4);
  await caseRegistrationSummaryPage.verifySuspectSummaryRows([
    "POTTER, Harry",
    "STEVE, Martin",
    "ADAMS, Brian",
    "Data Limited",
  ]);
  await caseRegistrationSummaryPage.verifySuspectSummaryDetails(
    3,
    [],
    "company",
  );
  await caseRegistrationSummaryPage.verifyChargesSummaryDetails(
    3,
    [
      { key: "PB92005", value: "Attempt to injure a badger" },
      { key: "Date of offence", value: "02 February 2022 to 03 February 2022" },
      { key: "Victim", value: "SMITH, SteveWitnessVulnerableIntimidated" },
    ],
    "company",
  );
  await caseRegistrationSummaryPage.verifyAddNewChargeDetails(
    3,
    "/case-registration/suspect-3/charge-1/charges-offence-search",
    "company",
    true,
  );
});
