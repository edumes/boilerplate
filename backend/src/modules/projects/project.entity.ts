import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IBaseEntity } from '../base/base.entity';
import { Company } from '../companies/company.entity';
import { User } from '../users/user.entity';

@Entity({ name: 'projects' })
export class Project implements IBaseEntity {
  @PrimaryGeneratedColumn({ name: 'project_id' })
  id: number;

  @Column({ nullable: true })
  project_code: string;

  @Column({ nullable: true })
  project_description: string;

  @Column({ type: 'text', nullable: true })
  project_obs: string;

  @Column({ nullable: true })
  project_created_by_fk_user_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'project_created_by_fk_user_id' })
  created_by_user: User;

  @Column({ nullable: true })
  project_fk_company_id: number;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'project_fk_company_id' })
  company: Company;

  @Column({ nullable: true })
  project_fk_situation_id: number;

  @Column({ type: 'timestamp', nullable: true })
  project_inital_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  project_final_date: Date;

  @CreateDateColumn({ name: 'project_created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'project_updated_at' })
  updated_at: Date;
}
