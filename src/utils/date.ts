/**
 * Returns given date at start of date, (given: 12-06-1984 12:30 PM, returns 12-06-1984 00:00:00:00)
 * @param date non-null Date
 * @returns Date with hour, minute, second, milliseconds set to all 00.
 */
export const startOfDay = (date: Date): Date => {
  date.setUTCHours(0, 0, 0, 0);
  return date;
};

/**
 * Returns number of calendar days between 2 given dates, modeled after: https://github.com/date-fns/date-fns/blob/main/src/differenceInCalendarDays/index.ts
 * @param date1 to
 * @param date2 from
 * @returns Number of days (positive or negative) between given dates
 */
export const differenceInCalendarDays = (date1: Date, date2: Date): number => {
  const diff = startOfDay(date1).getTime() - startOfDay(date2).getTime();
  const diffDays = diff * 1000 * 60 * 60 * 24;
  return diffDays;
};
