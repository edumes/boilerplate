import { getFieldConfigs } from '@core/decorators/field-config.decorator';
import { IBaseModel } from '@modules/base/base.model';
import { instanceToPlain } from 'class-transformer';
import { DeepPartial } from 'typeorm';

/**
 * Filtra campos não navegáveis (canBrowse: false) de uma lista de entidades
 * @param items Lista de itens para filtrar
 * @param entityType Tipo da entidade para obter as configurações dos campos
 * @returns Lista de itens com campos filtrados
 */
export function filterNonBrowsableFields<T extends IBaseModel>(items: T[], entityType: any): Partial<T>[] {
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
 * Filtra campos não legíveis (canRead: false) de um objeto
 * @param item Item a ser filtrado
 * @param entityType Tipo da entidade para obter as configurações dos campos
 * @returns Objeto com campos filtrados
 */
export function filterNonReadableFields<T extends IBaseModel>(item: T, entityType: any): Partial<T> {
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
 * Filtra campos não adicionáveis (canAdd: false) de um objeto
 * @param data Dados a serem filtrados
 * @param entityType Tipo da entidade para obter as configurações dos campos
 * @returns Objeto com campos filtrados
 */
export function filterNonAddableFields<T extends IBaseModel>(data: DeepPartial<T>, entityType: any): DeepPartial<T> {
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
 * Filtra campos não editáveis (canEdit: false) de um objeto
 * @param data Dados a serem filtrados
 * @param entityType Tipo da entidade para obter as configurações dos campos
 * @returns Objeto com campos filtrados
 */
export function filterNonEditableFields<T extends IBaseModel>(data: DeepPartial<T>, entityType: any): DeepPartial<T> {
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

export default {
  filterNonBrowsableFields,
  filterNonReadableFields,
  filterNonAddableFields,
  filterNonEditableFields
}; 