import { XCircle } from '@phosphor-icons/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import React, { useState } from 'react';

import type { INotificationItemRendererProps } from '../NotificationItemRenderer';
import { notificationConfig } from '../private/config';
import { NotificationType } from '../private/types';

import Avatar from '@/components/core/avatar/Avatar';
import Button from '@/components/core/button/Button';
import { mergeClassnames } from '@/components/core/private/utils';
import Modal from '@/components/Modal';
import AppealToReportModal from '@/layouts/profile/AppealToReportModal';
import SessionDetailCard from '@/layouts/scheduling/SessionDetailCard';
import { toLocaleDateString } from '@/utils/dateUtils';

export default function InformativeNotificationCard({ notification, showExtras, onClick }: INotificationItemRendererProps) {
  const cfg = notificationConfig[notification.type.name as NotificationType];

  const router = useRouter();

  const locale = useLocale();

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

  if (!notification || !notification?.relatedEntity) {
    return undefined;
  }

  return (
    <>
      <button
        type="button"
        className={mergeClassnames(
          'flex w-full items-center gap-3 bg-white py-2.5 px-4 text-left transition-colors delay-300 hover:bg-primary-98',
          'xl:py-4 xl:rounded-lg',
          [NotificationType.SESSION_MISS, NotificationType.HUBER_WARNING].includes(notification.type.name as NotificationType)
          && 'bg-orange-98 hover:bg-orange-90',
          !notification.seen && 'bg-green-90 xl:bg-white',
        )}
        onClick={handleClick}
      >
        <div className={mergeClassnames(notification.type.name === NotificationType.SESSION_CANCELLATION && 'relative')}>
          <Avatar
            imageUrl={[NotificationType.SESSION_MISS, NotificationType.SESSION_CANCELLATION].includes(notification.type.name as NotificationType)
              ? '/assets/icons/disabled-meeting-icon.svg' : notification.sender.id === 1
                ? '/assets/images/admin-ava.png'
                : (notification.sender.photo?.path ?? '/assets/images/ava-placeholder.png')}
            size="xl"
            className={mergeClassnames(
              showExtras && 'xl:!size-[72px]',
              [NotificationType.SESSION_MISS, NotificationType.SESSION_CANCELLATION].includes(notification.type.name as NotificationType)
              && 'rounded-none',
            )}
          />
          {notification.type.name === NotificationType.SESSION_CANCELLATION && (
            <div className="absolute right-0 top-0">
              <XCircle weight="fill" className="size-8 text-red-60" />
            </div>
          )}
        </div>
        <div className="flex flex-1 items-center gap-3">
          <div className="flex w-full flex-col gap-2">
            <p className="line-clamp-2 font-bold">{cfg.title}</p>
            <p className="font-medium">{cfg.getMessage(notification)}</p>
            {![NotificationType.SESSION_APPROVAL, NotificationType.SESSION_MISS].includes(notification.type.name as NotificationType)
            && (
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
                      : (notification.relatedEntity?.rejectionReason ?? 'No reason')}
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
                  <p className="text-neutral-50">From:</p>
                  <p className="line-clamp-1 text-primary-60">{notification.relatedEntity?.storyTitle}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-neutral-50">Time:</p>
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
                  <p className="text-neutral-50">Huber:</p>
                  <p>{notification.sender.fullName}</p>
                </div>
              </div>
            )}
            {notification.type.name === NotificationType.STORY_REJECTION && (
              <Button size="sm" onClick={handleClick}>See the rejected stories</Button>
            )}
            {notification.type.name === NotificationType.SESSION_REJECTION && (
              <Button size="sm" onClick={() => router.push('/explore-story')}>Explore other stories</Button>
            )}
            {notification.type.name === NotificationType.SESSION_MISS && (
              <Button size="sm" onClick={() => setIsShareReasonModalOpen(true)}>Share the reason</Button>)}
            {notification.type.name === NotificationType.HUBER_WARNING && (
              <Button size="sm" onClick={() => setIsShareReasonModalOpen(true)}>Appeal</Button>)}
          </div>
          {!notification.seen && (
            <Image
              src="/assets/icons/leaf.svg"
              alt="Seen icon"
              width={20}
              height={20}
              className="hidden size-5 object-cover object-center xl:block"
            />
          )}
        </div>
      </button>
      {/* Share missing session reason modal */}
      <Modal open={isShareReasonModalOpen} onClose={() => setIsShareReasonModalOpen(false)}>
        <Modal.Backdrop />
        <Modal.Panel className="w-fit">
          <SessionDetailCard
            session={{
              ...notification.relatedEntity,
              story: { ...notification.relatedEntity.story, title: notification.relatedEntity.storyTitle },
            }}
            expandByDefault
            sharingMissingReason
          />
        </Modal.Panel>
      </Modal>

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
