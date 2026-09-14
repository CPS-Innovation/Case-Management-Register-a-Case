import { test } from "@playwright/test";
import { AddSuspectPage } from "../integration-tests/pages/addSuspectPage";
import { SuspectDOBPage } from "../integration-tests/pages/suspectDOBPage";
import { SuspectOffenderTypesPage } from "../integration-tests/pages/suspectOffenderTypesPage";
import { generateUniqueUrn } from "./utils/generateUrn";
import { expectStep } from "./utils/expectStep";
import { startAtHomePage, enterAreasAndCaseDetails } from "./journeys/steps";
import { personName } from "./journeys/suspectChargeSteps";

const SUSPECT_BASE = "/case-registration/suspect-0";
const YOUTH_DOB_DAY = "15";
const YOUTH_DOB_MONTH = "06";
const YOUTH_DOB_YEAR = String(new Date().getFullYear() - 15);

test("Scenario 20: a suspect under 18 is sent to type of offender even when unticked, and cannot skip it", async ({
  page,
}) => {
  const urn = generateUniqueUrn();
  const name = personName();

  await startAtHomePage(page, { hasSuspect: true });
  await enterAreasAndCaseDetails(page, urn);

  const addSuspectPage = new AddSuspectPage(page);
  await expectStep(page, `${SUSPECT_BASE}/add-suspect`);
  await addSuspectPage.addPersonSuspect();
  await addSuspectPage.addSuspectFirstName(name.first);
  await addSuspectPage.addSuspectLastName(name.last);

  await addSuspectPage.selectAdditionalDetailsDOB(true);
  await addSuspectPage.selectAdditionalDetailsOffenderType(false);
  await addSuspectPage.saveAndContinue();

  const suspectDOBPage = new SuspectDOBPage(page);
  await expectStep(page, `${SUSPECT_BASE}/suspect-dob`);
  await suspectDOBPage.addDOBDay(YOUTH_DOB_DAY);
  await suspectDOBPage.addDOBMonth(YOUTH_DOB_MONTH);
  await suspectDOBPage.addDOBYear(YOUTH_DOB_YEAR);
  await suspectDOBPage.saveAndContinue();

  const offenderTypesPage = new SuspectOffenderTypesPage(page);
  await expectStep(page, `${SUSPECT_BASE}/suspect-offender`);
  await offenderTypesPage.verifyHintTextIsVisible();

  await offenderTypesPage.saveAndContinue();
  await offenderTypesPage.verifySkipOffenderTypesAdditionalDetails(false);

  await expectStep(page, `${SUSPECT_BASE}/suspect-offender`);
  await offenderTypesPage.verifyHintTextIsVisible();
});
