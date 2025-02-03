import { pluralize } from '@core/utils/string.util';
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
  // type: SELECT_TYPE;
  url: string;
  options?: string[];
}

export interface FormConfig {
  prefix: string;
  table: string;
  singularName: string;
  pluralName: string;
  icon: string;
  tabs: TabConfig[];
  version: string;
}

export interface TabConfig {
  key: string;
  label: string;
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

export function getFormConfig(entityClass: any): FormConfig {
  const fieldConfigs = getFieldConfigs(entityClass);

  const tabs: TabConfig[] = Object.keys(fieldConfigs)
    .reduce((tabs: TabConfig[], fieldName: string) => {
      const config = fieldConfigs[fieldName];
      if (config.tabs) {
        config.tabs.forEach(tabKey => {
          if (!tabs.some(tab => tab.key === tabKey)) {
            tabs.push({ key: tabKey, label: tabKey.charAt(0).toUpperCase() + tabKey.slice(1) });
          }
        });
      }
      return tabs;
    }, []);

  return {
    prefix: entityClass.name.toLowerCase(),
    table: pluralize(entityClass.name.toLowerCase()),
    singularName: entityClass.name.toLowerCase(),
    pluralName: pluralize(entityClass.name.toLowerCase()),
    icon: entityClass.name.toLowerCase(),
    tabs,
    version: '1.0.0',
  };
}
