import PageContentWrapper from "../common/PageContentWrapper";

const UnAuthorisedPage = () => {
  return (
    <PageContentWrapper>
      <div className="govuk-heading-l">
        <h1>You cannot access this service</h1>
        <p className="govuk-body">
          Close this tab and open the homepage again from CMS Classic.
        </p>
      </div>
    </PageContentWrapper>
  );
};

export default UnAuthorisedPage;
