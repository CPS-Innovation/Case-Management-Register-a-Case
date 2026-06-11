import { ErrorSummary } from "../govuk";
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
};

const ErrorSummaryWrapper = ({
  errorList,
  errorSummaryRef,
  dataTestId,
}: ErrorSummaryWrapperProps) => {
  return (
    <>
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
        </div>
      )}
    </>
  );
};

export default ErrorSummaryWrapper;
