import React, { useState } from 'react';

import Image from 'next/image';
import NiceAvatar, { genConfig } from 'react-nice-avatar';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/libs/i18nNavigation';
import { mergeClassnames } from '@/components/core/private/utils';
import Button from '@/components/core/button/Button';
import TextArea from '@/components/core/textArea/TextArea';
import { ApprovalModalLayout } from '@/layouts/admin/ApprovalModalLayout';
import type { Huber } from '@/libs/services/modules/huber/huberType';
import { pushError } from '@/components/CustomToastifyContainer';
import { useUpgradeUserMutation } from '@/libs/services/modules/user';

type IApprovalConfirmationModalProps = {
  user: Huber;
  type: 'approve' | 'reject';
  open: boolean;
  onClose: () => void;
};

const HuberConfirmationModal = ({
  user,
  type,
  open,
  onClose,
}: IApprovalConfirmationModalProps) => {
  const router = useRouter();

  const [rejectionReason, setRejectionReason] = useState('');
  const [isSuccessful, setIsSuccessful] = useState(false);

  const t = useTranslations('Huber');
  const tCommon = useTranslations('Common');

  const [upgradeUser, { isLoading }] = useUpgradeUserMutation();

  const handleUpdateHuberRegistrarStatus = async () => {
    const body = type === 'approve'
      ? { action: 'accept' } : { action: 'reject', reason: rejectionReason };
    try {
      await upgradeUser({
        id: String(user.id),
        body,
      }).unwrap();
      setIsSuccessful(true);
    } catch {
      pushError(t('approve_huber_failed'));
    }
  };
  const handleDoneConfirmation = () => {
    onClose();
    setIsSuccessful(false);
    setRejectionReason('');
    router.push('/');
  };

  return (
    <ApprovalModalLayout open={open} onClose={onClose} type={type}>
      <div
        className={mergeClassnames(
          'w-full mx-auto rounded-lg py-6',
          type === 'approve' ? 'bg-neutral-98' : 'bg-red-98',
        )}
      >
        <div className="mx-auto flex w-full max-w-52 flex-col gap-2">
          <div className="relative w-full overflow-hidden rounded-[32px] bg-neutral-90">
            {user.photo?.path
              ? (
                  <Image
                    src={user.photo.path}
                    alt="User Avatar"
                    width={270}
                    height={270}
                    className="aspect-[1/1] h-auto w-full rounded-[32px] object-cover"
                  />
                )
              : (
                  <NiceAvatar
                    className="aspect-[1/1] h-auto w-full rounded-[32px]"
                    {...genConfig(user.fullName || 'user')}
                  />
                )}
            <div className="absolute bottom-4 left-0 flex w-full items-center justify-center">
              <span
                className={mergeClassnames(
                  'rounded-full bg-orange-90 px-4 py-1 text-xs leading-[14px] text-orange-50',
                  type === 'approve' && isSuccessful && 'bg-green-90 text-green-30',
                  type === 'reject' && isSuccessful && 'bg-red-98 text-red-50',
                )}
              >
                {!isSuccessful ? t('waiting_for_approval') : type === 'approve' ? t('approved') : t('declined')}
              </span>
            </div>
          </div>

          <p className="line-clamp-1 text-2xl font-medium leading-8 text-primary-10">
            {user.fullName}
          </p>
        </div>
      </div>
      {type === 'reject' && !isSuccessful && (
        <TextArea
          rows={7}
          placeholder={t('reason_for_rejection')}
          value={rejectionReason}
          onChange={e => setRejectionReason(e.target.value)}
        />
      )}
      <div className="flex w-full flex-col gap-3">
        <p className={mergeClassnames('text-center text-sm', (type === 'approve' || isSuccessful) ? 'text-neutral-30' : 'text-red-70')}>
          {type === 'approve'
            ? isSuccessful ? t('huber_request_confirmed') : t('accept_huber_request')
            : isSuccessful ? t('decline_huber_request') : t('declining_huber_request')}
        </p>
        {isSuccessful ? (
          <Button
            size="lg"
            fullWidth
            onClick={handleDoneConfirmation}
          >
            {t('homepage')}
          </Button>
        ) : (
          <div className="flex w-full items-center gap-2">
            <Button variant="outline" size="lg" fullWidth onClick={onClose}>Back</Button>
            <Button
              size="lg"
              fullWidth
              disabled={isLoading}
              animation={isLoading && 'progress'}
              onClick={handleUpdateHuberRegistrarStatus}
            >
              {tCommon('confirm')}
            </Button>
          </div>
        )}
      </div>
    </ApprovalModalLayout>
  );
};

export default HuberConfirmationModal;
