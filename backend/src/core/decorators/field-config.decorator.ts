import { CURRENCY_TYPE } from '@core/enums/currency-type.enum';
import { DATE_TYPE } from '@core/enums/date-type.enum';
import { FIELD_TYPE } from '@core/enums/field-type.enum';
import { NUMBER_TYPE } from '@core/enums/number-typ.enum';
import { pluralize } from '@core/utils/string.util';
import 'reflect-metadata';

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
  url?: string;
  options?: any;
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

export interface FormConfigOptions {
  prefix?: string;
  table?: string;
  singularName?: string;
  pluralName?: string;
  icon?: string;
  version?: string;
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

export function FormMetadata(config: FormConfigOptions) {
  return function (target: any) {
    Reflect.defineMetadata('formMetadata', config, target);
  };
}

export function getFormConfig(entityClass: any): FormConfig {
  const fieldConfigs = getFieldConfigs(entityClass);
  const formMetadata = Reflect.getMetadata('formMetadata', entityClass) || {};

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
    prefix: formMetadata.prefix || entityClass.name.toLowerCase(),
    table: formMetadata.table || pluralize(entityClass.name.toLowerCase()),
    singularName: formMetadata.singularName || entityClass.name.toLowerCase(),
    pluralName: formMetadata.pluralName || pluralize(entityClass.name.toLowerCase()),
    icon: formMetadata.icon || entityClass.name.toLowerCase(),
    tabs,
    version: formMetadata.version || '1.0.0',
  };
}
