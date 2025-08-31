import { useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

import { notificationConfig } from '../private/config';
import { NotificationType } from '../private/types';
import type { INotificationItemRendererProps } from '../NotificationItemRenderer';

import Avatar from '@/components/avatar/Avatar';
import Button from '@/components/button/Button';
import { mergeClassnames } from '@/components/private/utils';
import { useAppSelector } from '@/libs/hooks';
import useNotificationActions from '@/libs/hooks/useNotificationActions';
import { Role, StatusEnum } from '@/types/common';
import { toLocaleDateString } from '@/utils/dateUtils';

export default function DefaultNotificationCard({ notification, showExtras, onClick }: INotificationItemRendererProps) {
  const cfg = notificationConfig[notification.type.name as NotificationType];

  const router = useRouter();

  const locale = useLocale();

  const {
    handleApproveOrRejectSession,
  } = useNotificationActions();

  const userInfo = useAppSelector(state => state.auth.userInfo);

  const handleApproveRequestClick = async () => {
    await handleApproveOrRejectSession(
      notification.relatedEntityId,
      StatusEnum.Approved,
    );

    if (onClick) {
      onClick();
    }
  };
  const handleRejectRequestClick = async () => {
    await handleApproveOrRejectSession(
      notification.relatedEntityId,
      StatusEnum.Rejected,
    );

    if (onClick) {
      onClick();
    }
  };
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    const relatedEntityId = notification.type.name === NotificationType.ACCOUNT_UPGRADE ? notification.sender.id : notification.relatedEntityId;
    if (cfg.route && cfg.route(relatedEntityId, userInfo?.role?.id ?? Role.LIBER) !== '') {
      router.push(cfg.route(relatedEntityId, userInfo?.role?.id ?? Role.LIBER));
    }
  };

  return (
    <button
      type="button"
      className={mergeClassnames(
        'flex w-full items-start gap-3 rounded-none bg-white py-2.5 px-4 text-left transition-colors delay-300 hover:bg-primary-98',
        'xl:py-4 xl:rounded-lg',
        notification.type.name === NotificationType.HUBER_REPORT && 'bg-red-98 hover:bg-red-90',
        !notification.seen && 'bg-green-90 xl:bg-white',
      )}
      onClick={handleClick}
    >
      <div className={mergeClassnames(notification.type.name === NotificationType.SESSION_REQUEST && 'relative')}>
        <Avatar
          imageUrl={notification.sender.id === 1
            ? '/assets/images/admin-ava.png'
            : (notification.sender.photo?.path ?? '/assets/images/ava-placeholder.png')}
          size="xl"
          className={mergeClassnames(showExtras && 'xl:!size-[72px]')}
        />
        {notification.type.name === NotificationType.SESSION_REQUEST && (
          <div className="absolute bottom-0 right-0">
            <Image
              src="/assets/icons/meeting-icon.svg"
              width={24}
              height={24}
              alt="Meeting icon"
              className="size-6 object-cover object-center"
            />
          </div>
        )}
      </div>
      <div className="flex flex-1 items-center gap-3">
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-center justify-between">
            <p className="line-clamp-2 font-medium">{cfg.getMessage(notification, userInfo?.role?.id ?? Role.LIBER)}</p>
            {showExtras && notification.type.name === NotificationType.SESSION_REQUEST && (
              <Link href="/schedule-meeting/weekly-schedule" className="text-sm font-medium text-primary-60 underline">
                See detail
              </Link>
            )}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm">{toLocaleDateString(notification.createdAt, locale === 'en' ? 'en-GB' : 'vi-VI')}</p>
            {showExtras && notification.type.name === NotificationType.STORY_REVIEW && (
              <div className="flex items-center gap-5 text-sm font-medium text-primary-50">
                <p>{`${notification.relatedEntity?.numOfRatings ?? 0} rating`}</p>
                <p>{`${notification.relatedEntity?.numOfComments ?? 0} comment`}</p>
              </div>
            )}
          </div>
          {showExtras && notification.type.name === NotificationType.HUBER_REPORT && (
            <Link href="/schedule-meeting/weekly-schedule" className="text-sm font-medium text-primary-60 underline">
              See detail
            </Link>
          )}
          {notification.type.name === NotificationType.SESSION_REQUEST && (
            <div className="flex w-full items-center gap-2">
              <Button variant="outline" size="sm" fullWidth onClick={handleRejectRequestClick}>Reject</Button>
              <Button size="sm" fullWidth onClick={handleApproveRequestClick}>Accept</Button>
            </div>
          )}
        </div>
        {!notification.seen && (
          <Image
            src={notification.type.name === NotificationType.HUBER_REPORT
              ? '/assets/icons/seal-warning.svg' : '/assets/icons/leaf.svg'}
            alt="Seen icon"
            width={20}
            height={20}
            className="hidden size-5 object-cover object-center xl:block"
          />
        )}
      </div>
    </button>
  );
}
