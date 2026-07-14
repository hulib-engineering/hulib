'use client';

import { type IconProps, X } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import type { ComponentType } from 'react';

import Modal from '@/components/Modal';

type ShareOption = {
  icon: ComponentType<IconProps>;
  label: string;
  url: string;
};

type ShareModalProps = {
  open: boolean;
  onClose: () => void;
  shareOptions: ShareOption[];
};

export default function ShareModal({ open, onClose, shareOptions }: ShareModalProps) {
  const t = useTranslations('ExploreStory');

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Backdrop />
      <Modal.Panel className="w-full max-w-sm">
        <div className="flex flex-col gap-1 p-4">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-10">
              {t('share_to')}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1 hover:bg-neutral-90"
            >
              <X size={16} />
            </button>
          </div>
          {shareOptions.map(option => (
            <button
              key={option.label}
              type="button"
              className="flex items-center gap-3 rounded-lg p-2 text-sm text-neutral-10 hover:bg-primary-98"
              onClick={() => window.open(option.url, '_blank', 'noopener')}
            >
              <option.icon size={20} />
              {option.label}
            </button>
          ))}
        </div>
      </Modal.Panel>
    </Modal>
  );
}
