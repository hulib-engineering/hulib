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
import Modal from '@/components/Modal';
import AppealToReportModal from '@/layouts/profile/AppealToReportModal';
import SessionDetailCard from '@/layouts/scheduling/SessionDetailCard';
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
        align="center"
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
          [NotificationType.SESSION_MISS, NotificationType.HUBER_WARNING].includes(notification.type.name as NotificationType)
          && 'hover:bg-orange-90',
          !notification.seen && (![NotificationType.SESSION_MISS, NotificationType.HUBER_WARNING].includes(notification.type.name as NotificationType) ? 'bg-green-90' : 'bg-orange-98'),
          !notification.seen && 'xl:bg-white',
        )}
        contentClassName="flex flex-1 flex-col gap-2"
        avatar={(
          <div className={mergeClassnames(notification.type.name === NotificationType.SESSION_CANCELLATION && 'relative')}>
            <Avatar
              imageUrl={[NotificationType.SESSION_MISS, NotificationType.SESSION_CANCELLATION].includes(notification.type.name as NotificationType)
                ? '/assets/icons/disabled-meeting-icon.svg' : notification.sender.id === 1
                  ? '/assets/images/admin-ava.png'
                  : notification.sender.photo?.path}
              name={notification.sender.fullName}
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
        {notification.type.name === NotificationType.SESSION_MISS && (
          <Button size="sm" fullWidth onClick={() => setIsShareReasonModalOpen(true)}>{t('share_reason')}</Button>)}
        {notification.type.name === NotificationType.HUBER_WARNING && (
          <Button size="sm" onClick={() => setIsShareReasonModalOpen(true)}>{t('appeal')}</Button>)}
      </NotificationRow>

      {/* Share missing session reason modal */}
      {notification.type.name === NotificationType.SESSION_MISS && (
        <Modal open={isShareReasonModalOpen} onClose={() => setIsShareReasonModalOpen(false)}>
          <Modal.Backdrop />
          <Modal.Panel className="w-fit">
            <SessionDetailCard
              session={{
                ...(notification.relatedEntity ?? {}),
                story: { ...(notification.relatedEntity?.story ?? {}), title: notification.relatedEntity?.storyTitle },
              }}
              expandByDefault
              sharingMissingReason
            />
          </Modal.Panel>
        </Modal>
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
