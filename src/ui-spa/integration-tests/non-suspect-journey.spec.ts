import { delay, HttpResponse, http } from "msw";
import { expect, test } from "./utils/test";
import { CaseRegistrationHomePage } from "./pages/caseRegistrationHomePage";
import { CaseAreasPage } from "./pages/caseAreasPage";
import { CaseDetailsPage } from "./pages/caseDetailsPage";
import { CaseMonitoringPage } from "./pages/caseMonitoringPage";
import { CaseAssigneePage } from "./pages/caseAssigneePage";
import { CaseRegistrationSummaryPage } from "./pages/caseRegistrationSummaryPage";
import { CaseComplexityPage } from "./pages/caseComplexityPage";
import { ChangeAreaConfirmationPage } from "./pages/changeAreaConfirmation";
import { ChangeRegisteringUnitConfirmationPage } from "./pages/changeRegisteringUnitConfirmation";
import { CaseRegistrationConfirmationPage } from "./pages/caseRegistrationConfirmationPage";

test("Should successfully complete non suspect journey", async ({
  page,
  worker,
}) => {
  await page.goto("http://localhost:5173");
  const caseRegistrationHomePage = new CaseRegistrationHomePage(page);
  await caseRegistrationHomePage.verifyUrl();
  await caseRegistrationHomePage.verifyPageElements();
  await caseRegistrationHomePage.errorValidations();
  await caseRegistrationHomePage.addOperationName("thunderstruck");
  await caseRegistrationHomePage.addNoSuspect();
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

  const caseMonitoringPage = new CaseMonitoringPage(page);
  await caseMonitoringPage.verifyUrl();
  await caseMonitoringPage.verifyBackLink("/case-registration/case-details");
  await caseMonitoringPage.backLinkClick();
  await caseDetailsPage.verifyUrl();
  await caseDetailsPage.saveAndContinue();
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
  await caseRegistrationSummaryPage.verifyPageElements();
  await caseRegistrationSummaryPage.verifyCaseDetailsElements({
    area: "CAMBRIDGESHIRE",
    urn: "12211234526",
    registeringUnit: "NORTHERN CJU (Peterborough)",
    wcu: "Cambridgeshire Non Operational WCU",
    operationName: "thunderstruck",
  });
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

  await caseRegistrationSummaryPage.changeOperationNameLinkClick();
  await caseRegistrationHomePage.verifyUrl();
  await caseRegistrationHomePage.saveAndContinue();
  await caseRegistrationSummaryPage.verifyUrl();

  await caseRegistrationSummaryPage.changeAreaLinkClick();
  await caseAreasPage.verifyUrl();
  await caseAreasPage.verifyBackLink("/case-registration/case-summary");
  await caseAreasPage.saveAndContinue();
  await caseRegistrationSummaryPage.verifyUrl();

  await caseRegistrationSummaryPage.changeUrnLinkClick();
  await caseDetailsPage.verifyUrl();
  await caseDetailsPage.verifyBackLink("/case-registration/case-summary");
  await caseDetailsPage.saveAndContinue();
  await caseRegistrationSummaryPage.verifyUrl();

  await caseRegistrationSummaryPage.changeRegisteringUnitLinkClick();
  await caseDetailsPage.verifyUrl();
  await caseDetailsPage.verifyBackLink("/case-registration/case-summary");
  await caseDetailsPage.saveAndContinue();
  await caseRegistrationSummaryPage.verifyUrl();

  await caseRegistrationSummaryPage.changeWcuLinkClick();
  await caseDetailsPage.verifyUrl();
  await caseDetailsPage.verifyBackLink("/case-registration/case-summary");
  await caseDetailsPage.saveAndContinue();
  await caseRegistrationSummaryPage.verifyUrl();

  await caseRegistrationSummaryPage.changeMonitoringCodesLinkClick();
  await caseMonitoringPage.verifyUrl();
  await caseMonitoringPage.verifyBackLink("/case-registration/case-summary");
  await caseMonitoringPage.saveAndContinue();
  await caseRegistrationSummaryPage.verifyUrl();

  const caseComplexityPage = new CaseComplexityPage(page);
  await caseRegistrationSummaryPage.changeCaseComplexityLinkClick();
  await caseComplexityPage.verifyUrl();
  await caseComplexityPage.verifyBackLink("/case-registration/case-summary");
  await caseComplexityPage.saveAndContinue();
  await caseRegistrationSummaryPage.verifyUrl();

  await caseRegistrationSummaryPage.changeCaseInvestigatorLinkClick();
  await caseAssigneePage.verifyUrl();
  await caseAssigneePage.verifyBackLink("/case-registration/case-summary");
  await caseAssigneePage.saveAndContinue();
  await caseRegistrationSummaryPage.verifyUrl();

  await caseRegistrationSummaryPage.changeShoulderNumberLinkClick();
  await caseAssigneePage.verifyUrl();
  await caseAssigneePage.verifyBackLink("/case-registration/case-summary");
  await caseAssigneePage.saveAndContinue();
  await caseRegistrationSummaryPage.verifyUrl();

  await caseRegistrationSummaryPage.changePoliceUnitLinkClick();
  await caseAssigneePage.verifyUrl();
  await caseAssigneePage.verifyBackLink("/case-registration/case-summary");
  await caseAssigneePage.saveAndContinue();
  await caseRegistrationSummaryPage.verifyUrl();

  await caseRegistrationSummaryPage.changeProsecutorLinkClick();
  await caseAssigneePage.verifyUrl();
  await caseAssigneePage.verifyBackLink("/case-registration/case-summary");
  await caseAssigneePage.saveAndContinue();
  await caseRegistrationSummaryPage.verifyUrl();

  await caseRegistrationSummaryPage.changeCaseworkerLinkClick();
  await caseAssigneePage.verifyUrl();
  await caseAssigneePage.verifyBackLink("/case-registration/case-summary");
  await caseAssigneePage.saveAndContinue();
  await caseRegistrationSummaryPage.verifyUrl();

  await caseRegistrationSummaryPage.changeAreaLinkClick();
  await caseAreasPage.verifyUrl();
  await caseAreasPage.verifyBackLink("/case-registration/case-summary");
  await caseAreasPage.enterAreaOrDivision("Cheshire");
  await caseAreasPage.saveAndContinue();
  const changeAreaConfirmationPage = new ChangeAreaConfirmationPage(page);
  await changeAreaConfirmationPage.verifyUrl();
  await changeAreaConfirmationPage.verifyPageElements(false);
  await changeAreaConfirmationPage.verifyBackLink("/case-registration/areas");
  await changeAreaConfirmationPage.backLinkClick();
  await caseAreasPage.verifyUrl();
  await caseAreasPage.verifyBackLink("/case-registration/case-summary");
  await caseAreasPage.enterAreaOrDivision("Cheshire");
  await caseAreasPage.saveAndContinue();
  await changeAreaConfirmationPage.verifyUrl();
  await changeAreaConfirmationPage.saveAndContinue();
  await caseDetailsPage.verifyUrl();
  await caseDetailsPage.verifyNoBackLink();
  await caseDetailsPage.enterRegisteringUnit("Chester MCU");
  await caseDetailsPage.enterWitnessCareUnit("Chester Business WCU");
  await caseDetailsPage.saveAndContinue();
  await caseAssigneePage.verifyUrl();
  await caseAssigneePage.verifyNoBackLink();
  await caseAssigneePage.verifyPageElements();
  await caseAssigneePage.addProsecutorYes();
  await caseAssigneePage.addInvestigatorYes();
  await caseAssigneePage.enterProsecutorName("Prosecutor B");
  await caseAssigneePage.enterCaseworkerName("Caseworker B");
  await caseAssigneePage.addInvestigatorFirstName("Investigator A");
  await caseAssigneePage.addInvestigatorLastName("Investigator B");
  await caseAssigneePage.addInvestigatorShoulderNumber("123456");
  await caseAssigneePage.saveAndContinue();
  await caseRegistrationSummaryPage.verifyUrl();
  await caseRegistrationSummaryPage.verifyCaseDetailsElements({
    area: "Cheshire",
    urn: "12211234526",
    registeringUnit: "Chester MCU",
    wcu: "Chester Business WCU",
    operationName: "thunderstruck",
  });
  await caseRegistrationSummaryPage.verifyWorkingOnTheCaseElements({
    prosecutor: "Prosecutor B",
    caseworker: "Caseworker B",
    investigator: "InvestigatorB, InvestigatorA",
    shoulderNumber: "123456",
    policeUnit: "Not entered",
  });
  await caseRegistrationSummaryPage.verifyNoSuspectElements();
  await caseRegistrationSummaryPage.verifyAddNewSuspectElements(0);
  await caseRegistrationSummaryPage.changeRegisteringUnitLinkClick();
  await caseDetailsPage.verifyUrl();
  await caseDetailsPage.verifyBackLink("/case-registration/case-summary");
  await caseDetailsPage.enterRegisteringUnit("Warrington CCU");
  await caseDetailsPage.enterWitnessCareUnit("Chester Business WCU");
  await caseDetailsPage.saveAndContinue();
  const changeRegisteringUnitConfirmationPage =
    new ChangeRegisteringUnitConfirmationPage(page);
  await changeRegisteringUnitConfirmationPage.verifyUrl();
  await changeRegisteringUnitConfirmationPage.verifyPageElements(false);
  await changeRegisteringUnitConfirmationPage.verifyBackLink(
    "/case-registration/case-details",
  );
  await changeRegisteringUnitConfirmationPage.backLinkClick();
  await caseDetailsPage.verifyUrl();
  await caseDetailsPage.verifyBackLink("/case-registration/case-summary");
  await caseDetailsPage.enterRegisteringUnit("Warrington CCU");
  await caseDetailsPage.enterWitnessCareUnit("Chester Business WCU");
  await caseDetailsPage.saveAndContinue();
  await changeRegisteringUnitConfirmationPage.verifyUrl();
  await changeRegisteringUnitConfirmationPage.saveAndContinue();
  await caseAssigneePage.verifyUrl();
  await caseAssigneePage.verifyNoBackLink();
  await caseAssigneePage.verifyPageElements();
  await caseAssigneePage.addProsecutorYes();
  await caseAssigneePage.addInvestigatorYes();
  await caseAssigneePage.enterProsecutorName("Prosecutor A");
  await caseAssigneePage.enterCaseworkerName("Caseworker A");
  await caseAssigneePage.addInvestigatorFirstName("Investigator A");
  await caseAssigneePage.addInvestigatorLastName("Investigator B");
  await caseAssigneePage.addInvestigatorShoulderNumber("1234567");
  await caseAssigneePage.saveAndContinue();
  await caseRegistrationSummaryPage.verifyUrl();
  await caseRegistrationSummaryPage.verifyCaseDetailsElements({
    area: "Cheshire",
    urn: "12211234526",
    registeringUnit: "Warrington CCU",
    wcu: "Chester Business WCU",
    operationName: "thunderstruck",
  });
  await caseRegistrationSummaryPage.verifyWorkingOnTheCaseElements({
    prosecutor: "Prosecutor A",
    caseworker: "Caseworker A",
    investigator: "InvestigatorB, InvestigatorA",
    shoulderNumber: "1234567",
    policeUnit: "Not entered",
  });
  await worker.use(
    http.get("https://mocked-out-api/api/v1/urns/:urn/exists", async () => {
      await delay(2000);
      return HttpResponse.json(true);
    }),
  );
  await caseRegistrationSummaryPage.clickCreateCaseButton();
  await caseRegistrationSummaryPage.verifyFormSubmittingStatus();
  await caseRegistrationSummaryPage.verifyUrl();
  await caseRegistrationSummaryPage.errorValidations();
  await caseRegistrationSummaryPage.verifyFormNonSubmittingStatus();
  await worker.use(
    http.get("https://mocked-out-api/api/v1/urns/:urn/exists", async () => {
      await delay(100);
      return HttpResponse.json(false);
    }),
  );
  await caseRegistrationSummaryPage.clickCreateCaseButton();
  await caseRegistrationSummaryPage.verifyErrorSummaryCleared();
  const caseRegistrationConfirmationPage = new CaseRegistrationConfirmationPage(
    page,
  );
  await caseRegistrationConfirmationPage.verifyUrl();
  await caseRegistrationConfirmationPage.verifyPageElements("12211234526");
});
