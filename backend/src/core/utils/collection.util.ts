/**
 * Groups array elements by a specified key
 * @template T - Type of array elements
 * @param array - Array to group
 * @param key - Key to group by
 * @returns Object with grouped arrays
 */
export const groupBy = <T>(array: T[], key: keyof T): { [key: string]: T[] } => {
  return array.reduce(
    (result, item) => {
      const groupKey = String(item[key]);
      result[groupKey] = result[groupKey] || [];
      result[groupKey].push(item);
      return result;
    },
    {} as { [key: string]: T[] }
  );
};

/**
 * Splits array into chunks of specified size
 * @template T - Type of array elements
 * @param array - Array to split
 * @param size - Size of each chunk
 * @returns Array of chunks
 * @throws Error if chunk size is less than or equal to 0
 */
export const chunk = <T>(array: T[], size: number): T[][] => {
  if (size <= 0) throw new Error('Chunk size must be greater than 0');
  return array.reduce((chunks, item, index) => {
    const chunkIndex = Math.floor(index / size);
    if (!chunks[chunkIndex]) {
      chunks[chunkIndex] = [];
    }
    chunks[chunkIndex].push(item);
    return chunks;
  }, [] as T[][]);
};

/**
 * Removes duplicate values from array
 * @template T - Type of array elements
 * @param array - Array to process
 * @returns Array with unique values
 */
export const unique = <T>(array: T[]): T[] => {
  return [...new Set(array)];
};

/**
 * Sorts array by specified key
 * @template T - Type of array elements
 * @param array - Array to sort
 * @param key - Key to sort by
 * @param order - Sort order ('asc' or 'desc')
 * @returns Sorted array
 */
export const sortBy = <T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] => {
  return [...array].sort((a, b) => {
    if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Creates a deep clone of an object using JSON
 * @template T - Type of object
 * @param obj - Object to clone
 * @returns Cloned object
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Creates an object composed of the picked object properties
 * @template T - Type of object
 * @template K - Keys to pick
 * @param obj - Source object
 * @param keys - Keys to pick
 * @returns Object with picked properties
 */
export const pick = <T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
  return keys.reduce(
    (result, key) => {
      if (key in obj) {
        result[key] = obj[key];
      }
      return result;
    },
    {} as Pick<T, K>
  );
};

/**
 * Creates an object composed of the object properties not omitted
 * @template T - Type of object
 * @template K - Keys to omit
 * @param obj - Source object
 * @param keys - Keys to omit
 * @returns Object without omitted properties
 */
export const omit = <T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
  return Object.keys(obj).reduce(
    (result, key) => {
      if (!keys.includes(key as K)) {
        result[key] = obj[key as keyof T];
      }
      return result;
    },
    {} as Omit<T, K>
  );
};

/**
 * Flattens a nested array
 * @template T - Type of array elements
 * @param array - Nested array to flatten
 * @returns Flattened array
 */
export const flatten = <T>(array: T[][]): T[] => {
  return array.reduce((flat, current) => flat.concat(current), []);
};

/**
 * Removes null and undefined values from array
 * @template T - Type of array elements
 * @param array - Array to compact
 * @returns Array without null/undefined values
 */
export const compact = <T>(array: (T | null | undefined)[]): T[] => {
  return array.filter(item => item != null) as T[];
};

/**
 * Creates array of values not included in the other array
 * @template T - Type of array elements
 * @param array1 - First array
 * @param array2 - Second array
 * @returns Array of values in array1 not in array2
 */
export const difference = <T>(array1: T[], array2: T[]): T[] => {
  return array1.filter(item => !array2.includes(item));
};

/**
 * Creates array of values included in both arrays
 * @template T - Type of array elements
 * @param array1 - First array
 * @param array2 - Second array
 * @returns Array of values in both arrays
 */
export const intersection = <T>(array1: T[], array2: T[]): T[] => {
  return array1.filter(item => array2.includes(item));
};

/**
 * Creates array of unique values from both arrays
 * @template T - Type of array elements
 * @param array1 - First array
 * @param array2 - Second array
 * @returns Array of unique values from both arrays
 */
export const union = <T>(array1: T[], array2: T[]): T[] => {
  return unique([...array1, ...array2]);
};

/**
 * Randomizes array element order
 * @template T - Type of array elements
 * @param array - Array to shuffle
 * @returns Shuffled array
 */
export const shuffle = <T>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

/**
 * Counts occurrences of values in array
 * @template T - Type of array elements
 * @param array - Array to count
 * @param iteratee - Function to generate count key
 * @returns Object with count of occurrences
 */
export const countBy = <T>(
  array: T[],
  iteratee: (item: T) => string
): { [key: string]: number } => {
  return array.reduce(
    (result, item) => {
      const key = iteratee(item);
      result[key] = (result[key] || 0) + 1;
      return result;
    },
    {} as { [key: string]: number }
  );
};

/**
 * Merges multiple objects
 * @template T - Type of objects
 * @param objects - Objects to merge
 * @returns Merged object
 */
export const merge = <T extends object>(...objects: T[]): T => {
  return objects.reduce((result, current) => {
    Object.keys(current).forEach(key => {
      result[key] = current[key];
    });
    return result;
  }, {} as T);
};

/**
 * Creates array of grouped elements from two arrays
 * @template T - Type of first array elements
 * @template U - Type of second array elements
 * @param array1 - First array
 * @param array2 - Second array
 * @returns Array of grouped elements
 */
export const zip = <T, U>(array1: T[], array2: U[]): [T, U][] => {
  return array1.map((item, index) => [item, array2[index]]);
};

/**
 * Creates separate arrays from array of grouped elements
 * @template T - Type of first array elements
 * @template U - Type of second array elements
 * @param array - Array of grouped elements
 * @returns Array containing two arrays
 */
export const unzip = <T, U>(array: [T, U][]): [T[], U[]] => {
  return array.reduce(
    ([arr1, arr2], [item1, item2]) => {
      arr1.push(item1);
      arr2.push(item2);
      return [arr1, arr2];
    },
    [[], []] as [T[], U[]]
  );
};

/**
 * Checks if two values are equal using JSON stringification
 * @template T - Type of values
 * @param obj1 - First value
 * @param obj2 - Second value
 * @returns True if values are equal
 */
export const isEqual = <T>(obj1: T, obj2: T): boolean => {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
};

/**
 * Extracts values for specified key from array of objects
 * @template T - Type of array elements
 * @template K - Key to extract
 * @param array - Array of objects
 * @param key - Key to extract
 * @returns Array of values
 */
export const pluck = <T, K extends keyof T>(array: T[], key: K): T[K][] => {
  return array.map(item => item[key]);
};

/**
 * Splits array into two arrays based on predicate
 * @template T - Type of array elements
 * @param array - Array to partition
 * @param predicate - Function to test each element
 * @returns Array containing two arrays
 */
export const partition = <T>(array: T[], predicate: (item: T) => boolean): [T[], T[]] => {
  return array.reduce(
    ([pass, fail], item) => {
      return predicate(item) ? [[...pass, item], fail] : [pass, [...fail, item]];
    },
    [[], []] as [T[], T[]]
  );
};

/**
 * Creates array of numbers in range
 * @param start - Start of range
 * @param end - End of range
 * @param step - Step between numbers
 * @returns Array of numbers
 */
export const range = (start: number, end: number, step: number = 1): number[] => {
  const result: number[] = [];
  for (let i = start; i < end; i += step) {
    result.push(i);
  }
  return result;
};

/**
 * Sorts array by multiple keys
 * @template T - Type of array elements
 * @param array - Array to sort
 * @param keys - Keys to sort by
 * @param orders - Sort orders for each key
 * @returns Sorted array
 */
export const sortByMultiple = <T>(
  array: T[],
  keys: (keyof T)[],
  orders: ('asc' | 'desc')[] = []
): T[] => {
  return [...array].sort((a, b) => {
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const order = orders[i] || 'asc';
      if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
    }
    return 0;
  });
};

