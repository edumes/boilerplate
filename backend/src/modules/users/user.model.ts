import { FieldConfig, FormMetadata } from '@core/decorators/field-config.decorator';
import { FIELD_TYPE } from '@core/enums/field-type.enum';
import { BaseModel } from '@modules/base/base.model';
import { Company } from '@modules/companies/company.model';
import { ProjectUser } from '@modules/project_users/project-user.model';
import { Role } from '@modules/roles/role.model';
import { IsEmail, MinLength } from 'class-validator';
import i18next from 'i18next';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity({ name: 'users' })
@FormMetadata({
  prefix: 'user',
  table: 'users',
  singularName: 'User',
  pluralName: 'Users',
  icon: 'user',
  version: '1.0.0'
})
export class User extends BaseModel {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  id: number;

  @Column({ length: 100 })
  @FieldConfig({
    label: 'Nome',
    canAdd: true,
    canRead: true,
    canBrowse: true,
    canEdit: true,
    order: 1,
    required: true,
    width: 6,
    type: FIELD_TYPE.TEXT,
    tabs: ['main']
  })
  user_name: string;

  @Column({ unique: true })
  @IsEmail({}, { message: 'Invalid email format' })
  @FieldConfig({
    label: 'Email',
    canAdd: true,
    canRead: true,
    canBrowse: true,
    canEdit: true,
    order: 2,
    required: true,
    width: 6,
    type: FIELD_TYPE.EMAIL,
    tabs: ['main']
  })
  user_email: string;

  @Column({
    length: 60
  })
  @MinLength(8, { message: i18next.t('PASSWORD_MIN_LENGTH', { characters: 8 }) })
  @FieldConfig({
    label: 'Senha',
    canAdd: true,
    canRead: false,
    canBrowse: false,
    canEdit: true,
    order: 3,
    required: true,
    width: 6,
    type: FIELD_TYPE.TEXT,
    tabs: ['main']
  })
  user_password: string;

  @Column({ length: 20, nullable: true })
  @FieldConfig({
    label: 'Telefone',
    canAdd: true,
    canRead: true,
    canBrowse: true,
    canEdit: true,
    order: 4,
    width: 4,
    type: FIELD_TYPE.TEXT,
    tabs: ['main']
  })
  user_telephone: string;

  @Column()
  @FieldConfig({
    label: 'Empresa',
    canAdd: true,
    canRead: true,
    canBrowse: true,
    canEdit: true,
    order: 5,
    required: true,
    width: 6,
    type: FIELD_TYPE.SELECT,
    select: { url: 'companies/select-options' },
    tabs: ['main']
  })
  user_fk_company_id: number;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'user_fk_company_id' })
  company: Company;

  @Column()
  @FieldConfig({
    label: 'Função',
    canAdd: true,
    canRead: true,
    canBrowse: true,
    canEdit: true,
    order: 8,
    required: true,
    width: 6,
    type: FIELD_TYPE.SELECT,
    select: { url: 'roles/select-options' },
    tabs: ['main']
  })
  user_fk_role_id: number;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'user_fk_role_id' })
  role: Role;

  @CreateDateColumn({ name: 'user_created_at' })
  @FieldConfig({
    label: 'Data de Criação',
    canAdd: false,
    canRead: true,
    canBrowse: true,
    canEdit: false,
    readonly: true,
    order: 6,
    width: 4,
    type: FIELD_TYPE.DATE,
    tabs: ['dates']
  })
  created_at: Date;

  @UpdateDateColumn({ name: 'user_updated_at' })
  @FieldConfig({
    label: 'Data de Atualização',
    canAdd: false,
    canRead: true,
    canBrowse: true,
    canEdit: false,
    readonly: true,
    order: 7,
    width: 4,
    type: FIELD_TYPE.DATE,
    tabs: ['dates']
  })
  updated_at: Date;

  @Column({ default: true })
  @FieldConfig({
    label: 'Ativo',
    canAdd: true,
    canRead: true,
    canBrowse: true,
    canEdit: true,
    order: 9,
    width: 2,
    type: FIELD_TYPE.CHECKBOX,
    tabs: ['main']
  })
  user_is_active: boolean;

  @OneToMany(() => ProjectUser, projectUser => projectUser.user)
  project_users: ProjectUser[];
}
