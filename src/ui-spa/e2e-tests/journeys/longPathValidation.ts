import { type Page } from "@playwright/test";
import { CaseRegistrationHomePage } from "../../integration-tests/pages/caseRegistrationHomePage";
import { CaseAreasPage } from "../../integration-tests/pages/caseAreasPage";
import { AddSuspectPage } from "../../integration-tests/pages/addSuspectPage";
import { SuspectDOBPage } from "../../integration-tests/pages/suspectDOBPage";
import { SuspectGenderPage } from "../../integration-tests/pages/suspectGenderPage";
import { SuspectDisabilityPage } from "../../integration-tests/pages/suspectDisabilityPage";
import { SuspectReligionPage } from "../../integration-tests/pages/suspectReligionPage";
import { SuspectEthnicityPage } from "../../integration-tests/pages/suspectEthnicityPage";
import { SuspectAliasesPage } from "../../integration-tests/pages/suspectAddAliases";
import { SuspectAliasesSummaryPage } from "../../integration-tests/pages/suspectAliasesSummary";
import { SuspectASNPage } from "../../integration-tests/pages/suspectASNPage";
import { SuspectOffenderTypesPage } from "../../integration-tests/pages/suspectOffenderTypesPage";
import { SuspectSummaryPage } from "../../integration-tests/pages/suspectSummaryPage";
import { WantToAddChargesPage } from "../../integration-tests/pages/wantToAddChargesPage";
import { AddChargeDetailsPage } from "../../integration-tests/pages/addChargeDetailsPage";
import { AddChargeVictimPage } from "../../integration-tests/pages/addChargeVictimPage";
import { ChargesSummaryPage } from "../../integration-tests/pages/chargesSummaryPage";
import { FirstHearingDetailsPage } from "../../integration-tests/pages/firstHearingDetailsPage";
import { CaseMonitoringPage } from "../../integration-tests/pages/caseMonitoringPage";
import { CaseAssigneePage } from "../../integration-tests/pages/caseAssigneePage";
import { CaseDetailsPage } from "../pages/caseDetailsPage";
import { ChargesOffenceSearchPage } from "../pages/chargesOffenceSearchPage";
import { generateUniqueUrn, type UrnParts } from "../utils/generateUrn";
import { startRegistration } from "../utils/startRegistration";
import { expectStep } from "../utils/expectStep";
import {
  AREA,
  REGISTERING_UNIT,
  WITNESS_CARE_UNIT,
  startAtHomePage,
  enterAreasAndCaseDetails,
  completeMonitoringAndAssignee,
  verifySummaryAndSubmit,
  watchAssigneeLookups,
  fillAssignee,
} from "./steps";
import { personName, chargeDates, isoDate } from "./suspectChargeSteps";

const OFFENCE_CODE = process.env.E2E_OFFENCE_CODE ?? "TH68040";
// Any code with no offence matches; the backend treats an invalid code the same
// as a zero-result search, so this covers both.
const NO_RESULT_OFFENCE_CODE = "ZZ99999NOMATCH";

export interface LongPathValidationOptions {
  operationName: string;
}

// Registers a minimal short-path case purely to occupy a URN, so the main
// walkthrough can assert the real backend duplicate-URN error against it.
async function registerSeedCase(
  page: Page,
  urn: UrnParts,
  operationName: string,
): Promise<void> {
  await startAtHomePage(page, { operationName, hasSuspect: false });
  await enterAreasAndCaseDetails(page, urn);
  await completeMonitoringAndAssignee(page);
  await verifySummaryAndSubmit(page, urn, {
    area: AREA,
    registeringUnit: REGISTERING_UNIT,
    wcu: WITNESS_CARE_UNIT,
    operationName,
  });
}

