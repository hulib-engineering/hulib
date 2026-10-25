import { Dialog } from '@headlessui/react';
import { CalendarDot, Check, VideoCamera, X } from '@phosphor-icons/react';
import { useLocale, useTranslations } from 'next-intl';
import React, { useState } from 'react';

import Avatar from '@/components/core/avatar/Avatar';
import Button from '@/components/core/button/Button';
import TextArea from '@/components/core/textArea/TextArea';
import Modal from '@/components/Modal';
import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';
import { useUpdateReadingSessionMutation } from '@/libs/services/modules/reading-session';
import { formatSessionDateWithWeekday, formatSessionTime, resolveSessionTimeRange } from '@/utils/dateUtils';

type MissedReasonModalProps = {
  session: {
    id?: number | string;
    startedAt?: string | null;
    startTime?: string | null;
    endTime?: string | null;
    humanBook?: { fullName?: string; photo?: { path?: string } | null } | null;
  };
  open: boolean;
  onClose: () => void;
};

/**
 * "You missed this conversation" reason capture for the reader-facing `missReadingSession`
 * notification.
 *
 * Deliberately not `SessionDetailCard`: that component is shared with `MobileSessionList` and
 * `SessionPopover`, which render a different layout, so restyling it for this design would
 * change the schedule views too.
 *
 * Submits `note` against the session — the same field and mutation the old shared card used —
 * so existing sessions carrying a reason keep working.
 */
export default function MissedReasonModal({ session, open, onClose }: MissedReasonModalProps) {
  const locale = useLocale();
  const t = useTranslations('Schedule');
  const tCommon = useTranslations('Common');

  const [updateStatus, { isLoading }] = useUpdateReadingSessionMutation();
  const [reason, setReason] = useState('');

  const { startedAt, startTime, endTime } = resolveSessionTimeRange(session);
  const huber = session.humanBook;

  const handleSubmit = async () => {
    if (!session?.id) {
      return;
    }
    try {
      // `note`, not `sessionStatus` — the status is already `missed`, this only records why.
      await updateStatus({ id: Number(session.id), note: reason } as any).unwrap();
      pushSuccess(t('status_updated'));
      setReason('');
      onClose();
    } catch {
      pushError(t('status_update_failed'));
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Backdrop />
      <Modal.Panel className="w-fit max-w-xl">
        <div className="flex flex-col gap-6 p-6 sm:p-8">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              aria-label={tCommon('close')}
              className="rounded-full p-1 text-neutral-10 transition-colors hover:bg-neutral-98"
            >
              <X className="size-6" />
            </button>
          </div>

          <Dialog.Title className="-mt-2 text-center text-2xl font-bold text-neutral-10 sm:text-3xl">
            {t('missed_reason.title')}
          </Dialog.Title>

          <div className="flex flex-col gap-4 rounded-2xl bg-neutral-98 p-5">
            <span className="w-fit rounded-full bg-red-50 px-4 py-2 text-sm font-medium uppercase leading-4 text-white">
              {t('missed_reason.status_label')}
            </span>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <CalendarDot className="size-5 text-neutral-40" />
                <span className="text-sm text-neutral-40">{t('missed_reason.time_label')}</span>
              </div>
              <div className="flex flex-col gap-1 rounded-xl bg-primary-98 px-3 py-2 text-base text-primary-60">
                <span>{formatSessionDateWithWeekday(startedAt, locale)}</span>
                <span className="flex items-center gap-2">
                  {formatSessionTime(startTime, locale)}
                  <span aria-hidden>→</span>
                  {formatSessionTime(endTime, locale)}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <VideoCamera className="size-5 text-neutral-40" />
                <span className="text-sm text-neutral-40">{t('missed_reason.meeting_with_label')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Avatar
                  imageUrl={huber?.photo?.path}
                  name={huber?.fullName ?? ''}
                  size="sm"
                />
                <span className="flex size-5 items-center justify-center rounded-full bg-lavender-40">
                  <Check className="size-3 text-white" />
                </span>
                <span className="text-lg font-medium text-neutral-10">{huber?.fullName}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-base font-medium text-neutral-10">{t('missed_reason.reason_label')}</span>
            <TextArea
              rows={5}
              value={reason}
              placeholder={t('share_reason_here')}
              onChange={e => setReason(e.target.value)}
            />
          </div>

          <Button size="lg" fullWidth disabled={isLoading} onClick={handleSubmit}>
            {t('missed_reason.submit')}
          </Button>
        </div>
      </Modal.Panel>
    </Modal>
  );
}
