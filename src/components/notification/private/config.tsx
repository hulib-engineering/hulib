import Image from 'next/image';
import type { ReactNode } from 'react';
import React from 'react';

import { format } from 'date-fns';
import type { useTranslations } from 'next-intl';
import { NotificationType } from './types';

import type { Notification } from '@/libs/services/modules/notifications/notificationType';
import { toLocaleDateString } from '@/utils/dateUtils';
import { Role } from '@/types/common';

type TFunction = ReturnType<typeof useTranslations<'notifications'>>;

type NotificationConfig = {
  [_K in NotificationType]: {
    getMessage: (t: TFunction, m: Notification, roleId?: number) => ReactNode;
    route?: (relatedEntityId: number, roleId?: number) => string;
    title?: ReactNode | ((t: TFunction) => ReactNode);
  };
};

export const notificationConfig: NotificationConfig = {
  [NotificationType.ACCOUNT_UPGRADE]: {
    getMessage: (t, m, roleId) => (roleId === Role.LIBER ? (
      <>{t('registration_accepted')}</>
    ) : (
      <>{t('registration_submitted', { name: m?.sender.fullName })}</>
    )),
    route: (relatedEntityId: number, roleId?: number) => (roleId && roleId === Role.ADMIN)
      ? `/admin/users/approval/${relatedEntityId}` : '',
  },
  [NotificationType.SESSION_REQUEST]: {
    getMessage: (t, m) => (
      <>{t('session_request', { name: m.sender.fullName })}</>
    ),
  },
  [NotificationType.STORY_REVIEW]: {
    getMessage: (t, m) => (
      <>{t('story_reviewed', { name: m.sender.fullName, title: m.relatedEntity?.title ?? '' })}</>
    ),
  },
  [NotificationType.STORY_REACTION]: {
    getMessage: (t, m) => (
      <>{t('story_reacted', { name: m.sender.fullName, title: m.relatedEntity?.title ?? '' })}</>
    ),
    route: relatedEntityId => `/explore-story/${relatedEntityId}`,
  },
  [NotificationType.STORY_SHARE]: {
    getMessage: (t, m) => (
      <>{t('story_shared', { name: m.sender.fullName, title: m.relatedEntity?.title ?? '' })}</>
    ),
    route: relatedEntityId => `/explore-story/${relatedEntityId}`,
  },
  [NotificationType.STORY_PUBLISH]: {
    getMessage: (t, m, roleId) => (roleId === Role.HUBER ? (
      <>{t('story_published_huber', { title: m.relatedEntity?.title ?? '' })}</>
    ) : (
      <>{t('story_published_admin', { name: m?.sender.fullName ?? '', title: m.relatedEntity?.title ?? '' })}</>
    )),
    route: (relatedEntityId: number, roleId?: number) => (roleId && roleId === Role.ADMIN)
      ? `/admin/stories/${relatedEntityId}/approval` : `/explore-story/${relatedEntityId}`,
  },
  [NotificationType.STORY_REJECTION]: {
    getMessage: (t, m) => (
      <>{t('story_rejected', { title: m.relatedEntity?.title ?? '' })}</>
    ),
    route: relatedEntityId => `/explore-story/${relatedEntityId}/preview`,
  },
  [NotificationType.HUBER_REPORT]: {
    getMessage: (t, m) => (
      <>{t('huber_reported', { name: m.relatedEntity?.reportee?.fullName ?? '' })}</>
    ),
  },
  [NotificationType.HUBER_WARNING]: {
    getMessage: t => (
      <>{t('huber_warning')}</>
    ),
    title: (t: TFunction) => <span className="text-orange-50">{t('huber_warning_title')}</span>,
  },
  [NotificationType.HUBER_REJECTION]: {
    getMessage: t => (
      <>{t('huber_rejection')}</>
    ),
    title: (t: TFunction) => <span className="text-red-60">{t('huber_rejection_title')}</span>,
  },
  [NotificationType.SESSION_REJECTION]: {
    getMessage: (t, m) => {
      const date = format(m.relatedEntity?.startedAt ? new Date(m.relatedEntity?.startedAt) : new Date(), 'dd MMM, yyyy');
      return (
        <>
          {t('session_rejection', {
            name: m.sender?.fullName ?? '',
            startTime: m.relatedEntity?.startTime ?? '',
            endTime: m.relatedEntity?.endTime ?? '',
            date,
          })}
        </>
      );
    },
    title: (t: TFunction) => <span className="text-red-60">{t('session_rejection_title')}</span>,
  },
  [NotificationType.SESSION_APPROVAL]: {
    getMessage: (t, m) => (
      <>{t('session_approval', { name: m.sender.fullName })}</>
    ),
    title: (t: TFunction) => <span className="text-primary-60">{t('session_approval_title')}</span>,
    route: () => '/my-schedule',
  },
  [NotificationType.OTHER]: {
    getMessage: (t, m) => (
      <>{t('session_upcoming', { name: m.relatedEntity?.humanBookId ?? '' })}</>
    ),
    title: (t: TFunction) => <p className="font-bold text-neutral-10">{t('session_upcoming_title')}</p>,
    route: (url: string | number) => `${url}`,
  },
  [NotificationType.SESSION_COMPLETION]: {
    getMessage: (t, m) => {
      const date = toLocaleDateString(m.relatedEntity?.startedAt, 'en-GB');
      return (
        <>
          {t('session_completion', {
            name: m.relatedEntity?.humanBookName ?? '',
            startTime: m.relatedEntity?.startTime ?? '',
            endTime: m.relatedEntity?.endTime ?? '',
            date,
          })}
        </>
      );
    },
    title: (t: TFunction) => (
      <div className="flex items-center gap-2 font-bold text-neutral-10">
        <p>{t('session_completion_title')}</p>
        <Image
          src="/assets/icons/kissing-icon.svg"
          width={24}
          height={24}
          alt="Kissing icon"
          className="size-6 object-cover object-center"
        />
      </div>
    ),
    route: (url: string | number) => `${url}`,
  },
  [NotificationType.SESSION_CANCELLATION]: {
    getMessage: (t, m) => {
      const date = toLocaleDateString(m.relatedEntity?.startedAt, 'en-GB');
      return (
        <>
          {t('session_cancellation', {
            name: m.sender?.fullName ?? '',
            startTime: m.relatedEntity?.startTime ?? '',
            endTime: m.relatedEntity?.endTime ?? '',
            date,
          })}
        </>
      );
    },
    title: (t: TFunction) => <span className="text-red-60">{t('session_cancellation_title')}</span>,
  },
  [NotificationType.SESSION_MISS]: {
    getMessage: (t, m) => {
      const date = toLocaleDateString(m.relatedEntity?.startedAt, 'en-GB');
      return (
        <>
          {t('session_miss', {
            startTime: m.relatedEntity?.startTime ?? '',
            endTime: m.relatedEntity?.endTime ?? '',
            date,
          })}
        </>
      );
    },
    title: (t: TFunction) => <span className="text-orange-50">{t('session_miss_title')}</span>,
  },
  [NotificationType.USER_APPEAL]: {
    getMessage: (t, m) => (
      <span className="font-bold text-red-50">{t('user_appeal', { id: String(m.relatedEntity?.moderationRelatedReport?.id ?? '') })}</span>
    ),
  },
  [NotificationType.APPEAL_RESPONSE]: {
    getMessage: (t, m) => (
      <>{m.relatedEntity?.status === 'accepted' ? t('appeal_accepted') : t('appeal_rejected')}</>
    ),
  },
};
