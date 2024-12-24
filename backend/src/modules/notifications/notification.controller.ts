import { BaseController } from '@modules/base/base.controller';
import { Notification } from '@modules/notifications/notification.model';
import { notificationService } from '@modules/notifications/notification.service';

export class NotificationController extends BaseController<Notification> {
  constructor() {
    super(notificationService);
  }
}

export const notificationController = new NotificationController();
