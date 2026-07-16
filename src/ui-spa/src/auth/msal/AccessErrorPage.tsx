import { PRIVATE_BETA_CONTACT_EMAIL } from "../../config";
import Layout from "../../components/Layout";
import PageContentWrapper from "../../components/common/PageContentWrapper";
import styles from "./AccessErrorPage.module.scss";

const AccessErrorPage: React.FC = () => {
  return (
    <Layout>
      <PageContentWrapper>
        <div className={styles.contentWrapper}>
          <h1>Access Error</h1>
          <p>
            You cannot access this page. You are not a member of this group.
          </p>
          <p>
            If you think this is a mistake, contact{" "}
            <a href={`mailto:${PRIVATE_BETA_CONTACT_EMAIL}`}>
              {PRIVATE_BETA_CONTACT_EMAIL}
            </a>{" "}
            for assistance.
          </p>
        </div>
      </PageContentWrapper>
    </Layout>
  );
};

export default AccessErrorPage;
