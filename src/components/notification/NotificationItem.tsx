import clsx from 'clsx';
import { format } from 'date-fns';
import Image from 'next/image';
import React from 'react';

import Button from '../button/Button';

export type NotificationType = 'meeting' | 'review' | 'publish';

export interface NotificationProps {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  timestamp: Date;
  read: boolean;
  users: {
    id: string;
    name: string;
    avatar: string;
  }[];
  actionable?: boolean;
  storyTitle?: string;
  storyLink?: string;
}

interface NotificationItemProps {
  notification: NotificationProps;
  onMarkAsRead: (id: string) => void;
  onAction: (
    id: string,
    action: 'accept' | 'reject' | 'confirm' | 'decline',
  ) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onAction,
}) => {
  const formattedTime = format(notification.timestamp, 'MMM d HH:mm');

  return (
    <div
      className={clsx(
        'border-b p-3 last:border-b-0',
        !notification.read && 'bg-blue-100',
      )}
      role="button"
      tabIndex={0}
      onClick={() => onMarkAsRead(notification.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onMarkAsRead(notification.id);
        }
      }}
    >
      <div className="flex items-start gap-2">
        {notification.type === 'meeting' && (
          <div className="shrink-0">
            <Image
              src={
                notification.users[0]?.avatar ??
                '/assets/images/user-avatar.jpeg'
              }
              alt={notification.users[0]?.name ?? 'Unknown User'}
              className="rounded-full"
              width={56}
              height={56}
            />
          </div>
        )}

        {(notification.type === 'review' ||
          notification.type === 'publish') && (
          <div className="flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-full border-2 border-blue-500 bg-blue-100 p-1 text-white">
            <Image
              src="/assets/images/minified-HULIB-logo.png"
              alt="logo.png"
              className="h-8 w-8 rounded-full"
              width={26}
              height={32}
            />
          </div>
        )}

        <div className="min-w-0 flex-1">
          {notification.title && (
            <p className="font-medium text-blue-600">{notification.title}</p>
          )}

          <div className="text-sm">
            {notification.type === 'meeting' && (
              <p>
                <span className="font-medium">
                  {notification.users[0]?.name ?? 'Unknown User'}
                </span>{' '}
                would love to have a meeting...
              </p>
            )}

            {notification.type === 'review' && (
              <p>
                <span className="font-medium">
                  {notification.users.map((u) => u.name).join(' and ')}
                </span>{' '}
                have also reviewed your story{' '}
                {notification.storyTitle && (
                  <span className="font-medium text-blue-600">
                    {notification.storyTitle}
                  </span>
                )}
              </p>
            )}

            {notification.type === 'publish' && (
              <p>
                Your book{' '}
                {notification.storyTitle && (
                  <span className="font-medium text-blue-600">
                    {notification.storyTitle}
                  </span>
                )}{' '}
                has been successfully published.
              </p>
            )}
          </div>

          <p className="mt-1 text-xs text-gray-500">{formattedTime}</p>

          {notification.actionable && notification.type === 'meeting' && (
            <div className="mt-2 flex gap-2">
              <Button
                className="flex-1  border-gray-400 !bg-white   text-center text-sm text-blue-500"
                onClick={(e: any) => {
                  e.stopPropagation();
                  onAction(notification.id, 'decline');
                }}
              >
                Decline
              </Button>
              <Button
                className="flex-1 text-center text-sm text-white"
                onClick={(e: any) => {
                  e.stopPropagation();
                  onAction(notification.id, 'confirm');
                }}
              >
                Confirm
              </Button>
            </div>
          )}

          {notification.actionable && notification.type !== 'meeting' && (
            <div className="mt-2 flex gap-2">
              <Button
                className="flex-1  border-gray-400 !bg-white text-center   text-sm text-blue-500 "
                onClick={(e: any) => {
                  e.stopPropagation();
                  onAction(notification.id, 'reject');
                }}
              >
                Reject
              </Button>
              <Button
                className="flex-1 text-center text-sm text-white"
                onClick={(e: any) => {
                  e.stopPropagation();
                  onAction(notification.id, 'accept');
                }}
              >
                Accept
              </Button>
            </div>
          )}
        </div>

        {notification.type !== 'meeting' && !notification.read && (
          <div className="mt-2 h-2 w-2 rounded-full bg-green-500" />
        )}
      </div>
    </div>
  );
};

export default NotificationItem;
