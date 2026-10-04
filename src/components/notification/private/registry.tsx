import type { ComponentType } from 'react';
import { NotificationType, isDecidedSessionStatus } from './types';
import DefaultNotificationCard from '@/components/notification/styles/DefaultNotification';
import type { Notification } from '@/libs/services/modules/notifications/notificationType';
import InformativeNotificationCard from '@/components/notification/styles/InformativeNotification';
import MeetingRequestNotificationCard from '@/components/notification/styles/MeetingRequestNotification';
import SessionDecisionNotificationCard from '@/components/notification/styles/SessionDecisionNotification';
import SessionOutcomeNotificationCard from '@/components/notification/styles/SessionOutcomeNotification';
import SystemNotificationCard from '@/components/notification/styles/SystemNotification';
import UpdateTimeSlotReminderNotificationCard from '@/components/notification/styles/UpdateTimeSlotReminderNotification';

type NotificationComponentProps = {
  notification: Notification;
  onClick: () => void;
  showExtras?: boolean;
  onRequestDecision?: (type: 'accept' | 'reject', notification: Notification) => void;
};

export const notificationRegistry: Record<
  NotificationType,
  ComponentType<NotificationComponentProps>
> = {
  [NotificationType.ACCOUNT_UPGRADE]: DefaultNotificationCard,
  // [NotificationType.STORY_PUBLISH_REQUEST]: DefaultNotificationCard,
  [NotificationType.SESSION_REQUEST]: MeetingRequestNotificationCard,
  [NotificationType.STORY_REVIEW]: DefaultNotificationCard,
  [NotificationType.STORY_REACTION]: DefaultNotificationCard,
  [NotificationType.STORY_SHARE]: DefaultNotificationCard,
  [NotificationType.STORY_PUBLISH]: DefaultNotificationCard,
  [NotificationType.STORY_REJECTION]: InformativeNotificationCard,
  [NotificationType.HUBER_REPORT]: DefaultNotificationCard,
  [NotificationType.HUBER_WARNING]: InformativeNotificationCard,
  [NotificationType.HUBER_REJECTION]: InformativeNotificationCard,
  [NotificationType.SESSION_REJECTION]: SessionDecisionNotificationCard,
  [NotificationType.SESSION_APPROVAL]: SessionDecisionNotificationCard,
  [NotificationType.SESSION_MISS]: InformativeNotificationCard,
  [NotificationType.HUBER_NO_SHOW]: SessionOutcomeNotificationCard,
  [NotificationType.SESSION_AUTO_CANCELLATION]: SessionOutcomeNotificationCard,
  [NotificationType.SESSION_CANCELLATION]: InformativeNotificationCard,
  [NotificationType.SESSION_COMPLETION]: SystemNotificationCard,
  [NotificationType.USER_APPEAL]: DefaultNotificationCard,
  [NotificationType.APPEAL_RESPONSE]: DefaultNotificationCard,
  [NotificationType.OTHER]: SystemNotificationCard,
  [NotificationType.UPDATE_TIME_SLOT_REMINDER]: UpdateTimeSlotReminderNotificationCard,
};

/**
 * Picks the card for a notification.
 *
 * A plain registry lookup is not enough: the backend sends accept/decline decisions under the
 * `sessionRequest` type, telling them apart only by `relatedEntity.sessionStatus`. A
 * `sessionRequest` that has already been decided is therefore rendered by the decision card
 * (the accept/reject design) rather than the meeting-request card, which is only meaningful
 * while the request is still pending.
 */
export const resolveNotificationComponent = (
  notification: Notification,
): ComponentType<NotificationComponentProps> => {
  const type = notification.type.name as NotificationType;

  if (type === NotificationType.SESSION_REQUEST && isDecidedSessionStatus(notification.relatedEntity?.sessionStatus)) {
    return notificationRegistry[NotificationType.SESSION_APPROVAL];
  }

  return notificationRegistry[type] ?? notificationRegistry[NotificationType.OTHER];
};
