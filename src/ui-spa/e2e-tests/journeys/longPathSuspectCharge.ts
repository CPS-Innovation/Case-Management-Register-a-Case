import { expect, type Page } from "@playwright/test";
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
import { ChargesOffenceSearchPagePage } from "../../integration-tests/pages/chargesOffenceSearchPage";
import { AddChargeDetailsPage } from "../../integration-tests/pages/addChargeDetailsPage";
import { AddChargeVictimPage } from "../../integration-tests/pages/addChargeVictimPage";
import { ChargesSummaryPage } from "../../integration-tests/pages/chargesSummaryPage";
import { FirstHearingDetailsPage } from "../../integration-tests/pages/firstHearingDetailsPage";
import { generateUniqueUrn } from "../utils/generateUrn";
import { expectStep } from "../utils/expectStep";
import {
  AREA,
  REGISTERING_UNIT,
  WITNESS_CARE_UNIT,
  startAtHomePage,
  enterAreasAndCaseDetails,
  completeMonitoringAndAssignee,
  verifySummaryAndSubmit,
} from "./steps";

const OFFENCE_CODE = process.env.E2E_OFFENCE_CODE ?? "TH68040";

const isoDate = (d: Date): string => d.toISOString().split("T")[0];

export interface LongPathSuspectChargeOptions {
  operationName: string;
}

