import 'reflect-metadata';

export enum FIELD_TYPE {
  TEXT = 'text',
  CHECKBOX = 'checkbox',
  RICHTEXT = 'richtext',
  NUMBER = 'number',
  DATE = 'date',
  EMAIL = 'email',
  URL = 'url',
  FILE = 'file',
  BOOLEAN = 'boolean',
  SELECT = 'select',
  MULTISELECT = 'multiselect',
  COLOR = 'color',
  DATE_TIME = 'datetime',
  TIME = 'time',
  CURRENCY = 'currency',
}

export enum DATE_TYPE {
  DATE_ONLY = 'date',
  DATE_TIME = 'datetime',
}

export enum CURRENCY_TYPE {
  USD = 'USD',
  EUR = 'EUR',
  BRL = 'BRL',
}

export enum NUMBER_TYPE {
  INTEGER = 'integer',
  DECIMAL = 'decimal',
  PERCENT = 'percent',
  CURRENCY = 'currency',
}

export enum SELECT_TYPE {
  SINGLE = 'single',
  MULTIPLE = 'multiple',
}

export interface FieldConfigOptions {
  name?: string;
  order?: number;
  width?: number;
  browserOrder?: number;
  browserWidth?: number;
  type?: FIELD_TYPE;
  canBrowse?: boolean;
  canRead?: boolean;
  canEdit?: boolean;
  canAdd?: boolean;
  label?: string;
  required?: boolean;
  tabs?: string[];
  date?: FieldDateConfig;
  currency?: FieldCurrencyConfig;
  number?: FieldNumberConfig;
  select?: FieldSelectConfig;
}

interface FieldDateConfig {
  type: DATE_TYPE;
}

interface FieldCurrencyConfig {
  type: CURRENCY_TYPE;
}

interface FieldNumberConfig {
  type: NUMBER_TYPE;
  min?: number;
  max?: number;
}

interface FieldSelectConfig {
  type: SELECT_TYPE;
  options?: string[];
}

export function FieldConfig(config: FieldConfigOptions) {
  return (target: any, propertyKey: string) => {
    const existingConfigs = Reflect.getMetadata('fieldConfigs', target.constructor) || {};
    existingConfigs[propertyKey] = config;
    Reflect.defineMetadata('fieldConfigs', existingConfigs, target.constructor);
  };
}

export function getFieldConfigs(entityClass: any): Record<string, FieldConfigOptions> {
  return Reflect.getMetadata('fieldConfigs', entityClass) || {};
}
