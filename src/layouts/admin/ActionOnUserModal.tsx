import { Hammer, Warning } from '@phosphor-icons/react';
import Image from 'next/image';
import type { FC } from 'react';
import React, { useState } from 'react';

import TextArea from '@/components/core/textArea/TextArea';
import { mergeClassnames } from '@/components/core/private/utils';
import Button from '@/components/core/button/Button';
import Modal from '@/components/Modal';
import type { User } from '@/libs/services/modules/auth';

type IActionOnUserModalProps = {
  data: User;
  open?: boolean;
  onClose?: () => void;
  type: 'ban' | 'warn';
};

const ActionOnUserModal: FC<IActionOnUserModalProps> = ({
  data,
  open = true,
  onClose,
  type,
}) => {
  const [reasonForAction, setReasonForAction] = useState('');

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
          'flex w-full max-w-[30rem] border-4 flex-col items-center gap-4 rounded-[20px] p-8',
          type === 'ban' ? 'border-red-50' : 'border-orange-50',
        )}
      >
        <div
          className={mergeClassnames(
            'relative w-full rounded-lg',
            type === 'ban' ? 'bg-red-98' : 'border-orange-98',
          )}
        >
          {type === 'ban'
            ? <Hammer weight="fill" className="absolute inset-3 text-[2.5rem] text-red-50" />
            : <Warning className="absolute inset-3 text-[2.5rem] text-orange-50" />}
          <div className="flex size-full flex-col items-center justify-center gap-2 py-6">
            <div className="size-[12.5rem]">
              <Image
                src={data.photo?.path ?? '/assets/images/ava-placeholder.png'}
                alt="User Avatar"
                width={200}
                height={200}
                className="aspect-[1/1] size-full rounded-[32px] bg-neutral-90 object-cover"
              />
            </div>
            <p className="line-clamp-1 text-2xl font-medium leading-8 text-primary-10">
              {data.fullName}
            </p>
          </div>
        </div>
        <TextArea
          rows={5}
          placeholder="Reason for warning"
          value={reasonForAction}
          onChange={e => setReasonForAction(e.target.value)}
        />
        <div className="flex w-full flex-col gap-3">
          <p className={mergeClassnames('text-center text-sm', type === 'ban' ? 'text-red-70' : 'text-orange-70')}>
            {type === 'ban'
              ? 'Are you sure you want to ban this account?' : 'Are you sure you want to send a warning to this account?'}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="lg" fullWidth onClick={handleClose}>Cancel</Button>
            <Button
              size="lg"
              fullWidth
              disabled={reasonForAction.trim().length === 0}
              // animation={isLoading && 'progress'}
              // onClick={handleUpdateHuberRegistrarStatus}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Modal.Panel>
    </Modal>
  );
};

export { ActionOnUserModal };
