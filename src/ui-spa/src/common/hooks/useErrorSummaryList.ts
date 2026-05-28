import { useEffect, useMemo } from "react";

export default function useErrorSummaryList<
  T extends Record<string, Record<string, string | boolean | string[]>>,
>(
  formDataErrors: T,
  errorSummaryProperties: (key: keyof T) => {
    children: React.ReactNode;
    href: string;
    "data-testid": string;
  } | null,
  errorSummaryRef?: React.RefObject<HTMLElement | null>,
) {
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

  return errorList;
}
