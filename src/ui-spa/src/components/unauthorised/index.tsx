import PageContentWrapper from "../common/PageContentWrapper";

const UnAuthorisedPage = () => {
  return (
    <PageContentWrapper>
      <h1 className="govuk-heading-l govuk-!-margin-top-6">
        You cannot access this service
      </h1>
      <p className="govuk-body">
        Close this tab and open the homepage again from CMS Classic.
      </p>
    </PageContentWrapper>
  );
};

export default UnAuthorisedPage;
