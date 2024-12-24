export class CollectionUtil {
  static groupBy<T>(array: T[], key: keyof T): { [key: string]: T[] } {
    return array.reduce(
      (result, item) => {
        const groupKey = String(item[key]);
        result[groupKey] = result[groupKey] || [];
        result[groupKey].push(item);
        return result;
      },
      {} as { [key: string]: T[] },
    );
  }

  static chunk<T>(array: T[], size: number): T[][] {
    if (size <= 0) throw new Error('Chunk size must be greater than 0');
    return array.reduce((chunks, item, index) => {
      const chunkIndex = Math.floor(index / size);
      if (!chunks[chunkIndex]) {
        chunks[chunkIndex] = [];
      }
      chunks[chunkIndex].push(item);
      return chunks;
    }, [] as T[][]);
  }

  static unique<T>(array: T[]): T[] {
    return [...new Set(array)];
  }

  static sortBy<T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
    return [...array].sort((a, b) => {
      if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }

  static deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  static pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
    return keys.reduce(
      (result, key) => {
        if (key in obj) {
          result[key] = obj[key];
        }
        return result;
      },
      {} as Pick<T, K>,
    );
  }

  static omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
    return Object.keys(obj).reduce(
      (result, key) => {
        if (!keys.includes(key as K)) {
          result[key] = obj[key as keyof T];
        }
        return result;
      },
      {} as Omit<T, K>,
    );
  }

  static flatten<T>(array: T[][]): T[] {
    return array.reduce((flat, current) => flat.concat(current), []);
  }

  static compact<T>(array: (T | null | undefined)[]): T[] {
    return array.filter(item => item != null) as T[];
  }

  static difference<T>(array1: T[], array2: T[]): T[] {
    return array1.filter(item => !array2.includes(item));
  }

  static intersection<T>(array1: T[], array2: T[]): T[] {
    return array1.filter(item => array2.includes(item));
  }

  static union<T>(array1: T[], array2: T[]): T[] {
    return this.unique([...array1, ...array2]);
  }

  static shuffle<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5);
  }

  static countBy<T>(array: T[], iteratee: (item: T) => string): { [key: string]: number } {
    return array.reduce(
      (result, item) => {
        const key = iteratee(item);
        result[key] = (result[key] || 0) + 1;
        return result;
      },
      {} as { [key: string]: number },
    );
  }

  static merge<T extends object>(...objects: T[]): T {
    return objects.reduce((result, current) => {
      Object.keys(current).forEach(key => {
        result[key] = current[key];
      });
      return result;
    }, {} as T);
  }

  static zip<T, U>(array1: T[], array2: U[]): [T, U][] {
    return array1.map((item, index) => [item, array2[index]]);
  }

  static unzip<T, U>(array: [T, U][]): [T[], U[]] {
    return array.reduce(
      ([arr1, arr2], [item1, item2]) => {
        arr1.push(item1);
        arr2.push(item2);
        return [arr1, arr2];
      },
      [[], []] as [T[], U[]],
    );
  }

  static isEqual<T>(obj1: T, obj2: T): boolean {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  static pluck<T, K extends keyof T>(array: T[], key: K): T[K][] {
    return array.map(item => item[key]);
  }

  static partition<T>(array: T[], predicate: (item: T) => boolean): [T[], T[]] {
    return array.reduce(
      ([pass, fail], item) => {
        return predicate(item) ? [[...pass, item], fail] : [pass, [...fail, item]];
      },
      [[], []] as [T[], T[]],
    );
  }

  static range(start: number, end: number, step: number = 1): number[] {
    const result: number[] = [];
    for (let i = start; i < end; i += step) {
      result.push(i);
    }
    return result;
  }

  static sortByMultiple<T>(array: T[], keys: (keyof T)[], orders: ('asc' | 'desc')[] = []): T[] {
    return [...array].sort((a, b) => {
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const order = orders[i] || 'asc';
        if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  static throttle<T extends (...args: any[]) => any>(func: T, wait: number): T {
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
  }

  static debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
    let timeout: NodeJS.Timeout | null = null;

    return ((...args: any[]) => {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => func(...args), wait);
    }) as T;
  }

  static find<T>(array: T[], predicate: (item: T) => boolean): T | undefined {
    return array.find(predicate);
  }

  static keyBy<T>(array: T[], key: keyof T): { [key: string]: T } {
    return array.reduce(
      (result, item) => {
        const keyValue = String(item[key]);
        result[keyValue] = item;
        return result;
      },
      {} as { [key: string]: T },
    );
  }

  static cloneDeep<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(item => this.cloneDeep(item)) as unknown as T;
    return Object.keys(obj).reduce((result, key) => {
      result[key] = this.cloneDeep((obj as any)[key]);
      return result;
    }, {} as T);
  }

  static without<T>(array: T[], ...values: T[]): T[] {
    return array.filter(item => !values.includes(item));
  }

  static filter<T>(array: T[], predicate: (item: T) => boolean): T[] {
    return array.filter(predicate);
  }

  static map<T, U>(array: T[], iteratee: (item: T) => U): U[] {
    return array.map(iteratee);
  }
}
