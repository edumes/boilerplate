import { FIELD_TYPE, FieldConfig } from '@core/decorators/field-config.decorator';
import { IBaseModel } from '@modules/base/base.model';
import { User } from '@modules/users/user.model';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('roles')
export class Role implements IBaseModel {
  @PrimaryGeneratedColumn()
  @FieldConfig({
    type: FIELD_TYPE.NUMBER,
    canEdit: false,
    canAdd: false,
  })
  id: number;

  @Column({ unique: true })
  @FieldConfig({
    type: FIELD_TYPE.TEXT,
    required: true,
    label: 'Name',
  })
  role_name: string;

  @Column({ nullable: true })
  @FieldConfig({
    type: FIELD_TYPE.TEXT,
    label: 'Description',
  })
  role_description?: string;

  @Column('simple-array', { nullable: true })
  @FieldConfig({
    type: FIELD_TYPE.MULTISELECT,
    label: 'Permissions',
  })
  role_permissions: string[];

  @ManyToMany(() => User, user => user.roles)
  users: User[];
}
