import { notificationRegistry } from './private/registry';

import { NotificationType } from '@/components/notification/private/types';
import type { Notification } from '@/libs/services/modules/notifications/notificationType';

export type INotificationItemRendererProps = {
  notification: Notification;
  onClick?: () => void;
  showExtras?: boolean;
};

export default function NotificationItemRenderer({ notification, showExtras, onClick }: INotificationItemRendererProps) {
  const Component
    = notificationRegistry[notification.type.name as NotificationType] ?? notificationRegistry[NotificationType.OTHER];

  return <Component notification={notification} showExtras={showExtras} onClick={onClick || (() => {})} />;
}
