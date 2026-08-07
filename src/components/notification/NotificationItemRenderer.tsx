import React from 'react';
import { notificationRegistry } from './private/registry';

import { NotificationType } from '@/components/notification/private/types';
import type { Notification } from '@/libs/services/modules/notifications/notificationType';
import useNotificationActions from '@/libs/hooks/useNotificationActions';

export type INotificationItemRendererProps = {
  notification: Notification;
  onClick?: () => void;
  showExtras?: boolean;
};

// Isolates one bad notification (e.g. unregistered type) so it doesn't crash the whole list.
class ItemBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

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

  return (
    <ItemBoundary>
      <Component notification={notification} showExtras={showExtras} onClick={handleClick} />
    </ItemBoundary>
  );
}
