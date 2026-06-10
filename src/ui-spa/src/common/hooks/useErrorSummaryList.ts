import { useEffect, useMemo, useRef, useState } from "react";

const useErrorSummaryList = <
  T extends Record<string, Record<string, string | boolean | string[]>>,
>(
  formDataErrors: T,
  errorSummaryProperties: (key: keyof T) => {
    children: React.ReactNode;
    href: string;
    "data-testid": string;
  } | null,
): {
  errorSummaryRef: React.RefObject<HTMLDivElement | null>;
  disableBtns: boolean;
  setDisableBtns: React.Dispatch<React.SetStateAction<boolean>>;
  errorList: {
    children: React.ReactNode;
    href: string;
    "data-testid": string;
    reactListKey: string;
  }[];
} => {
  const errorSummaryRef = useRef<HTMLDivElement | null>(null);
  const [disableBtns, setDisableBtns] = useState(false);
  const errorList = useMemo(() => {
    const validErrorKeys = Object.keys(formDataErrors).filter(
      (errorKey) =>
        formDataErrors[errorKey as keyof T] &&
        errorSummaryProperties(errorKey as keyof T),
    );

    return validErrorKeys.map((errorKey, index) => {
      const properties = errorSummaryProperties(errorKey)!;

      return {
        reactListKey: `${index}`,
        ...properties,
      };
    });
  }, [formDataErrors, errorSummaryProperties]);

  useEffect(() => {
    if (errorList.length && errorSummaryRef?.current)
      errorSummaryRef?.current?.focus();
  }, [errorList, errorSummaryRef]);

  return {
    errorSummaryRef,
    errorList,
    disableBtns,
    setDisableBtns,
  };
};

export default useErrorSummaryList;
