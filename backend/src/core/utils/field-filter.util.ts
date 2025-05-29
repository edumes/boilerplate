import { getFieldConfigs } from '@core/decorators/field-config.decorator';
import { IBaseModel } from '@modules/base/base.model';
import { instanceToPlain } from 'class-transformer';
import { DeepPartial } from 'typeorm';

/**
 * Filters out non-browsable fields (canBrowse: false) from a list of entities
 * @template T - Type extending IBaseModel
 * @param items - List of items to filter
 * @param entityType - Entity type to get field configurations
 * @returns List of items with filtered fields
 */
export function filterNonBrowsableFields<T extends IBaseModel>(
  items: T[],
  entityType: any
): Partial<T>[] {
  const fieldConfigs = getFieldConfigs(entityType);

  return items.map(item => {
    const plainItem = instanceToPlain(item) as any;
    const filteredItem: any = {};

    for (const [key, value] of Object.entries(plainItem)) {
      const fieldConfig = fieldConfigs[key];
      if (!fieldConfig || fieldConfig.canBrowse !== false) {
        filteredItem[key] = value;
      }
    }

    return filteredItem;
  });
}

/**
 * Filters out non-readable fields (canRead: false) from an object
 * @template T - Type extending IBaseModel
 * @param item - Item to filter
 * @param entityType - Entity type to get field configurations
 * @returns Object with filtered fields
 */
export function filterNonReadableFields<T extends IBaseModel>(
  item: T,
  entityType: any
): Partial<T> {
  const fieldConfigs = getFieldConfigs(entityType);
  const plainItem = instanceToPlain(item) as any;
  const filteredItem: any = {};

  for (const [key, value] of Object.entries(plainItem)) {
    const fieldConfig = fieldConfigs[key];
    if (!fieldConfig || fieldConfig.canRead !== false) {
      filteredItem[key] = value;
    }
  }

  return filteredItem;
}

/**
 * Filters out non-addable fields (canAdd: false) from an object
 * @template T - Type extending IBaseModel
 * @param data - Data to filter
 * @param entityType - Entity type to get field configurations
 * @returns Object with filtered fields
 */
export function filterNonAddableFields<T extends IBaseModel>(
  data: DeepPartial<T>,
  entityType: any
): DeepPartial<T> {
  const fieldConfigs = getFieldConfigs(entityType);
  const filteredData: any = {};

  for (const [key, value] of Object.entries(data)) {
    const fieldConfig = fieldConfigs[key];
    if (!fieldConfig || fieldConfig.canAdd !== false) {
      filteredData[key] = value;
    }
  }

  return filteredData;
}

/**
 * Filters out non-editable fields (canEdit: false) from an object
 * @template T - Type extending IBaseModel
 * @param data - Data to filter
 * @param entityType - Entity type to get field configurations
 * @returns Object with filtered fields
 */
export function filterNonEditableFields<T extends IBaseModel>(
  data: DeepPartial<T>,
  entityType: any
): DeepPartial<T> {
  const fieldConfigs = getFieldConfigs(entityType);
  const filteredData: any = {};

  for (const [key, value] of Object.entries(data)) {
    const fieldConfig = fieldConfigs[key];
    if (!fieldConfig || fieldConfig.canEdit !== false) {
      filteredData[key] = value;
    }
  }

  return filteredData;
}

/**
 * Field filter utility functions
 */
export default {
  filterNonBrowsableFields,
  filterNonReadableFields,
  filterNonAddableFields,
  filterNonEditableFields
};
