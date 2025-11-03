import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, X } from '@phosphor-icons/react';
import { isEmpty } from 'lodash';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import Avatar from '@/components/core/avatar/Avatar';
import Button from '@/components/core/button/Button';
import Checkbox from '@/components/core/checkbox/Checkbox';
import { mergeClassnames } from '@/components/core/private/utils';
import TextArea from '@/components/core/textArea/TextArea';
import { pushError } from '@/components/CustomToastifyContainer';
import Modal from '@/components/Modal';
import type { FileType } from '@/libs/services/modules/files/fileType';
import { useBanUserMutation, useWarnUserMutation } from '@/libs/services/modules/moderation';
import { useUpdateReportByIdMutation } from '@/libs/services/modules/report';
import { ReportValidation } from '@/validations/ReportValidation';

const RejectedReasons = [
  'Insufficient evidence',
  'No violation of community guidelines',
  'Duplicate report',
  'Misuse of the report feature',
  'Incorrect or irrelevant report',
];

type IHandleReportModalProps = {
  open?: boolean;
  onClose?: () => void;
  data?: {
    id: number;
    createdAt: string;
    reason: string;
    customReason: string;
    reporter: {
      id: number;
      fullName: string;
      photo: FileType;
    };
    reportee: {
      id: number;
      fullName: string;
      photo: FileType;
    };
  };
};

