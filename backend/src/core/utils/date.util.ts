import { appConfig } from '@config/app.config';

export class DateUtil {
  static formatDate(date: Date, format: string = appConfig.locale.dateFormat): string {
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
  }

  static formatDateTime(date: Date): string {
    return this.formatDate(date, appConfig.locale.dateTimeFormat);
  }

  static formatTime(date: Date): string {
    return this.formatDate(date, appConfig.locale.timeFormat);
  }

  static formatLocale(date: Date, options: Intl.DateTimeFormatOptions = {}): string {
    return date.toLocaleDateString(appConfig.locale.defaultLanguage, options);
  }

  static parseDate(dateString: string, format: string = appConfig.locale.dateFormat): Date {
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
  }

  static toLocalTimezone(date: Date): Date {
    const targetTimezone = appConfig.locale.timezone;
    return new Date(
      date.toLocaleString('en-US', {
        timeZone: targetTimezone,
      }),
    );
  }

  static now(): Date {
    return this.toLocalTimezone(new Date());
  }

  static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  static subtractDays(date: Date, days: number): Date {
    return this.addDays(date, -days);
  }

  static addMonths(date: Date, months: number): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  }

  static subtractMonths(date: Date, months: number): Date {
    return this.addMonths(date, -months);
  }

  static diffInDays(date1: Date, date2: Date): number {
    const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
    return Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));
  }

  static isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  static isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 0 || day === 6;
  }

  static isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  static daysInMonth(date: Date): number {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }

  static startOfDay(date: Date): Date {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
  }

  static endOfDay(date: Date): Date {
    const result = new Date(date);
    result.setHours(23, 59, 59, 999);
    return result;
  }
}
