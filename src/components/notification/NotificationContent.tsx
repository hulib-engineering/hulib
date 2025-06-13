'use client';

import _ from 'lodash';
import type { FC } from 'react';

import type { Notification } from '@/libs/services/modules/notifications/notificationType';
import { NOTIFICATION_TYPES } from '@/libs/services/modules/notifications/notificationType';

interface NotificationContentProps {
  notification: Notification;
  hideDetails?: boolean;
  onSeeDetail?: () => void;
}

const NotificationContent: FC<NotificationContentProps> = ({
  notification,
  hideDetails = false,
  onSeeDetail,
}) => {
  const renderContent = () => {
    switch (notification.type.name) {
      case NOTIFICATION_TYPES.SESSION_REQUEST.name:
        return (
          <div className="flex w-full flex-col md:flex-row md:items-center md:justify-between md:gap-2">
            <p>
              <span className="font-bold">
                {notification.sender.fullName ?? 'Unknown User'}
              </span>{' '}
              would love to have a meeting...
            </p>
            {!hideDetails && (
              <button
                type="button"
                className="mt-1 text-xs text-primary-60 underline md:mt-0"
                onClick={onSeeDetail}
              >
                See detail
              </button>
            )}
          </div>
        );

      case NOTIFICATION_TYPES.REVIEW_STORY.name:
        return (
          <p>
            <span className="font-bold">{notification.sender.fullName}</span>{' '}
            have also reviewed your story{' '}
            {notification.relatedEntity?.title && (
              <span className="font-medium text-blue-600">
                {_.truncate(notification.relatedEntity.title, { length: 50 })}
              </span>
            )}
          </p>
        );

      case NOTIFICATION_TYPES.PUBLISH_STORY.name:
        return (
          <p>
            Your book{' '}
            {notification.relatedEntity?.title && (
              <span className="font-bold text-blue-600">
                {notification.relatedEntity.title}
              </span>
            )}{' '}
            has been successfully published.
          </p>
        );

      case NOTIFICATION_TYPES.ACCOUNT.name:
        return (
          <p>
            <span className="font-bold">
              Your registration to become a Huber{' '}
            </span>
            has been accepted. Welcome onboard!
          </p>
        );

      default:
        return <p>New notification</p>;
    }
  };

  return <div className="w-full text-sm">{renderContent()}</div>;
};

export default NotificationContent;