const HandleReportModal = ({
  open = true,
  onClose,
  data,
}: IHandleReportModalProps) => {
  const t = useTranslations('MyProfile');

  const [rejectSingleReport, { isLoading }] = useUpdateReportByIdMutation();
  const [banUser, { isLoading: isBanningUser }] = useBanUserMutation();
  const [warnUser, { isLoading: isWarningUser }] = useWarnUserMutation();

  const { register, watch, setValue, handleSubmit, formState: { errors } } = useForm<z.infer<typeof ReportValidation>>({
    resolver: zodResolver(ReportValidation),
    defaultValues: {
      reasons: Array(5).fill(''),
      customReason: '',
    },
  });

  const [isRejected, setIsRejected] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };
  const handleSubmitRejectingReport = handleSubmit(async (reportData) => {
    try {
      await rejectSingleReport({
        id: data?.id,
        markAsResolved: true,
        rejectedReason: reportData.reasons.filter(r => r.trim().length > 0).join('\n'),
        rejectedCustomReason: reportData.customReason?.trim() ?? '',
      }).unwrap();
      handleClose();
    } catch (error: any) {
      pushError(`Error: ${error.message}`);
    }
  });
  const handleClickBack = () => {
    setIsRejected(false);
    setIsApproved(false);
  };
  const handleModerate = async (action: 'ban' | 'warn') => {
    try {
      if (action === 'ban') {
        await banUser({ userId: data?.reportee?.id }).unwrap();
      } else {
        await warnUser({ userId: data?.reportee?.id }).unwrap();
      }
      handleClose();
    } catch (error: any) {
      pushError(`Error: ${error.message}`);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Modal.Backdrop />
      <Modal.Panel className="w-full max-w-[607px] overflow-hidden rounded-2xl text-neutral-10 shadow-sm">
        <div className="flex w-full flex-col items-center justify-center bg-white">
          {/* Modal Header */}
          <div
            className={mergeClassnames(
              'inline-flex w-full items-center justify-between p-4',
              isRejected && 'outline outline-1 -outline-offset-1 outline-neutral-90',
            )}
          >
            <ArrowLeft
              className={mergeClassnames(
                'size-6 cursor-pointer text-[#343330]',
                !isRejected && !isApproved && 'invisible',
              )}
              onClick={handleClickBack}
            />
            <h5 className="text-2xl font-medium leading-8">
              {`${!isRejected && !isApproved ? 'Report' : isApproved ? 'Approve' : 'Reject'} detail #${data?.id}`}
            </h5>
            <X
              className={mergeClassnames(
                'size-6 cursor-pointer text-[#343330]',
                (isRejected || isApproved) && 'invisible',
              )}
              onClick={handleClose}
            />
          </div>
          {/* Modal Body */}
          <div className={mergeClassnames('flex w-full flex-col', !isRejected && 'bg-neutral-98')}>
            {!isRejected && !isApproved && (
              <>
                <div className="py-2 text-center text-black">{data?.createdAt}</div>
                <div className="flex items-center outline outline-1 -outline-offset-1 outline-neutral-90">
                  <div className="flex flex-1 flex-col border-r border-neutral-90">
                    <div className="bg-primary-60 p-2 text-center text-lg font-medium text-white">Reporter</div>
                    <div className="flex h-20 items-center justify-center gap-2 py-2 text-sm font-medium leading-4">
                      <Avatar imageUrl="/assets/images/ava-placeholder.png" className="size-11" />
                      <span className="rounded-full bg-orange-90 px-2.5 py-0.5 text-orange-50">
                        Liber
                      </span>
                      <span>{data?.reporter?.fullName}</span>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="bg-red-60 p-2 text-center text-lg font-medium text-white">Reported user</div>
                    <div className="flex h-20 items-center justify-center gap-2 py-2 text-sm font-medium leading-4">
                      <Avatar imageUrl="/assets/images/ava-placeholder.png" className="size-11" />
                      <span className="rounded-full bg-primary-90 px-2.5 py-0.5 text-primary-50">
                        Huber
                      </span>
                      <span>{data?.reportee?.fullName}</span>
                    </div>
                  </div>
                </div>
              </>
            )}
            {isApproved && (
              <div className="flex flex-col">
                <div className="bg-red-60 p-2 text-center text-lg font-medium text-white">Reported user</div>
                <div className="flex h-20 items-center justify-center gap-2 py-2 text-sm font-medium leading-4">
                  <Avatar imageUrl="/assets/images/ava-placeholder.png" className="size-11" />
                  <span className="rounded-full bg-primary-90 px-2.5 py-0.5 text-primary-50">
                    Huber
                  </span>
                  <span>{data?.reportee?.fullName}</span>
                </div>
              </div>
            )}
            {!isApproved && (
              <div className="flex flex-col gap-4 p-6">
                <p className="text-lg font-medium">Reasons:</p>
                {!isRejected ? (
                  <>
                    <ul className="list-disc space-y-2 pl-6">
                      {data?.reason?.split('\n').map((each: string, index: number) => (
                        <li key={index}>{each}</li>
                      ))}
                    </ul>
                    {data?.customReason && (
                      <div
                        className="h-[162px] rounded-2xl bg-neutral-98 px-3 py-0.5 leading-10 text-neutral-40 outline outline-1 -outline-offset-1 outline-neutral-90"
                      >
                        {data?.customReason}
                      </div>
                    )}
                  </>
                )
                  : (
                      <div className="flex flex-col gap-4">
                        {RejectedReasons.map((reason, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <Checkbox
                              id={`reason-${index}`}
                              checked={!!watch(`reasons.${index}`)}
                              onChange={(event) => {
                                if (event.target.checked) {
                                  setValue(`reasons.${index}`, reason);
                                } else {
                                  setValue(`reasons.${index}`, '');
                                }
                              }}
                            />
                            <span>{reason}</span>
                          </div>
                        ))}
                        <TextArea
                          id="customReason"
                          aria-multiline
                          rows={7}
                          placeholder={t('report_modal.other_reason_placeholder')}
                          {...register('customReason')}
                        />
                      </div>
                    )}
              </div>
            )}
          </div>
          {/* Modal Footer */}
          <div
            className={mergeClassnames(
              'flex w-full items-center gap-2.5 px-6 py-5',
              isRejected ? 'pt-0' : 'outline outline-1 outline-offset-1 outline-neutral-90',
            )}
          >
            {!isRejected && !isApproved ? (
              <>
                <Button
                  size="lg"
                  variant="outline"
                  fullWidth
                  onClick={() => setIsRejected(true)}
                >
                  Reject
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  fullWidth
                  onClick={() => setIsApproved(true)}
                >
                  Approve
                </Button>
              </>
            ) : isRejected ? (
              <Button
                size="lg"
                fullWidth
                disabled={!isEmpty(errors) || isLoading}
                animation={isLoading && 'progress'}
                onClick={handleSubmitRejectingReport}
              >
                Done
              </Button>
            ) : (
              <>
                <Button
                  size="lg"
                  variant="outline"
                  fullWidth
                  disabled={isWarningUser}
                  animation={isWarningUser && 'progress'}
                  className="border-orange-70"
                  onClick={() => handleModerate('warn')}
                >
                  Warn user
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  fullWidth
                  disabled={isBanningUser}
                  animation={isBanningUser && 'progress'}
                  className="border-red-60"
                  onClick={() => handleModerate('ban')}
                >
                  Ban user
                </Button>
              </>
            )}
          </div>
        </div>
      </Modal.Panel>
    </Modal>
  );
};

export default HandleReportModal;
