import { FIELD_TYPE, FieldConfig } from '@core/decorators/field-config.decorator';
import { IBaseModel } from '@modules/base/base.model';
import { Company } from '@modules/companies/company.model';
import { Role } from '@modules/roles/role.model';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User implements IBaseModel {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  id: number;

  @Column({ length: 100 })
  user_name: string;

  @Column({ unique: true })
  user_email: string;

  @Column({
    length: 60,
  })
  user_password: string;

  @Column({ length: 20, nullable: true })
  user_telephone: string;

  @Column({ nullable: false })
  user_fk_company_id: number;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'user_fk_company_id' })
  company: Company;

  @CreateDateColumn({ name: 'user_created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'user_updated_at' })
  updated_at: Date;

  @ManyToMany(() => Role, role => role.users, {
    eager: true,
  })
  @JoinTable({
    name: 'user_roles',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  @FieldConfig({
    type: FIELD_TYPE.MULTISELECT,
    label: 'Roles',
  })
  roles: Role[];
}
