'use client';

import { format } from 'date-fns';
import Image from 'next/image';
import type { FC } from 'react';

import NotificationActions from './NotificationActions';
import NotificationAvatar from './NotificationAvatar';
import NotificationContent from './NotificationContent';
import { mergeClassnames } from '@/components/private/utils';
import useNotificationActions from '@/libs/hooks/useNotificationActions';
import type { Notification } from '@/libs/services/modules/notifications/notificationType';
import { NOTIFICATION_TYPES } from '@/libs/services/modules/notifications/notificationType';
import { StatusEnum } from '@/types/common';
import { getNotificationConfig } from '@/utils/notificationUtils';

type NotificationItemProps = {
  notification: Notification;
  hideDetails?: boolean;
  hideRateNumber?: boolean;
  onClick?: () => void;
  onMarkAsSeen?: (id: number) => void;
  className?: string;
};

const NotificationItem: FC<NotificationItemProps> = ({
  notification,
  hideRateNumber = false,
  hideDetails = false,
  onClick,
  onMarkAsSeen,
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
    try {
      if (!notification.seen && onMarkAsSeen) {
        onMarkAsSeen(notification.id);
      }

      await handleNotificationClick(notification);

      if (onClick) {
        onClick();
      }
    } catch (error) {
      console.error('Error handling notification click:', error);
    }
  };

  const onSeeDetailClick = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    try {
      if (!notification.seen && onMarkAsSeen) {
        onMarkAsSeen(notification.id);
      }

      await handleSeeDetail(notification);
    } catch (error) {
      console.error('Error handling see detail click:', error);
    }
  };

  const onAccept = async () => {
    if (!notification.relatedEntityId) {
      console.error('No related entity ID for acceptance');
      return;
    }

    try {
      await handleStatusChange(
        notification.relatedEntityId,
        StatusEnum.Approved,
        notification,
      );
    } catch (error) {
      console.error('Error accepting notification:', error);
    }
  };

  const onReject = async () => {
    if (!notification.relatedEntityId) {
      console.error('No related entity ID for rejection');
      return;
    }

    try {
      await handleStatusChange(
        notification.relatedEntityId,
        StatusEnum.Rejected,
        notification,
      );
    } catch (error) {
      console.error('Error rejecting notification:', error);
    }
  };

  const isReviewStory = notification.type.name === NOTIFICATION_TYPES.REVIEW_STORY.name;
  const isSessionRequest = notification.type.name === NOTIFICATION_TYPES.SESSION_REQUEST.name;
  const isPendingSession = isSessionRequest && notification.relatedEntity?.sessionStatus === StatusEnum.Pending;

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
      {/* Unseen indicator */}
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

      {/* Priority indicator for urgent notifications */}
      {isPendingSession && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2">
          <div className="h-8 w-1 rounded-r bg-primary-50"></div>
        </div>
      )}

      <div className="flex items-start gap-3">
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
          {/* Time and metadata */}
          <div className="relative mt-1">
            <p className="text-sm text-gray-500">{formattedTime}</p>
            {isReviewStory && !hideRateNumber && notification.relatedEntity && (
              <div className="absolute right-[80px] top-0 flex items-center gap-4 text-sm text-primary-50">
                <span>
                  {notification.relatedEntity.numOfRatings}
                  {' '}
                  rating
                </span>
                <span>
                  {notification.relatedEntity.numOfComments}
                  {' '}
                  comment
                </span>
              </div>
            )}
          </div>

          {config.showActions && (
            <div className="mt-3">
              <NotificationActions
                onAccept={onAccept}
                onReject={onReject}
                isLoading={isUpdatingStatus}
                notificationType={notification.type.name}
                sessionId={notification.relatedEntityId || undefined}
              />
            </div>
          )}
        </div>
      </div>

      {/* Loading overlay */}
      {isUpdatingStatus && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50">
          <div className="animate-spin size-6 rounded-full border-2 border-primary-50 border-t-transparent"></div>
        </div>
      )}
    </div>
  );
};

export default NotificationItem;
