import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IBaseEntity } from '../base/base.entity';
import { User } from '../users/user.entity';

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

@Entity({ name: 'audits' })
export class Audit implements IBaseEntity {
  @PrimaryGeneratedColumn({ name: 'audit_id' })
  id: number;

  @Column()
  audit_entity_name: string;

  @Column({
    type: 'enum',
    enum: AuditAction,
  })
  audit_action: AuditAction;

  @Column({ type: 'jsonb', nullable: true })
  audit_old_values: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  audit_new_values: Record<string, any>;

  @Column({ nullable: true })
  audit_observation?: string;

  @Column({ nullable: true })
  audit_fk_user_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'audit_fk_user_id' })
  user: User;

  @CreateDateColumn()
  created_at: Date;
}
