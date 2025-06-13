'use client';

import clsx from 'clsx';
import { format } from 'date-fns';
import Image from 'next/image';
import type { FC } from 'react';

import useNotificationActions from '@/libs/hooks/useNotificationActions';
import type { Notification } from '@/libs/services/modules/notifications/notificationType';
import { StatusEnum } from '@/types/common';
import { getNotificationConfig } from '@/utils/notificationUtils';

import NotificationActions from './NotificationActions';
import NotificationAvatar from './NotificationAvatar';
import NotificationContent from './NotificationContent';

interface NotificationItemProps {
  notification: Notification;
  hideDetails?: boolean;
}

const NotificationItem: FC<NotificationItemProps> = ({
  notification,
  hideDetails = false,
}) => {
  const config = getNotificationConfig(notification.type.name);
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

  const onItemClick = () => handleNotificationClick(notification);

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

  return (
    <div
      className={clsx(
        'relative border-b p-3 last:border-b-0',
        !notification.seen && 'bg-green-90 md:bg-transparent',
        config.isClickable && 'cursor-pointer',
      )}
      {...(config.isClickable
        ? {
            role: 'button',
            tabIndex: 0,
            onClick: onItemClick,
            onKeyDown: (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onItemClick();
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

          <p className="mt-1 text-xs text-gray-500">{formattedTime}</p>

          {config.showActions && (
            <NotificationActions
              onAccept={onAccept}
              onReject={onReject}
              isLoading={isUpdatingStatus}
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default NotificationItem;
