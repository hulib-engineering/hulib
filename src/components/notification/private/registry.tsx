import type { ComponentType } from 'react';
import { NotificationType } from './types';
import DefaultNotificationCard from '@/components/notification/styles/DefaultNotification';
import type { Notification } from '@/libs/services/modules/notifications/notificationType';
import InformativeNotificationCard from '@/components/notification/styles/InformativeNotification';
import SystemNotificationCard from '@/components/notification/styles/SystemNotification';

type NotificationComponentProps = {
  notification: Notification;
  onClick: () => void;
  showExtras?: boolean;
};

export const notificationRegistry: Record<
  NotificationType,
  ComponentType<NotificationComponentProps>
> = {
  [NotificationType.ACCOUNT_UPGRADE]: DefaultNotificationCard,
  [NotificationType.STORY_PUBLISH]: DefaultNotificationCard,
  [NotificationType.SESSION_REQUEST]: DefaultNotificationCard,
  [NotificationType.STORY_REVIEW]: DefaultNotificationCard,
  [NotificationType.STORY_REJECTION]: InformativeNotificationCard,
  [NotificationType.HUBER_REPORT]: DefaultNotificationCard,
  [NotificationType.HUBER_REJECTION]: InformativeNotificationCard,
  [NotificationType.SESSION_REJECTION]: InformativeNotificationCard,
  [NotificationType.SESSION_APPROVAL]: InformativeNotificationCard,
  [NotificationType.SESSION_MISS]: InformativeNotificationCard,
  [NotificationType.SESSION_CANCELLATION]: InformativeNotificationCard,
  [NotificationType.SESSION_COMPLETION]: SystemNotificationCard,
  [NotificationType.OTHER]: SystemNotificationCard,
};
