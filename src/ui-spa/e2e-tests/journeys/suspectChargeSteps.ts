import { expect, type Page } from "@playwright/test";
import { faker } from "@faker-js/faker";
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
import { ChargesOffenceSearchPagePage } from "../../integration-tests/pages/chargesOffenceSearchPage";
import { AddChargeDetailsPage } from "../../integration-tests/pages/addChargeDetailsPage";
import { AddChargeVictimPage } from "../../integration-tests/pages/addChargeVictimPage";
import { FirstHearingDetailsPage } from "../../integration-tests/pages/firstHearingDetailsPage";
import { SuspectSummaryPage } from "../../integration-tests/pages/suspectSummaryPage";
import { WantToAddChargesPage } from "../../integration-tests/pages/wantToAddChargesPage";
import { formatNameUtil } from "../../src/common/utils/formatNameUtil";
import { expectStep } from "../utils/expectStep";
import { type UrnParts } from "../utils/generateUrn";
import { startAtHomePage, enterAreasAndCaseDetails } from "./steps";

export interface PersonName {
  first: string;
  last: string;
}

export const isoDate = (d: Date): string => d.toISOString().split("T")[0];

const alpha = (value: string): string => value.replace(/[^A-Za-z]/g, "");

export const personName = (): PersonName => ({
  first: alpha(faker.person.firstName()),
  last: alpha(faker.person.lastName()),
});

export function chargeDates(): {
  offence: { from: Date; to: Date };
  arrestDate: Date;
} {
  const from = new Date();
  from.setMonth(from.getMonth() - 1);
  const to = new Date(from);
  to.setDate(to.getDate() + 1);
  const arrestDate = new Date();
  arrestDate.setDate(arrestDate.getDate() - 14);
  return { offence: { from, to }, arrestDate };
}

export async function startSingleSuspectUpToCharges(
  page: Page,
  opts: {
    operationName?: string;
    urn: UrnParts;
    arrestDate: Date;
    addCharges?: boolean;
  },
): Promise<void> {
  await startAtHomePage(page, {
    operationName: opts.operationName,
    hasSuspect: true,
  });
  await enterAreasAndCaseDetails(page, opts.urn);

  await addPersonSuspectWithAllDetails(page, 0, {
    name: personName(),
    alias: personName(),
    arrestDate: opts.arrestDate,
  });

  const suspectSummaryPage = new SuspectSummaryPage(page);
  await expectStep(page, "/case-registration/suspect-summary");
  await suspectSummaryPage.selectAddMoreSuspectNo();
  await suspectSummaryPage.saveAndContinue();

  const wantToAddChargesPage = new WantToAddChargesPage(page);
  await expectStep(page, "/case-registration/want-to-add-charges");
  if (opts.addCharges ?? true) {
    await wantToAddChargesPage.selectAddChargesYes();
  } else {
    await wantToAddChargesPage.selectAddChargesNo();
  }
  await wantToAddChargesPage.saveAndContinue();
}

export async function addPersonSuspectWithAllDetails(
  page: Page,
  suspectIndex: number,
  opts: { name: PersonName; alias: PersonName; arrestDate: Date },
): Promise<void> {
  const base = `/case-registration/suspect-${suspectIndex}`;

  const addSuspectPage = new AddSuspectPage(page);
  await expectStep(page, `${base}/add-suspect`);
  await addSuspectPage.addPersonSuspect();
  await addSuspectPage.addSuspectFirstName(opts.name.first);
  await addSuspectPage.addSuspectLastName(opts.name.last);
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
  await expectStep(page, `${base}/suspect-dob`);
  const dob = new Date();
  dob.setFullYear(dob.getFullYear() - 15);
  await suspectDOBPage.addDOBDay(String(dob.getDate()));
  await suspectDOBPage.addDOBMonth(String(dob.getMonth() + 1));
  await suspectDOBPage.addDOBYear(String(dob.getFullYear()));
  await suspectDOBPage.saveAndContinue();

  const suspectGenderPage = new SuspectGenderPage(page);
  await expectStep(page, `${base}/suspect-gender`);
  await suspectGenderPage.selectGenderMale();
  await suspectGenderPage.saveAndContinue();

  const suspectDisabilityPage = new SuspectDisabilityPage(page);
  await expectStep(page, `${base}/suspect-disability`);
  await suspectDisabilityPage.selectDisabilityYes();
  await suspectDisabilityPage.saveAndContinue();

  const suspectReligionPage = new SuspectReligionPage(page);
  await expectStep(page, `${base}/suspect-religion`);
  await suspectReligionPage.selectFirstReligion();
  await suspectReligionPage.saveAndContinue();

  const suspectEthnicityPage = new SuspectEthnicityPage(page);
  await expectStep(page, `${base}/suspect-ethnicity`);
  await suspectEthnicityPage.selectFirstEthnicity();
  await suspectEthnicityPage.saveAndContinue();

  const suspectAliasesPage = new SuspectAliasesPage(page);
  await expectStep(page, `${base}/suspect-add-aliases`);
  await suspectAliasesPage.addFirstName(opts.alias.first);
  await suspectAliasesPage.addLastName(opts.alias.last);
  await suspectAliasesPage.saveAndContinue();

  const suspectAliasesSummaryPage = new SuspectAliasesSummaryPage(page);
  await expectStep(page, `${base}/suspect-aliases-summary`);
  await suspectAliasesSummaryPage.selectAddMoreAliasesNo();
  await suspectAliasesSummaryPage.saveAndContinue();

  const suspectASNPage = new SuspectASNPage(page);
  await expectStep(page, `${base}/suspect-asn`);
  await suspectASNPage.addASNText("123456");
  await suspectASNPage.saveAndContinue();

  const suspectOffenderTypesPage = new SuspectOffenderTypesPage(page);
  await expectStep(page, `${base}/suspect-offender`);
  await suspectOffenderTypesPage.selectOffenderTypePYO();
  await suspectOffenderTypesPage.addArrestDate(isoDate(opts.arrestDate));
  await suspectOffenderTypesPage.saveAndContinue();
}

