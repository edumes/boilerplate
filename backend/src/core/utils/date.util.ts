import { appConfig } from '@config/app.config';

/**
 * Formats a date according to the specified format string
 * @param date - Date to format
 * @param format - Format string (defaults to appConfig.locale.dateFormat)
 * @returns Formatted date string
 */
export const formatDate = (date: Date, format: string = appConfig.locale.dateFormat): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', year.toString())
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};

/**
 * Formats a date with date and time according to appConfig.locale.dateTimeFormat
 * @param date - Date to format
 * @returns Formatted date and time string
 */
export const formatDateTime = (date: Date): string => {
  return formatDate(date, appConfig.locale.dateTimeFormat);
};

/**
 * Formats a date with time only according to appConfig.locale.timeFormat
 * @param date - Date to format
 * @returns Formatted time string
 */
export const formatTime = (date: Date): string => {
  return formatDate(date, appConfig.locale.timeFormat);
};

/**
 * Formats a date using locale-specific formatting
 * @param date - Date to format
 * @param options - Intl.DateTimeFormatOptions for customizing the format
 * @returns Locale-formatted date string
 */
export const formatLocale = (date: Date, options: Intl.DateTimeFormatOptions = {}): string => {
  return date.toLocaleDateString(appConfig.locale.defaultLanguage, options);
};

/**
 * Calculates and formats the uptime duration between two dates
 * @param startDate - Start date
 * @param endDate - End date (defaults to current date)
 * @returns Formatted uptime string (e.g., "2 days, 3 hours, 45 minutes, 30 seconds")
 */
export const formatUptime = (startDate: Date, endDate: Date = new Date()): string => {
  const uptimeInMillis = endDate.getTime() - startDate.getTime();
  const totalSeconds = Math.floor(uptimeInMillis / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);

  const hours = totalHours % 24;
  const minutes = totalMinutes % 60;
  const seconds = totalSeconds % 60;

  let uptimeString = '';
  if (totalDays > 0) {
    uptimeString += `${totalDays} day${totalDays > 1 ? 's' : ''}, `;
  }
  uptimeString += `${hours} hour${hours !== 1 ? 's' : ''}, `;
  uptimeString += `${minutes} minute${minutes !== 1 ? 's' : ''}, `;
  uptimeString += `${seconds} second${seconds !== 1 ? 's' : ''}`;

  return uptimeString;
};

/**
 * Parses a date string according to the specified format
 * @param dateString - Date string to parse
 * @param format - Format string (defaults to appConfig.locale.dateFormat)
 * @returns Parsed Date object
 */
export const parseDate = (
  dateString: string,
  format: string = appConfig.locale.dateFormat
): Date => {
  const parts = dateString.match(/(\d+)/g) || [];
  const formatParts = format.match(/(YYYY|MM|DD|HH|mm|ss)/g) || [];
  const values: { [key: string]: number } = {};

  formatParts.forEach((part, index) => {
    values[part] = parseInt(parts[index] || '0', 10);
  });

  return new Date(
    values['YYYY'] || 0,
    (values['MM'] || 1) - 1,
    values['DD'] || 1,
    values['HH'] || 0,
    values['mm'] || 0,
    values['ss'] || 0
  );
};

/**
 * Converts a date to the local timezone specified in appConfig
 * @param date - Date to convert
 * @returns Date object in local timezone
 */
export const toLocalTimezone = (date: Date): Date => {
  const targetTimezone = appConfig.locale.timezone;
  return new Date(
    date.toLocaleString('en-US', {
      timeZone: targetTimezone
    })
  );
};

/**
 * Returns current date in local timezone
 * @returns Current date in local timezone
 */
export const now = (): Date => {
  return toLocalTimezone(new Date());
};

/**
 * Adds specified number of days to a date
 * @param date - Date to add days to
 * @param days - Number of days to add
 * @returns New date with days added
 */
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Subtracts specified number of days from a date
 * @param date - Date to subtract days from
 * @param days - Number of days to subtract
 * @returns New date with days subtracted
 */
export const subtractDays = (date: Date, days: number): Date => {
  return addDays(date, -days);
};

/**
 * Adds specified number of months to a date
 * @param date - Date to add months to
 * @param months - Number of months to add
 * @returns New date with months added
 */
export const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

/**
 * Subtracts specified number of months from a date
 * @param date - Date to subtract months from
 * @param months - Number of months to subtract
 * @returns New date with months subtracted
 */
export const subtractMonths = (date: Date, months: number): Date => {
  return addMonths(date, -months);
};

/**
 * Calculates the difference in days between two dates
 * @param date1 - First date
 * @param date2 - Second date
 * @returns Number of days between dates
 */
export const diffInDays = (date1: Date, date2: Date): number => {
  const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
  return Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));
};

/**
 * Checks if two dates are the same day
 * @param date1 - First date
 * @param date2 - Second date
 * @returns True if dates are the same day
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

/**
 * Checks if a date falls on a weekend
 * @param date - Date to check
 * @returns True if date is a weekend day
 */
export const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

/**
 * Checks if a year is a leap year
 * @param year - Year to check
 * @returns True if year is a leap year
 */
export const isLeapYear = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

/**
 * Gets the number of days in the month of a date
 * @param date - Date to check
 * @returns Number of days in the month
 */
export const daysInMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

/**
 * Sets a date to the start of the day (00:00:00.000)
 * @param date - Date to modify
 * @returns Date set to start of day
 */
export const startOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

/**
 * Sets a date to the end of the day (23:59:59.999)
 * @param date - Date to modify
 * @returns Date set to end of day
 */
export const endOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
};
