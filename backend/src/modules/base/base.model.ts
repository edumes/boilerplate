import { BeforeInsert, Column, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export interface IBaseModel {
  id: number;
  uuid: string;
  created_at?: Date;
  updated_at?: Date;
  created_by_fk_user_id?: number;
  updated_by_fk_user_id?: number;
}

export abstract class BaseModel implements IBaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'uuid',
    unique: true,
    nullable: false
  })
  uuid: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at?: Date;

  @Column({ nullable: true })
  created_by_fk_user_id?: number;

  @Column({ nullable: true })
  updated_by_fk_user_id?: number;

  @BeforeInsert()
  generateUUID() {
    if (!this.uuid) {
      this.uuid = uuidv4();
    }
  }
}