export async function completeLongPathValidation(
  page: Page,
  { operationName }: LongPathValidationOptions,
): Promise<void> {
  const existingUrn = generateUniqueUrn();
  const urn = generateUniqueUrn();
  const suspect = personName();
  const alias = personName();
  const victim = personName();
  const { offence, arrestDate } = chargeDates();

  // Seed an existing case so the duplicate-URN check below hits a real match.
  await registerSeedCase(page, existingUrn, operationName);

  // Start the validation walkthrough as a fresh registration.
  await startRegistration(page);

  // Home: validate, then add an operation name and a suspect.
  const homePage = new CaseRegistrationHomePage(page);
  await expectStep(page, "/case-registration");
  await homePage.errorValidations();
  await homePage.addOperationName(operationName);
  await homePage.addSuspect();
  await homePage.saveAndContinue();

  // Areas.
  const areasPage = new CaseAreasPage(page);
  await expectStep(page, "/case-registration/areas");
  await areasPage.errorValidations();
  await areasPage.enterAreaOrDivision(AREA);
  await areasPage.saveAndContinue();

  // Case details: client-side field validation, then the real backend
  // duplicate-URN error using the seeded URN, then a fresh URN to continue.
  const caseDetailsPage = new CaseDetailsPage(page);
  await expectStep(page, "/case-registration/case-details");
  await caseDetailsPage.errorValidations();
  await caseDetailsPage.enterRegisteringUnit(REGISTERING_UNIT);
  await caseDetailsPage.enterWitnessCareUnit(WITNESS_CARE_UNIT);
  await caseDetailsPage.submitAndExpectExistingUrnError(existingUrn);
  await caseDetailsPage.enterUrn(urn);
  await caseDetailsPage.saveAndContinue();

  // Add suspect.
  const addSuspectPage = new AddSuspectPage(page);
  await expectStep(page, "/case-registration/suspect-0/add-suspect");
  await addSuspectPage.errorValidations();
  await addSuspectPage.addPersonSuspect();
  await addSuspectPage.addSuspectFirstName(suspect.first);
  await addSuspectPage.addSuspectLastName(suspect.last);
  await addSuspectPage.selectAdditionalDetailsDOB(true);
  await addSuspectPage.selectAdditionalDetailsGender(true);
  await addSuspectPage.selectAdditionalDetailsDisability(true);
  await addSuspectPage.selectAdditionalDetailsReligion(true);
  await addSuspectPage.selectAdditionalDetailsEthnicity(true);
  await addSuspectPage.selectAdditionalDetailsASN(true);
  await addSuspectPage.selectAdditionalDetailsAlias(true);
  await addSuspectPage.selectAdditionalDetailsOffenderType(true);
  await addSuspectPage.saveAndContinue();

  // Suspect DOB (15 years ago so the suspect qualifies as a youth offender).
  const suspectDOBPage = new SuspectDOBPage(page);
  await expectStep(page, "/case-registration/suspect-0/suspect-dob");
  await suspectDOBPage.errorValidations();
  const dob = new Date();
  dob.setFullYear(dob.getFullYear() - 15);
  await suspectDOBPage.addDOBDay(String(dob.getDate()));
  await suspectDOBPage.addDOBMonth(String(dob.getMonth() + 1));
  await suspectDOBPage.addDOBYear(String(dob.getFullYear()));
  await suspectDOBPage.saveAndContinue();

  const suspectGenderPage = new SuspectGenderPage(page);
  await expectStep(page, "/case-registration/suspect-0/suspect-gender");
  await suspectGenderPage.errorValidations();
  await suspectGenderPage.selectGenderMale();
  await suspectGenderPage.saveAndContinue();

  const suspectDisabilityPage = new SuspectDisabilityPage(page);
  await expectStep(page, "/case-registration/suspect-0/suspect-disability");
  await suspectDisabilityPage.errorValidations();
  await suspectDisabilityPage.selectDisabilityYes();
  await suspectDisabilityPage.saveAndContinue();

  const suspectReligionPage = new SuspectReligionPage(page);
  await expectStep(page, "/case-registration/suspect-0/suspect-religion");
  await suspectReligionPage.errorValidations();
  await suspectReligionPage.selectFirstReligion();
  await suspectReligionPage.saveAndContinue();

  const suspectEthnicityPage = new SuspectEthnicityPage(page);
  await expectStep(page, "/case-registration/suspect-0/suspect-ethnicity");
  await suspectEthnicityPage.errorValidations();
  await suspectEthnicityPage.selectFirstEthnicity();
  await suspectEthnicityPage.saveAndContinue();

  const suspectAliasesPage = new SuspectAliasesPage(page);
  await expectStep(page, "/case-registration/suspect-0/suspect-add-aliases");
  await suspectAliasesPage.errorValidations();
  await suspectAliasesPage.addFirstName(alias.first);
  await suspectAliasesPage.addLastName(alias.last);
  await suspectAliasesPage.saveAndContinue();

  const suspectAliasesSummaryPage = new SuspectAliasesSummaryPage(page);
  await expectStep(
    page,
    "/case-registration/suspect-0/suspect-aliases-summary",
  );
  await suspectAliasesSummaryPage.errorValidations();
  await suspectAliasesSummaryPage.selectAddMoreAliasesNo();
  await suspectAliasesSummaryPage.saveAndContinue();

  const suspectASNPage = new SuspectASNPage(page);
  await expectStep(page, "/case-registration/suspect-0/suspect-asn");
  await suspectASNPage.errorValidations();
  await suspectASNPage.addASNText("123456");
  await suspectASNPage.saveAndContinue();

  const suspectOffenderTypesPage = new SuspectOffenderTypesPage(page);
  await expectStep(page, "/case-registration/suspect-0/suspect-offender");
  await suspectOffenderTypesPage.errorValidations();
  await suspectOffenderTypesPage.selectOffenderTypePYO();
  await suspectOffenderTypesPage.addArrestDate(isoDate(arrestDate));
  await suspectOffenderTypesPage.saveAndContinue();

  const suspectSummaryPage = new SuspectSummaryPage(page);
  await expectStep(page, "/case-registration/suspect-summary");
  await suspectSummaryPage.errorValidations();
  await suspectSummaryPage.selectAddMoreSuspectNo();
  await suspectSummaryPage.saveAndContinue();

  const wantToAddChargesPage = new WantToAddChargesPage(page);
  await expectStep(page, "/case-registration/want-to-add-charges");
  await wantToAddChargesPage.errorValidations();
  await wantToAddChargesPage.selectAddChargesYes();
  await wantToAddChargesPage.saveAndContinue();

  // Offence search: empty-submit validation, a real zero-result search, then a
  // valid offence code.
  const offenceSearchPage = new ChargesOffenceSearchPage(page);
  await expectStep(
    page,
    "/case-registration/suspect-0/charge-0/charges-offence-search",
  );
  await offenceSearchPage.errorValidations();
  await offenceSearchPage.searchAndExpectNoResults(NO_RESULT_OFFENCE_CODE);
  await offenceSearchPage.searchAndAddFirstOffence(OFFENCE_CODE);

  // Charge details (youth offender, so the charged-with-adult question shows).
  const addChargeDetailsPage = new AddChargeDetailsPage(page);
  await expectStep(
    page,
    "/case-registration/suspect-0/charge-0/add-charge-details",
  );
  await addChargeDetailsPage.errorValidations(true);
  await addChargeDetailsPage.clickDateRange();
  await addChargeDetailsPage.fillOffenceFromDate(isoDate(offence.from));
  await addChargeDetailsPage.fillOffenceToDate(isoDate(offence.to));
  await addChargeDetailsPage.selectAddVictimYes();
  await addChargeDetailsPage.selectChargedWithAdultYes();
  await addChargeDetailsPage.saveAndContinue();

  const addChargeVictimPage = new AddChargeVictimPage(page);
  await expectStep(
    page,
    "/case-registration/suspect-0/charge-0/add-charge-victim",
  );
  await addChargeVictimPage.errorValidationsNewVictims();
  await addChargeVictimPage.fillVictimFirstName(victim.first);
  await addChargeVictimPage.fillVictimLastName(victim.last);
  await addChargeVictimPage.selectVictimIsVulnerable(true);
  await addChargeVictimPage.selectVictimIsIntimidated(true);
  await addChargeVictimPage.selectVictimIsWitness(true);
  await addChargeVictimPage.saveAndContinue();

  // Charges summary: validate, then no more charges. Capture the courts lookup
  // that fires when continuing into the (charge-driven) first hearing step.
  const chargesSummaryPage = new ChargesSummaryPage(page);
  await expectStep(page, "/case-registration/charges-summary");
  await chargesSummaryPage.errorValidations();
  await chargesSummaryPage.selectAddMoreChargesNo();
  const courtsResponse = page.waitForResponse(
    (r) => /\/api\/v1\/courts\//.test(r.url()) && r.ok(),
    { timeout: 30_000 },
  );
  await chargesSummaryPage.saveAndContinue();

  // First hearing: validate, then add real court + date.
  const firstHearingDetailsPage = new FirstHearingDetailsPage(page);
  await expectStep(page, "/case-registration/first-hearing");
  await firstHearingDetailsPage.errorValidations();
  const courts = (await (await courtsResponse).json()) as {
    description: string;
  }[];
  const courtName = courts[0]?.description;
  if (!courtName) {
    throw new Error("no courts returned for the registering unit");
  }
  const hearingDate = new Date();
  hearingDate.setDate(hearingDate.getDate() + 14);
  await firstHearingDetailsPage.selectAddFirstHearingDetailsYes();
  await firstHearingDetailsPage.enterFirstHearingCourtLocation(courtName);
  await firstHearingDetailsPage.addFirstHearingDate(isoDate(hearingDate));
  await firstHearingDetailsPage.saveAndContinue();

  // Monitoring codes (optional step, no required validation). Charges exist, so
  // the pre-charge box is unchecked. Watch the assignee lookups before leaving.
  const caseMonitoringPage = new CaseMonitoringPage(page);
  await expectStep(page, "/case-registration/case-monitoring-codes");
  await caseMonitoringPage.verifyPreChargeCheckboxNotChecked();
  const lookups = watchAssigneeLookups(page);
  await caseMonitoringPage.saveAndContinue();

  // Assignee: validate, then fill real prosecutor/caseworker/investigator.
  const caseAssigneePage = new CaseAssigneePage(page);
  await expectStep(page, "/case-registration/case-assignee");
  await caseAssigneePage.errorValidations();
  await fillAssignee(page, lookups);

  // Summary: assert details, submit to POST /api/v1/cases and assert the real
  // response body and the confirmation page URN.
  await verifySummaryAndSubmit(page, urn, {
    area: AREA,
    registeringUnit: REGISTERING_UNIT,
    wcu: WITNESS_CARE_UNIT,
    operationName,
  });
}
