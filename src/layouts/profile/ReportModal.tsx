import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle, X } from '@phosphor-icons/react';
import { isEmpty } from 'lodash';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import type z from 'zod';

import Button from '@/components/core/button/Button';
import Checkbox from '@/components/core/checkbox/Checkbox';
import TextArea from '@/components/core/textArea/TextArea';
import { mergeClassnames } from '@/components/core/private/utils';
import { pushError } from '@/components/CustomToastifyContainer';
import Modal from '@/components/Modal';
import { useCreateReportMutation } from '@/libs/services/modules/report';
import { ReportValidation } from '@/validations/ReportValidation';

const reasonIndexes = [
  'reason_0',
  'reason_1',
  'reason_2',
  'reason_3',
  'reason_4',
  'reason_5',
] as const;

export default function ReportModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { id: huberId } = useParams();

  const t = useTranslations('MyProfile');

  const [report, { isLoading }] = useCreateReportMutation();

  const { register, watch, setValue, handleSubmit, formState: { errors } } = useForm<z.infer<typeof ReportValidation>>({
    resolver: zodResolver(ReportValidation),
    defaultValues: {
      reasons: Array(6).fill(''),
      customReason: '',
    },
  });

  const [isSuccessful, setIsSuccessful] = useState(false);

  const handleSubmitReport = handleSubmit(async (data) => {
    try {
      await report({
        reportedUserId: Number(huberId) ?? 0,
        reason: data.reasons.filter(r => r.trim().length > 0).join('\n'),
        customReason: data.customReason?.trim() ?? '',
      }).unwrap();
      setIsSuccessful(true);
    } catch (error: any) {
      pushError(`Error: ${error.message}`);
    }
  });

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Backdrop />
      <Modal.Panel className="w-11/12 overflow-hidden rounded-[20px] text-neutral-10 shadow-popover xl:max-w-2xl">
        <div className="flex w-full flex-col items-center justify-center bg-neutral-98">
          {/* Modal Header */}
          <div className={mergeClassnames('inline-flex w-full items-center justify-between p-4', !isSuccessful && 'bg-white')}>
            <X className="invisible size-6" />
            {!isSuccessful && (
              <h6 className="text-xl font-bold">{t('report_modal.header_title')}</h6>
            )}
            <X className="size-6 cursor-pointer text-[#343330]" onClick={onClose} />
          </div>
          {/* Modal Body */}
          <div className={mergeClassnames('flex flex-col gap-5 p-6', isSuccessful ? 'items-center pt-0' : 'pt-4')}>
            {!isSuccessful ? (
              <>
                <p className="font-medium">{t('report_modal.reason_checkbox_label')}</p>
                <div className="flex flex-col gap-4">
                  {reasonIndexes.map((reason, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Checkbox
                        id={`reason-${index}`}
                        checked={!!watch(`reasons.${index}`)}
                        onChange={(event) => {
                          if (event.target.checked) {
                            setValue(`reasons.${index}`, t(`report_modal.${reason}`));
                          } else {
                            setValue(`reasons.${index}`, '');
                          }
                        }}
                      />
                      <p>{t(`report_modal.${reason}`)}</p>
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
              </>
            ) : (
              <>
                <div className="rounded-[43px] bg-[#D9FDEE] p-1">
                  <CheckCircle weight="fill" className="text-[48px] text-[#32D583]" />
                </div>
                <h6 className="text-center text-xl font-bold">{t('report_modal.success_report_title')}</h6>
                <p className="text-center">
                  {t('report_modal.success_report_detail')}
                </p>
              </>
            )}

          </div>
          {!isSuccessful && (
            <div className="w-full border-[0.97px] border-neutral-90 bg-white px-6 py-5">
              <Button
                fullWidth
                disabled={!isEmpty(errors) || isLoading}
                animation={isLoading && 'progress'}
                onClick={handleSubmitReport}
              >
                {t('report_modal.submit')}
              </Button>
            </div>
          )}
        </div>
      </Modal.Panel>
    </Modal>
  );
};
