import { ArrowRight, CalendarDots, Check, User as UserIcon, X } from '@phosphor-icons/react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import React, { useState } from 'react';

import type { INotificationItemRendererProps } from '../NotificationItemRenderer';
import NotificationRow from '../NotificationRow';
import { isPendingSessionStatus } from '../private/types';
import MeetingDecisionModal from './MeetingDecisionModal';
import Avatar from '@/components/core/avatar/Avatar';
import Button from '@/components/core/button/Button';
import { mergeClassnames } from '@/components/core/private/utils';
import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';
import { useRouter } from '@/libs/i18nNavigation';
import { useUpdateReadingSessionMutation } from '@/libs/services/modules/reading-session';
import { ROLE_NAME, Role, StatusEnum } from '@/types/common';
import { formatMeetingDateLabel, formatNotificationTimestamp, formatSessionTime, resolveSessionTimeRange } from '@/utils/dateUtils';

export default function MeetingRequestNotificationCard({ notification, showExtras, onClick, onRequestDecision }: INotificationItemRendererProps) {
  const t = useTranslations('notifications');
  const locale = useLocale();
  const router = useRouter();

  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [updateStatus, { isLoading }] = useUpdateReadingSessionMutation();

  const session = notification.relatedEntity;
  const isPending = isPendingSessionStatus(session?.sessionStatus);

  const handleAccept = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick();
    }
    if (onRequestDecision) {
      onRequestDecision('accept', notification);
      return;
    }
    setIsAcceptModalOpen(true);
  };

  const handleReject = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick();
    }
    if (onRequestDecision) {
      onRequestDecision('reject', notification);
      return;
    }
    setIsRejectModalOpen(true);
  };

  const confirmDecision = async (sessionStatus: StatusEnum.Approved | StatusEnum.Rejected, rejectReason?: string) => {
    try {
      await updateStatus({ id: session?.id, sessionStatus, rejectReason }).unwrap();
      pushSuccess(t('status_updated'));
    } catch {
      pushError(t('status_update_failed'));
    } finally {
      setIsAcceptModalOpen(false);
      setIsRejectModalOpen(false);
    }
  };

  const handleOpenDetail = () => {
    if (onClick) {
      onClick();
    }
    router.push('/my-schedule');
  };

  if (!notification) {
    return undefined;
  }

  // The "Thời gian" block: `startedAt` supplies the meeting's date, `startTime`/`endTime`
  // supply the times it was booked for. notification.createdAt stays in the footer below,
  // because "when is this meeting" and "when did I hear about it" are different questions
  // and can be days apart.
  const { startedAt, startTime, endTime } = resolveSessionTimeRange(session);
  const dateLabel = formatMeetingDateLabel(startedAt, locale);

  return (
    <>
      <NotificationRow
        onClick={handleOpenDetail}
        seen={notification.seen}
        className={!notification.seen ? 'bg-red-98 xl:bg-white' : undefined}
        avatar={(
          <div className="relative">
            <Avatar
              imageUrl={notification.sender.id === 1
                ? '/assets/images/admin-ava.png'
                : notification.sender.photo?.path}
              name={notification.sender.fullName}
              size="xl"
              className="xl:!size-[72px]"
            />
            <div className="absolute bottom-0 right-0">
              <Image
                src="/assets/icons/meeting-icon.svg"
                width={24}
                height={24}
                alt="Meeting icon"
                className="size-6 object-cover object-center"
              />
            </div>
          </div>
        )}
      >
        <p className="text-sm font-medium leading-5 tracking-[0.015em] text-neutral-10 xl:text-base xl:leading-6 xl:tracking-[0.005em]">
          {t('new_session_request_title')}
        </p>

        <div className="flex flex-col gap-5 rounded-2xl border-4 border-orange-70 bg-white p-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-sm font-medium text-neutral-10">
                <CalendarDots className="text-base" />
                <span className="leading-none">{t('session_time_label')}</span>
              </div>
              <div
                className={mergeClassnames(
                  'flex flex-col gap-1 rounded bg-primary-98 p-1',
                  showExtras && 'xl:flex-row xl:items-center xl:justify-between',
                )}
              >
                <span className="text-base font-medium leading-6 tracking-[0.005em] text-primary-50">
                  {dateLabel}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-base font-medium leading-6 tracking-[0.005em] text-primary-50">
                    {formatSessionTime(startTime, locale)}
                  </span>
                  <ArrowRight className="text-base text-neutral-60" />
                  <span className="text-base font-medium leading-6 tracking-[0.005em] text-primary-50">
                    {formatSessionTime(endTime, locale)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-sm font-medium text-neutral-10">
                <UserIcon className="text-base" />
                <span className="leading-none">{t('requested_by')}</span>
              </div>
              <div className="flex items-center gap-1">
                <Avatar
                  imageUrl={notification.sender.photo?.path}
                  name={notification.sender.fullName}
                  size="sm"
                />
                <span className="flex items-center rounded-[100px] border border-yellow-70 bg-yellow-90 px-2.5 py-0.5 text-sm font-medium leading-none text-orange-40">
                  {ROLE_NAME[Role.LIBER]}
                </span>
                <span className="flex items-center text-base font-medium leading-none text-primary-40">
                  {notification.sender.fullName}
                </span>
              </div>
            </div>
          </div>

          {isPending && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={handleReject}
              >
                <X className="text-base" />
                <span className="leading-none">{t('reject')}</span>
              </Button>
              <Button
                size="sm"
                fullWidth
                animation={isLoading && 'progress'}
                onClick={handleAccept}
              >
                <Check className="text-base" />
                <span className="leading-none">{t('accept')}</span>
              </Button>
            </div>
          )}
        </div>

        <p className="text-sm font-normal leading-[22px] tracking-[0.015em] text-neutral-10">
          {formatNotificationTimestamp(notification.createdAt, locale)}
        </p>
      </NotificationRow>

      <MeetingDecisionModal
        open={isAcceptModalOpen}
        type="accept"
        session={session}
        sender={notification.sender}
        isLoading={isLoading}
        onConfirm={() => confirmDecision(StatusEnum.Approved)}
        onClose={() => setIsAcceptModalOpen(false)}
      />
      <MeetingDecisionModal
        open={isRejectModalOpen}
        type="reject"
        session={session}
        sender={notification.sender}
        isLoading={isLoading}
        onConfirm={reason => confirmDecision(StatusEnum.Rejected, reason)}
        onClose={() => setIsRejectModalOpen(false)}
      />
    </>
  );
}
