import { format, parseISO, isValid, isToday } from "date-fns";
import { tz } from "@date-fns/tz";

const londonTime = tz("Europe/London");

export const formatDate = (
  dateString: string | null | undefined,
  withTime: boolean = false,
  dateFormat: "dd/MM/yyyy" | "dd MMM yyyy" = "dd/MM/yyyy",
) => {
  if (!dateString) {
    return "--";
  }
  const date = parseISO(dateString);

  if (!isValid(date)) {
    return "--";
  }
  const formattedDate = format(date, dateFormat, { in: londonTime });
  if (!withTime) {
    return isToday(date) ? "Today" : formattedDate;
  }
  const timeString = format(date, "h:mm aaa", { in: londonTime });
  return isToday(date)
    ? `Today, ${timeString}`
    : `${formattedDate}, ${timeString}`;
};
