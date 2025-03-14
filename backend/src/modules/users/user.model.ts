import { BaseModel } from '@modules/base/base.model';
import { Company } from '@modules/companies/company.model';
import { Role } from '@modules/roles/role.model';
import { Exclude } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
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
export class User extends BaseModel {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  id: number;

  @Column({ length: 100 })
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  user_name: string;

  @Column({ unique: true })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  user_email: string;

  @Column({
    length: 60,
  })
  @Exclude()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
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

  @Column({ nullable: true })
  user_fk_role_id: number;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'user_fk_role_id' })
  role: Role;

  @Column({ default: true })
  user_is_active: boolean;
}
