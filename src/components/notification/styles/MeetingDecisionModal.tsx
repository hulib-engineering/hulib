import { ArrowRight, CalendarDots, CheckIcon, User as UserIcon, VideoCamera } from '@phosphor-icons/react';
import { useLocale, useTranslations } from 'next-intl';
import React, { useState } from 'react';

import Avatar from '@/components/core/avatar/Avatar';
import Button from '@/components/core/button/Button';
import Modal from '@/components/Modal';
import { ROLE_NAME, Role } from '@/types/common';
import type { Notification } from '@/libs/services/modules/notifications/notificationType';
import { formatMeetingDateLabel, formatSessionTime, resolveSessionTimeRange } from '@/utils/dateUtils';

type MeetingDecisionType = 'accept' | 'reject';

type MeetingDecisionModalProps = {
  open: boolean;
  type: MeetingDecisionType;
  session: Notification['relatedEntity'];
  // Optional: the modal is mounted before a notification is chosen (the popover keeps it
  // mounted with `notification: null`), and the render below already guards with `sender?.`.
  sender?: Notification['sender'];
  isLoading?: boolean;
  onConfirm: (reason?: string) => void;
  onClose: () => void;
};

const getTimeLeftLabel = (startedAt: Date | null, t: ReturnType<typeof useTranslations>) => {
  if (!startedAt) {
    return '';
  }
  const diffMs = startedAt.getTime() - Date.now();
  // NaN must be rejected explicitly: `NaN <= 0` is false, so an unparsed date would
  // otherwise fall through and render as "NaNd NaNh left".
  if (Number.isNaN(diffMs) || diffMs <= 0) {
    return '';
  }
  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  return t('time_left', { days, hours });
};

export default function MeetingDecisionModal({
  open,
  type,
  session,
  sender,
  isLoading,
  onConfirm,
  onClose,
}: MeetingDecisionModalProps) {
  const t = useTranslations('notifications');
  const locale = useLocale();
  const [reason, setReason] = useState('');

  const isAccept = type === 'accept';

  const { startedAt, startTime, endTime } = resolveSessionTimeRange(session);
  const dateLabel = formatMeetingDateLabel(startedAt, locale);
  const timeLeftLabel = isAccept ? getTimeLeftLabel(startedAt, t) : '';

  const handleClose = () => {
    setReason('');
    onClose();
  };

  const handleConfirm = () => {
    onConfirm(isAccept ? undefined : (reason.trim() || undefined));
    setReason('');
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Modal.Backdrop />
      <Modal.Panel className="w-[calc(100%-2rem)] max-w-[480px]">
        <div className="flex flex-col items-center gap-10 p-5 py-10 sm:px-10">
          <div className="flex w-full flex-col items-center gap-4">
            <h4 className="text-center text-2xl font-medium tracking-[-0.02em] text-neutral-10 sm:text-[28px]">
              {t(isAccept ? 'confirm_accept_title' : 'confirm_reject_title')}
            </h4>
            <p className="text-center text-base font-normal leading-6 tracking-[0.005em] text-black">
              {t(isAccept ? 'confirm_accept_message' : 'confirm_reject_message')}
            </p>

            <div
              className={`flex w-full flex-col items-start gap-5 rounded-2xl border-4 bg-white p-4 ${isAccept ? 'border-primary-70' : 'border-orange-70'}`}
            >
              {isAccept
                ? (
                    timeLeftLabel && (
                      <span className="flex items-center justify-center rounded-full bg-primary-60 px-4 py-0.5 text-sm font-medium leading-none text-white">
                        {timeLeftLabel}
                      </span>
                    )
                  )
                : (
                    <span className="flex items-center justify-center rounded-full bg-orange-40 px-4 py-0.5 text-sm font-medium leading-none text-white">
                      {t('invitation')}
                    </span>
                  )}

              <div className="flex w-full flex-col gap-1">
                <div className="flex items-center gap-2 text-sm font-medium text-neutral-10">
                  <CalendarDots className="text-base" />
                  <span className="leading-none">{t('session_time_label')}</span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-1 rounded bg-primary-98 p-1">
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

              <div className="flex w-full flex-col gap-1.5">
                <div className="flex items-center gap-2 text-sm font-medium text-neutral-10">
                  {isAccept ? <VideoCamera className="text-base" /> : <UserIcon className="text-base" />}
                  <span className="leading-none">{t(isAccept ? 'meeting_with' : 'requested_by')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Avatar
                    imageUrl={sender?.photo?.path}
                    name={sender?.fullName}
                    size="sm"
                  />
                  {isAccept
                    ? (
                        <CheckIcon
                          size={16}
                          weight="bold"
                          className="rounded-full bg-gradient-to-b from-blue-50 to-lavender-40 p-0.5 text-lavender-80 ring-2 ring-lavender-80"
                        />
                      )
                    : (
                        <span className="flex items-center rounded-[100px] border border-yellow-70 bg-yellow-90 px-2.5 py-0.5 text-sm font-medium leading-none text-orange-40">
                          {ROLE_NAME[Role.LIBER]}
                        </span>
                      )}
                  <span className={`flex items-center text-base font-medium leading-none ${isAccept ? 'text-primary-40' : 'text-neutral-10'}`}>
                    {sender?.fullName}
                  </span>
                </div>
              </div>
            </div>

            {!isAccept && (
              <div className="flex w-full flex-col gap-2">
                <label htmlFor="reject-reason" className="w-full text-base font-normal leading-6 tracking-[0.005em] text-black">
                  {t('reject_reason_label')}
                </label>
                <textarea
                  id="reject-reason"
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder={t('reject_reason_placeholder')}
                  rows={4}
                  className="w-full resize-none rounded-lg border border-neutral-90 bg-neutral-98 p-3 text-sm text-neutral-10 placeholder:text-neutral-40 focus:outline-none"
                />
              </div>
            )}
          </div>

          <div className="flex w-full flex-col items-start gap-4">
            <Button
              size="lg"
              fullWidth
              animation={isLoading && 'progress'}
              onClick={handleConfirm}
            >
              {t(isAccept ? 'confirm' : 'confirm_reject_action')}
            </Button>
            <Button
              variant="ghost"
              size="lg"
              fullWidth
              onClick={handleClose}
            >
              {t(isAccept ? 'confirm_accept_cancel_label' : 'confirm_reject_cancel_label')}
            </Button>
          </div>
        </div>
      </Modal.Panel>
    </Modal>
  );
}
