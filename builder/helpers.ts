import { Role, YearsTimeFrame } from ".";

/**
 * Determine whether a given date is in the past
 * @param date A date object (e.g. `new Date("October, 2022")` or `new Date("October 31, 2022")`)
 * @returns {boolean} Whether or not the provided date is in the past
 */
export const isInPast = (date: Date) => new Date(Date.now()) > date;

/**
 * 
 * @param type What kind of student are you?
 * @param startDate When did you start your program? Given in the format: `new Date("Month, Year");`
 * @param graduationDate When will you graduate? Given in the format: `new Date("Month, Year");`
 * @returns 
 * - If the student is determined to have graduated (based on their graduation date), returns just the student type as a string (e.g. `role: "PhD Student"`) and the years as a tuple of their start and end years (e.g. `years: [2020, 2022]`).
 * - If the student has not graduated, returns the calculated number of years the student has been in their program + 1 (i.e. if a student has been in their program for less than 12 months, they are a first year) 
 * (e.g. `role: { name: "PhD Student", year: 2 }, years: 2020`)
 */
export const student = <TStudent extends "PhD Student" | "Masters Student">(type: TStudent, startDate: Date, graduationDate: Date): { role: Role, years: YearsTimeFrame } => {
  if (isInPast(graduationDate)) return { role: type, years: [startDate.getFullYear(), graduationDate.getFullYear()] };

  const now = new Date(Date.now());
  const differenceMs = Math.max(now.valueOf() - startDate.valueOf(), 0);
  const differenceDate = new Date(differenceMs); // miliseconds from epoch
  const yearDifference = differenceDate.getUTCFullYear() - 1970;
  const year = Math.floor(yearDifference) + 1;
  return { role: { name: type, year }, years: startDate.getFullYear() };
}