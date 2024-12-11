import { IBaseModel } from '@modules/base/base.model';
import { Company } from '@modules/companies/company.model';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
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
}
