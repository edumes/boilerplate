export const groupBy = <T>(array: T[], key: keyof T): { [key: string]: T[] } => {
  return array.reduce(
    (result, item) => {
      const groupKey = String(item[key]);
      result[groupKey] = result[groupKey] || [];
      result[groupKey].push(item);
      return result;
    },
    {} as { [key: string]: T[] },
  );
};

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

export const unique = <T>(array: T[]): T[] => {
  return [...new Set(array)];
};

export const sortBy = <T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] => {
  return [...array].sort((a, b) => {
    if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

export const pick = <T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
  return keys.reduce(
    (result, key) => {
      if (key in obj) {
        result[key] = obj[key];
      }
      return result;
    },
    {} as Pick<T, K>,
  );
};

export const omit = <T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
  return Object.keys(obj).reduce(
    (result, key) => {
      if (!keys.includes(key as K)) {
        result[key] = obj[key as keyof T];
      }
      return result;
    },
    {} as Omit<T, K>,
  );
};

export const flatten = <T>(array: T[][]): T[] => {
  return array.reduce((flat, current) => flat.concat(current), []);
};

export const compact = <T>(array: (T | null | undefined)[]): T[] => {
  return array.filter(item => item != null) as T[];
};

export const difference = <T>(array1: T[], array2: T[]): T[] => {
  return array1.filter(item => !array2.includes(item));
};

export const intersection = <T>(array1: T[], array2: T[]): T[] => {
  return array1.filter(item => array2.includes(item));
};

export const union = <T>(array1: T[], array2: T[]): T[] => {
  return unique([...array1, ...array2]);
};

export const shuffle = <T>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

export const countBy = <T>(
  array: T[],
  iteratee: (item: T) => string,
): { [key: string]: number } => {
  return array.reduce(
    (result, item) => {
      const key = iteratee(item);
      result[key] = (result[key] || 0) + 1;
      return result;
    },
    {} as { [key: string]: number },
  );
};

export const merge = <T extends object>(...objects: T[]): T => {
  return objects.reduce((result, current) => {
    Object.keys(current).forEach(key => {
      result[key] = current[key];
    });
    return result;
  }, {} as T);
};

export const zip = <T, U>(array1: T[], array2: U[]): [T, U][] => {
  return array1.map((item, index) => [item, array2[index]]);
};

export const unzip = <T, U>(array: [T, U][]): [T[], U[]] => {
  return array.reduce(
    ([arr1, arr2], [item1, item2]) => {
      arr1.push(item1);
      arr2.push(item2);
      return [arr1, arr2];
    },
    [[], []] as [T[], U[]],
  );
};

export const isEqual = <T>(obj1: T, obj2: T): boolean => {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
};

export const pluck = <T, K extends keyof T>(array: T[], key: K): T[K][] => {
  return array.map(item => item[key]);
};

export const partition = <T>(array: T[], predicate: (item: T) => boolean): [T[], T[]] => {
  return array.reduce(
    ([pass, fail], item) => {
      return predicate(item) ? [[...pass, item], fail] : [pass, [...fail, item]];
    },
    [[], []] as [T[], T[]],
  );
};

export const range = (start: number, end: number, step: number = 1): number[] => {
  const result: number[] = [];
  for (let i = start; i < end; i += step) {
    result.push(i);
  }
  return result;
};

export const sortByMultiple = <T>(
  array: T[],
  keys: (keyof T)[],
  orders: ('asc' | 'desc')[] = [],
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

export const debounce = <T extends (...args: any[]) => any>(func: T, wait: number): T => {
  let timeout: NodeJS.Timeout | null = null;

  return ((...args: any[]) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
};

export const find = <T>(array: T[], predicate: (item: T) => boolean): T | undefined => {
  return array.find(predicate);
};

export const keyBy = <T>(array: T[], key: keyof T): { [key: string]: T } => {
  return array.reduce(
    (result, item) => {
      const keyValue = String(item[key]);
      result[keyValue] = item;
      return result;
    },
    {} as { [key: string]: T },
  );
};

export const cloneDeep = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(item => cloneDeep(item)) as unknown as T;
  return Object.keys(obj).reduce((result, key) => {
    result[key] = cloneDeep((obj as any)[key]);
    return result;
  }, {} as T);
};

export const without = <T>(array: T[], ...values: T[]): T[] => {
  return array.filter(item => !values.includes(item));
};

export const filter = <T>(array: T[], predicate: (item: T) => boolean): T[] => {
  return array.filter(predicate);
};

export const map = <T, U>(array: T[], iteratee: (item: T) => U): U[] => {
  return array.map(iteratee);
};
