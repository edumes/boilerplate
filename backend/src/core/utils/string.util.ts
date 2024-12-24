export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

export const generateRandomString = (length: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join(
    '',
  );
};

export const mask = (text: string, pattern: string): string => {
  let textIndex = 0;
  return pattern
    .split('')
    .map(char => (char === '#' ? text[textIndex++] : char))
    .join('');
};

export const truncate = (str: string, length: number, ending: string = '...'): string => {
  return str.length > length ? str.slice(0, length - ending.length) + ending : str;
};

export const capitalizeFirstLetter = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const reverseString = (text: string): string => {
  return text.split('').reverse().join('');
};

export const isPalindrome = (text: string): boolean => {
  const cleanedText = text.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleanedText === reverseString(cleanedText);
};

export const countOccurrences = (text: string, substring: string): number => {
  return (text.match(new RegExp(substring, 'g')) || []).length;
};

export const convertToTitleCase = (text: string): string => {
  return text.toLowerCase().replace(/\b(\w)/g, char => char.toUpperCase());
};

export const pluralize = (word: string): string => {
  if (word.endsWith('y')) {
    return word.slice(0, -1) + 'ies';
  } else if (word.endsWith('s') || word.endsWith('x') || word.endsWith('z')) {
    return word + 'es';
  } else {
    return word + 's';
  }
};

export const singularize = (word: string): string => {
  if (word.endsWith('ies')) {
    return word.slice(0, -3) + 'y';
  } else if (word.endsWith('es')) {
    return word.slice(0, -2);
  } else {
    return word.slice(0, -1);
  }
};
