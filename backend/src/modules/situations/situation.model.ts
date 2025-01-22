import { FIELD_TYPE, FieldConfig, NUMBER_TYPE } from '@core/decorators/field-config.decorator';
import { BaseModel } from '@modules/base/base.model';
import { User } from '@modules/users/user.model';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'situations' })
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
    width: 3
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
    type: FIELD_TYPE.TEXT,
  })
  situation_description: string;

  @CreateDateColumn({ name: 'project_created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'project_updated_at' })
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
