import { expect, test } from "./utils/test";
import { CaseRegistrationHomePage } from "./pages/caseRegistrationHomePage";
import { CaseAreasPage } from "./pages/caseAreasPage";
import { CaseDetailsPage } from "./pages/caseDetailsPage";
import { AddSuspectPage } from "./pages/addSuspectPage";
import { SuspectSummaryPage } from "./pages/suspectSummaryPage";
import { WantToAddChargesPage } from "./pages/wantToAddChargesPage";
import { ChargesOffenceSearchPagePage } from "./pages/chargesOffenceSearchPage";
import { AddChargeDetailsPage } from "./pages/addChargeDetailsPage";
import { ChargesSummaryPage } from "./pages/chargesSummaryPage";
import { AddChargeSuspectPage } from "./pages/addChargeSuspectPage";
import { FirstHearingDetailsPage } from "./pages/firstHearingDetailsPage";
import { CaseMonitoringPage } from "./pages/caseMonitoringPage";
import { CaseAssigneePage } from "./pages/caseAssigneePage";
import { CaseRegistrationSummaryPage } from "./pages/caseRegistrationSummaryPage";

test("Monitoring code is optional if all the suspects have charges", async ({
  page,
}) => {
  await page.goto("http://localhost:5173");
  const caseRegistrationHomePage = new CaseRegistrationHomePage(page);
  await caseRegistrationHomePage.addOperationName("thunderstruck");
  await caseRegistrationHomePage.addSuspect();
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

  const addSuspectPage = new AddSuspectPage(page);
  await addSuspectPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/add-suspect",
  );
  await addSuspectPage.addPersonSuspect();
  await addSuspectPage.addSuspectFirstName("harry");
  await addSuspectPage.addSuspectLastName("potter");
  await addSuspectPage.saveAndContinue();

  //second suspect
  const suspectSummaryPage = new SuspectSummaryPage(page);
  await suspectSummaryPage.verifyUrl();
  await suspectSummaryPage.verifyPageElements("You have added 1 suspect");
  await suspectSummaryPage.verifySuspectSummaryRows(["POTTER, Harry"]);
  await suspectSummaryPage.selectAddMoreSuspectYes();
  await suspectSummaryPage.saveAndContinue();
  await addSuspectPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-1/add-suspect",
  );

  await addSuspectPage.verifyBasePageElements();
  await addSuspectPage.addPersonSuspect();
  await addSuspectPage.addSuspectFirstName("steve");
  await addSuspectPage.addSuspectLastName("smith");

  await addSuspectPage.saveAndContinue();

  await suspectSummaryPage.verifyUrl();
  await suspectSummaryPage.verifyPageElements("You have added 2 suspects");
  await suspectSummaryPage.errorValidations();
  await suspectSummaryPage.verifySuspectSummaryRows([
    "POTTER, Harry",
    "SMITH, Steve",
  ]);
  await suspectSummaryPage.selectAddMoreSuspectNo();
  await suspectSummaryPage.saveAndContinue();

  const wantToAddChargesPage = new WantToAddChargesPage(page);
  await wantToAddChargesPage.verifyUrl();
  await wantToAddChargesPage.verifyPageElements(
    "Do you want to add charges for any of the suspects?",
  );

  await wantToAddChargesPage.selectAddChargesYes();
  await wantToAddChargesPage.saveAndContinue();
  const addChargeSuspectPage = new AddChargeSuspectPage(page);
  await addChargeSuspectPage.verifyUrl();
  await addChargeSuspectPage.verifyPageElements([
    "POTTER, Harry",
    "SMITH, Steve",
  ]);
  await addChargeSuspectPage.selectSuspectByName("POTTER, Harry");
  await addChargeSuspectPage.saveAndContinue();

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

  await chargesSummaryPage.selectAddMoreChargesYes();
  await chargesSummaryPage.saveAndContinue();

  await addChargeSuspectPage.verifyUrl();
  await addChargeSuspectPage.verifyPageElements([
    "POTTER, Harry",
    "SMITH, Steve",
  ]);
  await addChargeSuspectPage.selectSuspectByName("SMITH, Steve");
  await addChargeSuspectPage.saveAndContinue();

  await chargesOffenceSearchPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-1/charge-0/charges-offence-search",
  );
  await chargesOffenceSearchPage.verifyPageElements("SMITH, Steve");
  await chargesOffenceSearchPage.addOffenceSearchText("test");
  await chargesOffenceSearchPage.searchOffence();
  await chargesOffenceSearchPage.validateOffenceSearchResults("test", 1, 0);
  await chargesOffenceSearchPage.addOffence(1);

  await addChargeDetailsPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-1/charge-0/add-charge-details",
  );
  await addChargeDetailsPage.verifyPageElements(
    "SMITH, Steve",
    "PB92005 - Attempt to injure a badger",
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
  await chargesSummaryPage.verifyChargesSummaryRow(
    {
      suspectName: "SMITH, Steve",
      charges: [
        {
          offenceCode: "PB92005",
          offenceDescription: "Attempt to injure a badger",
          chargeDetails: {
            dateOfOffence: "02 February 2022",
          },
        },
      ],
    },
    1,
  );
  await chargesSummaryPage.selectAddMoreChargesNo();
  await chargesSummaryPage.saveAndContinue();

  const firstHearingDetailsPage = new FirstHearingDetailsPage(page);
  await firstHearingDetailsPage.verifyUrl();
  await firstHearingDetailsPage.selectAddFirstHearingDetailsYes();
  await firstHearingDetailsPage.enterFirstHearingCourtLocation("Court A");
  await firstHearingDetailsPage.addFirstHearingDate("2022-02-04");
  await firstHearingDetailsPage.saveAndContinue();

  const caseMonitoringPage = new CaseMonitoringPage(page);
  await caseMonitoringPage.verifyUrl();
  await caseMonitoringPage.verifyPageElements(45);
  // monitoring code is optional
  await caseMonitoringPage.verifyPreChargeCheckboxNotChecked();
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
  await expect(page).toHaveURL(
    "http://localhost:5173/case-registration/case-summary",
  );

  const caseRegistrationSummaryPage = new CaseRegistrationSummaryPage(page);
  await caseRegistrationSummaryPage.verifyUrl();
  await caseRegistrationSummaryPage.verifyCaseDetailsElements({
    area: "CAMBRIDGESHIRE",
    urn: "12211234526",
    registeringUnit: "NORTHERN CJU (Peterborough)",
    wcu: "Cambridgeshire Non Operational WCU",
    operationName: "thunderstruck",
  });
  await caseRegistrationSummaryPage.verifyAddNewSuspectElements(2);
  await suspectSummaryPage.verifySuspectSummaryRows([
    "POTTER, Harry",
    "SMITH, Steve",
  ]);

  // monitoring code is optional
  await caseRegistrationSummaryPage.verifyComplexityAndMonitoringCodesElements({
    complexity: "Basic",
    monitoringCodes: [],
  });
});

