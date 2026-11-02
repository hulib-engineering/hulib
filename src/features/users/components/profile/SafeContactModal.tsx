'use client';

import { LockKey } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';

import Button from '@/components/core/button/Button';
import Modal from '@/components/Modal';
import type { SafetyRequirement } from '@/features/users/utils/profile.util';

export type SafeContactModalProps = {
  open: boolean;
  requirement: SafetyRequirement;
  onClose: () => void;
  onConfirm: () => void;
};

/** Asks the user for their birthday, or for an emergency contact when they are under 18. */
export function SafeContactModal({ open, requirement, onClose, onConfirm }: SafeContactModalProps) {
  const t = useTranslations('Common');
  const prefix = requirement === 'birthday' ? 'safe_birthday' : 'safe_contact';

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Backdrop className="bg-[#2E3032]/50" />
      <Modal.Panel className="flex w-full max-w-[500px] flex-col items-center gap-4 rounded-2xl p-6">
        <h6 className="text-center text-[28px] font-medium leading-9 text-primary-50">{t(`${prefix}_title`)}</h6>
        <p className="text-center text-base text-neutral-10">{t(`${prefix}_description`)}</p>
        <div className="flex w-full items-start gap-2 rounded-lg border border-primary-90 bg-primary-98 p-3 text-sm font-medium text-primary-20">
          <LockKey size={20} className="shrink-0" />
          <span>{t('safe_contact_notice')}</span>
        </div>
        <Button fullWidth className="mt-2" onClick={onConfirm}>
          {t(`${prefix}_action`)}
        </Button>
      </Modal.Panel>
    </Modal>
  );
}
