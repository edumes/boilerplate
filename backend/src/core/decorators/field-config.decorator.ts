import { CURRENCY_TYPE } from '@core/enums/currency-type.enum';
import { DATE_TYPE } from '@core/enums/date-type.enum';
import { FIELD_TYPE } from '@core/enums/field-type.enum';
import { NUMBER_TYPE } from '@core/enums/number-typ.enum';
import { pluralize } from '@core/utils/string.util';
import 'reflect-metadata';

/**
 * Configuration options for field decorators
 */
export interface FieldConfigOptions {
  /** Name of the field */
  name?: string;
  /** Display order of the field */
  order?: number;
  /** Width of the field in pixels */
  width?: number;
  /** Display order in browser view */
  browserOrder?: number;
  /** Width in browser view */
  browserWidth?: number;
  /** Type of the field */
  type?: FIELD_TYPE;
  /** Whether the field can be browsed */
  canBrowse?: boolean;
  /** Whether the field can be read */
  canRead?: boolean;
  /** Whether the field can be edited */
  canEdit?: boolean;
  /** Whether the field can be added */
  canAdd?: boolean;
  /** Display label for the field */
  label?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Whether the field is read-only */
  readonly?: boolean;
  /** Tabs where the field should appear */
  tabs?: string[];
  /** Date-specific configuration */
  date?: FieldDateConfig;
  /** Currency-specific configuration */
  currency?: FieldCurrencyConfig;
  /** Number-specific configuration */
  number?: FieldNumberConfig;
  /** Select-specific configuration */
  select?: FieldSelectConfig;
}

/**
 * Configuration for date fields
 */
interface FieldDateConfig {
  /** Type of date field */
  type: DATE_TYPE;
}

/**
 * Configuration for currency fields
 */
interface FieldCurrencyConfig {
  /** Type of currency */
  type: CURRENCY_TYPE;
}

/**
 * Configuration for number fields
 */
interface FieldNumberConfig {
  /** Type of number field */
  type: NUMBER_TYPE;
  /** Minimum value allowed */
  min?: number;
  /** Maximum value allowed */
  max?: number;
}

/**
 * Configuration for select fields
 */
interface FieldSelectConfig {
  /** URL for fetching options */
  url?: string;
  /** Static options for the select field */
  options?: any;
}

/**
 * Configuration for form metadata
 */
export interface FormConfig {
  /** Prefix for the form */
  prefix: string;
  /** Database table name */
  table: string;
  /** Singular name of the entity */
  singularName: string;
  /** Plural name of the entity */
  pluralName: string;
  /** Icon to display */
  icon: string;
  /** Available tabs in the form */
  tabs: TabConfig[];
  /** Version of the form */
  version: string;
}

/**
 * Configuration for form tabs
 */
export interface TabConfig {
  /** Unique key for the tab */
  key: string;
  /** Display label for the tab */
  label: string;
}

/**
 * Options for form metadata configuration
 */
export interface FormConfigOptions {
  /** Prefix for the form */
  prefix?: string;
  /** Database table name */
  table?: string;
  /** Singular name of the entity */
  singularName?: string;
  /** Plural name of the entity */
  pluralName?: string;
  /** Icon to display */
  icon?: string;
  /** Version of the form */
  version?: string;
}

/**
 * Decorator for configuring field metadata
 * @param config - Field configuration options
 * @returns Property decorator function
 */
export function FieldConfig(config: FieldConfigOptions) {
  return (target: any, propertyKey: string) => {
    const existingConfigs = Reflect.getMetadata('fieldConfigs', target.constructor) || {};
    existingConfigs[propertyKey] = config;
    Reflect.defineMetadata('fieldConfigs', existingConfigs, target.constructor);
  };
}

/**
 * Retrieves field configurations for an entity class
 * @param entityClass - The entity class to get configurations for
 * @returns Record of field configurations
 */
export function getFieldConfigs(entityClass: any): Record<string, FieldConfigOptions> {
  return Reflect.getMetadata('fieldConfigs', entityClass) || {};
}

/**
 * Decorator for configuring form metadata
 * @param config - Form configuration options
 * @returns Class decorator function
 */
export function FormMetadata(config: FormConfigOptions) {
  return function (target: any) {
    Reflect.defineMetadata('formMetadata', config, target);
  };
}

/**
 * Retrieves form configuration for an entity class
 * @param entityClass - The entity class to get configuration for
 * @returns Form configuration object
 */
export function getFormConfig(entityClass: any): FormConfig {
  const fieldConfigs = getFieldConfigs(entityClass);
  const formMetadata = Reflect.getMetadata('formMetadata', entityClass) || {};

  const tabs: TabConfig[] = Object.keys(fieldConfigs).reduce(
    (tabs: TabConfig[], fieldName: string) => {
      const config = fieldConfigs[fieldName];
      if (config.tabs) {
        config.tabs.forEach(tabKey => {
          if (!tabs.some(tab => tab.key === tabKey)) {
            tabs.push({ key: tabKey, label: tabKey.charAt(0).toUpperCase() + tabKey.slice(1) });
          }
        });
      }
      return tabs;
    },
    []
  );

  return {
    prefix: formMetadata.prefix || entityClass.name.toLowerCase(),
    table: formMetadata.table || pluralize(entityClass.name.toLowerCase()),
    singularName: formMetadata.singularName || entityClass.name.toLowerCase(),
    pluralName: formMetadata.pluralName || pluralize(entityClass.name.toLowerCase()),
    icon: formMetadata.icon || entityClass.name.toLowerCase(),
    tabs,
    version: formMetadata.version || '1.0.0'
  };
}
