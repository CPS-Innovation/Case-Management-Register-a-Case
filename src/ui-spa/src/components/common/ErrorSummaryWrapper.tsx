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
  showSkip?: boolean;
  nextRoute?: string;
  skipText?: string;
  onSkipCallBack?: () => void;
};

const ErrorSummaryWrapper = ({
  errorList,
  errorSummaryRef,
  dataTestId,
  showSkip,
  nextRoute,
  skipText,
  onSkipCallBack,
}: ErrorSummaryWrapperProps) => {
  return (
    <div
      className={showSkip ? `${styles.errorSummarySkipLinkWrapper}` : undefined}
    >
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

          {showSkip && nextRoute && skipText && (
            <div className={styles.suspectAdditionalDetailsSkip}>
              <Link
                className="govuk-link govuk-link--no-visited-state"
                to={nextRoute}
                data-testid="suspect-detail-skip-link"
                onClick={onSkipCallBack}
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
