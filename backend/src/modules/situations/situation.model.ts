import { FieldConfig, FormMetadata } from '@core/decorators/field-config.decorator';
import { FIELD_TYPE } from '@core/enums/field-type.enum';
import { BaseModel } from '@modules/base/base.model';
import { User } from '@modules/users/user.model';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity({ name: 'situations' })
@FormMetadata({
  prefix: 'situation',
  table: 'situations',
  singularName: 'Situation',
  pluralName: 'Situations',
  icon: 'situation',
  version: '1.0.0'
})
export class Situation extends BaseModel {
  @PrimaryGeneratedColumn({ name: 'situation_id' })
  id: number;

  @Column({ nullable: false })
  @FieldConfig({
    label: 'Código',
    canAdd: true,
    canRead: true,
    canBrowse: true,
    canEdit: true,
    order: 1,
    width: 3,
    type: FIELD_TYPE.TEXT,
    tabs: ['main']
  })
  situation_code: string;

  @Column({ nullable: false })
  @FieldConfig({
    label: 'Nome',
    canAdd: true,
    canRead: true,
    canBrowse: true,
    canEdit: true,
    order: 2,
    width: 3,
    type: FIELD_TYPE.TEXT,
    tabs: ['main']
  })
  situation_name: string;

  @Column({ nullable: false })
  @FieldConfig({
    label: 'Descrição',
    canAdd: true,
    canRead: true,
    canBrowse: true,
    canEdit: true,
    order: 2,
    width: 5,
    type: FIELD_TYPE.TEXTAREA,
    tabs: ['main']
  })
  situation_description: string;

  @CreateDateColumn({ name: 'situation_created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'situation_updated_at' })
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
