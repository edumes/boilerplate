import dayjs from 'dayjs';

export const filters = {
  currency: value =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value),

  date: value => dayjs(value).format('DD/MM/YYYY'),

  uppercase: value => String(value).toUpperCase(),

  lowercase: value => String(value).toLowerCase(),

  truncate: (value, limit = 100) => {
    const str = String(value);
    return str.length > limit ? `${str.slice(0, limit)}...` : str;
  },

  percentage: (value, decimals = 2) => `${(value * 100).toFixed(decimals)}%`,

  capitalize: value => String(value).charAt(0).toUpperCase() + String(value).slice(1).toLowerCase(),

  number: value => new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(value),

  abs: value => Math.abs(value),

  round: (value, decimals = 0) => Number(value).toFixed(decimals),

  join: (array, separator = ', ') => array.join(separator),

  slice: (array, start, end) => array.slice(start, end),

  sort: array => [...array].sort(),

  unique: array => [...new Set(array)],

  keys: obj => Object.keys(obj),

  values: obj => Object.values(obj),

  entries: obj => Object.entries(obj),

  JSON: obj => JSON.stringify(obj),
};
