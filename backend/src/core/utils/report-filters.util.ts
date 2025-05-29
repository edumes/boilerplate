import { appConfig } from '@config/app.config';
import dayjs from 'dayjs';

const { currencyFormat, defaultLanguage, dateFormat } = appConfig.locale;

/**
 * Collection of utility functions for formatting and transforming data in reports
 */
export const filters = {
  /**
   * Formats a number as currency using the application's locale settings
   * @param value - Number to format
   * @returns Formatted currency string
   */
  currency: (value: number) =>
    new Intl.NumberFormat(currencyFormat.locale, {
      style: 'currency',
      currency: currencyFormat.currency
    }).format(value),

  /**
   * Formats a date using the application's date format
   * @param value - Date to format (string or Date object)
   * @returns Formatted date string
   */
  date: (value: string | Date) => dayjs(value).format(dateFormat),

  /**
   * Converts a string to uppercase
   * @param value - String to convert
   * @returns Uppercase string
   */
  uppercase: (value: string) => String(value).toUpperCase(),

  /**
   * Converts a string to lowercase
   * @param value - String to convert
   * @returns Lowercase string
   */
  lowercase: (value: string) => String(value).toLowerCase(),

  /**
   * Truncates a string to a specified length with ellipsis
   * @param value - String to truncate
   * @param limit - Maximum length (defaults to 100)
   * @returns Truncated string
   */
  truncate: (value: string, limit: number = 100) => {
    const str = String(value);
    return str.length > limit ? `${str.slice(0, limit)}...` : str;
  },

  /**
   * Formats a number as a percentage
   * @param value - Number to format (0-1)
   * @param decimals - Number of decimal places (defaults to 2)
   * @returns Formatted percentage string
   */
  percentage: (value: number, decimals: number = 2) => `${(value * 100).toFixed(decimals)}%`,

  /**
   * Capitalizes the first letter of a string
   * @param value - String to capitalize
   * @returns Capitalized string
   */
  capitalize: (value: string) =>
    String(value).charAt(0).toUpperCase() + String(value).slice(1).toLowerCase(),

  /**
   * Formats a number using the application's locale settings
   * @param value - Number to format
   * @returns Formatted number string
   */
  number: (value: number) =>
    new Intl.NumberFormat(defaultLanguage, {
      maximumFractionDigits: 2
    }).format(value),

  /**
   * Returns the absolute value of a number
   * @param value - Number to get absolute value of
   * @returns Absolute value
   */
  abs: (value: number) => Math.abs(value),

  /**
   * Rounds a number to specified decimal places
   * @param value - Number to round
   * @param decimals - Number of decimal places (defaults to 0)
   * @returns Rounded number as string
   */
  round: (value: number, decimals: number = 0) => Number(value).toFixed(decimals),

  /**
   * Joins array elements with a separator
   * @param array - Array to join
   * @param separator - Separator string (defaults to ', ')
   * @returns Joined string
   */
  join: (array: any[], separator: string = ', ') => array.join(separator),

  /**
   * Returns a portion of an array
   * @param array - Array to slice
   * @param start - Start index
   * @param end - End index
   * @returns Sliced array
   */
  slice: (array: any[], start: number, end: number) => array.slice(start, end),

  /**
   * Sorts an array
   * @param array - Array to sort
   * @returns Sorted array
   */
  sort: (array: any[]) => [...array].sort(),

  /**
   * Removes duplicate values from an array
   * @param array - Array to deduplicate
   * @returns Array with unique values
   */
  unique: (array: any[]) => [...new Set(array)],

  /**
   * Returns object keys as array
   * @param obj - Object to get keys from
   * @returns Array of keys
   */
  keys: (obj: object) => Object.keys(obj),

  /**
   * Returns object values as array
   * @param obj - Object to get values from
   * @returns Array of values
   */
  values: (obj: object) => Object.values(obj),

  /**
   * Returns object entries as array of [key, value] pairs
   * @param obj - Object to get entries from
   * @returns Array of [key, value] pairs
   */
  entries: (obj: object) => Object.entries(obj),

  /**
   * Converts an object to JSON string
   * @param obj - Object to stringify
   * @returns JSON string
   */
  JSON: (obj: object) => JSON.stringify(obj)
};
