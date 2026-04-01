import {
  addDays,
  differenceInCalendarDays,
  endOfWeek,
  format,
  startOfWeek,
} from "date-fns";

export function formatDateKey(date: Date) {
  return format(date, "yyyy-MM-dd");
}

export function parseDateKey(dateKey: string) {
  return new Date(`${dateKey}T00:00:00`);
}

export function formatDisplayDate(
  dateKey: string,
  formatOptions: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  }
) {
  return parseDateKey(dateKey).toLocaleDateString("en-US", formatOptions);
}

export function getCurrentWeekRange(date: Date = new Date()) {
  return {
    start: startOfWeek(date, { weekStartsOn: 1 }),
    end: endOfWeek(date, { weekStartsOn: 1 }),
  };
}

export function enumerateDays(start: Date, count: number) {
  return Array.from({ length: count }, (_, index) => addDays(start, index));
}

export function getDayDiff(fromDate: string, toDate: string) {
  return differenceInCalendarDays(parseDateKey(toDate), parseDateKey(fromDate));
}

export function getDateKeyDiff(fromDate: string, toDate: string) {
  return parseDateKey(toDate).getTime() - parseDateKey(fromDate).getTime();
}

export function getDateKeyOffset(baseDate: Date, offsetDays: number) {
  return formatDateKey(addDays(baseDate, offsetDays));
}
