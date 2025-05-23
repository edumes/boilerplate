import { BaseService } from '@modules/base/base.service';
import { Notification } from '@modules/notifications/notification.model';
import { notificationRepository } from '@modules/notifications/notification.repository';

export class NotificationService extends BaseService<Notification> {
  constructor() {
    super(notificationRepository, 'Notification');

    this.setHooks({
      beforeCreate: async data => {}
    });
  }
}

export const notificationService = new NotificationService();
