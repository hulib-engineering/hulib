import type { Notification } from '@/libs/services/modules/notifications/notificationType';
import { NOTIFICATION_TYPES } from '@/libs/services/modules/notifications/notificationType';

type NotificationConfig = {
  isClickable: boolean;
  showAvatar: boolean;
  showActions: boolean;
  avatarType: 'user' | 'system';
};

export const getNotificationConfig = (
  notificationType: string,
): NotificationConfig => {
  const configs: Record<string, NotificationConfig> = {
    [NOTIFICATION_TYPES.SESSION_REQUEST.name]: {
      isClickable: true,
      showAvatar: true,
      showActions: true,
      avatarType: 'user',
    },
    [NOTIFICATION_TYPES.REVIEW_STORY.name]: {
      isClickable: true,
      showAvatar: true,
      showActions: false,
      avatarType: 'system',
    },
    [NOTIFICATION_TYPES.PUBLISH_STORY.name]: {
      isClickable: true,
      showAvatar: true,
      showActions: false,
      avatarType: 'system',
    },
    [NOTIFICATION_TYPES.ACCOUNT.name]: {
      isClickable: true,
      showAvatar: true,
      showActions: false,
      avatarType: 'system',
    },
  };

  return (
    configs[notificationType] || {
      isClickable: false,
      showAvatar: false,
      showActions: false,
      avatarType: 'system',
    }
  );
};
export const getNotificationRoute = (notification: Notification): string => {
  const { type, relatedEntityId } = notification;

  switch (type.name) {
    case NOTIFICATION_TYPES.ACCOUNT.name:
      return '/profile';
    case NOTIFICATION_TYPES.SESSION_REQUEST.name:
      return '/schedule-meeting/weekly-schedule';
    case NOTIFICATION_TYPES.PUBLISH_STORY.name:
    case NOTIFICATION_TYPES.REVIEW_STORY.name:
      return relatedEntityId ? `/explore-story/${relatedEntityId}` : '/';
    default:
      return '/';
  }
};
