import { test } from "./utils/test";
import { CaseRegistrationHomePage } from "./pages/caseRegistrationHomePage";
import { CaseAreasPage } from "./pages/caseAreasPage";
import { CaseDetailsPage } from "./pages/caseDetailsPage";
import { AddSuspectPage } from "./pages/addSuspectPage";
import { SuspectSummaryPage } from "./pages/suspectSummaryPage";
import { WantToAddChargesPage } from "./pages/wantToAddChargesPage";
import { ChargesOffenceSearchPagePage } from "./pages/chargesOffenceSearchPage";
import { AddChargeDetailsPage } from "./pages/addChargeDetailsPage";
import { ChargesSummaryPage } from "./pages/chargesSummaryPage";
import { FirstHearingDetailsPage } from "./pages/firstHearingDetailsPage";
import { CaseMonitoringPage } from "./pages/caseMonitoringPage";
import { CaseAssigneePage } from "./pages/caseAssigneePage";
import { CaseRegistrationSummaryPage } from "./pages/caseRegistrationSummaryPage";
import { ChargeRemoveConfirmationPage } from "./pages/chargeRemoveConfirmationPage";
import { SuspectRemoveConfirmationPage } from "./pages/suspectRemoveConfirmationPage";
import { AddPreChargeConfirmationPage } from "./pages/addPreChargeConfirmationPage";

