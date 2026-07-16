import type { FallbackProps } from "react-error-boundary";
import Layout from "./Layout";
import PageContentWrapper from "./common/PageContentWrapper";
import styles from "./ErrorBoundaryFallback.module.scss";

export const ErrorBoundaryFallback = ({ error }: FallbackProps) => {
  return (
    <Layout>
      <PageContentWrapper>
        <div role="alert" className={`${styles.content}`}>
          <h1 className="govuk-heading-l" data-testid="txt-error-page-heading">
            Sorry, there is a problem with the service
          </h1>

          <p className="govuk-body-l">
            Please try this case again later. If the problem continues, contact
            the product team.
          </p>

          <p className="govuk-inset-text">{error?.toString()}</p>
        </div>
      </PageContentWrapper>
    </Layout>
  );
};
