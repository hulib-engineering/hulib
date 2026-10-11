'use client';

import { useTranslations } from 'next-intl';

import Button from '@/components/core/button/Button';
import Modal from '@/components/Modal';

export type EndCallConfirmModalProps = {
  open: boolean;
  isEnding: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/**
 * Confirms before leaving the call.
 *
 * The previous implementation tore the call down on a single click, which left
 * no way back once the tracks were stopped.
 */
export function EndCallConfirmModal({
  open,
  isEnding,
  onConfirm,
  onCancel,
}: EndCallConfirmModalProps) {
  const t = useTranslations('Reading.AgoraMeeting');

  return (
    <Modal open={open} disableClosingTrigger onClose={onCancel}>
      <Modal.Backdrop className="bg-[#2E3032]/50" />
      <Modal.Panel className="flex w-full max-w-sm flex-col items-center gap-4 rounded-2xl px-5 py-6">
        <h6 className="text-xl font-medium text-neutral-10">{t('end_call_title')}</h6>
        <p className="text-center text-sm font-medium text-neutral-20">{t('end_call_confirm')}</p>
        <div className="flex w-full items-center gap-2.5">
          <Button variant="outline" fullWidth onClick={onCancel}>
            {t('end_call_cancel')}
          </Button>
          <Button fullWidth onClick={onConfirm} disabled={isEnding}>
            {t('end_call')}
          </Button>
        </div>
      </Modal.Panel>
    </Modal>
  );
}