test("Monitoring code is not optional if at least one of the suspects has no charges", async ({
  page,
}) => {
  await page.goto("http://localhost:5173");
  const caseRegistrationHomePage = new CaseRegistrationHomePage(page);
  await caseRegistrationHomePage.addOperationName("thunderstruck");
  await caseRegistrationHomePage.addSuspect();
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

  const addSuspectPage = new AddSuspectPage(page);
  await addSuspectPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/add-suspect",
  );
  await addSuspectPage.addPersonSuspect();
  await addSuspectPage.addSuspectFirstName("harry");
  await addSuspectPage.addSuspectLastName("potter");
  await addSuspectPage.saveAndContinue();

  //second suspect
  const suspectSummaryPage = new SuspectSummaryPage(page);
  await suspectSummaryPage.verifyUrl();
  await suspectSummaryPage.verifyPageElements("You have added 1 suspect");
  await suspectSummaryPage.verifySuspectSummaryRows(["POTTER, Harry"]);
  await suspectSummaryPage.selectAddMoreSuspectYes();
  await suspectSummaryPage.saveAndContinue();
  await addSuspectPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-1/add-suspect",
  );

  await addSuspectPage.verifyBasePageElements();
  await addSuspectPage.addPersonSuspect();
  await addSuspectPage.addSuspectFirstName("steve");
  await addSuspectPage.addSuspectLastName("smith");

  await addSuspectPage.saveAndContinue();

  await suspectSummaryPage.verifyUrl();
  await suspectSummaryPage.verifyPageElements("You have added 2 suspects");
  await suspectSummaryPage.errorValidations();
  await suspectSummaryPage.verifySuspectSummaryRows([
    "POTTER, Harry",
    "SMITH, Steve",
  ]);
  await suspectSummaryPage.selectAddMoreSuspectNo();
  await suspectSummaryPage.saveAndContinue();

  const wantToAddChargesPage = new WantToAddChargesPage(page);
  await wantToAddChargesPage.verifyUrl();
  await wantToAddChargesPage.verifyPageElements(
    "Do you want to add charges for any of the suspects?",
  );

  await wantToAddChargesPage.selectAddChargesYes();
  await wantToAddChargesPage.saveAndContinue();
  const addChargeSuspectPage = new AddChargeSuspectPage(page);
  await addChargeSuspectPage.verifyUrl();
  await addChargeSuspectPage.verifyPageElements([
    "POTTER, Harry",
    "SMITH, Steve",
  ]);
  await addChargeSuspectPage.selectSuspectByName("POTTER, Harry");
  await addChargeSuspectPage.saveAndContinue();

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
  //charge added only for one suspect
  await chargesSummaryPage.selectAddMoreChargesNo();
  await chargesSummaryPage.saveAndContinue();

  const firstHearingDetailsPage = new FirstHearingDetailsPage(page);
  await firstHearingDetailsPage.verifyUrl();
  await firstHearingDetailsPage.selectAddFirstHearingDetailsYes();
  await firstHearingDetailsPage.enterFirstHearingCourtLocation("Court A");
  await firstHearingDetailsPage.addFirstHearingDate("2022-02-04");
  await firstHearingDetailsPage.saveAndContinue();

  const caseMonitoringPage = new CaseMonitoringPage(page);
  await caseMonitoringPage.verifyUrl();
  await caseMonitoringPage.verifyPageElements(45);
  // monitoring code is not optional
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
  await expect(page).toHaveURL(
    "http://localhost:5173/case-registration/case-summary",
  );

  const caseRegistrationSummaryPage = new CaseRegistrationSummaryPage(page);
  await caseRegistrationSummaryPage.verifyUrl();
  await caseRegistrationSummaryPage.verifyCaseDetailsElements({
    area: "CAMBRIDGESHIRE",
    urn: "12211234526",
    registeringUnit: "NORTHERN CJU (Peterborough)",
    wcu: "Cambridgeshire Non Operational WCU",
    operationName: "thunderstruck",
  });
  await caseRegistrationSummaryPage.verifyAddNewSuspectElements(2);
  await suspectSummaryPage.verifySuspectSummaryRows([
    "POTTER, Harry",
    "SMITH, Steve",
  ]);

  // monitoring code is optional
  await caseRegistrationSummaryPage.verifyComplexityAndMonitoringCodesElements({
    complexity: "Basic",
    monitoringCodes: ["Pre-Charge Decision"],
  });
});
