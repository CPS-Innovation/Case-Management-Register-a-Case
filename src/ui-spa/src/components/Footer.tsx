import LicenceLogo from "./svgs/footerlicencelogo.svg?react";
import { useUserDetails } from "../auth";
import styles from "./Layout.module.scss";

const FooterView = ({
  username,
  showUser,
}: {
  username?: string;
  showUser: boolean;
}) => {
  return (
    <footer className={`govuk-footer ${styles.footer}`}>
      <div className="govuk-width-container">
        <div className="govuk-footer__meta">
          <div className="govuk-footer__meta-item govuk-footer__meta-item--grow">
            {showUser ? (
              <div className={styles.username} data-testid="div-ad-username">
                {username}
              </div>
            ) : null}
            <div>
              <LicenceLogo className="govuk-footer__licence-logo" />
              <span className="govuk-footer__licence-description">
                All content is available under the{" "}
                <a
                  className="govuk-footer__link"
                  href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
                  rel="license"
                >
                  Open Government Licence v3.0
                </a>{" "}
                , except where otherwise stated
              </span>
            </div>
          </div>
          <div className="govuk-footer__meta-item">
            <a
              className="govuk-footer__link govuk-footer__copyright-logo"
              href="https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/"
            >
              © Crown copyright
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export function PublicFooter() {
  return <FooterView showUser={false} />;
}

export default function Footer() {
  const { username } = useUserDetails();
  return <FooterView username={username} showUser />;
}
