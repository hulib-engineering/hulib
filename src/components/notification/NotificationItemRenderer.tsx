import React from 'react';
import { resolveNotificationComponent } from './private/registry';

import type { Notification } from '@/libs/services/modules/notifications/notificationType';
import useNotificationActions from '@/libs/hooks/useNotificationActions';

export type INotificationItemRendererProps = {
  notification: Notification;
  onClick?: () => void;
  showExtras?: boolean;
  /**
   * Lets a parent (e.g. a popover that unmounts its content on close) take over
   * rendering of the accept/reject confirmation modal so it survives the parent closing.
   * Only consumed by MeetingRequestNotificationCard; ignored by other notification types.
   */
  onRequestDecision?: (type: 'accept' | 'reject', notification: Notification) => void;
};

// Isolates one bad notification (e.g. unregistered type) so it doesn't crash the whole list.
class ItemBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  override state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  override render() {
    return this.state.hasError ? null : this.props.children;
  }
}

export default function NotificationItemRenderer({ notification, showExtras, onClick, onRequestDecision }: INotificationItemRendererProps) {
  const Component = resolveNotificationComponent(notification);

  const { markAsSeen } = useNotificationActions();

  const handleClick = async () => {
    await markAsSeen(`${notification.id}`);
    if (onClick) {
      onClick();
    }
  };

  return (
    <ItemBoundary>
      <Component notification={notification} showExtras={showExtras} onClick={handleClick} onRequestDecision={onRequestDecision} />
    </ItemBoundary>
  );
}
