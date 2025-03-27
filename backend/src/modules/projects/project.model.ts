import { FieldConfig, FormMetadata } from '@core/decorators/field-config.decorator';
import { FIELD_TYPE } from '@core/enums/field-type.enum';
import { PriorityLevel } from '@core/enums/priority.enum';
import { BaseModel } from '@modules/base/base.model';
import { Client } from '@modules/clients/client.model';
import { ProjectItem } from '@modules/project_items/project-item.model';
import { ProjectUser } from '@modules/project_users/project-user.model';
import { Situation } from '@modules/situations/situation.model';
import { User } from '@modules/users/user.model';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity({ name: 'projects' })
@FormMetadata({
  prefix: 'project',
  table: 'projects',
  singularName: 'Project',
  pluralName: 'Projects',
  icon: 'project-management',
  version: '1.0.0',
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

  @Column({ nullable: true })
  @Index('IDX_PROJECT_CLIENT')
  @FieldConfig({
    label: 'Cliente',
    canAdd: true,
    canRead: true,
    canBrowse: true,
    canEdit: true,
    order: 3,
    required: true,
    width: 6,
    type: FIELD_TYPE.SELECT,
    select: { url: 'clients/select-options' },
    tabs: ['main'],
  })
  project_fk_client_id: number;

  @ManyToOne(() => Client)
  @JoinColumn({ name: 'project_fk_client_id' })
  client: Client;

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

  @Column({ type: 'enum', enum: PriorityLevel, default: PriorityLevel.MEDIUM })
  @FieldConfig({
    label: 'Prioridade',
    type: FIELD_TYPE.SELECT,
    width: 2,
    order: 5,
    select: { options: PriorityLevel },
  })
  project_priority: PriorityLevel;

  @OneToMany(() => ProjectUser, projectUser => projectUser.project)
  @FieldConfig({
    label: 'Usuários Envolvidos',
    canAdd: true,
    canRead: true,
    canBrowse: true,
    canEdit: true,
    order: 6,
    width: 6,
    type: FIELD_TYPE.MULTISELECT,
    select: { url: 'users/select-options' },
    tabs: ['main'],
  })
  project_users: ProjectUser[];

  @Column({ type: 'timestamp', nullable: true })
  @FieldConfig({
    label: 'Data de Início',
    canAdd: true,
    canRead: true,
    canBrowse: true,
    canEdit: true,
    order: 6,
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
    order: 7,
    width: 4,
    type: FIELD_TYPE.DATE,
    tabs: ['dates'],
  })
  project_final_date: Date;

  @OneToMany(() => ProjectItem, projectItem => projectItem.project)
  @FieldConfig({
    label: 'Itens do Projeto',
    canAdd: true,
    canRead: true,
    canBrowse: false,
    canEdit: true,
    order: 7,
    width: 12,
    type: FIELD_TYPE.GRID,
    tabs: ['main'],
  })
  project_items: ProjectItem[];

  @Column({ type: 'text', nullable: true })
  @FieldConfig({
    label: 'Observações',
    canAdd: true,
    canRead: true,
    canBrowse: true,
    canEdit: true,
    order: 8,
    width: 12,
    type: FIELD_TYPE.TEXTAREA,
    tabs: ['main'],
  })
  project_observation: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  @FieldConfig({
    label: 'Orçamento',
    type: FIELD_TYPE.CURRENCY,
    width: 9,
    tabs: ['financial'],
  })
  project_budget: number;

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