/**
 * Creates throttled function that only invokes at most once per wait period
 * @template T - Type of function
 * @param func - Function to throttle
 * @param wait - Wait period in milliseconds
 * @returns Throttled function
 */
export const throttle = <T extends (...args: any[]) => any>(func: T, wait: number): T => {
  let lastCall = 0;
  let timeout: NodeJS.Timeout | null = null;
  let lastArgs: any[] | null = null;

  const invoke = () => {
    lastCall = Date.now();
    timeout = null;
    if (lastArgs) {
      func(...lastArgs);
      lastArgs = null;
    }
  };

  return ((...args: any[]) => {
    const now = Date.now();
    const remaining = wait - (now - lastCall);
    if (remaining <= 0) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      lastCall = now;
      func(...args);
    } else {
      lastArgs = args;
      if (!timeout) {
        timeout = setTimeout(invoke, remaining);
      }
    }
  }) as T;
};

/**
 * Creates debounced function that delays invoking until after wait period
 * @template T - Type of function
 * @param func - Function to debounce
 * @param wait - Wait period in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(func: T, wait: number): T => {
  let timeout: NodeJS.Timeout | null = null;

  return ((...args: any[]) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
};

/**
 * Finds first element in array that satisfies predicate
 * @template T - Type of array elements
 * @param array - Array to search
 * @param predicate - Function to test each element
 * @returns First matching element or undefined
 */
export const find = <T>(array: T[], predicate: (item: T) => boolean): T | undefined => {
  return array.find(predicate);
};

/**
 * Creates object from array using key
 * @template T - Type of array elements
 * @param array - Array to process
 * @param key - Key to use
 * @returns Object with key-value pairs
 */
export const keyBy = <T>(array: T[], key: keyof T): { [key: string]: T } => {
  return array.reduce(
    (result, item) => {
      const keyValue = String(item[key]);
      result[keyValue] = item;
      return result;
    },
    {} as { [key: string]: T }
  );
};

/**
 * Creates deep clone of object
 * @template T - Type of object
 * @param obj - Object to clone
 * @returns Cloned object
 */
export const cloneDeep = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(item => cloneDeep(item)) as unknown as T;
  return Object.keys(obj).reduce((result, key) => {
    result[key] = cloneDeep((obj as any)[key]);
    return result;
  }, {} as T);
};

/**
 * Creates array excluding specified values
 * @template T - Type of array elements
 * @param array - Array to process
 * @param values - Values to exclude
 * @returns Array without excluded values
 */
export const without = <T>(array: T[], ...values: T[]): T[] => {
  return array.filter(item => !values.includes(item));
};

/**
 * Filters array using predicate
 * @template T - Type of array elements
 * @param array - Array to filter
 * @param predicate - Function to test each element
 * @returns Filtered array
 */
export const filter = <T>(array: T[], predicate: (item: T) => boolean): T[] => {
  return array.filter(predicate);
};

/**
 * Maps array using iteratee
 * @template T - Type of array elements
 * @template U - Type of mapped elements
 * @param array - Array to map
 * @param iteratee - Function to transform each element
 * @returns Mapped array
 */
export const map = <T, U>(array: T[], iteratee: (item: T) => U): U[] => {
  return array.map(iteratee);
};
