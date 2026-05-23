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
import { FirstHearingDetailsPage } from "./pages/firstHearingDetailsPage";
import { CaseMonitoringPage } from "./pages/caseMonitoringPage";
import { CaseAssigneePage } from "./pages/caseAssigneePage";
import { CaseRegistrationSummaryPage } from "./pages/caseRegistrationSummaryPage";

test("Add a new suspect from summary page journey with no charges & change a new suspect with no charges", async ({
  page,
}) => {
  await page.goto("http://localhost:5173");
  await expect(page).toHaveTitle(/Case Management Register a Case/);
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

  const caseRegistrationSummaryPage = new CaseRegistrationSummaryPage(page);
  await caseRegistrationSummaryPage.verifyUrl();
  await caseRegistrationSummaryPage.verifyCaseDetailsElements({
    area: "CAMBRIDGESHIRE",
    urn: "122112345/26",
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
  //no from want to add charges user is taken back to case summary page
  await wantToAddChargesPage.selectAddChargesNo();
  await wantToAddChargesPage.saveAndContinue();
  await caseRegistrationSummaryPage.verifyUrl();
  await caseRegistrationSummaryPage.verifyAddNewSuspectElements(1);
  await caseRegistrationSummaryPage.verifySuspectSummaryRows(["POTTER, Harry"]);
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
  //no from want to add charges user is taken back to case summary page
  await wantToAddChargesPage.selectAddChargesNo();
  await wantToAddChargesPage.saveAndContinue();
  await caseRegistrationSummaryPage.verifyUrl();
  await caseRegistrationSummaryPage.verifyAddNewSuspectElements(1);
  await caseRegistrationSummaryPage.verifySuspectSummaryRows(["POTTER, Harry"]);
});

test("Add a new suspect from summary page journey with charges &  change a new suspect with charges", async ({
  page,
}) => {
  await page.goto("http://localhost:5173");
  await expect(page).toHaveTitle(/Case Management Register a Case/);
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

  const caseRegistrationSummaryPage = new CaseRegistrationSummaryPage(page);
  await caseRegistrationSummaryPage.verifyUrl();
  await caseRegistrationSummaryPage.verifyCaseDetailsElements({
    area: "CAMBRIDGESHIRE",
    urn: "122112345/26",
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
  //Yes from want to add charges user is taken to add charge pages
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

  // From charges Summary user is taken to first hearing details page
  const firstHearingDetailsPage = new FirstHearingDetailsPage(page);
  await firstHearingDetailsPage.verifyUrl();
  await firstHearingDetailsPage.selectAddFirstHearingDetailsYes();
  await firstHearingDetailsPage.enterFirstHearingCourtLocation("Court A");
  await firstHearingDetailsPage.addFirstHearingDate("2022-02-04");
  await firstHearingDetailsPage.saveAndContinue();
  // From first hearing page since monitoring code is now optional and pre-charge decision is checked  user is taken to case monitoring page
  await caseMonitoringPage.verifyUrl();
  // monitoring code is not optional
  await caseMonitoringPage.verifyPreChargeCheckboxNotDisabled();
  await caseMonitoringPage.deSelectMonitoringCode("Pre-Charge Decision");
  await caseMonitoringPage.saveAndContinue();
  await caseMonitoringPage.verifyErrorSummaryClear();
  await caseRegistrationSummaryPage.verifyUrl();
  await caseRegistrationSummaryPage.verifyCaseDetailsElements({
    area: "CAMBRIDGESHIRE",
    urn: "122112345/26",
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
  //Yes from want to add charges user is taken to add charge pages
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

  // From charges Summary user is taken to first hearing details page
  await firstHearingDetailsPage.verifyUrl();
  await firstHearingDetailsPage.selectAddFirstHearingDetailsYes();
  await firstHearingDetailsPage.enterFirstHearingCourtLocation("Court A");
  await firstHearingDetailsPage.addFirstHearingDate("2022-02-04");
  await firstHearingDetailsPage.saveAndContinue();
  // From first hearing page since monitoring code is now optional and pre-charge decision is not checked  user is taken to case summary page
  await caseRegistrationSummaryPage.verifyUrl();
});

test("Add new charge from summary page journey", async ({ page }) => {
  await page.goto("http://localhost:5173");
  await expect(page).toHaveTitle(/Case Management Register a Case/);
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
  //no from want to add charges user is taken back to case summary page
  await wantToAddChargesPage.selectAddChargesNo();
  await wantToAddChargesPage.saveAndContinue();

  const caseMonitoringPage = new CaseMonitoringPage(page);
  await caseMonitoringPage.verifyUrl();
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

  const caseRegistrationSummaryPage = new CaseRegistrationSummaryPage(page);
  await caseRegistrationSummaryPage.verifyUrl();
  await caseRegistrationSummaryPage.verifyCaseDetailsElements({
    area: "CAMBRIDGESHIRE",
    urn: "122112345/26",
    registeringUnit: "NORTHERN CJU (Peterborough)",
    wcu: "Cambridgeshire Non Operational WCU",
    operationName: "thunderstruck",
  });
  await caseRegistrationSummaryPage.verifyAddNewSuspectElements(2);

  await caseRegistrationSummaryPage.verifyComplexityAndMonitoringCodesElements({
    complexity: "Basic",
    monitoringCodes: ["Pre-Charge Decision"],
  });

  await caseRegistrationSummaryPage.addSuspectCharge(0);
  //Yes from want to add charges user is taken to add charge pages
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

  // From charges Summary user is taken to first hearing details page
  const firstHearingDetailsPage = new FirstHearingDetailsPage(page);
  await firstHearingDetailsPage.verifyUrl();
  await firstHearingDetailsPage.selectAddFirstHearingDetailsYes();
  await firstHearingDetailsPage.enterFirstHearingCourtLocation("Court A");
  await firstHearingDetailsPage.addFirstHearingDate("2022-02-04");
  await firstHearingDetailsPage.saveAndContinue();
  // From first hearing page since monitoring code is not optional so user is taken to case summary page
  await caseRegistrationSummaryPage.verifyUrl();
  await caseRegistrationSummaryPage.addSuspectCharge(1);
  await chargesOffenceSearchPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-1/charge-0/charges-offence-search",
  );

  await chargesOffenceSearchPage.verifyPageElements("SMITH, Steve");
  await chargesOffenceSearchPage.addOffenceSearchText("test");
  await chargesOffenceSearchPage.searchOffence();
  await chargesOffenceSearchPage.validateOffenceSearchResults("test", 1, 0);
  await chargesOffenceSearchPage.addOffence(0);

  await addChargeDetailsPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-1/charge-0/add-charge-details",
  );
  await addChargeDetailsPage.verifyPageElements(
    "SMITH, Steve",
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

  await chargesSummaryPage.verifyChargesSummaryRow(
    {
      suspectName: "SMITH, Steve",
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
    1,
  );

  await chargesSummaryPage.selectAddMoreChargesNo();
  await chargesSummaryPage.saveAndContinue();

  // From charges Summary user is taken to first hearing details page
  await firstHearingDetailsPage.verifyUrl();
  await firstHearingDetailsPage.selectAddFirstHearingDetailsYes();
  await firstHearingDetailsPage.enterFirstHearingCourtLocation("Court A");
  await firstHearingDetailsPage.addFirstHearingDate("2022-02-04");
  await firstHearingDetailsPage.saveAndContinue();

  // From first hearing page since monitoring code is now optional and pre-charge decision is checked user is taken to case monitoring page
  await caseMonitoringPage.verifyUrl();
  // monitoring code is not optional
  await caseMonitoringPage.verifyPreChargeCheckboxNotDisabled();
  await caseMonitoringPage.deSelectMonitoringCode("Pre-Charge Decision");
  await caseMonitoringPage.saveAndContinue();
  await caseMonitoringPage.verifyErrorSummaryClear();
  await caseRegistrationSummaryPage.verifyUrl();
  await caseRegistrationSummaryPage.verifyCaseDetailsElements({
    area: "CAMBRIDGESHIRE",
    urn: "122112345/26",
    registeringUnit: "NORTHERN CJU (Peterborough)",
    wcu: "Cambridgeshire Non Operational WCU",
    operationName: "thunderstruck",
  });
  await caseRegistrationSummaryPage.verifyAddNewSuspectElements(2);
  await caseRegistrationSummaryPage.verifyComplexityAndMonitoringCodesElements({
    complexity: "Basic",
    monitoringCodes: [],
  });
});
