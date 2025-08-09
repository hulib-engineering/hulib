'use client';

import _ from 'lodash';
import { useTranslations } from 'next-intl';
import type { FC } from 'react';

import { useAppSelector } from '@/libs/hooks';
import type { Notification } from '@/libs/services/modules/notifications/notificationType';
import { NOTIFICATION_TYPES } from '@/libs/services/modules/notifications/notificationType';
import { useGetReadingSessionByIdQuery } from '@/libs/services/modules/reading-session';
import { Role } from '@/types/common';

type NotificationContentProps = {
  notification: Notification;
  hideDetails?: boolean;
  onSeeDetail?: () => void;
};

const NotificationContent: FC<NotificationContentProps> = ({
  notification,
  hideDetails = false,
  onSeeDetail,
}) => {
  const { role } = useAppSelector(state => state.auth.userInfo);
  const userInfo = useAppSelector(state => state.auth.userInfo);
  const t = useTranslations('notifications');

  const shouldFetchReadingSession
    = notification.type.name === NOTIFICATION_TYPES.OTHER.name
      && notification.relatedEntityId;

  const { data: readingSession } = useGetReadingSessionByIdQuery(
    {
      id: notification.relatedEntityId || 0,
    },
    {
      skip: !shouldFetchReadingSession,
    },
  );

  const renderOtherNotification = () => {
    if (!readingSession) {
      return (
        <p>
          <span className="font-bold">{t('upComming.title')}</span>
          <br />
          <span className="text-sm text-gray-600">Loading meeting details...</span>
        </p>
      );
    }

    const isLiber = userInfo?.fullName === readingSession?.humanBook?.fullName;
    const meetingType = isLiber ? 'Liber' : 'Huber';
    const partnerName = isLiber
      ? readingSession?.reader?.fullName
      : readingSession?.humanBook?.fullName;

    return (
      <>
        <p>
          <span className="font-bold">{t('upComming.title', { default: 'Upcoming Meeting' })}</span>
        </p>
        <p>
          {t('upComming.meetingWith', { default: 'Meeting with' })}
          {' '}
          <span className="text-yellow-50">
            {meetingType}
            {' '}
            {partnerName}
          </span>
          {' '}
          {t('upComming.startingNow', { default: 'starting now.' })}
          {' '}
          {t('upComming.encouragement', { default: 'Good luck!' })}
          {' '}
          {t('upComming.callToAction', { default: 'Click to join.' })}
        </p>
      </>
    );
  };

  const renderContent = () => {
    switch (notification.type.name) {
      case NOTIFICATION_TYPES.SESSION_REQUEST.name:
        return (
          <div className="flex w-full flex-col md:flex-row md:items-center md:justify-between md:gap-2">
            <p>
              <span className="font-bold">
                {notification.sender?.fullName ?? t('unknownUser', { default: 'Unknown User' })}
              </span>
              {' '}
              {t('sessionRequest.message', { default: 'sent you a meeting request' })}
            </p>
            {!hideDetails && (
              <button
                type="button"
                className="mt-1 text-xs text-primary-60 underline md:mt-0"
                onClick={onSeeDetail}
              >
                {t('seeDetail', { default: 'See Detail' })}
              </button>
            )}
          </div>
        );

      case NOTIFICATION_TYPES.REJECTED_MEETING.name:
        return (
          <div className="w-full">
            <h3 className="mb-2 font-bold text-red-60">Your request for meeting is rejected</h3>
            <p className="mb-2 text-sm ">
              Unfortunately,
              {' '}
              <span className="font-medium text-primary-60">{notification.sender?.fullName || 'the user'}</span>
              {' '}
              isn't available for this meeting.
              {notification.relatedEntity?.scheduledTime && ` (${notification.relatedEntity.scheduledTime})`}
              {notification.relatedEntity?.reason && '. Reason:'}
            </p>
            {notification.relatedEntity?.reason && (
              <div className="mb-3 rounded-lg border p-3">
                <span className="text-sm">{notification.relatedEntity.reason}</span>
              </div>
            )}
          </div>
        );

      case NOTIFICATION_TYPES.ACCEPTED_MEETING.name:
        return (
          <div className="w-full">
            <h3 className="mb-2 font-bold text-primary-60">Your request for meeting is accepted</h3>
            <p className="mb-3 text-sm">
              We're happy to let you know that
              {' '}
              <span className="font-medium text-primary-60">{notification.sender?.fullName || 'the user'}</span>
              {' '}
              has accepted your meeting request. Don't forget to join the meeting on time.
            </p>
            {notification.relatedEntity && (
              <div className="rounded-lg border border-yellow-80 bg-yellow-98 p-3 text-sm">
                <div className="flex justify-between py-1">
                  <span className="text-neutral-50">From:</span>
                  <span className="font-medium text-primary-60">
                    {notification.relatedEntity.from || notification.relatedEntity.storyTitle || 'Meeting Request'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-neutral-50">Time:</span>
                  <span className="font-medium">
                    {notification.relatedEntity.time || notification.relatedEntity.scheduledTime || 'TBD'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-neutral-50">Huber:</span>
                  <span className="font-medium">
                    {notification.relatedEntity.huber || notification.sender?.fullName || 'TBD'}
                  </span>
                </div>
              </div>
            )}
          </div>
        );

      case NOTIFICATION_TYPES.CANCELED_MEETING.name:
        return (
          <div className="w-full">
            <h3 className="mb-2 font-bold text-red-60">The meeting is canceled</h3>
            <p className="mb-2 text-sm">
              We want to notify you that
              {' '}
              <span className="font-medium text-primary-60">{notification.sender?.fullName || 'the user'}</span>
              {' '}
              has canceled the meeting
              {notification.relatedEntity?.scheduledTime && ` (${notification.relatedEntity.scheduledTime})`}
              {notification.relatedEntity?.reason && '. Reason:'}
            </p>
            {notification.relatedEntity?.reason && (
              <div className="rounded-lg border p-3">
                <span className="text-sm">{notification.relatedEntity.reason}</span>
              </div>
            )}
          </div>
        );

      case NOTIFICATION_TYPES.NOT_ATTENDED.name:
        return (
          <div className="w-full">
            <h3 className="mb-2 font-bold text-orange-40">Meeting not attended!</h3>
            <p className="text-sm">
              You didn't join the meeting
              {notification.relatedEntity?.scheduledTime && ` (${notification.relatedEntity.scheduledTime})`}
              . We'd love to know what happened, so we can improve the experience for everyone.
            </p>
          </div>
        );

      case NOTIFICATION_TYPES.REJECTED_HUBER.name:
        return (
          <div className="w-full">
            <h3 className="mb-2 font-bold text-red-60">Huber Registration did not go through.</h3>
            <p className="mb-2 text-sm">
              We're sorry, but your registration to become Huber was not successful
              {notification.relatedEntity?.reason && '. Reason:'}
            </p>
            {notification.relatedEntity?.reason && (
              <div className="mb-3 rounded-lg border border-red-60 bg-neutral-98 p-3">
                <span className="text-sm text-neutral-40">{notification.relatedEntity.reason}</span>
              </div>
            )}
          </div>
        );

      case NOTIFICATION_TYPES.REJECTED_STORY.name:
        return (
          <div className="w-full">
            <h3 className="mb-2 font-bold text-red-60">
              Your story
              {notification.relatedEntity?.title && ` "${_.truncate(notification.relatedEntity.title, { length: 50 })}"`}
              {' '}
              has not been published successfully
              {notification.relatedEntity?.reason && '. Reason:'}
            </h3>
            {notification.relatedEntity?.reason && (
              <div className="mb-3 rounded-lg border border-red-200 bg-red-50 p-3">
                <span className="text-sm text-red-700">{notification.relatedEntity.reason}</span>
              </div>
            )}
          </div>
        );

      case NOTIFICATION_TYPES.REVIEW_STORY.name:
        return (
          <div className="w-full">
            <p>
              <span className="font-bold">{notification.sender?.fullName || 'Someone'}</span>
              {' '}
              {t('reviewStory.message', { default: 'reviewed your story' })}
              {notification.relatedEntity?.title && (
                <span className="font-bold text-primary-60">
                  {' "'}
                  {_.truncate(notification.relatedEntity.title, { length: 50 })}
                  "
                </span>
              )}
            </p>
          </div>
        );

      case NOTIFICATION_TYPES.PUBLISH_STORY.name:
        return (
          <p>
            {t('publishStory.user.prefix', { default: 'Your story' })}
            {notification.relatedEntity?.title && (
              <span className="font-bold text-primary-60">
                {' "'}
                {notification.relatedEntity.title}
                "
              </span>
            )}
            {' '}
            {t('publishStory.user.suffix', { default: 'has been published successfully' })}
          </p>
        );

      case NOTIFICATION_TYPES.ACCOUNT.name:
        return (
          <p>
            <span className="font-bold">
              {t('account.user.prefix', { default: 'Account notification:' })}
              {' '}
            </span>
            {t('account.user.suffix', { default: 'Your account status has been updated' })}
          </p>
        );

      case NOTIFICATION_TYPES.OTHER.name:
        return renderOtherNotification();

      default:
        return <p>{t('newNotification', { default: 'New notification' })}</p>;
    }
  };

  const renderAdminNotifContent = () => {
    switch (notification.type.name) {
      case NOTIFICATION_TYPES.PUBLISH_STORY.name:
        return (
          <p>
            <span className="font-bold">
              {`${notification.sender?.fullName || 'User'} `}
            </span>
            {t('publishStory.admin.message', { default: 'submitted a story for review' })}
            {notification.relatedEntity?.title && (
              <span className="font-bold text-primary-60">
                {' "'}
                {notification.relatedEntity.title}
                "
              </span>
            )}
          </p>
        );

      case NOTIFICATION_TYPES.ACCOUNT.name:
        return (
          <p>
            <span className="font-bold">
              {`${notification.sender?.fullName || 'User'} `}
            </span>
            {t('account.admin.message', { default: 'requires account review' })}
          </p>
        );

      default:
        return <p>{t('newNotification', { default: 'New notification' })}</p>;
    }
  };

  return (
    <div className="w-full text-sm">
      {role?.id === Role.ADMIN ? renderAdminNotifContent() : renderContent()}
    </div>
  );
};

export default NotificationContent;
