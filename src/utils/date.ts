const ISO_DATE_FORMAT = /^(\d{4})-(\d{2})-(\d{2})$/;

export const enum DaysOfWeek {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
}

export function createDate(year: string, month: string, day: string): Date | undefined {
  const dayInt = parseInt(day, 10);
  const monthInt = parseInt(month, 10);
  const yearInt = parseInt(year, 10);

  const isValid =
    Number.isInteger(yearInt) && // all parts should be integers
    Number.isInteger(monthInt) &&
    Number.isInteger(dayInt) &&
    monthInt > 0 && // month must be 1-12
    monthInt <= 12 &&
    dayInt > 0 && // day must be 1-31
    dayInt <= 31 &&
    yearInt > 0;

  if (isValid) {
    return new Date(yearInt, monthInt - 1, dayInt);
  }
}

/**
 * @param value date string in ISO format YYYY-MM-DD
 */
export function parseISODate(value: string): Date | undefined {
  if (!value) {
    return undefined;
  }

  const matches = value.match(ISO_DATE_FORMAT);

  if (matches) {
    return createDate(matches[1], matches[2], matches[3]);
  }
}

/**
 * print date in format YYYY-MM-DD
 * @param date
 */
export function printISODate(date: Date): string {
  if (!date) {
    return '';
  }

  let d = date.getDate().toString(10);
  let m = (date.getMonth() + 1).toString(10);
  const y = date.getFullYear().toString(10);

  // days are not zero-indexed, so pad if less than 10
  if (date.getDate() < 10) {
    d = `0${d}`;
  }

  // months *are* zero-indexed, pad if less than 9!
  if (date.getMonth() < 9) {
    m = `0${m}`;
  }

  return `${y}-${m}-${d}`;
}

/**
 * Compare if two dates are in the same month of the same year.
 */
export function isEqualMonth(a: Date, b: Date): boolean {
  if (a == null || b == null) {
    return false;
  }

  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

/**
 * Compare if two dates are equal in terms of day, month, and year
 */
export function isEqual(a?: Date, b?: Date): boolean {
  if (a == null || b == null) {
    return false;
  }

  return isEqualMonth(a, b) && a.getDate() === b.getDate();
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(date.getMonth() + months);
  return d;
}

export function addYears(date: Date, years: number): Date {
  const d = new Date(date);
  d.setFullYear(date.getFullYear() + years);
  return d;
}

export function startOfWeek(date: Date, firstDayOfWeek: DaysOfWeek = DaysOfWeek.Monday): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day < firstDayOfWeek ? 7 : 0) + day - firstDayOfWeek;

  d.setDate(d.getDate() - diff);
  return d;
}

export function endOfWeek(date: Date, firstDayOfWeek: DaysOfWeek = DaysOfWeek.Monday): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day < firstDayOfWeek ? -7 : 0) + 6 - (day - firstDayOfWeek);

  d.setDate(d.getDate() + diff);
  return d;
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function setMonth(date: Date, month: number): Date {
  const d = new Date(date);
  d.setMonth(month);
  return d;
}

export function setYear(date: Date, year: number): Date {
  const d = new Date(date);
  d.setFullYear(year);
  return d;
}

/**
 * Ensures date is within range, returns min or max if out of bounds
 */
export function clamp(date: Date, min?: Date, max?: Date): Date {
  const time = date.getTime();

  if (min && min instanceof Date && time < min.getTime()) {
    return min;
  }

  if (max && max instanceof Date && time > max.getTime()) {
    return max;
  }

  return date;
}

/**
 * Check if date is within a min and max
 */
export function inRange(date: Date, min?: Date, max?: Date): boolean {
  return clamp(date, min, max) === date;
}

/**
 * given start and end date, return an (inclusive) array of all dates in between
 * @param start
 * @param end
 */
function getDaysInRange(start: Date, end: Date): Date[] {
  const days: Date[] = [];
  let current = start;

  while (!isEqual(current, end)) {
    days.push(current);
    current = addDays(current, 1);
  }

  days.push(current);

  return days;
}

/**
 * given a date, return an array of dates from a calendar perspective
 * @param date
 * @param firstDayOfWeek
 */
export function getViewOfMonth(date: Date, firstDayOfWeek: DaysOfWeek = DaysOfWeek.Monday): Date[] {
  const start = startOfWeek(startOfMonth(date), firstDayOfWeek);
  const end = endOfWeek(endOfMonth(date), firstDayOfWeek);

  return getDaysInRange(start, end);
}
