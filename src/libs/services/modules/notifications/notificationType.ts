export const NOTIFICATION_TYPES = {
  SESSION_REQUEST: { id: 1, name: 'sessionRequest' } as const,
  ACCOUNT: { id: 2, name: 'account' } as const,
  REVIEW_STORY: { id: 3, name: 'reviewStory' } as const,
  PUBLISH_STORY: { id: 4, name: 'publishStory' } as const,
  OTHER: { id: 5, name: 'other' } as const,
} as const;

export type NotificationTypeName =
  (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES]['name'];
export type NotificationTypeKey = keyof typeof NOTIFICATION_TYPES;

export interface NotificationType {
  id: number;
  name: NotificationTypeName;
}

export interface NotificationUser {
  id: number;
  fullName: string;
  file: string | null;
}

export interface Notification {
  id: number;
  seen: boolean;
  relatedEntityId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  type: NotificationType;
  recipient: NotificationUser;
  sender: NotificationUser;
  relatedEntity: any;
}

export interface CreateNotificationRequest {
  recipientId: number;
  senderId: number;
  type: string;
  relatedEntityId: number;
}

// Helper function to get notification type key
export const getNotificationTypeKey = (
  typeId: number,
): NotificationTypeKey | undefined => {
  return (Object.keys(NOTIFICATION_TYPES) as NotificationTypeKey[]).find(
    (key) => NOTIFICATION_TYPES[key].id === typeId,
  );
};
