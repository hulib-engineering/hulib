import Image from 'next/image';
import type { ReactNode } from 'react';
import React from 'react';

import { format } from 'date-fns';
import { NotificationType } from './types';

import type { Notification } from '@/libs/services/modules/notifications/notificationType';
import { toLocaleDateString } from '@/utils/dateUtils';
import { Role } from '@/types/common';

type TranslationFunction = (key: string) => string;

type NotificationConfig = {
  [_K in NotificationType]: {
    getMessage: (m: Notification, roleId?: number) => ReactNode;
    route?: (relatedEntityId: number, roleId?: number) => string;
    title?: ReactNode;
  };
};

export const getNotificationConfig = (t: TranslationFunction, tAlt: TranslationFunction): NotificationConfig => ({
  [NotificationType.ACCOUNT_UPGRADE]: {
    getMessage: (m: Notification, roleId?: number) => roleId === Role.LIBER ? (
      <>
        <span className="font-bold">{t('Notification.account_upgrade_huber')}</span>
        {' '}
        {t('Notification.account_upgrade_huber_accepted')}
      </>
    ) : (
      <>
        <span className="font-bold">{m?.sender.fullName}</span>
        {' '}
        {t('Notification.account_upgrade_admin')}
      </>
    ),
    route: (relatedEntityId: number, roleId?: number) => (roleId && roleId === Role.ADMIN)
      ? `/admin/users/approval/${relatedEntityId}` : '',
  },
  [NotificationType.SESSION_REQUEST]: {
    getMessage: (m: Notification) => (
      <>
        <span className="font-bold">{m.sender.fullName}</span>
        {' '}
        {t('Notification.session_request')}
      </>
    ),
  },
  [NotificationType.STORY_REVIEW]: {
    getMessage: (m: Notification) => (
      <>
        <span className="font-bold">{m.sender.fullName}</span>
        {' '}
        {t('Notification.story_review')}
        {' '}
        <span className="font-bold text-primary-60">{`"${m.relatedEntity?.title}"`}</span>
        .
      </>
    ),
  },
  [NotificationType.STORY_PUBLISH]: {
    getMessage: (m: Notification, roleId?: number) => roleId === Role.HUBER ? (
      <>
        {t('Notification.story_publish_huber')}
        {' '}
        <span className="font-bold text-primary-60">{`"${m.relatedEntity?.title}"`}</span>
        ,
        {' '}
        {t('Notification.story_publish_huber_published')}
      </>
    ) : (
      <>
        <span className="font-bold">{`${m?.sender.fullName} `}</span>
        {t('Notification.story_publish_admin')}
        <span className="font-bold text-primary-60">{` ${m.relatedEntity?.title}.`}</span>
      </>
    ),
    route: (relatedEntityId: number, roleId?: number) => (roleId && roleId === Role.ADMIN)
      ? `/admin/stories/${relatedEntityId}/approval` : `/explore-story/${relatedEntityId}`,
  },
  [NotificationType.STORY_REJECTION]: {
    getMessage: (m: Notification) => (
      <>
        {t('Notification.story_rejection')}
        {' '}
        <span className="font-bold text-primary-60">{`"${m.relatedEntity?.title}"`}</span>
        ,
        {' '}
        {t('Notification.story_rejection_reason')}
      </>
    ),
    route: relatedEntityId => `/explore-story/${relatedEntityId}/preview`,
  },
  [NotificationType.HUBER_REPORT]: {
    getMessage: (m: Notification) => (
      <>
        <span className="font-bold">{t('Notification.huber_report_prefix')}</span>
        <span className="font-bold text-red-50">{m.relatedEntity?.reportee?.fullName}</span>
        <span className="font-bold">{t('Notification.huber_report_suffix')}</span>
      </>
    ),
  },
  [NotificationType.HUBER_WARNING]: {
    getMessage: () => (
      <>
        {t('Notification.huber_warning')}
      </>
    ),
    title: <span className="text-orange-50">{t('Notification.huber_warning_title')}</span>,
  },
  [NotificationType.HUBER_REJECTION]: {
    getMessage: () => (
      <>
        {t('Notification.huber_rejection')}
      </>
    ),
    title: <span className="text-red-60">{t('Notification.huber_rejection_title')}</span>,
  },
  [NotificationType.SESSION_REJECTION]: {
    getMessage: (m: Notification) => (
      <>
        {t('Notification.session_rejection')}
        {' '}
        <span className="text-primary-60">{`Huber ${m.sender?.fullName} `}</span>
        {t('Notification.session_rejection_not_available')}
        {' '}
        (
        {m.relatedEntity?.startTime}
        {' '}
        to
        {' '}
        {m.relatedEntity?.endTime}
        ,
        {' '}
        {format(m.relatedEntity?.startedAt ? new Date(m.relatedEntity?.startedAt) : new Date(), 'dd MMM, yyyy')}
        ). Reason:
      </>
    ),
    title: <span className="text-red-60">{t('Notification.session_rejection_title')}</span>,
  },
  [NotificationType.SESSION_APPROVAL]: {
    getMessage: (m: Notification) => (
      <>
        {t('Notification.session_approval')}
        {' '}
        <span className="text-primary-60">{`Huber ${m.sender.fullName} `}</span>
        {t('Notification.session_approval_accepted')}
      </>
    ),
    title: <span className="text-primary-60">{t('Notification.session_approval_title')}</span>,
    route: () => '/my-schedule',
  },
  [NotificationType.OTHER]: {
    getMessage: (m: Notification) => (
      <>
        {t('Notification.session_starting')}
        {' '}
        <span className="text-primary-50">{`Huber ${m.relatedEntity?.humanBookId}`}</span>
        {' '}
        {t('Notification.session_starting_now')}
      </>
    ),
    title: <p className="font-bold text-neutral-10">{t('Notification.session_starting_title')}</p>,
    route: (url: string | number) => `${url}`,
  },
  [NotificationType.SESSION_COMPLETION]: {
    getMessage: (m: Notification) => (
      <>
        {t('Notification.session_completion')}
        <span className="text-primary-50">{` Huber ${m.relatedEntity?.humanBookName} `}</span>
        {t('Notification.session_completion_and')}
        <span className="text-primary-50">
          {` ${m.relatedEntity?.startTime} to ${m.relatedEntity?.endTime}, ${toLocaleDateString(m.relatedEntity?.startedAt, 'en-GB')}`}
        </span>
        {t('Notification.session_completion_feedback')}
      </>
    ),
    title: (
      <div className="flex items-center gap-2 font-bold text-neutral-10">
        <p>{t('Notification.session_completion_title')}</p>
        <Image
          src="/assets/icons/kissing-icon.svg"
          width={24}
          height={24}
          alt={tAlt('kissing_icon')}
          className="size-6 object-cover object-center"
        />
      </div>
    ),
    route: (url: string | number) => `${url}`,
  },
  [NotificationType.SESSION_CANCELLATION]: {
    getMessage: (m: Notification) => (
      <>
        {t('Notification.session_cancellation')}
        {' '}
        <span className="text-yellow-30">{`Liber ${m.sender?.fullName} `}</span>
        {t('Notification.session_cancellation_canceled')}
        {' '}
        (
        <span className="text-yellow-30">{`${m.relatedEntity?.startTime} to ${m.relatedEntity?.endTime}, ${toLocaleDateString(m.relatedEntity?.startedAt, 'en-GB')}`}</span>
        ). Reason:
      </>
    ),
    title: <span className="text-red-60">{t('Notification.session_cancellation_title')}</span>,
  },
  [NotificationType.SESSION_MISS]: {
    getMessage: (m: Notification) => (
      <>
        {t('Notification.session_miss')}
        {' '}
        (
        <span className="font-bold">{`${m.relatedEntity?.startTime} to ${m.relatedEntity?.endTime}, ${toLocaleDateString(m.relatedEntity?.startedAt, 'en-GB')}). `}</span>
        {t('Notification.session_miss_improve')}
      </>
    ),
    title: <span className="text-orange-50">{t('Notification.session_miss_title')}</span>,
  },
  [NotificationType.USER_APPEAL]: {
    getMessage: (m: Notification) => (
      <span className="font-bold text-red-50">{`${t('Notification.user_appeal')}${m.relatedEntity?.moderationRelatedReport?.id}`}</span>
    ),
  },
  [NotificationType.APPEAL_RESPONSE]: {
    getMessage: (m: Notification) => (
      <>
        {m.relatedEntity?.status === 'accepted' ? t('Notification.appeal_accepted') : t('Notification.appeal_rejected')}
      </>
    ),
  },
});

export const notificationConfig = getNotificationConfig((key: string) => key, (key: string) => key);
