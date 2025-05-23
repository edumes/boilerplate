import { appConfig } from '@config/app.config';
import dayjs from 'dayjs';

const { currencyFormat, defaultLanguage, dateFormat } = appConfig.locale;

export const filters = {
  currency: (value: number) =>
    new Intl.NumberFormat(currencyFormat.locale, {
      style: 'currency',
      currency: currencyFormat.currency
    }).format(value),

  date: (value: string | Date) => dayjs(value).format(dateFormat),

  uppercase: (value: string) => String(value).toUpperCase(),

  lowercase: (value: string) => String(value).toLowerCase(),

  truncate: (value: string, limit: number = 100) => {
    const str = String(value);
    return str.length > limit ? `${str.slice(0, limit)}...` : str;
  },

  percentage: (value: number, decimals: number = 2) => `${(value * 100).toFixed(decimals)}%`,

  capitalize: (value: string) =>
    String(value).charAt(0).toUpperCase() + String(value).slice(1).toLowerCase(),

  number: (value: number) =>
    new Intl.NumberFormat(defaultLanguage, {
      maximumFractionDigits: 2
    }).format(value),

  abs: (value: number) => Math.abs(value),

  round: (value: number, decimals: number = 0) => Number(value).toFixed(decimals),

  join: (array: any[], separator: string = ', ') => array.join(separator),

  slice: (array: any[], start: number, end: number) => array.slice(start, end),

  sort: (array: any[]) => [...array].sort(),

  unique: (array: any[]) => [...new Set(array)],

  keys: (obj: object) => Object.keys(obj),

  values: (obj: object) => Object.values(obj),

  entries: (obj: object) => Object.entries(obj),

  JSON: (obj: object) => JSON.stringify(obj)
};
