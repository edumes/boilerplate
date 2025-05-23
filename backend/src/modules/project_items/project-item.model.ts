import { FieldConfig, FormMetadata } from '@core/decorators/field-config.decorator';
import { FIELD_TYPE } from '@core/enums/field-type.enum';
import { BaseModel } from '@modules/base/base.model';
import { Project } from '@modules/projects/project.model';
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

@Entity({ name: 'project_items' })
@FormMetadata({
  prefix: 'project_item',
  table: 'project_items',
  singularName: 'Project Item',
  pluralName: 'Project Items',
  icon: 'project-management',
  version: '1.0.0'
})
export class ProjectItem extends BaseModel {
  @PrimaryGeneratedColumn({ name: 'project_item_id' })
  id: number;

  @Column({ nullable: false })
  @Index('IDX_PROJECT_ITEM_PROJECT')
  // @FieldConfig({
  //   label: 'Projeto',
  //   canAdd: true,
  //   canRead: true,
  //   canBrowse: true,
  //   canEdit: true,
  //   order: 1,
  //   required: true,
  //   width: 6,
  //   type: FIELD_TYPE.SELECT,
  //   select: { url: 'projects/select-options' },
  //   tabs: ['main'],
  // })
  project_item_fk_project_id: number;

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'project_item_fk_project_id' })
  project: Project;

  @Column({ nullable: false })
  @FieldConfig({
    label: 'Descrição',
    canAdd: true,
    canRead: true,
    canBrowse: true,
    canEdit: true,
    order: 2,
    required: true,
    width: 4,
    type: FIELD_TYPE.TEXT,
    tabs: ['main']
  })
  project_item_description: string;

  @Column({ nullable: true })
  @Index('IDX_PROJECT_ITEM_STATUS')
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
    tabs: ['main']
  })
  project_item_fk_situation_id: number;

  @ManyToOne(() => Situation)
  @JoinColumn({ name: 'project_item_fk_situation_id' })
  situation: Situation;

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
    tabs: ['main']
  })
  project_item_observation: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  @FieldConfig({
    label: 'Orçamento',
    type: FIELD_TYPE.CURRENCY,
    width: 9,
    tabs: ['financial']
  })
  project_item_budget: number;

  @CreateDateColumn({ name: 'project_item_created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'project_item_updated_at' })
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