test("verify Pre-Charge  is added to monitoring codes when removing a suspect and removing available charge from suspect and first hearing details are removed when pre-charge monitoring code is added", async ({
  page,
}) => {
  await page.goto("http://localhost:5173");
  const caseRegistrationHomePage = new CaseRegistrationHomePage(page);
  await caseRegistrationHomePage.addOperationName("thunderstruck");
  await caseRegistrationHomePage.addNoSuspect();
  await caseRegistrationHomePage.saveAndContinue();

  const caseAreasPage = new CaseAreasPage(page);
  await caseAreasPage.verifyUrl();
  await caseAreasPage.enterAreaOrDivision("CAMBRIDGESHIRE");
  await caseAreasPage.saveAndContinue();

  const caseDetailsPage = new CaseDetailsPage(page);
  await caseDetailsPage.verifyUrl();

  await caseDetailsPage.enterUrnPoliceForce("12");
  await caseDetailsPage.enterUrnPoliceUnit("21");
  await caseDetailsPage.enterUrnUniqueReference("12345");
  await caseDetailsPage.enterUrnYearReference("26");
  await caseDetailsPage.enterRegisteringUnit("NORTHERN CJU (Peterborough)");
  await caseDetailsPage.enterWitnessCareUnit(
    "Cambridgeshire Non Operational WCU",
  );
  await caseDetailsPage.saveAndContinue();

  const caseMonitoringPage = new CaseMonitoringPage(page);
  await caseMonitoringPage.verifyUrl();

  await caseMonitoringPage.verifyPreChargeCheckboxChecked();
  await caseMonitoringPage.saveAndContinue();
  await caseMonitoringPage.verifyErrorSummaryClear();

  const caseAssigneePage = new CaseAssigneePage(page);
  await caseAssigneePage.verifyUrl();
  await caseAssigneePage.addProsecutorYes();
  await caseAssigneePage.addInvestigatorYes();
  await caseAssigneePage.enterProsecutorName("Prosecutor A");
  await caseAssigneePage.enterCaseworkerName("Caseworker A");
  await caseAssigneePage.addInvestigatorFirstName("Investigator F");
  await caseAssigneePage.addInvestigatorLastName("Investigator L");
  await caseAssigneePage.addInvestigatorShoulderNumber("12345");
  await caseAssigneePage.saveAndContinue();

  const caseRegistrationSummaryPage = new CaseRegistrationSummaryPage(page);
  await caseRegistrationSummaryPage.verifyUrl();
  await caseRegistrationSummaryPage.verifyCaseDetailsElements({
    area: "CAMBRIDGESHIRE",
    urn: "12211234526",
    registeringUnit: "NORTHERN CJU (Peterborough)",
    wcu: "Cambridgeshire Non Operational WCU",
    operationName: "thunderstruck",
  });
  await caseRegistrationSummaryPage.verifyAddNewSuspectElements(0);

  await caseRegistrationSummaryPage.verifyComplexityAndMonitoringCodesElements({
    complexity: "Basic",
    monitoringCodes: ["Pre-Charge Decision"],
  });

  await caseRegistrationSummaryPage.addSuspectLinkClick();
  const addSuspectPage = new AddSuspectPage(page);
  await addSuspectPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/add-suspect",
  );
  await addSuspectPage.addPersonSuspect();
  await addSuspectPage.addSuspectFirstName("harry");
  await addSuspectPage.addSuspectLastName("potter");
  await addSuspectPage.saveAndContinue();

  const suspectSummaryPage = new SuspectSummaryPage(page);
  await suspectSummaryPage.verifyUrl();
  await suspectSummaryPage.verifyPageElements("You have added 1 suspect");
  await suspectSummaryPage.verifySuspectSummaryRows(["POTTER, Harry"]);
  await suspectSummaryPage.selectAddMoreSuspectNo();
  await suspectSummaryPage.saveAndContinue();

  const wantToAddChargesPage = new WantToAddChargesPage(page);
  await wantToAddChargesPage.verifyUrl();
  await wantToAddChargesPage.verifyPageElements(
    "Do you want to add charges for the suspect?",
  );

  await wantToAddChargesPage.selectAddChargesYes();
  await wantToAddChargesPage.saveAndContinue();

  const chargesOffenceSearchPage = new ChargesOffenceSearchPagePage(page);
  await chargesOffenceSearchPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/charge-0/charges-offence-search",
  );
  await chargesOffenceSearchPage.verifyPageElements("POTTER, Harry");

  await chargesOffenceSearchPage.addOffenceSearchText("test");
  await chargesOffenceSearchPage.searchOffence();
  await chargesOffenceSearchPage.validateOffenceSearchResults("test", 0, 0);
  await chargesOffenceSearchPage.addOffence(0);

  const addChargeDetailsPage = new AddChargeDetailsPage(page);
  await addChargeDetailsPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/charge-0/add-charge-details",
  );
  await addChargeDetailsPage.verifyPageElements(
    "POTTER, Harry",
    "WC81229 - Permit to be set trap etc - cause injury to wild bird",
    false,
  );
  await addChargeDetailsPage.fillOffenceFromDate("2022-02-02");
  await addChargeDetailsPage.selectAddVictimNo();
  await addChargeDetailsPage.saveAndContinue();

  const chargesSummaryPage = new ChargesSummaryPage(page);
  await chargesSummaryPage.verifyUrl();

  await chargesSummaryPage.verifyUrl();
  await chargesSummaryPage.verifyChargesSummaryRow(
    {
      suspectName: "POTTER, Harry",
      charges: [
        {
          offenceCode: "WC81229",
          offenceDescription:
            "Permit to be set trap etc - cause injury to wild bird",
          chargeDetails: {
            dateOfOffence: "02 February 2022",
          },
        },
      ],
    },
    0,
  );

  await chargesSummaryPage.selectAddMoreChargesNo();
  await chargesSummaryPage.saveAndContinue();

  await caseMonitoringPage.verifyUrl();

  await caseMonitoringPage.verifyPreChargeCheckboxNotDisabled();
  await caseMonitoringPage.deSelectMonitoringCode("Pre-Charge Decision");
  await caseMonitoringPage.saveAndContinue();
  await caseMonitoringPage.verifyErrorSummaryClear();

  const firstHearingDetailsPage = new FirstHearingDetailsPage(page);
  await firstHearingDetailsPage.verifyUrl();
  await firstHearingDetailsPage.selectAddFirstHearingDetailsYes();
  await firstHearingDetailsPage.enterFirstHearingCourtLocation("Court A");
  await firstHearingDetailsPage.addFirstHearingDate("2022-02-04");
  await firstHearingDetailsPage.saveAndContinue();

  await caseRegistrationSummaryPage.verifyUrl();
  await caseRegistrationSummaryPage.verifyCaseDetailsElements({
    area: "CAMBRIDGESHIRE",
    urn: "12211234526",
    registeringUnit: "NORTHERN CJU (Peterborough)",
    wcu: "Cambridgeshire Non Operational WCU",
    operationName: "thunderstruck",
  });
  await caseRegistrationSummaryPage.verifyAddNewSuspectElements(1);
  await caseRegistrationSummaryPage.verifyComplexityAndMonitoringCodesElements({
    complexity: "Basic",
    monitoringCodes: [],
  });

  await caseRegistrationSummaryPage.changeSuspect(0);
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
  await suspectSummaryPage.selectAddMoreSuspectNo();
  await suspectSummaryPage.saveAndContinue();

  await wantToAddChargesPage.verifyUrl();
  await wantToAddChargesPage.verifyPageElements(
    "Do you want to add charges for the suspect?",
  );

  await wantToAddChargesPage.selectAddChargesYes();
  await wantToAddChargesPage.saveAndContinue();

  await chargesOffenceSearchPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/charge-1/charges-offence-search",
  );
  await chargesOffenceSearchPage.verifyPageElements("POTTER, Harry");
  await chargesOffenceSearchPage.addOffenceSearchText("test");
  await chargesOffenceSearchPage.searchOffence();
  await chargesOffenceSearchPage.validateOffenceSearchResults("test", 0, 1);
  await chargesOffenceSearchPage.addOffence(0);

  await addChargeDetailsPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/charge-1/add-charge-details",
  );
  await addChargeDetailsPage.verifyPageElements(
    "POTTER, Harry",
    "WC81229 - Permit to be set trap etc - cause injury to wild bird",
    false,
  );
  await addChargeDetailsPage.fillOffenceFromDate("2022-02-02");
  await addChargeDetailsPage.selectAddVictimNo();
  await addChargeDetailsPage.saveAndContinue();
  await chargesSummaryPage.verifyUrl();
  await chargesSummaryPage.verifyChargesSummaryRow(
    {
      suspectName: "POTTER, Harry",
      charges: [
        {
          offenceCode: "WC81229",
          offenceDescription:
            "Permit to be set trap etc - cause injury to wild bird",
          chargeDetails: {
            dateOfOffence: "02 February 2022",
          },
        },
      ],
    },
    0,
  );

  await chargesSummaryPage.selectAddMoreChargesNo();
  await chargesSummaryPage.saveAndContinue();

  await caseMonitoringPage.verifyUrl();

  await caseMonitoringPage.verifyPreChargeCheckboxNotDisabled();
  await caseMonitoringPage.deSelectMonitoringCode("Pre-Charge Decision");
  await caseMonitoringPage.saveAndContinue();
  await caseMonitoringPage.verifyErrorSummaryClear();

  await firstHearingDetailsPage.verifyUrl();
  await firstHearingDetailsPage.selectAddFirstHearingDetailsYes();
  await firstHearingDetailsPage.enterFirstHearingCourtLocation("Court A");
  await firstHearingDetailsPage.addFirstHearingDate("2022-02-04");
  await firstHearingDetailsPage.saveAndContinue();

  await caseRegistrationSummaryPage.verifyUrl();

  await caseRegistrationSummaryPage.verifyFirstHearingElements({
    courtLocation: "Court A",
    firstHearingDate: "04 February 2022",
  });

  await caseRegistrationSummaryPage.verifyComplexityAndMonitoringCodesElements({
    complexity: "Basic",
    monitoringCodes: [],
  });

  // remove suspect charge and verify pre-charge is added to monitoring codes, and first hearing details are cleared
  await caseRegistrationSummaryPage.removeSuspectCharge(0, 0);

  const chargeRemoveConfirmationPage = new ChargeRemoveConfirmationPage(page);
  await chargeRemoveConfirmationPage.verifyUrl();
  await chargeRemoveConfirmationPage.verifyBackLink(
    "/case-registration/case-summary",
  );
  await chargeRemoveConfirmationPage.verifyPageElements(true);
  await chargeRemoveConfirmationPage.saveAndContinue();
  await caseRegistrationSummaryPage.removeSuspectCharge(0, 0);

  await chargeRemoveConfirmationPage.verifyPageElements(true);
  await chargeRemoveConfirmationPage.saveAndContinue();
  await caseRegistrationSummaryPage.verifyChargesSummaryDetails(0, []);

  await caseRegistrationSummaryPage.verifyComplexityAndMonitoringCodesElements({
    complexity: "Basic",
    monitoringCodes: ["Pre-Charge Decision"],
  });

  await caseRegistrationSummaryPage.verifyNoFirstHearingElements();

  await caseRegistrationSummaryPage.addSuspectCharge(0);

  await chargesOffenceSearchPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/charge-0/charges-offence-search",
  );
  await chargesOffenceSearchPage.verifyPageElements("POTTER, Harry");

  await chargesOffenceSearchPage.addOffenceSearchText("test");
  await chargesOffenceSearchPage.searchOffence();
  await chargesOffenceSearchPage.validateOffenceSearchResults("test", 0, 0);
  await chargesOffenceSearchPage.addOffence(0);

  await addChargeDetailsPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/charge-0/add-charge-details",
  );
  await addChargeDetailsPage.verifyPageElements(
    "POTTER, Harry",
    "WC81229 - Permit to be set trap etc - cause injury to wild bird",
    false,
  );
  await addChargeDetailsPage.fillOffenceFromDate("2022-02-02");
  await addChargeDetailsPage.selectAddVictimNo();
  await addChargeDetailsPage.saveAndContinue();

  await chargesSummaryPage.verifyUrl();

  await chargesSummaryPage.verifyUrl();
  await chargesSummaryPage.verifyChargesSummaryRow(
    {
      suspectName: "POTTER, Harry",
      charges: [
        {
          offenceCode: "WC81229",
          offenceDescription:
            "Permit to be set trap etc - cause injury to wild bird",
          chargeDetails: {
            dateOfOffence: "02 February 2022",
          },
        },
      ],
    },
    0,
  );

  await chargesSummaryPage.selectAddMoreChargesNo();
  await chargesSummaryPage.saveAndContinue();

  await caseMonitoringPage.verifyPreChargeCheckboxNotDisabled();
  await caseMonitoringPage.deSelectMonitoringCode("Pre-Charge Decision");
  await caseMonitoringPage.saveAndContinue();
  await caseMonitoringPage.verifyErrorSummaryClear();

  await firstHearingDetailsPage.verifyUrl();
  await firstHearingDetailsPage.selectAddFirstHearingDetailsYes();
  await firstHearingDetailsPage.enterFirstHearingCourtLocation("Court A");
  await firstHearingDetailsPage.addFirstHearingDate("2022-02-04");
  await firstHearingDetailsPage.saveAndContinue();

  await caseRegistrationSummaryPage.verifyUrl();
  await caseRegistrationSummaryPage.verifyCaseDetailsElements({
    area: "CAMBRIDGESHIRE",
    urn: "12211234526",
    registeringUnit: "NORTHERN CJU (Peterborough)",
    wcu: "Cambridgeshire Non Operational WCU",
    operationName: "thunderstruck",
  });
  await caseRegistrationSummaryPage.verifyAddNewSuspectElements(1);
  await caseRegistrationSummaryPage.verifyComplexityAndMonitoringCodesElements({
    complexity: "Basic",
    monitoringCodes: [],
  });
  await caseRegistrationSummaryPage.verifyFirstHearingElements({
    courtLocation: "Court A",
    firstHearingDate: "04 February 2022",
  });
  // add pre-charge monitoring code  from summary page and verify first hearing details are cleared
  await caseRegistrationSummaryPage.changeMonitoringCodesLinkClick();
  await caseMonitoringPage.verifyUrl();
  await caseMonitoringPage.selectMonitoringCode("Pre-Charge Decision");
  await caseMonitoringPage.saveAndContinue();
  await caseMonitoringPage.verifyErrorSummaryClear();
  // verify pre-charge confirmation page elements
  const addPreChargeConfirmationPage = new AddPreChargeConfirmationPage(page);
  await addPreChargeConfirmationPage.verifyUrl();
  await addPreChargeConfirmationPage.verifyPageElements();
  await addPreChargeConfirmationPage.verifyBackLink();
  await addPreChargeConfirmationPage.backLinkClick();
  await caseMonitoringPage.verifyUrl();
  await caseMonitoringPage.selectMonitoringCode("Pre-Charge Decision");
  await caseMonitoringPage.saveAndContinue();
  await addPreChargeConfirmationPage.verifyUrl();
  await addPreChargeConfirmationPage.cancel();
  await caseMonitoringPage.verifyUrl();
  await caseMonitoringPage.selectMonitoringCode("Pre-Charge Decision");
  await caseMonitoringPage.saveAndContinue();
  await addPreChargeConfirmationPage.verifyUrl();
  await addPreChargeConfirmationPage.saveAndContinue();

  await caseRegistrationSummaryPage.verifyUrl();
  await caseRegistrationSummaryPage.verifyComplexityAndMonitoringCodesElements({
    complexity: "Basic",
    monitoringCodes: ["Pre-Charge Decision"],
  });
  await caseRegistrationSummaryPage.verifyNoFirstHearingElements();

  await caseRegistrationSummaryPage.changeMonitoringCodesLinkClick();
  await caseMonitoringPage.verifyUrl();
  await caseMonitoringPage.deSelectMonitoringCode("Pre-Charge Decision");
  await caseMonitoringPage.saveAndContinue();
  await caseMonitoringPage.verifyErrorSummaryClear();
  await firstHearingDetailsPage.verifyUrl();
  await firstHearingDetailsPage.selectAddFirstHearingDetailsYes();
  await firstHearingDetailsPage.enterFirstHearingCourtLocation("Court A");
  await firstHearingDetailsPage.addFirstHearingDate("2022-02-04");
  await firstHearingDetailsPage.saveAndContinue();

  await caseRegistrationSummaryPage.verifyUrl();
  await caseRegistrationSummaryPage.verifyComplexityAndMonitoringCodesElements({
    complexity: "Basic",
    monitoringCodes: [],
  });
  await caseRegistrationSummaryPage.verifyFirstHearingElements({
    courtLocation: "Court A",
    firstHearingDate: "04 February 2022",
  });
  //remove suspect and verify pre-charge is added to monitoring codes, and first hearing details are cleared
  await caseRegistrationSummaryPage.removeSuspect(0);
  const suspectRemoveConfirmationPage = new SuspectRemoveConfirmationPage(page);
  await suspectRemoveConfirmationPage.verifyUrl();
  await suspectRemoveConfirmationPage.verifyPageElements("POTTER, Harry", true);
  await suspectRemoveConfirmationPage.saveAndContinue();

  await caseRegistrationSummaryPage.verifyComplexityAndMonitoringCodesElements({
    complexity: "Basic",
    monitoringCodes: ["Pre-Charge Decision"],
  });

  await caseRegistrationSummaryPage.verifyNoFirstHearingElements();
});
