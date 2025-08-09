export const NOTIFICATION_TYPES = {
  // Existing types
  SESSION_REQUEST: { id: 1, name: 'sessionRequest' } as const,
  ACCOUNT: { id: 2, name: 'account' } as const,
  REVIEW_STORY: { id: 3, name: 'reviewStory' } as const,
  PUBLISH_STORY: { id: 4, name: 'publishStory' } as const,
  OTHER: { id: 5, name: 'other' } as const,

  // New specific notification types
  REJECTED_HUBER: { id: 6, name: 'rejectedHuber' } as const,
  ACCEPTED_MEETING: { id: 7, name: 'acceptedMeeting' } as const,
  REJECTED_MEETING: { id: 8, name: 'rejectedMeeting' } as const,
  CANCELED_MEETING: { id: 9, name: 'canceledMeeting' } as const,
  NOT_ATTENDED: { id: 10, name: 'notAttended' } as const,
  REJECTED_STORY: { id: 11, name: 'rejectedStory' } as const,
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

type RelatedEntity = {
  id?: number;
  title?: string;

  // Meeting/Session specific fields
  storyTitle?: string;
  sessionUrl?: string;
  scheduledTime?: string;
  reason?: string; // For rejections/cancellations

  // Story specific fields
  numOfRatings?: number;
  numOfComments?: number;

  // Meeting details for accepted meetings
  from?: string;
  time?: string;
  huber?: string;

  // Additional metadata
  createdAt?: string;
  updatedAt?: string;
  sessionStatus?: string; // Keep for backward compatibility
};

export type Notification = {
  id: number;
  seen: boolean;
  relatedEntityId: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  type: NotificationType;
  recipient: NotificationUser;
  sender: NotificationUser;
  relatedEntity: RelatedEntity | null;
};

export type CreateNotificationRequest = {
  recipientId: number;
  senderId: number;
  type: string;
  relatedEntityId?: number;
  metadata?: Record<string, any>;
};
