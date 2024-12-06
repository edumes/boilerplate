import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";
import { IBaseEntity } from "../base/base.entity";

export enum AuditAction {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
}

@Entity()
export class Audit implements IBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  entityName: string;

  @Column()
  entityId: number;

  @Column({
    type: "enum",
    enum: AuditAction,
  })
  action: AuditAction;

  @Column({ type: "jsonb", nullable: true })
  oldValues: Record<string, any>;

  @Column({ type: "jsonb", nullable: true })
  newValues: Record<string, any>;

  @Column({ nullable: true })
  userId: number;

  @CreateDateColumn()
  createdAt: Date;
}
