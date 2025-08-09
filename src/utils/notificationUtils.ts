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
  sessionStatus?: string,
): NotificationConfig => {
  const configs: Record<string, NotificationConfig> = {
    // Original types
    [NOTIFICATION_TYPES.SESSION_REQUEST.name]: {
      isClickable: true,
      showAvatar: true,
      showActions: sessionStatus === 'pending',
      avatarType: 'user',
    },
    [NOTIFICATION_TYPES.REVIEW_STORY.name]: {
      isClickable: true,
      showAvatar: true,
      showActions: false,
      avatarType: 'user', // Changed from system to user since it's from a user review
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
    [NOTIFICATION_TYPES.OTHER.name]: {
      isClickable: false, // Changed to false since these are typically meeting reminders
      showAvatar: true,
      showActions: true, // Show Join/Cancel actions
      avatarType: 'system',
    },

    // New specific notification types
    [NOTIFICATION_TYPES.REJECTED_HUBER.name]: {
      isClickable: false,
      showAvatar: true,
      showActions: true, // Show "See the rejected application" button
      avatarType: 'system',
    },
    [NOTIFICATION_TYPES.ACCEPTED_MEETING.name]: {
      isClickable: true, // Make clickable to navigate to schedule
      showAvatar: true,
      showActions: false, // No actions needed, just display info
      avatarType: 'user',
    },
    [NOTIFICATION_TYPES.REJECTED_MEETING.name]: {
      isClickable: false,
      showAvatar: true,
      showActions: true, // Show "Explore other stories" button
      avatarType: 'user',
    },
    [NOTIFICATION_TYPES.CANCELED_MEETING.name]: {
      isClickable: false,
      showAvatar: true,
      showActions: false, // No actions needed, just display info
      avatarType: 'user',
    },
    [NOTIFICATION_TYPES.NOT_ATTENDED.name]: {
      isClickable: false,
      showAvatar: true,
      showActions: true, // Show "Share the reason" button
      avatarType: 'system',
    },
    [NOTIFICATION_TYPES.REJECTED_STORY.name]: {
      isClickable: false,
      showAvatar: true,
      showActions: true, // Show "See the rejected story" button
      avatarType: 'system',
    },
  };

  return (
    configs[notificationType] || {
      isClickable: false,
      showAvatar: true,
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
      return relatedEntityId ? `/explore-story/${relatedEntityId}` : '/explore-story';
    case NOTIFICATION_TYPES.REJECTED_MEETING.name:
      return '/explore-story';
    case NOTIFICATION_TYPES.ACCEPTED_MEETING.name:
      return '/schedule-meeting/weekly-schedule';
    case NOTIFICATION_TYPES.CANCELED_MEETING.name:
      return '/schedule-meeting';
    case NOTIFICATION_TYPES.NOT_ATTENDED.name:
      return '/feedback/meeting-absence';
    case NOTIFICATION_TYPES.REJECTED_HUBER.name:
      return '/profile'; // Navigate to profile to see application status
    case NOTIFICATION_TYPES.REJECTED_STORY.name:
      return relatedEntityId ? `/story/${relatedEntityId}` : '/profile';
    case NOTIFICATION_TYPES.OTHER.name:
      // For meeting notifications, don't navigate automatically
      return relatedEntityId ? `/meeting/${relatedEntityId}` : '/';
    default:
      return '/';
  }
};

export const getAdminNotificationRoute = (
  notification: Notification,
): string => {
  const { type, relatedEntityId, sender } = notification;

  switch (type.name) {
    case NOTIFICATION_TYPES.ACCOUNT.name:
    case NOTIFICATION_TYPES.REJECTED_HUBER.name:
      return `/admin/users/approval/${sender?.id || relatedEntityId}`;
    case NOTIFICATION_TYPES.PUBLISH_STORY.name:
    case NOTIFICATION_TYPES.REVIEW_STORY.name:
    case NOTIFICATION_TYPES.REJECTED_STORY.name:
      return relatedEntityId
        ? `/admin/stories/approval/${relatedEntityId}`
        : '/admin/stories';
    case NOTIFICATION_TYPES.SESSION_REQUEST.name:
    case NOTIFICATION_TYPES.ACCEPTED_MEETING.name:
    case NOTIFICATION_TYPES.REJECTED_MEETING.name:
    case NOTIFICATION_TYPES.CANCELED_MEETING.name:
    case NOTIFICATION_TYPES.NOT_ATTENDED.name:
    case NOTIFICATION_TYPES.OTHER.name:
      return '/admin/meetings';
    default:
      return '/admin/dashboard';
  }
};

// Helper function to get notification display priority
export const getNotificationPriority = (notificationType: string): number => {
  const priorities: Record<string, number> = {
    [NOTIFICATION_TYPES.SESSION_REQUEST.name]: 1, // Highest priority
    [NOTIFICATION_TYPES.OTHER.name]: 2, // Meeting reminders
    [NOTIFICATION_TYPES.NOT_ATTENDED.name]: 3,
    [NOTIFICATION_TYPES.REJECTED_MEETING.name]: 4,
    [NOTIFICATION_TYPES.CANCELED_MEETING.name]: 5,
    [NOTIFICATION_TYPES.ACCEPTED_MEETING.name]: 6,
    [NOTIFICATION_TYPES.REJECTED_HUBER.name]: 7,
    [NOTIFICATION_TYPES.REJECTED_STORY.name]: 8,
    [NOTIFICATION_TYPES.REVIEW_STORY.name]: 9,
    [NOTIFICATION_TYPES.PUBLISH_STORY.name]: 10,
    [NOTIFICATION_TYPES.ACCOUNT.name]: 11, // Lowest priority
  };

  return priorities[notificationType] || 12;
};
