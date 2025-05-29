/**
 * Converts a string to a URL-friendly slug
 * @param text - Text to convert
 * @returns URL-friendly slug
 */
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

/**
 * Generates a random string of specified length
 * @param length - Length of the random string
 * @returns Random string
 */
export const generateRandomString = (length: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join(
    ''
  );
};

/**
 * Applies a mask pattern to a string
 * @param text - Text to mask
 * @param pattern - Mask pattern (use # for characters to keep)
 * @returns Masked string
 */
export const mask = (text: string, pattern: string): string => {
  let textIndex = 0;
  return pattern
    .split('')
    .map(char => (char === '#' ? text[textIndex++] : char))
    .join('');
};

/**
 * Truncates a string to specified length with optional ending
 * @param str - String to truncate
 * @param length - Maximum length
 * @param ending - String to append if truncated (defaults to '...')
 * @returns Truncated string
 */
export const truncate = (str: string, length: number, ending: string = '...'): string => {
  return str.length > length ? str.slice(0, length - ending.length) + ending : str;
};

/**
 * Capitalizes the first letter of a string
 * @param text - Text to capitalize
 * @returns Capitalized string
 */
export const capitalizeFirstLetter = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

/**
 * Reverses a string
 * @param text - Text to reverse
 * @returns Reversed string
 */
export const reverseString = (text: string): string => {
  return text.split('').reverse().join('');
};

/**
 * Checks if a string is a palindrome
 * @param text - Text to check
 * @returns True if text is a palindrome
 */
export const isPalindrome = (text: string): boolean => {
  const cleanedText = text.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleanedText === reverseString(cleanedText);
};

/**
 * Counts occurrences of a substring in a string
 * @param text - Text to search in
 * @param substring - Substring to count
 * @returns Number of occurrences
 */
export const countOccurrences = (text: string, substring: string): number => {
  return (text.match(new RegExp(substring, 'g')) || []).length;
};

/**
 * Converts a string to title case
 * @param text - Text to convert
 * @returns Title case string
 */
export const convertToTitleCase = (text: string): string => {
  return text.toLowerCase().replace(/\b(\w)/g, char => char.toUpperCase());
};

/**
 * Converts a word to its plural form
 * @param word - Word to pluralize
 * @returns Plural form of the word
 */
export const pluralize = (word: string): string => {
  if (word.endsWith('y')) {
    return word.slice(0, -1) + 'ies';
  } else if (word.endsWith('s') || word.endsWith('x') || word.endsWith('z')) {
    return word + 'es';
  } else {
    return word + 's';
  }
};

/**
 * Converts a word to its singular form
 * @param word - Word to singularize
 * @returns Singular form of the word
 */
export const singularize = (word: string): string => {
  if (word.endsWith('ies')) {
    return word.slice(0, -3) + 'y';
  } else if (word.endsWith('es')) {
    return word.slice(0, -2);
  } else {
    return word.slice(0, -1);
  }
};
