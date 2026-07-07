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
import { ChargesOffenceSearchPagePage } from "./pages/chargesOffenceSearchPage";
import { AddChargeDetailsPage } from "./pages/addChargeDetailsPage";
import { AddChargeVictimPage } from "./pages/addChargeVictimPage";
import { ChargesSummaryPage } from "./pages/chargesSummaryPage";
import { AddChargeSuspectPage } from "./pages/addChargeSuspectPage";
import { FirstHearingDetailsPage } from "./pages/firstHearingDetailsPage";
import { CaseMonitoringPage } from "./pages/caseMonitoringPage";
import { CaseAssigneePage } from "./pages/caseAssigneePage";
import { CaseRegistrationSummaryPage } from "./pages/caseRegistrationSummaryPage";
import { ChangeAreaConfirmationPage } from "./pages/changeAreaConfirmation";
import { ChangeRegisteringUnitConfirmationPage } from "./pages/changeRegisteringUnitConfirmation";

test("Should successfully complete suspect journey", async ({ page }) => {
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
  await caseAreasPage.verifyPageElements();
  await caseAreasPage.errorValidations();
  await caseAreasPage.enterAreaOrDivision("CAMBRIDGESHIRE");
  await caseAreasPage.saveAndContinue();
  await caseAreasPage.verifyErrorSummaryClear();

  const caseDetailsPage = new CaseDetailsPage(page);
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
  await suspectDOBPage.errorValidations();
  await suspectDOBPage.addDOBDay("27");
  await suspectDOBPage.addDOBMonth("03");
  await suspectDOBPage.addDOBYear("2007");
  await suspectDOBPage.saveAndContinue();

  const suspectGenderPage = new SuspectGenderPage(page);
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
  await suspectDisabilityPage.verifyPageElements("POTTER, Harry");
  await suspectDisabilityPage.errorValidations();
  await suspectDisabilityPage.selectDisabilityYes();
  await suspectDisabilityPage.saveAndContinue();

  const suspectReligionPage = new SuspectReligionPage(page);
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
  await suspectEthnicityPage.verifyPageElements();
  await suspectEthnicityPage.errorValidations();
  await suspectEthnicityPage.selectEthnicityBlack();
  await suspectEthnicityPage.saveAndContinue();

  const suspectAliasesPage = new SuspectAliasesPage(page);
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
  await suspectAliasesSummaryPage.verifyPageElements();
  await suspectAliasesSummaryPage.errorValidations();
  await suspectAliasesSummaryPage.verifySuspectAliasesList(["POTTER, Harry"]);
  await suspectAliasesSummaryPage.selectAddMoreAliasesNo();
  await suspectAliasesSummaryPage.saveAndContinue();

  const suspectASNPage = new SuspectASNPage(page);
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
  await suspectOffenderTypesPage.verifyBasePageElements();
  await suspectOffenderTypesPage.errorValidations();
  await suspectOffenderTypesPage.verifyPYOElements();
  await suspectOffenderTypesPage.verifyYOElements();
  await suspectOffenderTypesPage.selectOffenderTypePYO();
  await suspectOffenderTypesPage.addArrestDate("2024-01-01");
  await suspectOffenderTypesPage.saveAndContinue();

  //second suspect
  const suspectSummaryPage = new SuspectSummaryPage(page);
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
  await suspectDOBPage.addDOBDay("15");
  await suspectDOBPage.addDOBMonth("06");
  await suspectDOBPage.addDOBYear("2007");
  await suspectDOBPage.saveAndContinue();

  await suspectGenderPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-1/suspect-gender",
  );
  await suspectGenderPage.selectGenderFemale();
  await suspectGenderPage.saveAndContinue();

  await suspectDisabilityPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-1/suspect-disability",
  );
  await suspectDisabilityPage.selectDisabilityNo();
  await suspectDisabilityPage.saveAndContinue();

  await suspectReligionPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-1/suspect-religion",
  );
  await suspectReligionPage.selectReligionChristianity();
  await suspectReligionPage.saveAndContinue();

  await suspectEthnicityPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-1/suspect-ethnicity",
  );
  await suspectEthnicityPage.selectEthnicityWhite();
  await suspectEthnicityPage.saveAndContinue();

  await suspectAliasesPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-1/suspect-add-aliases",
  );
  await suspectAliasesPage.addFirstName("Stev");
  await suspectAliasesPage.addLastName("mark");
  await suspectAliasesPage.saveAndContinue();

  await suspectAliasesSummaryPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-1/suspect-aliases-summary",
  );
  await suspectAliasesSummaryPage.verifySuspectAliasesList(["MARK, Stev"]);
  await suspectAliasesSummaryPage.selectAddMoreAliasesNo();
  await suspectAliasesSummaryPage.saveAndContinue();

  await suspectASNPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-1/suspect-asn",
  );
  await suspectASNPage.addASNText("1234");
  await suspectASNPage.saveAndContinue();

  await suspectOffenderTypesPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-1/suspect-offender",
  );
  await suspectOffenderTypesPage.selectOffenderTypePPO();
  await suspectOffenderTypesPage.saveAndContinue();

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
  await wantToAddChargesPage.verifyPageElements(
    "Do you want to add charges for the suspect?",
  );
  await wantToAddChargesPage.errorValidations();
  await wantToAddChargesPage.selectAddChargesYes();
  await wantToAddChargesPage.saveAndContinue();

  const chargesOffenceSearchPage = new ChargesOffenceSearchPagePage(page);
  await chargesOffenceSearchPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/charge-0/charges-offence-search",
  );
  await chargesOffenceSearchPage.verifyPageElements("POTTER, Harry");
  await chargesOffenceSearchPage.errorValidations();
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
    true,
  );
  await addChargeDetailsPage.errorValidations(true);
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
  await addChargeVictimPage.verifyPageElements(
    "POTTER, Harry",
    "WC81229 - Permit to be set trap etc - cause injury to wild bird",
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
  await chargesSummaryPage.errorValidations();
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
  await addChargeSuspectPage.verifyPageElements(["POTTER, Harry"]);
  await addChargeSuspectPage.errorValidations();
  await addChargeSuspectPage.selectSuspectByName("POTTER, Harry");
  await addChargeSuspectPage.saveAndContinue();

  await chargesOffenceSearchPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/charge-1/charges-offence-search",
  );
  await chargesOffenceSearchPage.verifyPageElements("POTTER, Harry");
  await chargesOffenceSearchPage.errorValidations();
  await chargesOffenceSearchPage.addOffenceSearchText("test");
  await chargesOffenceSearchPage.searchOffence();
  await chargesOffenceSearchPage.validateOffenceSearchResults("test", 0, 1);
  await chargesOffenceSearchPage.addOffence(1);

  await addChargeDetailsPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/charge-1/add-charge-details",
  );
  await addChargeDetailsPage.verifyPageElements(
    "POTTER, Harry",
    "PB92005 - Attempt to injure a badger",
    true,
  );
  await addChargeDetailsPage.errorValidations(true);
  await addChargeDetailsPage.clickDateRange();
  await addChargeDetailsPage.fillOffenceFromDate("2022-02-02");
  await addChargeDetailsPage.fillOffenceToDate("2022-02-03");
  await addChargeDetailsPage.selectAddVictimYes();
  await addChargeDetailsPage.selectChargedWithAdultNo();
  await addChargeDetailsPage.saveAndContinue();
  await addChargeVictimPage.verifyUrl(
    "http://localhost:5173/case-registration/suspect-0/charge-1/add-charge-victim",
  );
  await addChargeVictimPage.verifyPageElements(
    "POTTER, Harry",
    "PB92005 - Attempt to injure a badger",
  );
  await addChargeVictimPage.errorValidationsSelectVictims();
  await addChargeVictimPage.verifyAddMoreVictimElements(["SMITH, Steve"]);

  await addChargeVictimPage.selectVictimByName("Add new victim");
  await addChargeVictimPage.fillVictimFirstName("mark");
  await addChargeVictimPage.fillVictimLastName("smith");
  await addChargeVictimPage.selectVictimIsVulnerable(true);
  await addChargeVictimPage.selectVictimIsIntimidated(true);
  await addChargeVictimPage.selectVictimIsWitness(true);
  await addChargeVictimPage.saveAndContinue();

  await chargesSummaryPage.verifyUrl();
  await chargesSummaryPage.errorValidations();
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
  await firstHearingDetailsPage.errorValidations();
  await firstHearingDetailsPage.verifyPageElements();
  await firstHearingDetailsPage.selectAddFirstHearingDetailsYes();
  await firstHearingDetailsPage.enterFirstHearingCourtLocation("Court A");
  await firstHearingDetailsPage.addFirstHearingDate("2022-02-04");
  await firstHearingDetailsPage.saveAndContinue();

  const caseMonitoringPage = new CaseMonitoringPage(page);
  await caseMonitoringPage.verifyUrl();
  await caseMonitoringPage.verifyPageElements(45);
  await caseMonitoringPage.verifyPreChargeCheckboxNotChecked();
  await caseMonitoringPage.selectMonitoringCode("Asset Recovery");
  await caseMonitoringPage.saveAndContinue();
  await caseMonitoringPage.verifyErrorSummaryClear();

  const caseAssigneePage = new CaseAssigneePage(page);
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
  await caseRegistrationSummaryPage.verifyCaseDetailsElements({
    area: "CAMBRIDGESHIRE",
    urn: "12211234526",
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
  await caseRegistrationSummaryPage.changeAreaLinkClick();
  await caseAreasPage.verifyUrl();
  await caseAreasPage.verifyBackLink("/case-registration/case-summary");
  await caseAreasPage.enterAreaOrDivision("Cheshire");
  await caseAreasPage.saveAndContinue();
  const changeAreaConfirmationPage = new ChangeAreaConfirmationPage(page);
  await changeAreaConfirmationPage.verifyUrl();
  await changeAreaConfirmationPage.verifyPageElements(true);
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

  await firstHearingDetailsPage.verifyUrl();
  await firstHearingDetailsPage.verifyNoBackLink();
  await firstHearingDetailsPage.verifyPageElements();
  await firstHearingDetailsPage.selectAddFirstHearingDetailsYes();
  await firstHearingDetailsPage.enterFirstHearingCourtLocation("Court B");
  await firstHearingDetailsPage.addFirstHearingDate("2022-02-05");
  await firstHearingDetailsPage.saveAndContinue();

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
  await caseRegistrationSummaryPage.verifyFirstHearingElements({
    courtLocation: "Court B",
    firstHearingDate: "05 February 2022",
  });
  await caseRegistrationSummaryPage.verifyWorkingOnTheCaseElements({
    prosecutor: "Prosecutor B",
    caseworker: "Caseworker B",
    investigator: "InvestigatorB, InvestigatorA",
    shoulderNumber: "123456",
    policeUnit: "Not entered",
  });

  await caseRegistrationSummaryPage.changeRegisteringUnitLinkClick();
  await caseDetailsPage.verifyUrl();
  await caseDetailsPage.verifyBackLink("/case-registration/case-summary");
  await caseDetailsPage.enterRegisteringUnit("Warrington CCU");
  await caseDetailsPage.enterWitnessCareUnit("Chester Business WCU");
  await caseDetailsPage.saveAndContinue();
  const changeRegisteringUnitConfirmationPage =
    new ChangeRegisteringUnitConfirmationPage(page);
  await changeRegisteringUnitConfirmationPage.verifyUrl();
  await changeRegisteringUnitConfirmationPage.verifyPageElements(true);
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

  await firstHearingDetailsPage.verifyUrl();
  await firstHearingDetailsPage.verifyNoBackLink();
  await firstHearingDetailsPage.verifyPageElements();
  await firstHearingDetailsPage.selectAddFirstHearingDetailsYes();
  await firstHearingDetailsPage.enterFirstHearingCourtLocation("Court A");
  await firstHearingDetailsPage.addFirstHearingDate("2022-02-06");
  await firstHearingDetailsPage.saveAndContinue();

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
  await caseRegistrationSummaryPage.verifyFirstHearingElements({
    courtLocation: "Court A",
    firstHearingDate: "06 February 2022",
  });
  await caseRegistrationSummaryPage.verifyWorkingOnTheCaseElements({
    prosecutor: "Prosecutor A",
    caseworker: "Caseworker A",
    investigator: "InvestigatorB, InvestigatorA",
    shoulderNumber: "1234567",
    policeUnit: "Not entered",
  });
});
