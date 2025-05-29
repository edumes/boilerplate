import { appConfig } from '@config/app.config';

/**
 * Formats a number as currency using specified locale and currency
 * @param value - Number to format
 * @param currency - Currency code (defaults to app config)
 * @param locale - Locale string (defaults to app config)
 * @returns Formatted currency string
 */
export const formatCurrency = (
  value: number,
  currency: string = appConfig.locale.currencyFormat.currency,
  locale: string = appConfig.locale.currencyFormat.locale
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(value);
};

/**
 * Formats a number as percentage
 * @param value - Number to format (0-100)
 * @param decimals - Number of decimal places (defaults to 2)
 * @param locale - Locale string (defaults to app config)
 * @returns Formatted percentage string
 */
export const formatPercentage = (
  value: number,
  decimals: number = 2,
  locale: string = appConfig.locale.defaultLanguage
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value / 100);
};

/**
 * Rounds a number to specified decimal places
 * @param value - Number to round
 * @param decimals - Number of decimal places (defaults to 2)
 * @returns Rounded number
 */
export const roundTo = (value: number, decimals: number = 2): number => {
  return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);
};

/**
 * Generates a random number between min and max (inclusive)
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Random number
 */
export const random = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Formats file size in bytes to human readable format
 * @param bytes - Size in bytes
 * @returns Formatted file size string
 */
export const formatFileSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${Math.round(bytes / Math.pow(1024, i))} ${sizes[i]}`;
};

/**
 * Parses a currency string to number
 * @param value - Currency string to parse
 * @param currency - Currency code (defaults to app config)
 * @returns Parsed number
 */
export const parseCurrency = (
  value: string,
  currency: string = appConfig.locale.currencyFormat.currency
): number => {
  return parseFloat(value.replace(/[^\d.-]/g, ''));
};

/**
 * Checks if a number is prime
 * @param value - Number to check
 * @returns True if number is prime
 */
export const isPrime = (value: number): boolean => {
  if (value <= 1) return false;
  for (let i = 2; i <= Math.sqrt(value); i++) {
    if (value % i === 0) return false;
  }
  return true;
};

/**
 * Calculates factorial of a number
 * @param value - Number to calculate factorial
 * @returns Factorial value or NaN for negative numbers
 */
export const factorial = (value: number): number => {
  if (value < 0) return NaN;
  let result = 1;
  for (let i = 1; i <= value; i++) {
    result *= i;
  }
  return result;
};

/**
 * Calculates Greatest Common Divisor of two numbers
 * @param a - First number
 * @param b - Second number
 * @returns GCD value
 */
export const gcd = (a: number, b: number): number => {
  while (b !== 0) {
    let t = b;
    b = a % b;
    a = t;
  }
  return a;
};

/**
 * Calculates Least Common Multiple of two numbers
 * @param a - First number
 * @param b - Second number
 * @returns LCM value
 */
export const lcm = (a: number, b: number): number => {
  return Math.abs(a * b) / gcd(a, b);
};

/**
 * Checks if a number is even
 * @param value - Number to check
 * @returns True if number is even
 */
export const isEven = (value: number): boolean => {
  return value % 2 === 0;
};

/**
 * Checks if a number is odd
 * @param value - Number to check
 * @returns True if number is odd
 */
export const isOdd = (value: number): boolean => {
  return value % 2 !== 0;
};

/**
 * Converts amount between currencies using exchange rate
 * @param amount - Amount to convert
 * @param fromCurrency - Source currency
 * @param toCurrency - Target currency
 * @param exchangeRate - Exchange rate
 * @returns Converted amount
 */
export const convertCurrency = (
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  exchangeRate: number
): number => {
  if (fromCurrency === toCurrency) return amount;
  return amount * exchangeRate;
};

/**
 * Formats a date using specified format
 * @param date - Date to format
 * @param format - Format string (defaults to app config)
 * @returns Formatted date string
 */
export const formatDate = (date: Date, format: string = appConfig.locale.dateFormat): string => {
  return new Intl.DateTimeFormat(appConfig.locale.defaultLanguage, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
};

/**
 * Formats time using specified format
 * @param date - Date to format
 * @param format - Format string (defaults to app config)
 * @returns Formatted time string
 */
export const formatTime = (date: Date, format: string = appConfig.locale.timeFormat): string => {
  return new Intl.DateTimeFormat(appConfig.locale.defaultLanguage, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(date);
};

/**
 * Formats date and time using specified format
 * @param date - Date to format
 * @param format - Format string (defaults to app config)
 * @returns Formatted date and time string
 */
export const formatDateTime = (
  date: Date,
  format: string = appConfig.locale.dateTimeFormat
): string => {
  return new Intl.DateTimeFormat(appConfig.locale.defaultLanguage, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(date);
};

/**
 * Generates a random integer between min and max (inclusive)
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Random integer
 */
export const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Checks if a number is negative
 * @param value - Number to check
 * @returns True if number is negative
 */
export const isNegative = (value: number): boolean => {
  return value < 0;
};

/**
 * Checks if a number is positive
 * @param value - Number to check
 * @returns True if number is positive
 */
export const isPositive = (value: number): boolean => {
  return value > 0;
};

/**
 * Gets number of decimal places in a number
 * @param value - Number to check
 * @returns Number of decimal places
 */
export const getDecimalPlaces = (value: number): number => {
  const str = value.toString();
  const decimalIndex = str.indexOf('.');
  return decimalIndex === -1 ? 0 : str.length - decimalIndex - 1;
};
