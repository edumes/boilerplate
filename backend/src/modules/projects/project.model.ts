import { FIELD_TYPE, FieldConfig, NUMBER_TYPE } from '@core/decorators/field-config.decorator';
import { BaseModel } from '@modules/base/base.model';
import { Situation } from '@modules/situations/situation.model';
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
    canAdd: true,
    canRead: true,
    canBrowse: true,
    canEdit: true,
    order: 1,
    required: true,
    width: 4,
    type: FIELD_TYPE.TEXT,
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
    width: 8,
    type: FIELD_TYPE.TEXT,
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
  })
  project_obs: string;

  @Column({ nullable: true })
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

  // static getFormConfig(): FormConfig {
  //   const fieldConfigs = getFieldConfigs(Project);

  //   const tabs: TabConfig[] = Object.keys(fieldConfigs).reduce((tabs: TabConfig[], fieldName: string) => {
  //     const config = fieldConfigs[fieldName];

  //     if (config.tabs) {
  //       config.tabs.forEach((tabKey: string) => {
  //         if (!tabs.some(tab => tab.key === tabKey)) {
  //           tabs.push({
  //             key: tabKey,
  //             label: tabKey.charAt(0).toUpperCase() + tabKey.slice(1),
  //           });
  //         }
  //       });
  //     }

  //     return tabs;
  //   }, []);

  //   return {
  //     prefix: 'project', // Prefixo do formulário
  //     table: 'projects', // Nome da tabela
  //     singularName: 'Projeto', // Nome singular
  //     pluralName: 'Projetos', // Nome plural
  //     icon: 'project', // Ícone
  //     tabs, // Abas
  //     version: '1.0.0', // Versão do formulário
  //   };
  // }
}
