'use client';

import { useTranslations } from 'next-intl';

import Button from '@/components/core/button/Button';
import Modal from '@/components/Modal';

export type RecordingConsentModalProps = {
  open: boolean;
  isStarting: boolean;
  onAccept: () => void;
  onDecline: () => void;
};

/** Asks the Liber whether this call may be recorded before the recording starts. */
export function RecordingConsentModal({
  open,
  isStarting,
  onAccept,
  onDecline,
}: RecordingConsentModalProps) {
  const t = useTranslations('Reading.AgoraMeeting');

  return (
    <Modal open={open} disableClosingTrigger onClose={onDecline}>
      <Modal.Backdrop className="bg-[#2E3032]/50" />
      <Modal.Panel className="flex w-full max-w-sm flex-col items-center gap-4 rounded-2xl px-5 py-6">
        <h6 className="text-xl font-medium text-neutral-10">{t('recording_title')}</h6>
        <p className="text-center text-sm font-medium text-neutral-20">{t('recording_detail')}</p>
        <div className="flex w-full items-center gap-2.5">
          <Button variant="outline" fullWidth onClick={onDecline}>
            {t('not_record')}
          </Button>
          <Button fullWidth onClick={onAccept} disabled={isStarting}>
            {t('start_recording')}
          </Button>
        </div>
      </Modal.Panel>
    </Modal>
  );
}