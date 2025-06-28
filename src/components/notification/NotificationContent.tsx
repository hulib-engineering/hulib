'use client';

import _ from 'lodash';
import { useTranslations } from 'next-intl';
import type { FC } from 'react';

import { useAppSelector } from '@/libs/hooks';
import type { Notification } from '@/libs/services/modules/notifications/notificationType';
import { NOTIFICATION_TYPES } from '@/libs/services/modules/notifications/notificationType';
import { Role } from '@/types/common';

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
  const { role } = useAppSelector((state) => state.auth.userInfo);
  const t = useTranslations('notifications');

  const renderContent = () => {
    switch (notification.type.name) {
      case NOTIFICATION_TYPES.SESSION_REQUEST.name:
        return (
          <div className="flex w-full flex-col md:flex-row md:items-center md:justify-between md:gap-2">
            <p>
              <span className="font-bold">
                {notification.sender.fullName ?? t('unknownUser')}
              </span>{' '}
              {t('sessionRequest.message')}
            </p>
            {!hideDetails && (
              <button
                type="button"
                className="mt-1 text-xs text-primary-60 underline md:mt-0"
                onClick={onSeeDetail}
              >
                {t('seeDetail')}
              </button>
            )}
          </div>
        );

      case NOTIFICATION_TYPES.REVIEW_STORY.name:
        return (
          <div className="w-full">
            <p>
              <span className="font-bold">{notification.sender.fullName}</span>{' '}
              {t('reviewStory.message')}{' '}
              {notification.relatedEntity?.title && (
                <span className="font-bold text-primary-60">
                  &ldquo;
                  {_.truncate(notification.relatedEntity.title, { length: 50 })}
                  &rdquo;
                </span>
              )}
            </p>
          </div>
        );

      case NOTIFICATION_TYPES.PUBLISH_STORY.name:
        return (
          <p>
            {t('publishStory.user.prefix')}{' '}
            {notification.relatedEntity?.title && (
              <span className="font-bold text-primary-60">
                &ldquo;{notification.relatedEntity.title}&rdquo;
              </span>
            )}{' '}
            {t('publishStory.user.suffix')}
          </p>
        );

      case NOTIFICATION_TYPES.ACCOUNT.name:
        return (
          <p>
            <span className="font-bold">{t('account.user.prefix')} </span>
            {t('account.user.suffix')}
          </p>
        );

      default:
        return <p>{t('newNotification')}</p>;
    }
  };

  const renderAdminNotifContent = () => {
    switch (notification.type.name) {
      case NOTIFICATION_TYPES.PUBLISH_STORY.name:
        return (
          <p>
            <span className="font-bold">
              {`${notification.sender.fullName} `}
            </span>
            {t('publishStory.admin.message')}{' '}
            {notification.relatedEntity?.title && (
              <span className="font-bold text-primary-60">
                &ldquo;{notification.relatedEntity.title}&rdquo;
              </span>
            )}
          </p>
        );

      case NOTIFICATION_TYPES.ACCOUNT.name:
        return (
          <p>
            <span className="font-bold">
              {`${notification.sender.fullName} `}
            </span>
            {t('account.admin.message')}
          </p>
        );

      default:
        return <p>{t('newNotification')}</p>;
    }
  };

  return (
    <div className="w-full text-sm">
      {role.id === Role.ADMIN ? renderAdminNotifContent() : renderContent()}
    </div>
  );
};

export default NotificationContent;
