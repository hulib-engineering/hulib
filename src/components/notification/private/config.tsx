import Image from 'next/image';
import type { ReactNode } from 'react';
import React from 'react';

import { format } from 'date-fns';
import { NotificationType } from './types';

import type { Notification } from '@/libs/services/modules/notifications/notificationType';
import { toLocaleDateString } from '@/utils/dateUtils';
import { Role } from '@/types/common';

type NotificationConfig = {
  [_K in NotificationType]: {
    getMessage: (m: Notification, roleId?: number) => ReactNode;
    route?: (relatedEntityId: number, roleId?: number) => string;
    title?: ReactNode;
  };
};

export const notificationConfig: NotificationConfig = {
  [NotificationType.ACCOUNT_UPGRADE]: {
    getMessage: (m: Notification, roleId?: number) => roleId === Role.LIBER ? (
      <>
        <span className="font-bold">Your registration to become a Huber</span>
        {' '}
        has been accepted. Welcome onboard!
      </>
    ) : (
      <>
        <span className="font-bold">{m?.sender.fullName}</span>
        {' has submitted a request to become a Huber.'}
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
        would love to have a meeting with you.
      </>
    ),
  },
  [NotificationType.STORY_REVIEW]: {
    getMessage: (m: Notification) => (
      <>
        <span className="font-bold">{m.sender.fullName}</span>
        {' have also reviewed your story '}
        <span className="font-bold text-primary-60">{`“${m.relatedEntity?.title}”`}</span>
        .
      </>
    ),
  },
  [NotificationType.STORY_PUBLISH]: {
    getMessage: (m: Notification, roleId?: number) => roleId === Role.HUBER ? (
      <>
        Your story,
        {' '}
        <span className="font-bold text-primary-60">{`“${m.relatedEntity?.title}”`}</span>
        ,  has been successfully published.
      </>
    ) : (
      <>
        <span className="font-bold">{`${m?.sender.fullName} `}</span>
        has sent a request to create a new Story
        <span className="font-bold text-primary-60">{` ${m.relatedEntity?.title}.`}</span>
      </>
    ),
    route: (relatedEntityId: number, roleId?: number) => (roleId && roleId === Role.ADMIN)
      ? `/admin/stories/${relatedEntityId}/approval` : `/explore-story/${relatedEntityId}`,
  },
  [NotificationType.STORY_REJECTION]: {
    getMessage: (m: Notification) => (
      <>
        Your story,
        {' '}
        <span className="font-bold text-primary-60">{`“${m.relatedEntity?.title}”`}</span>
        , has not published successfully. Reason:
      </>
    ),
    route: relatedEntityId => `/explore-story/${relatedEntityId}/preview`,
  },
  [NotificationType.HUBER_REPORT]: {
    getMessage: (m: Notification) => (
      <>
        <span className="font-bold">Huber “</span>
        <span className="font-bold text-red-50">{m.relatedEntity?.reportee?.fullName}</span>
        <span className="font-bold">” is reported.</span>
      </>
    ),
  },
  [NotificationType.HUBER_WARNING]: {
    getMessage: () => (
      <>
        Your account has received a warning due to a report. Your account will be ban if you receive 3 reports.
      </>
    ),
    title: <span className="text-orange-50">You’ve been warned</span>,
  },
  [NotificationType.HUBER_REJECTION]: {
    getMessage: () => (
      <>
        We're sorry, but your registration to become Huber was not successfully. Reason:
      </>
    ),
    title: <span className="text-red-60">Huber Registration did not go through.</span>,
  },
  [NotificationType.SESSION_REJECTION]: {
    getMessage: (m: Notification) => (
      <>
        Unfortunately,
        {' '}
        <span className="text-primary-60">{`Huber ${m.sender?.fullName} `}</span>
        isn’t available for this meeting (
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
    title: <span className="text-red-60">Your request for meeting is rejected</span>,
  },
  [NotificationType.SESSION_APPROVAL]: {
    getMessage: (m: Notification) => (
      <>
        We’re happy to let you know that
        {' '}
        <span className="text-primary-60">{`Huber ${m.sender.fullName} `}</span>
        has accepted your meeting request. Don’t forget to join the meeting on time.
      </>
    ),
    title: <span className="text-primary-60">Your request for meeting is accepted</span>,
    route: () => '/my-schedule',
  },
  [NotificationType.OTHER]: {
    getMessage: (m: Notification) => (
      <>
        Meeting with
        {' '}
        <span className="text-primary-50">{`Huber ${m.relatedEntity?.humanBookId}`}</span>
        {' '}
        is starting now. Hurry up to make it happen with a great soul. Click below to join.
      </>
    ),
    title: <p className="font-bold text-neutral-10">It’s time for your session</p>,
    route: (url: string | number) => `${url}`,
  },
  [NotificationType.SESSION_COMPLETION]: {
    getMessage: (m: Notification) => (
      <>
        Wish you have a memorable time. Now please spend a little time to share your thought about
        <span className="text-primary-50">{` Huber ${m.relatedEntity?.humanBookName} `}</span>
        and the session from
        <span className="text-primary-50">
          {` ${m.relatedEntity?.startTime} to ${m.relatedEntity?.endTime}, ${toLocaleDateString(m.relatedEntity?.startedAt, 'en-GB')}`}
        </span>
        . Your feedback is valuable for Hulib.
      </>
    ),
    title: (
      <div className="flex items-center gap-2 font-bold text-neutral-10">
        <p>The session is finished</p>
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
    getMessage: (m: Notification) => (
      <>
        We want you to notify that
        {' '}
        <span className="text-yellow-30">{`Liber ${m.sender?.fullName} `}</span>
        has canceled the meeting (
        <span className="text-yellow-30">{`${m.relatedEntity?.startTime} to ${m.relatedEntity?.endTime}, ${toLocaleDateString(m.relatedEntity?.startedAt, 'en-GB')}`}</span>
        ). Reason:
      </>
    ),
    title: <span className="text-red-60">The meeting is canceled</span>,
  },
  [NotificationType.SESSION_MISS]: {
    getMessage: (m: Notification) => (
      <>
        You didn’t join the meeting today (
        <span className="font-bold">{`${m.relatedEntity?.startTime} to ${m.relatedEntity?.endTime}, ${toLocaleDateString(m.relatedEntity?.startedAt, 'en-GB')}). `}</span>
        We’d love to know what happened, so we can improve the experience for everyone.
      </>
    ),
    title: <span className="text-orange-50">Meeting not attended !</span>,
  },
  [NotificationType.USER_APPEAL]: {
    getMessage: (m: Notification) => (
      <span className="font-bold text-red-50">{`User appeal report #${m.relatedEntity?.moderationRelatedReport?.id}`}</span>
    ),
  },
  [NotificationType.APPEAL_RESPONSE]: {
    getMessage: (m: Notification) => (
      <>
        {m.relatedEntity?.status === 'accepted' ? 'Your appeal request is accepted, your account does not receive warning. Thank you for clarifying the situation.' : 'After reviewing your appeal, we’ve decided to keep the warning. Please be careful that your account will be ban if you receive 3 reports.'}
      </>
    ),
  },
} as const;
