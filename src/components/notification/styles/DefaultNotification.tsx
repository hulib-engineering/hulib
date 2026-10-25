import { PenNib, SealWarning, Warning } from '@phosphor-icons/react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import React, { useState } from 'react';

import type { INotificationItemRendererProps } from '../NotificationItemRenderer';
import NotificationRow from '../NotificationRow';
import { notificationConfig } from '../private/config';
import { NotificationType } from '../private/types';
import { Link, useRouter } from '@/libs/i18nNavigation';

import Avatar from '@/components/core/avatar/Avatar';
import { mergeClassnames } from '@/components/core/private/utils';
import HandleAppealModal from '@/layouts/admin/HandleAppealModal';
import HandleReportModal from '@/layouts/admin/HandleReportModal';
import { useAppSelector } from '@/libs/hooks';
import { Role } from '@/types/common';
import { toLocaleDateString } from '@/utils/dateUtils';

const STORY_INTERACTION_TYPES = [NotificationType.STORY_REVIEW, NotificationType.STORY_REACTION, NotificationType.STORY_SHARE];

export default function DefaultNotificationCard({ notification, onClick }: INotificationItemRendererProps) {
  const cfg = notificationConfig[notification.type.name as NotificationType] ?? notificationConfig[NotificationType.OTHER];

  const router = useRouter();

  const locale = useLocale();
  const t = useTranslations('notifications');

  const userInfo = useAppSelector(state => state.auth.userInfo);

  const [isHandleReportModalOpen, setIsHandleReportModalOpen] = useState(false);
  const [isHandleAppealModalOpen, setIsHandleAppealModalOpen] = useState(false);

  const renderUnseenIcon = () => {
    if (![NotificationType.HUBER_REPORT, NotificationType.USER_APPEAL, NotificationType.APPEAL_RESPONSE].includes(notification.type.name as NotificationType)) {
      return (
        <Image
          src="/assets/icons/leaf.svg"
          alt="Seen icon"
          width={20}
          height={20}
          className="size-4 object-cover object-center xl:size-5"
        />
      );
    } else {
      switch (notification.type.name) {
        case NotificationType.HUBER_REPORT:
          return <SealWarning weight="fill" className="text-2xl text-red-50" />;
        case NotificationType.USER_APPEAL:
          return <PenNib weight="fill" className="text-2xl text-red-50" />;
        case NotificationType.APPEAL_RESPONSE:
          if (notification.relatedEntity?.status === 'rejected') {
            return <Warning className="text-xl text-red-60" />;
          }
          return (
            <Image
              src="/assets/icons/leaf.svg"
              alt="Seen icon"
              width={20}
              height={20}
              className="size-4 object-cover object-center xl:size-5"
            />
          );
        default:
          return <Warning className="text-xl text-red-60" />;
      }
    }
  };
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    if (notification.type.name === NotificationType.HUBER_REPORT) {
      setIsHandleReportModalOpen(true);
      return;
    }
    if (notification.type.name === NotificationType.USER_APPEAL) {
      setIsHandleAppealModalOpen(true);
      return;
    }
    const relatedEntityId = notification.type.name === NotificationType.ACCOUNT_UPGRADE
      ? notification.sender.id
      : (notification.relatedEntityId ?? notification.relatedEntity?.id);
    if (cfg.route && cfg.route(relatedEntityId, userInfo?.role?.id ?? Role.LIBER) !== '') {
      router.push(cfg.route(relatedEntityId, userInfo?.role?.id ?? Role.LIBER));
    }
  };

  if (!notification) {
    return undefined;
  }

  return (
    <>
      <NotificationRow
        onClick={handleClick}
        seen={notification.seen}
        unseenIcon={renderUnseenIcon()}
        className={mergeClassnames(
          ([NotificationType.HUBER_REPORT, NotificationType.USER_APPEAL].includes(notification.type.name as NotificationType)
            || (notification.type.name === NotificationType.APPEAL_RESPONSE && notification.relatedEntity?.status === 'rejected'))
          && 'hover:bg-red-90',
          !notification.seen && (notification.type.name === NotificationType.APPEAL_RESPONSE && notification.relatedEntity?.status !== 'rejected' ? 'bg-green-90' : 'bg-red-98'),
          !notification.seen && 'xl:bg-white',
        )}
        avatar={(
          <Avatar
            imageUrl={notification.sender.id === 1
              ? '/assets/images/admin-ava.png'
              : notification.sender.photo?.path}
            name={notification.sender.fullName}
            size="xl"
            className="xl:!size-[72px]"
          />
        )}
      >
        <div className="flex items-center justify-between">
          <p
            className={mergeClassnames(
              'text-sm font-medium leading-5 tracking-[0.015em] text-neutral-10',
              'xl:text-base xl:leading-6 xl:tracking-[0.005em]',
              notification.type.name !== NotificationType.APPEAL_RESPONSE && 'line-clamp-2',
            )}
          >
            {cfg.getMessage(t, notification, userInfo?.role?.id ?? Role.LIBER)}
          </p>
        </div>
        {![NotificationType.USER_APPEAL, NotificationType.APPEAL_RESPONSE].includes(notification.type.name as NotificationType) && (
          <div className="flex items-start justify-between xl:items-center">
            <p className="text-xs font-normal leading-[14px] text-neutral-10 xl:text-sm xl:leading-[22px] xl:tracking-[0.015em]">
              {toLocaleDateString(notification.createdAt, locale === 'en' ? 'en-GB' : 'vi-VI')}
            </p>
            {STORY_INTERACTION_TYPES.includes(notification.type.name as NotificationType) && (
              <div className="flex items-center gap-5 text-sm font-medium leading-4 text-primary-60 xl:leading-5 xl:tracking-[0.015em]">
                <p>
                  {notification.type.name === NotificationType.STORY_REACTION
                    ? t('like_count', { count: notification.relatedEntity?.likeCount ?? 0 })
                    : notification.type.name === NotificationType.STORY_REVIEW
                      ? t('rating_count', { count: notification.relatedEntity?.numOfRatings ?? 0 })
                      : t('share_count', { count: notification.relatedEntity?.shareCount ?? 0 })}
                </p>
              </div>
            )}
          </div>
        )}
        {[NotificationType.HUBER_REPORT, NotificationType.USER_APPEAL].includes(notification.type.name as NotificationType) && (
          <Link
            href="#"
            className="text-sm font-medium text-primary-60 underline"
            onClick={() => notification.type.name === NotificationType.HUBER_REPORT
              ? setIsHandleReportModalOpen(true) : setIsHandleAppealModalOpen(true)}
          >
            See detail
          </Link>
        )}
      </NotificationRow>

      {/* Handle report modal */}
      {notification.type.name === NotificationType.HUBER_REPORT && (
        <HandleReportModal
          data={notification?.relatedEntity}
          open={isHandleReportModalOpen}
          onClose={() => setIsHandleReportModalOpen(false)}
        />
      )}

      {/* Handle appeal modal */}
      {notification.type.name === NotificationType.USER_APPEAL && (
        <HandleAppealModal
          data={{
            ...notification?.relatedEntity,
            reportId: notification?.relatedEntity?.moderationRelatedReport?.id ?? 0,
            reportee: notification?.sender,
          }}
          open={isHandleAppealModalOpen}
          onClose={() => setIsHandleAppealModalOpen(false)}
        />
      )}
    </>
  );
}
