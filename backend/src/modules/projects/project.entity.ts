import { IBaseEntity } from '@modules/base/base.entity';
import { User } from '@modules/users/user.entity';
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
export class Project implements IBaseEntity {
  @PrimaryGeneratedColumn({ name: 'project_id' })
  id: number;

  @Column({ nullable: false })
  project_code: string;

  @Column({ nullable: false })
  project_description: string;

  @Column({ type: 'text', nullable: true })
  project_obs: string;

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
