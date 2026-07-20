'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import Button from '@/components/core/button/Button';
import Modal from '@/components/Modal';

type ConfirmModalProps = {
  className?: string;
  isOpen: boolean;
  title?: string;
  isConfirmDisable?: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
};

export const ConfirmModal = ({ className, isOpen, isConfirmDisable = false, title = '', onClose, onConfirm }: ConfirmModalProps) => {
  const t = useTranslations('Common');

  return (
    <div className={className}>
      <Modal open={isOpen} onClose={() => onClose?.()}>
        <Modal.Backdrop />
        <Modal.Panel className="w-full p-5 shadow-none sm:max-w-xl">
          <div className="flex flex-col items-center justify-center gap-8">
            <h4 className="text-center text-[28px] font-medium leading-9 text-black">
              {title}
            </h4>
            <div className="flex w-full items-center gap-3">
              <Button
                variant="outline"
                size="lg"
                fullWidth
                onClick={() => onClose?.()}
              >
                {t('cancel')}
              </Button>
              <Button
                size="lg"
                fullWidth
                disabled={isConfirmDisable}
                animation={(isConfirmDisable) && 'progress'}
                onClick={() => onConfirm?.()}
              >
                {t('confirm')}
              </Button>
            </div>
          </div>
        </Modal.Panel>
      </Modal>
    </div>
  );
};
