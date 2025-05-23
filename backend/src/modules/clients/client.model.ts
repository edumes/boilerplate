import { FieldConfig, FormMetadata } from '@core/decorators/field-config.decorator';
import { FIELD_TYPE } from '@core/enums/field-type.enum';
import { BaseModel } from '@modules/base/base.model';
import { User } from '@modules/users/user.model';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity({ name: 'clients' })
@FormMetadata({
  prefix: 'client',
  table: 'clients',
  singularName: 'Client',
  pluralName: 'Clients',
  icon: 'user-group',
  version: '1.0.0'
})
export class Client extends BaseModel {
  @PrimaryGeneratedColumn({ name: 'client_id' })
  id: number;

  @Column({ nullable: false })
  @FieldConfig({
    label: 'Nome',
    canAdd: true,
    canRead: true,
    canBrowse: true,
    canEdit: true,
    order: 2,
    required: true,
    width: 8,
    type: FIELD_TYPE.TEXT,
    tabs: ['main']
  })
  client_name: string;

  @Column({ nullable: true })
  @FieldConfig({
    label: 'Email',
    canAdd: true,
    canRead: true,
    canBrowse: true,
    canEdit: true,
    order: 3,
    width: 6,
    type: FIELD_TYPE.EMAIL,
    tabs: ['contact']
  })
  client_email: string;

  @Column({ nullable: true })
  @FieldConfig({
    label: 'Telefone',
    canAdd: true,
    canRead: true,
    canBrowse: true,
    canEdit: true,
    order: 4,
    width: 6,
    type: FIELD_TYPE.PHONE,
    tabs: ['contact']
  })
  client_phone: string;

  @Column({ type: 'text', nullable: true })
  @FieldConfig({
    label: 'Observações',
    canAdd: true,
    canRead: true,
    canBrowse: true,
    canEdit: true,
    order: 5,
    width: 12,
    type: FIELD_TYPE.TEXTAREA,
    tabs: ['main']
  })
  client_observation: string;

  @CreateDateColumn({ name: 'client_created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'client_updated_at' })
  updated_at: Date;

  @Column({ nullable: true })
  created_by_fk_user_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_fk_user_id' })
  created_by: User;

  @Column({ nullable: true })
  updated_by_fk_user_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'updated_by_fk_user_id' })
  updated_by: User;
}
