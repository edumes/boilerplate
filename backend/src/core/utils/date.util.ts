import { appConfig } from '@config/app.config';

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

export const formatDateTime = (date: Date): string => {
  return formatDate(date, appConfig.locale.dateTimeFormat);
};

export const formatTime = (date: Date): string => {
  return formatDate(date, appConfig.locale.timeFormat);
};

export const formatLocale = (date: Date, options: Intl.DateTimeFormatOptions = {}): string => {
  return date.toLocaleDateString(appConfig.locale.defaultLanguage, options);
};

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

export const parseDate = (
  dateString: string,
  format: string = appConfig.locale.dateFormat,
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
    values['ss'] || 0,
  );
};

export const toLocalTimezone = (date: Date): Date => {
  const targetTimezone = appConfig.locale.timezone;
  return new Date(
    date.toLocaleString('en-US', {
      timeZone: targetTimezone,
    }),
  );
};

export const now = (): Date => {
  return toLocalTimezone(new Date());
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const subtractDays = (date: Date, days: number): Date => {
  return addDays(date, -days);
};

export const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

export const subtractMonths = (date: Date, months: number): Date => {
  return addMonths(date, -months);
};

export const diffInDays = (date1: Date, date2: Date): number => {
  const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
  return Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

export const isLeapYear = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

export const daysInMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

export const startOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

export const endOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
};
