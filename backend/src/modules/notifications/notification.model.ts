import { BaseModel } from '@modules/base/base.model';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'notifications' })
export class Notification extends BaseModel {
  @PrimaryGeneratedColumn({ name: 'notification_id' })
  id: number;

  @Column({ nullable: false })
  notification_fk_user_id: number;

  @Column()
  notification_type: string;

  @Column()
  notification_title: string;

  @Column('text')
  notification_message: string;

  @Column({ default: false })
  notification_read: boolean;
}
