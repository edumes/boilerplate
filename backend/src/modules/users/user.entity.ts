import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { IBaseEntity } from "../base/base.entity";

@Entity({ name: "users" })
export class User implements IBaseEntity {
  @PrimaryGeneratedColumn({ name: "user_id" })
  id: number;

  @Column({ length: 100 })
  user_name: string;

  @Column({ unique: true })
  user_email: string;

  @Column({
    length: 60,
  })
  user_password: string;

  @CreateDateColumn({ name: "user_created_at" })
  created_at: Date;

  @UpdateDateColumn({ name: "user_updated_at" })
  updated_at: Date;
}
