import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import type { z } from 'zod';

import { mergeClassnames } from '@/components/private/utils';
import Button from '@/components/button/Button';
import TextArea from '@/components/textArea/TextArea';
import { pushError } from '@/components/CustomToastifyContainer';
import { ApprovalModalLayout } from '@/layouts/admin/ApprovalModalLayout';
import { useUpgradeUserMutation } from '@/libs/services/modules/user';
import type { ProfileValidation } from '@/validations/ProfileValidation';

type IHuberConfirmationModalProps = {
  huber: z.infer<typeof ProfileValidation> & { id: number; photo?: { id: string; path: string } };
  type: 'approve' | 'reject';
  open: boolean;
  onClose: () => void;
};

export default function HuberConfirmationModal({
  huber,
  type,
  open,
  onClose,
}: IHuberConfirmationModalProps) {
  const router = useRouter();

  const [upgradeUser, { isLoading }] = useUpgradeUserMutation();

  const [rejectionReason, setRejectionReason] = useState('');
  const [isSuccessful, setIsSuccessful] = useState(false);

  const handleUpgradeUser = async () => {
    try {
      await upgradeUser({
        id: String(huber.id),
        ...type === 'approve'
          ? { action: 'accept' }
          : { action: 'reject', reason: rejectionReason },
      }).unwrap();
      setIsSuccessful(true);
    } catch (error) {
      pushError('Failed to decline Huber. Please try again.');
    }
  };
  const handleDoneConfirmation = () => {
    onClose();
    setIsSuccessful(false);
    setRejectionReason('');
    router.push('/admin/users/approval');
  };

  return (
    <ApprovalModalLayout open={open} onClose={onClose} type={type}>
      <div className={mergeClassnames('rounded-lg py-6', type === 'approve' ? 'bg-neutral-98' : 'bg-red-98')}>
        <div className="mx-auto flex w-[200px] flex-col gap-2">
          <div className="relative">
            <Image
              src={huber.photo?.path ?? '/assets/images/ava-placeholder.png'}
              alt="Huber avatar"
              width={200}
              height={200}
              className="size-[200px] object-cover object-center"
            />
            {/* Status badge */}
            {type === 'approve' && (
              <div className="absolute bottom-2 left-1/2 w-[164px] rounded-lg bg-orange-90 px-2 py-1 text-sm font-medium text-orange-50 -translate-x-1/2">
                Waiting for approval
              </div>
            )}

            {isSuccessful && (
              <div className="absolute bottom-2 left-1/2 rounded-lg bg-green-90 px-2 py-1 text-sm font-medium text-green-30 -translate-x-1/2">
                {type === 'approve' ? 'Approved' : 'Declined'}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <h5 className="text-2xl font-medium text-primary-10">
              {huber.fullName}
            </h5>
            <p className="text-sm leading-4 text-neutral-30">Huber</p>
          </div>
        </div>

      </div>
      {type === 'reject' && !isSuccessful && (
        <TextArea
          rows={7}
          placeholder="Reason for rejection"
          value={rejectionReason}
          onChange={e => setRejectionReason(e.target.value)}
        />
      )}
      <div className="flex w-full flex-col gap-3">
        <p className={mergeClassnames('text-center text-sm', (type === 'approve' || isSuccessful) ? 'text-neutral-30' : 'text-red-70')}>
          {type === 'approve'
            ? isSuccessful ? 'You have confirmed the request to become a Huber.' : 'You are accepting the request to become a Huber.'
            : isSuccessful ? 'You declined the request to become a Huber.' : 'You are declining the request to become a Huber.'}
        </p>
        {isSuccessful ? (
          <Button
            size="lg"
            fullWidth
            onClick={handleDoneConfirmation}
          >
            Homepage
          </Button>
        ) : (
          <div className="flex w-full items-center gap-2">
            <Button variant="outline" size="lg" fullWidth onClick={onClose}>Back</Button>
            <Button
              size="lg"
              fullWidth
              disabled={isLoading}
              animation={isLoading && 'progress'}
              onClick={handleUpgradeUser}
            >
              Confirm
            </Button>
          </div>
        )}
      </div>
    </ApprovalModalLayout>
  );
}
