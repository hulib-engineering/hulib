export const NOTIFICATION_TYPES = {
  SESSION_REQUEST: { id: 1, name: 'sessionRequest' } as const,
  ACCOUNT: { id: 2, name: 'account' } as const,
  REVIEW_STORY: { id: 3, name: 'reviewStory' } as const,
  PUBLISH_STORY: { id: 4, name: 'publishStory' } as const,
  OTHER: { id: 5, name: 'other' } as const,
} as const;

type NotificationTypeName =
  (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES]['name'];
type NotificationType = {
  id: number;
  name: NotificationTypeName;
};

type NotificationUser = {
  id: number;
  fullName: string;
  file: string | null;
};

export type Notification = {
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
};

export type CreateNotificationRequest = {
  recipientId: number;
  senderId: number;
  type: string;
  relatedEntityId: number;
};