export interface AddChargeOptions {
  suspectIndex: number;
  chargeIndex: number;
  offenceCode: string;
  dates: { from: Date; to: Date };
  chargedWithAdult: boolean;
  victim:
    | { mode: "new"; name: PersonName }
    | { mode: "reuse"; expectVictim: PersonName };
  hasExistingVictims: boolean;
}

export async function addCharge(
  page: Page,
  opts: AddChargeOptions,
): Promise<void> {
  const base = `/case-registration/suspect-${opts.suspectIndex}/charge-${opts.chargeIndex}`;

  const offenceSearchPage = new ChargesOffenceSearchPagePage(page);
  await expectStep(page, `${base}/charges-offence-search`);
  await offenceSearchPage.addOffenceSearchText(opts.offenceCode);
  await offenceSearchPage.searchOffence();
  await expect(
    page.getByTestId("offence-search-results-wrapper"),
    `no offence result for ${opts.offenceCode}`,
  ).toBeVisible({ timeout: 30_000 });
  await offenceSearchPage.addOffence(0);

  const addChargeDetailsPage = new AddChargeDetailsPage(page);
  await expectStep(page, `${base}/add-charge-details`);
  await addChargeDetailsPage.clickDateRange();
  await addChargeDetailsPage.fillOffenceFromDate(isoDate(opts.dates.from));
  await addChargeDetailsPage.fillOffenceToDate(isoDate(opts.dates.to));
  await addChargeDetailsPage.selectAddVictimYes();
  if (opts.chargedWithAdult) {
    await addChargeDetailsPage.selectChargedWithAdultYes();
  }
  await addChargeDetailsPage.saveAndContinue();

  const addChargeVictimPage = new AddChargeVictimPage(page);
  await expectStep(page, `${base}/add-charge-victim`);
  if (opts.victim.mode === "reuse") {
    await addChargeVictimPage.verifyFirstExistingVictim(
      formatNameUtil(
        opts.victim.expectVictim.first,
        opts.victim.expectVictim.last,
      ),
    );
    await addChargeVictimPage.selectFirstExistingVictim();
  } else {
    if (opts.hasExistingVictims) {
      await addChargeVictimPage.selectVictimByName("Add new victim");
    }
    await addChargeVictimPage.fillVictimFirstName(opts.victim.name.first);
    await addChargeVictimPage.fillVictimLastName(opts.victim.name.last);
    await addChargeVictimPage.selectVictimIsVulnerable(true);
    await addChargeVictimPage.selectVictimIsIntimidated(true);
    await addChargeVictimPage.selectVictimIsWitness(true);
  }
  await addChargeVictimPage.saveAndContinue();
}

export async function completeFirstHearing(
  page: Page,
  navigateToFirstHearing: () => Promise<void>,
): Promise<void> {
  const courtsResponse = page.waitForResponse(
    (r) => /\/api\/v1\/courts\//.test(r.url()) && r.ok(),
    { timeout: 30_000 },
  );
  await navigateToFirstHearing();

  const firstHearingDetailsPage = new FirstHearingDetailsPage(page);
  await expectStep(page, "/case-registration/first-hearing");
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
}
