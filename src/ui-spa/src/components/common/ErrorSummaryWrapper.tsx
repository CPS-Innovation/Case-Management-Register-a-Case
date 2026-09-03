import { ErrorSummary } from "../govuk";
import { Link } from "react-router";
import styles from "./ErrorSummaryWrapper.module.scss";

type ErrorSummaryWrapperProps = {
  errorList: {
    children: React.ReactNode;
    href: string;
    "data-testid": string;
    reactListKey: string;
  }[];
  errorSummaryRef: React.RefObject<HTMLDivElement | null>;
  dataTestId: string;
  showSkip: boolean;
  nextRoute: string;
  skipText: string;
};

const ErrorSummaryWrapper = ({
  errorList,
  errorSummaryRef,
  dataTestId,
  showSkip,
  nextRoute,
  skipText,
}: ErrorSummaryWrapperProps) => {
  return (
    <div className={showSkip ? `${styles.errorSummarySkipLinkWrapper}` : ""}>
      {!!errorList.length && (
        <div
          ref={errorSummaryRef}
          tabIndex={-1}
          className={styles.errorSummaryWrapper}
        >
          <ErrorSummary
            data-testid={dataTestId}
            errorList={errorList}
            titleChildren="There is a problem"
          />

          {showSkip && (
            <div className={styles.suspectAdditionalDetailsSkip}>
              <Link
                className="govuk-link govuk-link--no-visited-state"
                to={nextRoute}
                data-testid="suspect-detail-skip-link"
              >
                {skipText}
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ErrorSummaryWrapper;