export async function completeLongPathSuspectCharge(
  page: Page,
  { operationName }: LongPathSuspectChargeOptions,
): Promise<void> {
  const urn = generateUniqueUrn();

  await startAtHomePage(page, { operationName, hasSuspect: true });
  await enterAreasAndCaseDetails(page, urn);

  const addSuspectPage = new AddSuspectPage(page);
  await expectStep(page, "/case-registration/suspect-0/add-suspect");
  await addSuspectPage.addPersonSuspect();
  await addSuspectPage.addSuspectFirstName("Harry");
  await addSuspectPage.addSuspectLastName("Potter");
  await addSuspectPage.selectAdditionalDetailsDOB(true);
  await addSuspectPage.selectAdditionalDetailsGender(true);
  await addSuspectPage.selectAdditionalDetailsDisability(true);
  await addSuspectPage.selectAdditionalDetailsReligion(true);
  await addSuspectPage.selectAdditionalDetailsEthnicity(true);
  await addSuspectPage.selectAdditionalDetailsASN(true);
  await addSuspectPage.selectAdditionalDetailsAlias(true);
  await addSuspectPage.selectAdditionalDetailsOffenderType(true);
  await addSuspectPage.saveAndContinue();

  const suspectDOBPage = new SuspectDOBPage(page);
  await expectStep(page, "/case-registration/suspect-0/suspect-dob");
  await suspectDOBPage.addDOBDay("27");
  await suspectDOBPage.addDOBMonth("03");
  await suspectDOBPage.addDOBYear("2007");
  await suspectDOBPage.saveAndContinue();

  const suspectGenderPage = new SuspectGenderPage(page);
  await expectStep(page, "/case-registration/suspect-0/suspect-gender");
  await suspectGenderPage.selectGenderMale();
  await suspectGenderPage.saveAndContinue();

  const suspectDisabilityPage = new SuspectDisabilityPage(page);
  await expectStep(page, "/case-registration/suspect-0/suspect-disability");
  await suspectDisabilityPage.selectDisabilityYes();
  await suspectDisabilityPage.saveAndContinue();

  const suspectReligionPage = new SuspectReligionPage(page);
  await expectStep(page, "/case-registration/suspect-0/suspect-religion");
  await page.locator("#suspect-religion-radio-0").check();
  await suspectReligionPage.saveAndContinue();

  const suspectEthnicityPage = new SuspectEthnicityPage(page);
  await expectStep(page, "/case-registration/suspect-0/suspect-ethnicity");
  await page.locator("#suspect-ethnicity-radio-0").check();
  await suspectEthnicityPage.saveAndContinue();

  const suspectAliasesPage = new SuspectAliasesPage(page);
  await expectStep(page, "/case-registration/suspect-0/suspect-add-aliases");
  await suspectAliasesPage.addFirstName("Harry");
  await suspectAliasesPage.addLastName("Potter");
  await suspectAliasesPage.saveAndContinue();

  const suspectAliasesSummaryPage = new SuspectAliasesSummaryPage(page);
  await expectStep(
    page,
    "/case-registration/suspect-0/suspect-aliases-summary",
  );
  await suspectAliasesSummaryPage.selectAddMoreAliasesNo();
  await suspectAliasesSummaryPage.saveAndContinue();

  const suspectASNPage = new SuspectASNPage(page);
  await expectStep(page, "/case-registration/suspect-0/suspect-asn");
  await suspectASNPage.addASNText("123456");
  await suspectASNPage.saveAndContinue();

  const suspectOffenderTypesPage = new SuspectOffenderTypesPage(page);
  await expectStep(page, "/case-registration/suspect-0/suspect-offender");
  await suspectOffenderTypesPage.selectOffenderTypePYO();
  await suspectOffenderTypesPage.addArrestDate("2024-01-01");
  await suspectOffenderTypesPage.saveAndContinue();

  const suspectSummaryPage = new SuspectSummaryPage(page);
  await expectStep(page, "/case-registration/suspect-summary");
  await suspectSummaryPage.selectAddMoreSuspectNo();
  await suspectSummaryPage.saveAndContinue();

  const wantToAddChargesPage = new WantToAddChargesPage(page);
  await expectStep(page, "/case-registration/want-to-add-charges");
  await wantToAddChargesPage.selectAddChargesYes();
  await wantToAddChargesPage.saveAndContinue();

  const chargesOffenceSearchPage = new ChargesOffenceSearchPagePage(page);
  await expectStep(
    page,
    "/case-registration/suspect-0/charge-0/charges-offence-search",
  );
  await chargesOffenceSearchPage.addOffenceSearchText(OFFENCE_CODE);
  await chargesOffenceSearchPage.searchOffence();
  await expect(
    page.getByTestId("offence-search-results-wrapper"),
    `no offence result for ${OFFENCE_CODE}`,
  ).toBeVisible({ timeout: 30_000 });
  await chargesOffenceSearchPage.addOffence(0);

  const addChargeDetailsPage = new AddChargeDetailsPage(page);
  await expectStep(
    page,
    "/case-registration/suspect-0/charge-0/add-charge-details",
  );
  await addChargeDetailsPage.clickDateRange();
  await addChargeDetailsPage.fillOffenceFromDate("2022-02-02");
  await addChargeDetailsPage.fillOffenceToDate("2022-02-03");
  await addChargeDetailsPage.selectAddVictimYes();
  await addChargeDetailsPage.selectChargedWithAdultYes();
  await addChargeDetailsPage.saveAndContinue();

  const addChargeVictimPage = new AddChargeVictimPage(page);
  await expectStep(
    page,
    "/case-registration/suspect-0/charge-0/add-charge-victim",
  );
  await addChargeVictimPage.fillVictimFirstName("Steve");
  await addChargeVictimPage.fillVictimLastName("Smith");
  await addChargeVictimPage.selectVictimIsVulnerable(true);
  await addChargeVictimPage.selectVictimIsIntimidated(true);
  await addChargeVictimPage.selectVictimIsWitness(true);
  await addChargeVictimPage.saveAndContinue();

  const chargesSummaryPage = new ChargesSummaryPage(page);
  await expectStep(page, "/case-registration/charges-summary");
  await chargesSummaryPage.selectAddMoreChargesNo();
  const courtsResponse = page.waitForResponse(
    (r) => /\/api\/v1\/courts\//.test(r.url()) && r.ok(),
    { timeout: 30_000 },
  );
  await chargesSummaryPage.saveAndContinue();

  const firstHearingDetailsPage = new FirstHearingDetailsPage(page);
  await expectStep(page, "/case-registration/first-hearing");
  const courts = (await (await courtsResponse).json()) as {
    description: string;
  }[];
  const courtName = courts[0]?.description;
  expect(courtName, "no courts returned for the registering unit").toBeTruthy();
  const hearingDate = new Date();
  hearingDate.setDate(hearingDate.getDate() + 14);
  await firstHearingDetailsPage.selectAddFirstHearingDetailsYes();
  await firstHearingDetailsPage.enterFirstHearingCourtLocation(courtName);
  await firstHearingDetailsPage.addFirstHearingDate(isoDate(hearingDate));
  await firstHearingDetailsPage.saveAndContinue();

  await completeMonitoringAndAssignee(page, { preChargeChecked: false });

  await verifySummaryAndSubmit(page, urn, {
    area: AREA,
    registeringUnit: REGISTERING_UNIT,
    wcu: WITNESS_CARE_UNIT,
    operationName,
  });
}
