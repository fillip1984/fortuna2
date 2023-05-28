//See; https://dd.engineering/blog/a-guide-to-handling-date-and-time-for-full-stack-javascript-developers
///// LOOKS LIKE PRISMA OR MAYBE POSTGRES OR JUST EVERYTHING STORES DATE/TIMES AS UTC.
// I was trying to force things to be entered timezone agnostic but might as well not fight things and keep things consistent
// What I mean is if I call startOfDate('2023-05-28T<anytime>Z') using date-fns it was showing '2023-05-28T04:00:00:000Z', the point being 4AM was returned no matter what functions I used unless I messed with UTCHour....
// /**
//  * Returns given date at start of date, (given: 12-06-1984 12:30 PM, returns 12-06-1984 00:00:00:00)
//  * @param date non-null Date
//  * @returns Date with hour, minute, second, milliseconds set to all 00.
//  */
// export const startOfDay = (date: Date): Date => {
//   date.setUTCHours(0, 0, 0, 0);
//   return date;
// };

// /**
//  * Returns number of calendar days between 2 given dates, modeled after: https://github.com/date-fns/date-fns/blob/main/src/differenceInCalendarDays/index.ts
//  * @param date1 to
//  * @param date2 from
//  * @returns Number of days (positive or negative) between given dates
//  */
// export const differenceInCalendarDays = (date1: Date, date2: Date): number => {
//   const diff = startOfDay(date1).getTime() - startOfDay(date2).getTime();
//   const diffDays = diff * 1000 * 60 * 60 * 24;
//   return diffDays;
// };
