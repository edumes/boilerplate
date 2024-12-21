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

@Entity({ name: 'projects' })
export class Project extends BaseModel {
  @PrimaryGeneratedColumn({ name: 'project_id' })
  id: number;

  @Column({ nullable: false })
  @FieldConfig({
    label: 'Código',
    canRead: true,
    canBrowse: true,
    canEdit: true,
    order: 1,
    width: 4,
    number: {
      type: NUMBER_TYPE.DECIMAL,
    },
  })
  project_code: string;

  @Column({ nullable: false })
  @FieldConfig({
    label: 'Descrição',
    canRead: true,
    canBrowse: true,
    canEdit: true,
    order: 2,
    width: 8,
    type: FIELD_TYPE.TEXT,
  })
  project_description: string;

  @Column({ type: 'text', nullable: true })
  @FieldConfig({
    label: 'Observações',
    canRead: true,
    canBrowse: true,
    canEdit: true,
    order: 3,
    width: 12,
    type: FIELD_TYPE.RICHTEXT,
  })
  project_obs: string;

  @Column({ nullable: true })
  @FieldConfig({
    label: 'Situação',
    canRead: true,
    canBrowse: true,
    canEdit: true,
    order: 4,
    width: 4,
    type: FIELD_TYPE.SELECT,
  })
  project_fk_situation_id: number;

  @Column({ type: 'timestamp', nullable: true })
  @FieldConfig({
    label: 'Data de Início',
    canRead: true,
    canBrowse: true,
    canEdit: true,
    order: 5,
    width: 4,
    type: FIELD_TYPE.DATE,
  })
  project_inital_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  @FieldConfig({
    label: 'Data de Término',
    canRead: true,
    canBrowse: true,
    canEdit: true,
    order: 6,
    width: 4,
    type: FIELD_TYPE.DATE,
  })
  project_final_date: Date;

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
