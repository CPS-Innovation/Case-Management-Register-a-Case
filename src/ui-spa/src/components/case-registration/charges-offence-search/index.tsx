import { useEffect, useState, useContext, useCallback, useMemo } from "react";
import {
  Input,
  Button,
  ErrorSummary,
  BackLink,
  Table,
  Select,
} from "../../govuk";
import { CaseRegistrationFormContext } from "../../../common/providers/CaseRegistrationProvider";
import { getOffences } from "../../../apis/gateway-api";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams, useNavigate } from "react-router";
import { formatNameUtil } from "../../../common/utils/formatNameUtil";
import useChargesCount from "../../../common/hooks/useChargesCount";
import useErrorSummaryList from "../../../common/hooks/useErrorSummaryList";
import { format } from "date-fns";
import PageContentWrapper from "../../common/PageContentWrapper";
import styles from "../index.module.scss";
import pageStyles from "./index.module.scss";

const ChargesOffenceSearch = () => {
  const { state, dispatch } = useContext(CaseRegistrationFormContext);
  const navigate = useNavigate();
  const { chargesCount } = useChargesCount(state.formData.suspects);

  const [resultsPerPage, setResultsPerPage] = useState<number>(20);
  const { suspectId, chargeId } = useParams<{
    suspectId: string;
    chargeId: string;
  }>() as {
    suspectId: string;
    chargeId: string;
  };

  const suspectIndex = useMemo(() => {
    const index = suspectId.replace("suspect-", "");
    return Number.parseInt(index, 10);
  }, [suspectId]);

  const chargeIndex = useMemo(() => {
    const index = chargeId.replace("charge-", "");
    return Number.parseInt(index, 10);
  }, [chargeId]);

  const currentOffenceSearchText = useMemo(() => {
    const { suspects } = state.formData;
    const charges = suspects[suspectIndex].charges || [];
    return charges[chargeIndex]?.offenceSearchText || "";
  }, [state.formData, suspectIndex, chargeIndex]);
  const [searchText, setSearchText] = useState<string>(
    currentOffenceSearchText,
  );

  const {
    data: offencesSearchResult,
    refetch: refetchSearchOffences,
    isFetching,
  } = useQuery({
    queryKey: ["search-offences"],
    queryFn: () => getOffences(searchText, resultsPerPage),
    enabled: !currentOffenceSearchText ? false : true,
    retry: false,
    throwOnError: true,
    gcTime: 0,
  });
  type ErrorText = {
    errorSummaryText: string;
    inputErrorText?: string;
  };
  type FormDataErrors = {
    offenceSearchText?: ErrorText;
  };

  const previousRoute = useMemo(() => {
    if (
      state.formData.navigation.changeCaseCharges &&
      !state.formData.navigation.fromChargeSummaryPage
    ) {
      return "/case-registration/case-summary";
    }
    if (state.formData.suspects.length === 1 && !chargesCount) {
      return "/case-registration/want-to-add-charges";
    }

    return "/case-registration/add-charge-suspect";
  }, [
    state.formData.suspects,
    state.formData.navigation.changeCaseCharges,
    state.formData.navigation.fromChargeSummaryPage,
    chargesCount,
  ]);

  const [formDataErrors, setFormDataErrors] = useState<FormDataErrors>({});

  const errorSummaryProperties = useCallback(
    (errorKey: keyof FormDataErrors) => {
      if (errorKey === "offenceSearchText") {
        return {
          children: formDataErrors[errorKey]?.errorSummaryText,
          href: "#offence-search-text",
          "data-testid": "offence-search-text-link",
        };
      }

      return null;
    },
    [formDataErrors],
  );
  const { errorSummaryRef, errorList } = useErrorSummaryList(
    formDataErrors,
    errorSummaryProperties,
  );

  const validateFormData = () => {
    const errors: FormDataErrors = {};

    let isValid = true;

    if (!searchText) {
      errors.offenceSearchText = {
        errorSummaryText: "Enter an offence to search for",
        inputErrorText: "Enter an offence to search for",
      };
      isValid = false;
    }

    setFormDataErrors(errors);
    return isValid;
  };

  const suspectName = useMemo(() => {
    const {
      suspectFirstNameText,
      suspectLastNameText,
      suspectCompanyNameText,
    } = state.formData.suspects[suspectIndex];
    return suspectCompanyNameText
      ? suspectCompanyNameText
      : formatNameUtil(suspectFirstNameText, suspectLastNameText);
  }, [state.formData.suspects, suspectIndex]);

  useEffect(() => {
    if (resultsPerPage && searchText) {
      refetchSearchOffences();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultsPerPage, refetchSearchOffences]);

  const handleFormChange = (value: string) => {
    setSearchText(value);
  };

  const searchResults = useMemo(() => {
    if (isFetching || !offencesSearchResult) return;

    return offencesSearchResult;
  }, [offencesSearchResult, isFetching]);

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    value: string,
  ) => {
    event.preventDefault();
    if (!searchResults) return;
    const selectedOffence = searchResults.offences.find(
      (offence) => offence.code === value.toString(),
    );
    if (selectedOffence) {
      dispatch({
        type: "SET_CHARGE_FIELDS",
        payload: {
          suspectIndex: suspectIndex,
          chargeIndex: chargeIndex,
          data: {
            selectedOffence: selectedOffence,
          },
        },
      });
      navigate(
        `/case-registration/suspect-${suspectIndex}/charge-${chargeIndex}/add-charge-details`,
      );
    }
  };

  const getEffectiveDate = (
    effectiveFromDate: string,
    effectiveToDate: string | null,
  ) => {
    if (!effectiveFromDate && !effectiveToDate) return "--";
    const from = effectiveFromDate
      ? format(effectiveFromDate, "dd MMM yyyy")
      : "--";
    const to = effectiveToDate ? format(effectiveToDate, "dd MMM yyyy") : "--";
    return to === "--" ? `From ${from}` : `From ${from} to ${to}`;
  };

  const getTableRowData = () => {
    if (isFetching || !searchResults) return [];
    return searchResults.offences.map((data) => {
      return {
        cells: [
          {
            children: <div>{data.code}</div>,
          },
          {
            children: <div>{data.description}</div>,
          },
          {
            children: <div>{data.legislation}</div>,
          },
          {
            children: (
              <div>
                {getEffectiveDate(data.effectiveFromDate, data.effectiveToDate)}
              </div>
            ),
          },
          {
            children: (
              <Link
                to={`/case-registration/suspect-${suspectIndex}/charge-${chargeIndex}/add-charge-details`}
                onClick={(event) => handleClick(event, data.code)}
              >
                Add
              </Link>
            ),
          },
        ],
      };
    });
  };
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateFormData()) return;
    await refetchSearchOffences();
    dispatch({
      type: "SET_CHARGE_FIELDS",
      payload: {
        suspectIndex: suspectIndex,
        chargeIndex: chargeIndex,
        data: {
          offenceSearchText: searchText,
        },
      },
    });
  };

  const handleBackLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const { suspectId } = state.formData.suspects[suspectIndex];
    dispatch({
      type: "REMOVE_INCOMPLETE_SUSPECT_CHARGES",
      payload: {
        suspectId,
      },
    });
    if (previousRoute === "/case-registration/case-summary") {
      dispatch({
        type: "SET_NAVIGATION_DATA",
        payload: { fromCaseSummaryPage: false, fromChargeSummaryPage: false },
      });
    }
    navigate(previousRoute);
  };

  return (
    <div>
      <BackLink to={previousRoute} onClick={handleBackLinkClick}>
        Back
      </BackLink>
      <PageContentWrapper>
        <div>
          {!!errorList.length && (
            <div
              ref={errorSummaryRef}
              tabIndex={-1}
              className={styles.errorSummaryWrapper}
            >
              <ErrorSummary
                data-testid={"offence-search-error-summary"}
                errorList={errorList}
                titleChildren="There is a problem"
              />
            </div>
          )}
        </div>

        <h1>Add a charge for {suspectName}</h1>

        <form onSubmit={handleSubmit}>
          <div className={styles.inputWrapper}>
            <div className={pageStyles.searchWrapper}>
              <Input
                id="offence-search-text"
                data-testid="offence-search-text"
                className="govuk-input--width-30"
                disabled={isFetching}
                label={{
                  children: <b>Search for an offence</b>,
                }}
                hint={{
                  children:
                    "You can search by part of a CJS code, statute or by offence keyword",
                }}
                errorMessage={
                  formDataErrors["offenceSearchText"]
                    ? {
                        children:
                          formDataErrors["offenceSearchText"].inputErrorText,
                      }
                    : undefined
                }
                type="text"
                value={searchText}
                onChange={(value: string) => {
                  handleFormChange(value);
                }}
              />
              <div className={styles.btnWrapper}>
                <Button
                  type="submit"
                  className={pageStyles.btnSearch}
                  disabled={isFetching}
                >
                  Search
                </Button>
              </div>
            </div>
            <div>
              {!isFetching && searchResults && (
                <div data-testid="offence-search-results-wrapper">
                  <p className={pageStyles.resultsCount}>
                    {searchResults?.total} results for{" "}
                    <strong>{currentOffenceSearchText}</strong>
                  </p>

                  <hr className={pageStyles.resultsDivider} />
                  <div className={pageStyles.resultsPerPageSelectWrapper}>
                    <Select
                      key="results-per-page-select"
                      className={"govuk-input--width-20"}
                      label={{
                        htmlFor: "results-per-page-select",
                        children: <span>Display</span>,
                        className: styles.investigatorTitleSelectLabel,
                      }}
                      id="results-per-page-select"
                      data-testid="results-per-page-select"
                      items={[
                        {
                          value: 20,
                          children: "20 results per page",
                        },
                        {
                          value: 50,
                          children: "50 results per page",
                        },
                        {
                          value: 100,
                          children: "100 results per page",
                        },
                        {
                          value: 1000,
                          children: "1000 results per page",
                        },
                      ]}
                      formGroup={{
                        className: styles.select,
                      }}
                      onChange={(event) =>
                        setResultsPerPage(parseInt(event.target.value))
                      }
                      value={resultsPerPage}
                    />
                  </div>

                  {searchResults?.offences.length > 0 && (
                    <Table
                      caption="offence search results"
                      captionClassName="govuk-visually-hidden"
                      head={[
                        {
                          children: "CJS code",
                        },
                        {
                          children: "Description",
                        },

                        {
                          children: "Statute name and section",
                        },
                        {
                          children: "Effective dates",
                        },
                        {
                          children: "Actions",
                        },
                      ]}
                      rows={getTableRowData()}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </form>
      </PageContentWrapper>
    </div>
  );
};
export default ChargesOffenceSearch;
