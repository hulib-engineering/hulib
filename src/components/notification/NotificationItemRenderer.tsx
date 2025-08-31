import { notificationRegistry } from './private/registry';

import { NotificationType } from '@/components/notification/private/types';
import type { Notification } from '@/libs/services/modules/notifications/notificationType';
import useNotificationActions from '@/libs/hooks/useNotificationActions';

export type INotificationItemRendererProps = {
  notification: Notification;
  onClick?: () => void;
  showExtras?: boolean;
};

export default function NotificationItemRenderer({ notification, showExtras, onClick }: INotificationItemRendererProps) {
  const Component
    = notificationRegistry[notification.type.name as NotificationType] ?? notificationRegistry[NotificationType.OTHER];

  const { markAsSeen } = useNotificationActions();

  const handleClick = async () => {
    await markAsSeen(`${notification.id}`);
    if (onClick) {
      onClick();
    }
  };

  return <Component notification={notification} showExtras={showExtras} onClick={handleClick} />;
}
