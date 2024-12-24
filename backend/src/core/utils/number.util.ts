import { appConfig } from '@config/app.config';

export const formatCurrency = (
  value: number,
  currency: string = appConfig.locale.currencyFormat.currency,
  locale: string = appConfig.locale.currencyFormat.locale,
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

export const formatPercentage = (
  value: number,
  decimals: number = 2,
  locale: string = appConfig.locale.defaultLanguage,
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
};

export const roundTo = (value: number, decimals: number = 2): number => {
  return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);
};

export const random = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const formatFileSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${Math.round(bytes / Math.pow(1024, i))} ${sizes[i]}`;
};

export const parseCurrency = (
  value: string,
  currency: string = appConfig.locale.currencyFormat.currency,
): number => {
  return parseFloat(value.replace(/[^\d.-]/g, ''));
};

export const isPrime = (value: number): boolean => {
  if (value <= 1) return false;
  for (let i = 2; i <= Math.sqrt(value); i++) {
    if (value % i === 0) return false;
  }
  return true;
};

export const factorial = (value: number): number => {
  if (value < 0) return NaN;
  let result = 1;
  for (let i = 1; i <= value; i++) {
    result *= i;
  }
  return result;
};

export const gcd = (a: number, b: number): number => {
  while (b !== 0) {
    let t = b;
    b = a % b;
    a = t;
  }
  return a;
};

export const lcm = (a: number, b: number): number => {
  return Math.abs(a * b) / gcd(a, b);
};

export const isEven = (value: number): boolean => {
  return value % 2 === 0;
};

export const isOdd = (value: number): boolean => {
  return value % 2 !== 0;
};

export const convertCurrency = (
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  exchangeRate: number,
): number => {
  if (fromCurrency === toCurrency) return amount;
  return amount * exchangeRate;
};

export const formatDate = (date: Date, format: string = appConfig.locale.dateFormat): string => {
  return new Intl.DateTimeFormat(appConfig.locale.defaultLanguage, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
};

export const formatTime = (date: Date, format: string = appConfig.locale.timeFormat): string => {
  return new Intl.DateTimeFormat(appConfig.locale.defaultLanguage, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);
};

export const formatDateTime = (
  date: Date,
  format: string = appConfig.locale.dateTimeFormat,
): string => {
  return new Intl.DateTimeFormat(appConfig.locale.defaultLanguage, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);
};

export const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const isNegative = (value: number): boolean => {
  return value < 0;
};

export const isPositive = (value: number): boolean => {
  return value > 0;
};

export const getDecimalPlaces = (value: number): number => {
  const str = value.toString();
  const decimalIndex = str.indexOf('.');
  return decimalIndex === -1 ? 0 : str.length - decimalIndex - 1;
};
