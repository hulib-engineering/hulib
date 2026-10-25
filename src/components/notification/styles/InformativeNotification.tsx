import { Warning, XCircle } from '@phosphor-icons/react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import React, { useState } from 'react';

import type { INotificationItemRendererProps } from '../NotificationItemRenderer';
import NotificationRow from '../NotificationRow';
import { notificationConfig } from '../private/config';
import { NotificationType } from '../private/types';
import { useRouter } from '@/libs/i18nNavigation';

import Avatar from '@/components/core/avatar/Avatar';
import Button from '@/components/core/button/Button';
import { mergeClassnames } from '@/components/core/private/utils';
import AppealToReportModal from '@/layouts/profile/AppealToReportModal';
import MissedReasonModal from '@/components/notification/styles/MissedReasonModal';
import { formatSessionDateLabel, formatSessionTime, resolveSessionTimeRange, toLocaleDateString } from '@/utils/dateUtils';
import { customMessage } from '@/utils/i18NRichTextUtils';

const timeRangeMessage = customMessage('font-bold text-primary-60');

export default function InformativeNotificationCard({ notification, showExtras, onClick }: INotificationItemRendererProps) {
  const cfg = notificationConfig[notification.type.name as NotificationType] ?? notificationConfig[NotificationType.OTHER];

  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('notifications');

  const [isShareReasonModalOpen, setIsShareReasonModalOpen] = useState(false);
  const [isAppealModalOpen, setIsAppealModalOpen] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    if (notification.type.name === NotificationType.SESSION_MISS) {
      setIsShareReasonModalOpen(true);
      return;
    }
    if (notification.type.name === NotificationType.HUBER_WARNING) {
      setIsAppealModalOpen(true);
      return;
    }
    if (cfg.route && cfg.route(notification.relatedEntityId) !== '') {
      router.push(cfg.route(notification.relatedEntityId));
    }
  };

  if (!notification) {
    return undefined;
  }

  const type = notification.type.name as NotificationType;
  const title = typeof cfg.title === 'function' ? cfg.title(t) : cfg.title;
  const isSessionMiss = type === NotificationType.SESSION_MISS;

  // SESSION_MISS renders its own copy so the session date follows the viewer locale and the
  // time range can be highlighted — `getMessage` has neither. `extraNote` is deliberately
  // ignored: the backend pre-renders an English message there.
  const { startedAt, startTime, endTime } = resolveSessionTimeRange(notification.relatedEntity);
  const message = isSessionMiss
    ? t.rich('session_miss', {
        startTime: formatSessionTime(startTime, locale),
        endTime: formatSessionTime(endTime, locale),
        date: formatSessionDateLabel(startedAt, locale),
        hl: timeRangeMessage,
      })
    : cfg.getMessage(t, notification);

  return (
    <>
      <NotificationRow
        onClick={handleClick}
        seen={notification.seen}
        align={isSessionMiss ? 'start' : 'center'}
        unseenIcon={notification.type.name !== NotificationType.HUBER_WARNING
          ? (
              <Image
                src="/assets/icons/leaf.svg"
                alt="Seen icon"
                width={20}
                height={20}
                className="size-4 object-cover object-center xl:size-5"
              />
            )
          : <Warning className="text-xl text-orange-50" />}
        className={mergeClassnames(
          // SESSION_MISS keeps the pink tint whether or not it has been read — the design
          // treats it as an outstanding action, not just an unread dot.
          isSessionMiss
            ? 'bg-red-98 hover:bg-red-90'
            : mergeClassnames(
                notification.type.name === NotificationType.HUBER_WARNING && 'hover:bg-orange-90',
                !notification.seen && (notification.type.name === NotificationType.HUBER_WARNING ? 'bg-orange-98' : 'bg-green-90'),
                !notification.seen && 'xl:bg-white',
              ),
        )}
        contentClassName="flex flex-1 flex-col gap-2"
        avatar={(
          <div className={mergeClassnames(notification.type.name === NotificationType.SESSION_CANCELLATION && 'relative')}>
            <Avatar
              imageUrl={[NotificationType.SESSION_MISS, NotificationType.SESSION_CANCELLATION].includes(notification.type.name as NotificationType)
                ? '/assets/icons/disabled-meeting-icon.svg' : notification.sender.id === 1
                  ? '/assets/images/admin-ava.png'
                  : notification.sender.photo?.path}
              // Session-outcome cards are rendered from the session relation, not the sender:
              // on those notifications `sender` is the admin/system account. Inert today (these
              // types always pass an icon), but it keeps a system name out of the DOM.
              name={[NotificationType.SESSION_MISS, NotificationType.SESSION_CANCELLATION].includes(notification.type.name as NotificationType)
                ? notification.relatedEntity?.humanBook?.fullName ?? ''
                : notification.sender.fullName}
              size="xl"
              className={mergeClassnames(
                showExtras && 'xl:!size-[72px]',
                // The disabled-meeting icon is drawn on a rounded square in the design, so
                // SESSION_MISS overrides Avatar's `rounded-full`. SESSION_CANCELLATION keeps
                // its existing square corners.
                type === NotificationType.SESSION_MISS ? 'rounded-2xl'
                  : type === NotificationType.SESSION_CANCELLATION ? 'rounded-none' : '',
              )}
            />
            {notification.type.name === NotificationType.SESSION_CANCELLATION && (
              <div className="absolute right-0 top-0">
                <XCircle weight="fill" className="size-8 text-red-60" />
              </div>
            )}
          </div>
        )}
      >
        {title && <p className="line-clamp-2 font-bold">{title}</p>}
        <p className={mergeClassnames('font-medium', isSessionMiss && 'text-base leading-6 tracking-[0.005em] text-neutral-10')}>
          {message}
        </p>
        {![NotificationType.SESSION_APPROVAL, NotificationType.SESSION_MISS, NotificationType.HUBER_WARNING]
          .includes(notification.type.name as NotificationType) && (
          <p
            className={mergeClassnames(
              'rounded-2xl border border-red-60 bg-neutral-98 p-3 text-sm leading-4 text-neutral-40',
              [NotificationType.SESSION_REJECTION, NotificationType.SESSION_CANCELLATION].includes(notification.type.name as NotificationType)
              && 'px-2 border-primary-60 bg-white text-neutral-10',
            )}
          >
            {notification.type.name === NotificationType.HUBER_REJECTION
              ? notification.extraNote
              : notification.type.name === NotificationType.SESSION_REJECTION
                ? notification.relatedEntity?.rejectReason
                : notification.type.name === NotificationType.SESSION_CANCELLATION ? notification.relatedEntity?.note
                  : (notification.relatedEntity?.rejectionReason ?? t('no_reason'))}
          </p>
        )}
        {notification.type.name === NotificationType.SESSION_APPROVAL && (
          <div
            className={mergeClassnames(
              'flex flex-col gap-2 rounded-lg border border-yellow-80 bg-yellow-98 px-4 py-2',
              'text-sm font-medium leading-4 text-neutral-20',
            )}
          >
            <div className="flex items-center justify-between">
              <p className="text-neutral-50">{t('from')}</p>
              <p className="line-clamp-1 text-primary-60">{notification.relatedEntity?.storyTitle}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-neutral-50">{t('time')}</p>
              <p>
                {toLocaleDateString(notification.relatedEntity?.startedAt, locale === 'en' ? 'en-GB' : 'vi-VI')}
                {' '}
                |
                {' '}
                {notification.relatedEntity?.startTime}
                {' '}
                {notification.relatedEntity?.endTime}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-neutral-50">{t('huber')}</p>
              <p>{notification.sender.fullName}</p>
            </div>
          </div>
        )}
        {notification.type.name === NotificationType.STORY_REJECTION && (
          <Button size="sm" onClick={handleClick}>{t('see_rejected_stories')}</Button>
        )}
        {notification.type.name === NotificationType.SESSION_REJECTION && (
          <Button size="sm" onClick={() => router.push('/explore-story')}>{t('explore_other_stories')}</Button>
        )}
        {/* `stopPropagation` is load-bearing: these buttons sit inside `NotificationRow`, which
            is itself a `<button>`. Without it the click bubbles to the row's `handleClick`,
            which invokes the `onClick` prop — `close` in the header popover — unmounting the
            panel and the modal with it. It also stops the modal being opened twice. */}
        {notification.type.name === NotificationType.SESSION_MISS && (
          <Button
            size="sm"
            fullWidth
            onClick={(e) => {
              e.stopPropagation();
              setIsShareReasonModalOpen(true);
            }}
          >
            {t('share_reason')}
          </Button>
        )}
        {notification.type.name === NotificationType.HUBER_WARNING && (
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setIsShareReasonModalOpen(true);
            }}
          >
            {t('appeal')}
          </Button>
        )}
      </NotificationRow>

      {/* Share missing session reason modal */}
      {isSessionMiss && (
        <MissedReasonModal
          session={notification.relatedEntity ?? {}}
          open={isShareReasonModalOpen}
          onClose={() => setIsShareReasonModalOpen(false)}
        />
      )}

      {/* Appeal a moderation modal */}
      {notification.type.name === NotificationType.HUBER_WARNING && (
        <AppealToReportModal
          moderation={notification?.relatedEntity}
          open={isAppealModalOpen}
          onClose={() => setIsAppealModalOpen(false)}
        />
      )}
    </>
  );
}
