'use client';

import { format } from 'date-fns';
import Image from 'next/image';
import type { FC } from 'react';

import { mergeClassnames } from '@/components/private/utils';
import useNotificationActions from '@/libs/hooks/useNotificationActions';
import type { Notification } from '@/libs/services/modules/notifications/notificationType';
import { NOTIFICATION_TYPES } from '@/libs/services/modules/notifications/notificationType';
import { StatusEnum } from '@/types/common';
import { getNotificationConfig } from '@/utils/notificationUtils';

import NotificationActions from './NotificationActions';
import NotificationAvatar from './NotificationAvatar';
import NotificationContent from './NotificationContent';

interface NotificationItemProps {
  notification: Notification;
  hideDetails?: boolean;
  hideRateNumber?: boolean;
  onClick?: () => void;
}

const NotificationItem: FC<NotificationItemProps> = ({
  notification,
  hideRateNumber = false,
  hideDetails = false,
  onClick,
}) => {
  const config = getNotificationConfig(
    notification.type.name,
    notification.relatedEntity?.sessionStatus,
  );
  const {
    handleNotificationClick,
    handleStatusChange,
    handleSeeDetail,
    isUpdatingStatus,
  } = useNotificationActions();

  const formattedTime = format(
    new Date(notification.createdAt),
    'EEE d MMM HH:mm',
  );

  const onItemClick = async () => {
    await handleNotificationClick(notification);
    if (onClick) {
      onClick();
    }
  };

  const onSeeDetailClick = () => handleSeeDetail(notification);
  const onAccept = () =>
    handleStatusChange(
      notification.relatedEntityId,
      StatusEnum.Approved,
      notification,
    );
  const onReject = () =>
    handleStatusChange(
      notification.relatedEntityId,
      StatusEnum.Rejected,
      notification,
    );

  const isReviewStory =
    notification.type.name === NOTIFICATION_TYPES.REVIEW_STORY.name;
  return (
    <div
      className={mergeClassnames(
        'relative border-b p-3 last:border-b-0',
        !notification.seen && 'bg-green-90 md:bg-transparent',
        config.isClickable && 'cursor-pointer',
      )}
      {...(config.isClickable
        ? {
            role: 'button',
            tabIndex: 0,
            onClick: onItemClick,
            onKeyDown: async (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                await onItemClick();
              }
            },
          }
        : {})}
    >
      {!notification.seen && (
        <div className="absolute right-4 top-1/2 hidden -translate-y-1/2 md:block">
          <Image
            src="/assets/icons/leaf.svg"
            alt="Unseen"
            className="rounded-full"
            width={16}
            height={16}
          />
        </div>
      )}

      <div className="flex items-start gap-2">
        {config.showAvatar && (
          <NotificationAvatar notification={notification} />
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <NotificationContent
              notification={notification}
              hideDetails={hideDetails}
              onSeeDetail={onSeeDetailClick}
            />
          </div>

          <div className="relative mt-1">
            <p className="text-sm text-gray-500">{formattedTime}</p>
            {isReviewStory && !hideRateNumber && notification.relatedEntity && (
              <div className="absolute right-[80px] top-0 flex items-center gap-4 text-sm text-primary-50">
                <span>{notification.relatedEntity.numOfRatings} rating</span>
                <span>{notification.relatedEntity.numOfComments} comment</span>
              </div>
            )}
          </div>

          {config.showActions && (
            <NotificationActions
              onAccept={onAccept}
              onReject={onReject}
              isLoading={isUpdatingStatus}
              notificationType={notification.type.name}
              sessionId={notification.relatedEntityId}
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default NotificationItem;
