import clsx from 'clsx';
import { format } from 'date-fns';
import _ from 'lodash';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';

import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';
import { useUpdateNotificationMutation } from '@/libs/services/modules/notifications';
import type { Notification } from '@/libs/services/modules/notifications/notificationType';
import { NOTIFICATION_TYPES } from '@/libs/services/modules/notifications/notificationType';
import { useUpdateReadingSessionMutation } from '@/libs/services/modules/reading-session';
import type { StatusType } from '@/libs/services/modules/reading-session/createNewReadingSession';
import { StatusEnum } from '@/types/common';

interface NotificationItemProps {
  notification: Notification;
  hideDetails?: boolean;
}

const NotificationItem: FC<NotificationItemProps> = ({
  notification,
  hideDetails = false,
}) => {
  const router = useRouter();
  const [updateStatus, { isLoading }] = useUpdateReadingSessionMutation();
  const [updateNotification] = useUpdateNotificationMutation();
  const formattedTime = format(new Date(notification.createdAt), 'MMM d HH:mm');

  const handleStatusChange = async (
    sessionId: number,
    newStatus: StatusType,
  ) => {
    try {
      const payload: any = {
        id: sessionId,
        sessionStatus: newStatus,
      };

      await updateStatus(payload).unwrap();
      pushSuccess('Status updated successfully!');
    } catch (error) {
      pushError('Failed to update status. Please try again.');
    }
  };

  const handleNotificationClick = async () => {
    if (
      notification.type.name === NOTIFICATION_TYPES.PUBLISH_STORY.name ||
      notification.type.name === NOTIFICATION_TYPES.REVIEW_STORY.name ||
      notification.type.name === NOTIFICATION_TYPES.ACCOUNT.name
    ) {
      if (!notification.seen) {
        await updateNotification({ id: notification.id.toString() }).unwrap();
      }

      if (notification.type.name === NOTIFICATION_TYPES.ACCOUNT.name) {
        router.push('/profile');
      } else if (notification.relatedEntityId) {
        router.push(`/explore-story/${notification.relatedEntityId}`);
      }
    }
  };

  const isClickableNotification =
    notification.type.name === NOTIFICATION_TYPES.PUBLISH_STORY.name ||
    notification.type.name === NOTIFICATION_TYPES.REVIEW_STORY.name;

  return (
    <div
      className={clsx(
        'relative border-b p-3 last:border-b-0',
        !notification.seen && 'bg-green-90 md:bg-transparent',
        isClickableNotification && 'cursor-pointer',
      )}
      role="button"
      tabIndex={0}
      onClick={handleNotificationClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleNotificationClick();
        }
      }}
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
        {notification.type.name === NOTIFICATION_TYPES.SESSION_REQUEST.name && (
          <div className="relative shrink-0">
            <Image
              src={
                notification.sender.file ?? '/assets/images/user-avatar.jpeg'
              }
              alt={notification.sender.fullName ?? 'Unknown User'}
              className="rounded-full"
              width={56}
              height={56}
            />
            <Image
              src="/assets/images/meeting-icon.png"
              alt="Meeting icon"
              className="absolute bottom-0 right-0 rounded-sm"
              width={24}
              height={24}
            />
          </div>
        )}

        {(notification.type.name === NOTIFICATION_TYPES.REVIEW_STORY.name ||
          notification.type.name === NOTIFICATION_TYPES.PUBLISH_STORY.name ||
          notification.type.name === NOTIFICATION_TYPES.ACCOUNT.name) && (
          <div className="flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-full border-2 border-blue-500 bg-blue-100 p-1 text-white">
            <Image
              src="/assets/images/minified-HULIB-logo.png"
              alt="HULIB logo"
              className="h-8 w-8 rounded-full"
              width={26}
              height={32}
            />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <div className="w-full text-sm">
              {notification.type.name ===
                NOTIFICATION_TYPES.SESSION_REQUEST.name && (
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
                      onClick={() =>
                        router.push('/schedule-meeting/weekly-schedule')
                      }
                    >
                      See detail
                    </button>
                  )}
                </div>
              )}

              {notification.type.name ===
                NOTIFICATION_TYPES.REVIEW_STORY.name && (
                <p>
                  <span className="font-bold">
                    {notification.sender.fullName}
                  </span>{' '}
                  have also reviewed your story{' '}
                  {notification.relatedEntity?.title && (
                    <span className="font-medium text-blue-600">
                      {_.truncate(notification.relatedEntity.title, {
                        length: 50,
                      })}
                    </span>
                  )}
                </p>
              )}

              {notification.type.name ===
                NOTIFICATION_TYPES.PUBLISH_STORY.name && (
                <p>
                  Your book{' '}
                  {notification.relatedEntity?.title && (
                    <span className="font-bold text-blue-600">
                      {notification.relatedEntity.title}
                    </span>
                  )}{' '}
                  has been successfully published.
                </p>
              )}

              {notification.type.name === NOTIFICATION_TYPES.ACCOUNT.name && (
                <p>
                  <span className="font-bold">
                    Your registration to become a Huber{' '}
                  </span>
                  has been accepted. Welcome onboard!
                </p>
              )}
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500">{formattedTime}</p>

          {notification.type.name ===
            NOTIFICATION_TYPES.SESSION_REQUEST.name && (
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                className="flex-1 rounded-[100px] border border-neutral-variant-80 !bg-white px-3 py-2 text-center   text-sm text-primary-50 "
                onClick={() =>
                  handleStatusChange(
                    notification?.relatedEntityId,
                    StatusEnum.Rejected,
                  )
                }
                disabled={isLoading}
              >
                Reject
              </button>
              <button
                type="button"
                className="flex-1 rounded-[100px] bg-primary-50 px-3 py-2 text-center text-sm text-white"
                onClick={() =>
                  handleStatusChange(
                    notification?.relatedEntityId,
                    StatusEnum.Approved,
                  )
                }
                disabled={isLoading}
              >
                Accept
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
