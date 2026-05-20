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
import { ChargesOffenceSearchPagePage } from "./pages/chargesOffenceSearchPage";
import { AddChargeDetailsPage } from "./pages/addChargeDetailsPage";
import { AddChargeVictimPage } from "./pages/addChargeVictimPage";
import { ChargesSummaryPage } from "./pages/chargesSummaryPage";
import { AddChargeSuspectPage } from "./pages/addChargeSuspectPage";
import { FirstHearingDetailsPage } from "./pages/firstHearingDetailsPage";
import { CaseMonitoringPage } from "./pages/caseMonitoringPage";
import { CaseAssigneePage } from "./pages/caseAssigneePage";
import { CaseRegistrationSummaryPage } from "./pages/caseRegistrationSummaryPage";
import { CancelCaseRegistrationConfirmationPage } from "./pages/cancelCaseRegistrationConfirmationPage";

test("Should successfully verify cancel case registration journey for all pages", async ({
  page,
}) => {
  await page.goto("http://localhost:5173");
  await expect(page).toHaveTitle(/Case Management Register a Case/);
  const caseRegistrationHomePage = new CaseRegistrationHomePage(page);
  await caseRegistrationHomePage.verifyUrl();
  await caseRegistrationHomePage.cancelCaseRegistration();
  const cancelCaseRegistrationConfirmationPage =
    new CancelCaseRegistrationConfirmationPage(page);
  await cancelCaseRegistrationConfirmationPage.verifyUrl();
  await cancelCaseRegistrationConfirmationPage.errorValidations();
  await cancelCaseRegistrationConfirmationPage.verifyPageElements();
  await cancelCaseRegistrationConfirmationPage.selectCancelCaseRegistrationNo();
  await cancelCaseRegistrationConfirmationPage.continue();
  await caseRegistrationHomePage.verifyUrl();
  await caseRegistrationHomePage.addOperationName("thunderstruck");
  await caseRegistrationHomePage.addSuspect();
  await caseRegistrationHomePage.saveAndContinue();

  const caseAreasPage = new CaseAreasPage(page);
  await caseAreasPage.verifyUrl();
  await caseAreasPage.cancelCaseRegistration();
  await cancelCaseRegistrationConfirmationPage.verifyUrl();
  await cancelCaseRegistrationConfirmationPage.errorValidations();
  await cancelCaseRegistrationConfirmationPage.verifyPageElements();
  await cancelCaseRegistrationConfirmationPage.selectCancelCaseRegistrationNo();
  await cancelCaseRegistrationConfirmationPage.continue();
  await caseAreasPage.verifyUrl();
  await caseAreasPage.enterAreaOrDivision("CAMBRIDGESHIRE");
  await caseAreasPage.saveAndContinue();

  const caseDetailsPage = new CaseDetailsPage(page);
  await caseDetailsPage.verifyUrl();
  await caseDetailsPage.cancelCaseRegistration();
  await cancelCaseRegistrationConfirmationPage.verifyUrl();
  await cancelCaseRegistrationConfirmationPage.errorValidations();
  await cancelCaseRegistrationConfirmationPage.verifyPageElements();
  await cancelCaseRegistrationConfirmationPage.selectCancelCaseRegistrationNo();
  await cancelCaseRegistrationConfirmationPage.continue();
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
  await addSuspectPage.cancelCaseRegistration();
  await cancelCaseRegistrationConfirmationPage.verifyUrl();
  await cancelCaseRegistrationConfirmationPage.errorValidations();
  await cancelCaseRegistrationConfirmationPage.verifyPageElements();
  await cancelCaseRegistrationConfirmationPage.selectCancelCaseRegistrationNo();
  await cancelCaseRegistrationConfirmationPage.continue();
  await addSuspectPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/add-suspect",
  );
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
  await suspectDOBPage.cancelCaseRegistration();
  await cancelCaseRegistrationConfirmationPage.verifyUrl();
  await cancelCaseRegistrationConfirmationPage.errorValidations();
  await cancelCaseRegistrationConfirmationPage.verifyPageElements();
  await cancelCaseRegistrationConfirmationPage.selectCancelCaseRegistrationNo();
  await cancelCaseRegistrationConfirmationPage.continue();
  await suspectDOBPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/suspect-dob",
  );
  await suspectDOBPage.addDOBDay("27");
  await suspectDOBPage.addDOBMonth("03");
  await suspectDOBPage.addDOBYear("2007");
  await suspectDOBPage.saveAndContinue();

  const suspectGenderPage = new SuspectGenderPage(page);
  await suspectGenderPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/suspect-gender",
  );
  await suspectGenderPage.cancelCaseRegistration();
  await cancelCaseRegistrationConfirmationPage.verifyUrl();
  await cancelCaseRegistrationConfirmationPage.errorValidations();
  await cancelCaseRegistrationConfirmationPage.verifyPageElements();
  await cancelCaseRegistrationConfirmationPage.selectCancelCaseRegistrationNo();
  await cancelCaseRegistrationConfirmationPage.continue();
  await suspectGenderPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/suspect-gender",
  );
  await suspectGenderPage.verifyPageElements("POTTER, Harry");
  await suspectGenderPage.selectGenderMale();
  await suspectGenderPage.saveAndContinue();

  const suspectDisabilityPage = new SuspectDisabilityPage(page);
  await suspectDisabilityPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/suspect-disability",
  );
  await suspectDisabilityPage.cancelCaseRegistration();
  await cancelCaseRegistrationConfirmationPage.verifyUrl();
  await cancelCaseRegistrationConfirmationPage.errorValidations();
  await cancelCaseRegistrationConfirmationPage.verifyPageElements();
  await cancelCaseRegistrationConfirmationPage.selectCancelCaseRegistrationNo();
  await cancelCaseRegistrationConfirmationPage.continue();
  await suspectDisabilityPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/suspect-disability",
  );
  await suspectDisabilityPage.verifyPageElements("POTTER, Harry");
  await suspectDisabilityPage.selectDisabilityYes();
  await suspectDisabilityPage.saveAndContinue();

  const suspectReligionPage = new SuspectReligionPage(page);
  await suspectReligionPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/suspect-religion",
  );
  await suspectReligionPage.cancelCaseRegistration();
  await cancelCaseRegistrationConfirmationPage.verifyUrl();
  await cancelCaseRegistrationConfirmationPage.errorValidations();
  await cancelCaseRegistrationConfirmationPage.verifyPageElements();
  await cancelCaseRegistrationConfirmationPage.selectCancelCaseRegistrationNo();
  await cancelCaseRegistrationConfirmationPage.continue();
  await suspectReligionPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/suspect-religion",
  );
  await suspectReligionPage.verifyPageElements();
  await suspectReligionPage.selectReligionChristianity();
  await suspectReligionPage.saveAndContinue();

  const suspectEthnicityPage = new SuspectEthnicityPage(page);
  await suspectEthnicityPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/suspect-ethnicity",
  );
  await suspectEthnicityPage.cancelCaseRegistration();
  await cancelCaseRegistrationConfirmationPage.verifyUrl();
  await cancelCaseRegistrationConfirmationPage.errorValidations();
  await cancelCaseRegistrationConfirmationPage.verifyPageElements();
  await cancelCaseRegistrationConfirmationPage.selectCancelCaseRegistrationNo();
  await cancelCaseRegistrationConfirmationPage.continue();
  await suspectEthnicityPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/suspect-ethnicity",
  );
  await suspectEthnicityPage.verifyPageElements();
  await suspectEthnicityPage.selectEthnicityBlack();
  await suspectEthnicityPage.saveAndContinue();

  const suspectAliasesPage = new SuspectAliasesPage(page);
  await suspectAliasesPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/suspect-add-aliases",
  );
  await suspectAliasesPage.cancelCaseRegistration();
  await cancelCaseRegistrationConfirmationPage.verifyUrl();
  await cancelCaseRegistrationConfirmationPage.errorValidations();
  await cancelCaseRegistrationConfirmationPage.verifyPageElements();
  await cancelCaseRegistrationConfirmationPage.selectCancelCaseRegistrationNo();
  await cancelCaseRegistrationConfirmationPage.continue();
  await suspectAliasesPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/suspect-add-aliases",
  );
  await suspectAliasesPage.verifyPageElements();
  await suspectAliasesPage.addFirstName("Harry");
  await suspectAliasesPage.addLastName("Potter");
  await suspectAliasesPage.saveAndContinue();

  const suspectAliasesSummaryPage = new SuspectAliasesSummaryPage(page);
  await suspectAliasesSummaryPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/suspect-aliases-summary",
  );
  await suspectAliasesSummaryPage.cancelCaseRegistration();
  await cancelCaseRegistrationConfirmationPage.verifyUrl();
  await cancelCaseRegistrationConfirmationPage.errorValidations();
  await cancelCaseRegistrationConfirmationPage.verifyPageElements();
  await cancelCaseRegistrationConfirmationPage.selectCancelCaseRegistrationNo();
  await cancelCaseRegistrationConfirmationPage.continue();
  await suspectAliasesSummaryPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/suspect-aliases-summary",
  );
  await suspectAliasesSummaryPage.verifyPageElements();
  await suspectAliasesSummaryPage.verifySuspectAliasesList(["POTTER, Harry"]);
  await suspectAliasesSummaryPage.selectAddMoreAliasesNo();
  await suspectAliasesSummaryPage.saveAndContinue();

  const suspectASNPage = new SuspectASNPage(page);
  await suspectASNPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/suspect-asn",
  );
  await suspectASNPage.cancelCaseRegistration();
  await cancelCaseRegistrationConfirmationPage.verifyUrl();
  await cancelCaseRegistrationConfirmationPage.errorValidations();
  await cancelCaseRegistrationConfirmationPage.verifyPageElements();
  await cancelCaseRegistrationConfirmationPage.selectCancelCaseRegistrationNo();
  await cancelCaseRegistrationConfirmationPage.continue();
  await suspectASNPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/suspect-asn",
  );
  await suspectASNPage.verifyPageElements();
  await suspectASNPage.addASNText("123456");
  await suspectASNPage.saveAndContinue();

  const suspectOffenderTypesPage = new SuspectOffenderTypesPage(page);
  await suspectOffenderTypesPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/suspect-offender",
  );
  await suspectOffenderTypesPage.cancelCaseRegistration();
  await cancelCaseRegistrationConfirmationPage.verifyUrl();
  await cancelCaseRegistrationConfirmationPage.errorValidations();
  await cancelCaseRegistrationConfirmationPage.verifyPageElements();
  await cancelCaseRegistrationConfirmationPage.selectCancelCaseRegistrationNo();
  await cancelCaseRegistrationConfirmationPage.continue();
  await suspectOffenderTypesPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/suspect-offender",
  );
  await suspectOffenderTypesPage.selectOffenderTypePYO();
  await suspectOffenderTypesPage.addArrestDate("2024-01-01");
  await suspectOffenderTypesPage.saveAndContinue();

  const suspectSummaryPage = new SuspectSummaryPage(page);
  await suspectSummaryPage.verifyUrl();
  await suspectSummaryPage.cancelCaseRegistration();
  await cancelCaseRegistrationConfirmationPage.verifyUrl();
  await cancelCaseRegistrationConfirmationPage.errorValidations();
  await cancelCaseRegistrationConfirmationPage.verifyPageElements();
  await cancelCaseRegistrationConfirmationPage.selectCancelCaseRegistrationNo();
  await cancelCaseRegistrationConfirmationPage.continue();
  await suspectSummaryPage.verifyUrl();
  await suspectSummaryPage.verifyPageElements("You have added 1 suspect");
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
  await addSuspectPage.cancelCaseRegistration();
  await cancelCaseRegistrationConfirmationPage.verifyUrl();
  await cancelCaseRegistrationConfirmationPage.errorValidations();
  await cancelCaseRegistrationConfirmationPage.verifyPageElements();
  await cancelCaseRegistrationConfirmationPage.selectCancelCaseRegistrationNo();
  await cancelCaseRegistrationConfirmationPage.continue();
  await addSuspectPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-1/add-suspect",
  );
  await addSuspectPage.backLinkClick();
  await suspectSummaryPage.selectAddMoreSuspectNo();
  await suspectSummaryPage.saveAndContinue();
  const wantToAddChargesPage = new WantToAddChargesPage(page);
  await wantToAddChargesPage.verifyUrl();
  await wantToAddChargesPage.cancelCaseRegistration();
  await cancelCaseRegistrationConfirmationPage.verifyUrl();
  await cancelCaseRegistrationConfirmationPage.errorValidations();
  await cancelCaseRegistrationConfirmationPage.verifyPageElements();
  await cancelCaseRegistrationConfirmationPage.selectCancelCaseRegistrationNo();
  await cancelCaseRegistrationConfirmationPage.continue();
  await wantToAddChargesPage.verifyUrl();
  await wantToAddChargesPage.selectAddChargesYes();
  await wantToAddChargesPage.saveAndContinue();

  const chargesOffenceSearchPage = new ChargesOffenceSearchPagePage(page);
  await chargesOffenceSearchPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/charge-0/charges-offence-search",
  );
  await chargesOffenceSearchPage.addOffenceSearchText("test");
  await chargesOffenceSearchPage.searchOffence();
  await chargesOffenceSearchPage.validateOffenceSearchResults("test", 0, 0);
  await chargesOffenceSearchPage.addOffence(0);

  const addChargeDetailsPage = new AddChargeDetailsPage(page);
  await addChargeDetailsPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/charge-0/add-charge-details",
  );
  await addChargeDetailsPage.cancelCaseRegistration();
  await cancelCaseRegistrationConfirmationPage.verifyUrl();
  await cancelCaseRegistrationConfirmationPage.errorValidations();
  await cancelCaseRegistrationConfirmationPage.verifyPageElements();
  await cancelCaseRegistrationConfirmationPage.selectCancelCaseRegistrationNo();
  await cancelCaseRegistrationConfirmationPage.continue();
  await addChargeDetailsPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/charge-0/add-charge-details",
  );
  await addChargeDetailsPage.verifyPageElements(
    "POTTER, Harry",
    "WC81229 - Permit to be set trap etc - cause injury to wild bird",
    true,
  );
  await addChargeDetailsPage.clickDateRange();
  await addChargeDetailsPage.fillOffenceFromDate("2022-02-02");
  await addChargeDetailsPage.fillOffenceToDate("2022-02-03");
  await addChargeDetailsPage.selectAddVictimYes();
  await addChargeDetailsPage.selectChargedWithAdultYes();
  await addChargeDetailsPage.saveAndContinue();

  const addChargeVictimPage = new AddChargeVictimPage(page);
  await addChargeVictimPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/charge-0/add-charge-victim",
  );
  await addChargeVictimPage.cancelCaseRegistration();
  await cancelCaseRegistrationConfirmationPage.verifyUrl();
  await cancelCaseRegistrationConfirmationPage.errorValidations();
  await cancelCaseRegistrationConfirmationPage.verifyPageElements();
  await cancelCaseRegistrationConfirmationPage.selectCancelCaseRegistrationNo();
  await cancelCaseRegistrationConfirmationPage.continue();
  await addChargeVictimPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/charge-0/add-charge-victim",
  );
  await addChargeVictimPage.verifyPageElements(
    "POTTER, Harry",
    "WC81229 - Permit to be set trap etc - cause injury to wild bird",
  );
  await addChargeVictimPage.fillVictimFirstName("steve");
  await addChargeVictimPage.fillVictimLastName("smith");
  await addChargeVictimPage.selectVictimIsVulnerable(true);
  await addChargeVictimPage.selectVictimIsIntimidated(true);
  await addChargeVictimPage.selectVictimIsWitness(true);
  await addChargeVictimPage.saveAndContinue();

  const chargesSummaryPage = new ChargesSummaryPage(page);
  await chargesSummaryPage.verifyUrl();
  await chargesSummaryPage.cancelCaseRegistration();
  await cancelCaseRegistrationConfirmationPage.verifyUrl();
  await cancelCaseRegistrationConfirmationPage.errorValidations();
  await cancelCaseRegistrationConfirmationPage.verifyPageElements();
  await cancelCaseRegistrationConfirmationPage.selectCancelCaseRegistrationNo();
  await cancelCaseRegistrationConfirmationPage.continue();
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
  await chargesSummaryPage.selectAddMoreChargesYes();
  await chargesSummaryPage.saveAndContinue();

  const addChargeSuspectPage = new AddChargeSuspectPage(page);
  await addChargeSuspectPage.verifyUrl();
  await addChargeSuspectPage.cancelCaseRegistration();
  await cancelCaseRegistrationConfirmationPage.verifyUrl();
  await cancelCaseRegistrationConfirmationPage.errorValidations();
  await cancelCaseRegistrationConfirmationPage.verifyPageElements();
  await cancelCaseRegistrationConfirmationPage.selectCancelCaseRegistrationNo();
  await cancelCaseRegistrationConfirmationPage.continue();
  await addChargeSuspectPage.verifyUrl();
  await addChargeSuspectPage.verifyPageElements(["POTTER, Harry"]);
  await addChargeSuspectPage.selectSuspectByName("POTTER, Harry");
  await addChargeSuspectPage.saveAndContinue();

  await chargesOffenceSearchPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/charge-1/charges-offence-search",
  );
  await chargesOffenceSearchPage.verifyPageElements("POTTER, Harry");
  await chargesOffenceSearchPage.addOffenceSearchText("test");
  await chargesOffenceSearchPage.searchOffence();
  await chargesOffenceSearchPage.validateOffenceSearchResults("test", 0, 1);
  await chargesOffenceSearchPage.addOffence(1);

  await addChargeDetailsPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/charge-1/add-charge-details",
  );
  await addChargeDetailsPage.cancelCaseRegistration();
  await cancelCaseRegistrationConfirmationPage.verifyUrl();
  await cancelCaseRegistrationConfirmationPage.errorValidations();
  await cancelCaseRegistrationConfirmationPage.verifyPageElements();
  await cancelCaseRegistrationConfirmationPage.selectCancelCaseRegistrationNo();
  await cancelCaseRegistrationConfirmationPage.continue();
  await addChargeDetailsPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/charge-1/add-charge-details",
  );

  await addChargeDetailsPage.verifyPageElements(
    "POTTER, Harry",
    "PB92005 - Attempt to injure a badger",
    true,
  );
  await addChargeDetailsPage.clickDateRange();
  await addChargeDetailsPage.fillOffenceFromDate("2022-02-02");
  await addChargeDetailsPage.fillOffenceToDate("2022-02-03");
  await addChargeDetailsPage.selectAddVictimYes();
  await addChargeDetailsPage.selectChargedWithAdultNo();
  await addChargeDetailsPage.saveAndContinue();
  await addChargeVictimPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/charge-1/add-charge-victim",
  );
  await addChargeVictimPage.cancelCaseRegistration();
  await cancelCaseRegistrationConfirmationPage.verifyUrl();
  await cancelCaseRegistrationConfirmationPage.errorValidations();
  await cancelCaseRegistrationConfirmationPage.verifyPageElements();
  await cancelCaseRegistrationConfirmationPage.selectCancelCaseRegistrationNo();
  await cancelCaseRegistrationConfirmationPage.continue();
  await addChargeVictimPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/charge-1/add-charge-victim",
  );
  await addChargeVictimPage.verifyPageElements(
    "POTTER, Harry",
    "PB92005 - Attempt to injure a badger",
  );

  await addChargeVictimPage.verifyAddMoreVictimElements(["SMITH, Steve"]);
  await addChargeVictimPage.selectVictimByName("Add new victim");
  await addChargeVictimPage.fillVictimFirstName("mark");
  await addChargeVictimPage.fillVictimLastName("smith");
  await addChargeVictimPage.selectVictimIsVulnerable(true);
  await addChargeVictimPage.selectVictimIsIntimidated(true);
  await addChargeVictimPage.selectVictimIsWitness(true);
  await addChargeVictimPage.saveAndContinue();

  await chargesSummaryPage.verifyUrl();
  await chargesSummaryPage.cancelCaseRegistration();
  await cancelCaseRegistrationConfirmationPage.verifyUrl();
  await cancelCaseRegistrationConfirmationPage.errorValidations();
  await cancelCaseRegistrationConfirmationPage.verifyPageElements();
  await cancelCaseRegistrationConfirmationPage.selectCancelCaseRegistrationNo();
  await cancelCaseRegistrationConfirmationPage.continue();
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
            dateOfOffence: "02 February 2022 to 03 February 2022",
            victim: {
              name: "SMITH, Steve",
              properties: "WitnessVulnerableIntimidated",
            },
          },
        },
        {
          offenceCode: "PB92005",
          offenceDescription: "Attempt to injure a badger",
          chargeDetails: {
            dateOfOffence: "02 February 2022 to 03 February 2022",
            victim: {
              name: "SMITH, Mark",
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
  await firstHearingDetailsPage.cancelCaseRegistration();
  await cancelCaseRegistrationConfirmationPage.verifyUrl();
  await cancelCaseRegistrationConfirmationPage.errorValidations();
  await cancelCaseRegistrationConfirmationPage.verifyPageElements();
  await cancelCaseRegistrationConfirmationPage.selectCancelCaseRegistrationNo();
  await cancelCaseRegistrationConfirmationPage.continue();
  await firstHearingDetailsPage.verifyUrl();

  await firstHearingDetailsPage.selectAddFirstHearingDetailsYes();
  await firstHearingDetailsPage.enterFirstHearingCourtLocation("Court A");
  await firstHearingDetailsPage.addFirstHearingDate("2022-02-04");
  await firstHearingDetailsPage.saveAndContinue();

  const caseMonitoringPage = new CaseMonitoringPage(page);
  await caseMonitoringPage.verifyUrl();
  await caseMonitoringPage.cancelCaseRegistration();
  await cancelCaseRegistrationConfirmationPage.verifyUrl();
  await cancelCaseRegistrationConfirmationPage.errorValidations();
  await cancelCaseRegistrationConfirmationPage.verifyPageElements();
  await cancelCaseRegistrationConfirmationPage.selectCancelCaseRegistrationNo();
  await cancelCaseRegistrationConfirmationPage.continue();
  await caseMonitoringPage.verifyUrl();
  await caseMonitoringPage.selectMonitoringCode("Asset Recovery");
  await caseMonitoringPage.saveAndContinue();

  const caseAssigneePage = new CaseAssigneePage(page);
  await caseAssigneePage.verifyUrl();
  await caseAssigneePage.cancelCaseRegistration();
  await cancelCaseRegistrationConfirmationPage.verifyUrl();
  await cancelCaseRegistrationConfirmationPage.errorValidations();
  await cancelCaseRegistrationConfirmationPage.verifyPageElements();
  await cancelCaseRegistrationConfirmationPage.selectCancelCaseRegistrationNo();
  await cancelCaseRegistrationConfirmationPage.continue();
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
  await caseRegistrationSummaryPage.cancelCaseRegistration();
  await cancelCaseRegistrationConfirmationPage.verifyUrl();
  await cancelCaseRegistrationConfirmationPage.errorValidations();
  await cancelCaseRegistrationConfirmationPage.verifyPageElements();
  await cancelCaseRegistrationConfirmationPage.selectCancelCaseRegistrationNo();
  await cancelCaseRegistrationConfirmationPage.continue();
  await caseRegistrationSummaryPage.verifyUrl();
  await caseRegistrationSummaryPage.verifyCaseDetailsElements({
    area: "CAMBRIDGESHIRE",
    urn: "122112345/26",
    registeringUnit: "NORTHERN CJU (Peterborough)",
    wcu: "Cambridgeshire Non Operational WCU",
    operationName: "thunderstruck",
  });
  await caseRegistrationSummaryPage.verifyAddNewSuspectElements(1);
  await suspectSummaryPage.verifySuspectSummaryRows(["POTTER, Harry"]);
  await caseRegistrationSummaryPage.verifySuspectSummaryDetails(0, [
    {
      key: "Date of birth",
      value: "27/03/2007",
    },
    {
      key: "Gender",
      value: "Male",
    },
    {
      key: "Disability",
      value: "yes",
    },
    {
      key: "Religion",
      value: "Christianity",
    },
    {
      key: "Ethnicity",
      value: "Black",
    },
    {
      key: "Alias",
      value: "POTTER, Harry",
    },
    {
      key: "Arrest Summons Number",
      value: "123456",
    },
    {
      key: "Type of offender",
      value: "Prolific youth offender (PYO)",
    },
    {
      key: "Arrest date",
      value: "01 January 2024",
    },
  ]);
  await caseRegistrationSummaryPage.verifyChargesSummaryDetails(0, [
    {
      key: "WC81229",
      value: "Permit to be set trap etc - cause injury to wild bird",
    },
    { key: "Date of offence", value: "02 February 2022 to 03 February 2022" },
    { key: "Victim", value: "SMITH, SteveWitnessVulnerableIntimidated" },
    { key: "Charged with an adult", value: "Yes" },
    { key: "PB92005", value: "Attempt to injure a badger" },
    { key: "Date of offence", value: "02 February 2022 to 03 February 2022" },
    { key: "Victim", value: "SMITH, MarkWitnessVulnerableIntimidated" },
    { key: "Charged with an adult", value: "No" },
  ]);
  await caseRegistrationSummaryPage.verifyAddNewChargeDetails(
    0,
    "/case-registration/suspect-0/charge-2/charges-offence-search",
    "person",
    true,
  );
  await caseRegistrationSummaryPage.verifyFirstHearingElements({
    courtLocation: "Court A",
    firstHearingDate: "04 February 2022",
  });

  await caseRegistrationSummaryPage.verifyComplexityAndMonitoringCodesElements({
    complexity: "Basic",
    monitoringCodes: ["Asset Recovery"],
  });
  await caseRegistrationSummaryPage.verifyWorkingOnTheCaseElements({
    prosecutor: "Prosecutor A",
    caseworker: "Caseworker A",
    investigator: "InvestigatorL, InvestigatorF",
    shoulderNumber: "12345",
    policeUnit: "Not entered",
  });
  await caseRegistrationSummaryPage.cancelCaseRegistration();
  await cancelCaseRegistrationConfirmationPage.verifyUrl();
  await cancelCaseRegistrationConfirmationPage.errorValidations();
  await cancelCaseRegistrationConfirmationPage.verifyPageElements();
  await cancelCaseRegistrationConfirmationPage.selectCancelCaseRegistrationYes();
  await cancelCaseRegistrationConfirmationPage.continue();
  await expect(page).toHaveURL("https://www.gov.uk/");
});
