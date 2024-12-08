import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IBaseEntity } from '../base/base.entity';

@Entity({ name: 'companies' })
export class Company implements IBaseEntity {
  @PrimaryGeneratedColumn({ name: 'company_id' })
  id: number;

  @Column({ length: 100 })
  company_name: string;

  @Column({ unique: true })
  company_cnpj: string;

  @Column({ length: 200, nullable: true })
  company_address: string;

  @Column({ length: 20, nullable: true })
  company_telephone: string;

  @Column({ length: 100, nullable: true })
  company_email: string;

  @CreateDateColumn({ name: 'company_created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'company_updated_at' })
  updated_at: Date;
}
