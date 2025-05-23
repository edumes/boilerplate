import { FieldConfig } from '@core/decorators/field-config.decorator';
import { FIELD_TYPE } from '@core/enums/field-type.enum';
import { BaseModel } from '@modules/base/base.model';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'roles' })
export class Role extends BaseModel {
  @PrimaryGeneratedColumn({ name: 'role_id' })
  @FieldConfig({
    type: FIELD_TYPE.NUMBER,
    canEdit: false,
    canAdd: false
  })
  id: number;

  @Column({ unique: true })
  @FieldConfig({
    type: FIELD_TYPE.TEXT,
    required: true,
    label: 'Role Name'
  })
  role_name: string;

  @Column({ type: 'jsonb', default: {} })
  @FieldConfig({
    type: FIELD_TYPE.TEXT,
    label: 'Permissions'
  })
  role_permissions: {
    [resource: string]: {
      create?: boolean;
      read?: boolean;
      update?: boolean;
      delete?: boolean;
      special?: string[];
    };
  };
}
