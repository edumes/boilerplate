import { FieldConfig, FormMetadata } from '@core/decorators/field-config.decorator';
import { FIELD_TYPE } from '@core/enums/field-type.enum';
import { PriorityLevel } from '@core/enums/priority.enum';
import { BaseModel } from '@modules/base/base.model';
import { Situation } from '@modules/situations/situation.model';
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

@Entity({ name: 'projects' })
@FormMetadata({
  prefix: 'project',
  table: 'projects',
  singularName: 'Projeto',
  pluralName: 'Projetos',
  icon: 'project-management',
  version: '1.0.0'
})
export class Project extends BaseModel {
  @PrimaryGeneratedColumn({ name: 'project_id' })
  id: number;

  @Column({ unique: true, nullable: false })
  @Index('IDX_PROJECT_CODE')
  @FieldConfig({
    label: 'Código',
    canAdd: true,
    canRead: true,
    canBrowse: true,
    canEdit: true,
    order: 1,
    required: true,
    width: 4,
    type: FIELD_TYPE.TEXT,
    tabs: ['main'],
  })
  project_code: string;

  @Column({ nullable: false })
  @FieldConfig({
    label: 'Descrição',
    canAdd: true,
    canRead: true,
    canBrowse: true,
    canEdit: true,
    order: 2,
    required: true,
    width: 8,
    type: FIELD_TYPE.TEXT,
    tabs: ['main'],
  })
  project_description: string;

  @Column({ type: 'text', nullable: true })
  @FieldConfig({
    label: 'Observações',
    canAdd: true,
    canRead: true,
    canBrowse: true,
    canEdit: true,
    order: 3,
    width: 12,
    type: FIELD_TYPE.RICHTEXT,
    tabs: ['main'],
  })
  project_obs: string;

  @Column({ nullable: true })
  @Index('IDX_PROJECT_STATUS')
  @FieldConfig({
    label: 'Situação',
    canAdd: true,
    canRead: true,
    canBrowse: true,
    canEdit: true,
    order: 4,
    required: true,
    width: 4,
    type: FIELD_TYPE.SELECT,
    select: { url: 'situations/select-options' },
    tabs: ['main'],
  })
  project_fk_situation_id: number;

  @ManyToOne(() => Situation)
  @JoinColumn({ name: 'project_fk_situation_id' })
  situation: Situation;

  @Column({ type: 'timestamp', nullable: true })
  @FieldConfig({
    label: 'Data de Início',
    canAdd: true,
    canRead: true,
    canBrowse: true,
    canEdit: true,
    order: 5,
    // required: true,
    width: 4,
    type: FIELD_TYPE.DATE,
    tabs: ['dates'],
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
    tabs: ['dates'],
  })
  project_final_date: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  @FieldConfig({
    label: 'Orçamento',
    type: FIELD_TYPE.CURRENCY,
    width: 4,
    tabs: ['financial']
  })
  project_budget: number;

  @Column({ type: 'enum', enum: PriorityLevel, default: PriorityLevel.MEDIUM })
  @FieldConfig({
    label: 'Prioridade',
    type: FIELD_TYPE.SELECT,
    select: { url: '', options: PriorityLevel }
  })
  project_priority: PriorityLevel;

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
