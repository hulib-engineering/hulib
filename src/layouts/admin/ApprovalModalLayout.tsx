import type { FC } from 'react';
import React from 'react';

import Modal from '@/components/Modal';
import { mergeClassnames } from '@/components/private/utils';
import type { WithChildren } from '@/components/private/types';

type IApprovalModalLayoutProps = WithChildren<{
  open?: boolean;
  onClose?: () => void;
  type: 'approve' | 'reject' | 'successful-approval' | 'successful-rejection';
}>;

const ApprovalModalLayout: FC<IApprovalModalLayoutProps> = ({
  children,
  open = true,
  onClose,
  type,
}) => {
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };
  return (
    <Modal open={open} onClose={handleClose}>
      <Modal.Backdrop />
      <Modal.Panel
        className={mergeClassnames(
          'flex w-full max-w-lg flex-col items-center gap-4 rounded-[20px] p-8',
          type === 'reject' && 'border-4 border-red-50',
        )}
      >
        {children}
      </Modal.Panel>
    </Modal>
  );
};

export { ApprovalModalLayout };
