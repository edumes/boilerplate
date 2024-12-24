import { AppDataSource } from '@config/database.config';
import { BaseRepository } from '@modules/base/base.repository';
import { Notification } from '@modules/notifications/notification.model';

export class NotificationRepository extends BaseRepository<Notification> {
  constructor() {
    super(Notification, AppDataSource);
  }
}

export const notificationRepository = new NotificationRepository();
