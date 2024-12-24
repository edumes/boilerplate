export class StringUtil {
  static slugify(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  static generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length)),
    ).join('');
  }

  static mask(text: string, pattern: string): string {
    let textIndex = 0;
    return pattern
      .split('')
      .map(char => (char === '#' ? text[textIndex++] : char))
      .join('');
  }

  static truncate(str: string, length: number, ending: string = '...'): string {
    return str.length > length ? str.slice(0, length - ending.length) + ending : str;
  }

  static capitalizeFirstLetter(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  static reverseString(text: string): string {
    return text.split('').reverse().join('');
  }

  static isPalindrome(text: string): boolean {
    const cleanedText = text.toLowerCase().replace(/[^a-z0-9]/g, '');
    return cleanedText === this.reverseString(cleanedText);
  }

  static countOccurrences(text: string, substring: string): number {
    return (text.match(new RegExp(substring, 'g')) || []).length;
  }

  static convertToTitleCase(text: string): string {
    return text.toLowerCase().replace(/\b(\w)/g, char => char.toUpperCase());
  }
}
