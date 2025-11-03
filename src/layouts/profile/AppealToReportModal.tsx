import { ArrowLeft, CheckCircle, X } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

import Button from '@/components/core/button/Button';
import Checkbox from '@/components/core/checkbox/Checkbox';
import TextArea from '@/components/core/textArea/TextArea';
import { mergeClassnames } from '@/components/core/private/utils';
import { pushError } from '@/components/CustomToastifyContainer';
import Modal from '@/components/Modal';
import { useAppealMutation } from '@/libs/services/modules/appeal';
import type { ModerationHistory } from '@/libs/services/modules/moderation/type';

type IAppealToReportModalProps = {
  moderation?: ModerationHistory;
  open: boolean;
  onClose: () => void;
};

const AppealToReportModal = ({
  moderation,
  open,
  onClose,
}: IAppealToReportModalProps) => {
  const t = useTranslations('MyProfile');

  const [appeal, { isLoading }] = useAppealMutation();

  // const { register, watch, setValue, handleSubmit, formState: { errors } } = useForm<z.infer<typeof ReportValidation>>({
  //   resolver: zodResolver(ReportValidation),
  //   defaultValues: {
  //     reasons: Array(6).fill(''),
  //     customReason: '',
  //   },
  // });

  const [isAppealing, setIsAppealing] = useState(false);
  const [appealingMessage, setAppealingMessage] = useState('');
  const [isCommitChecked, setIsCommitChecked] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);

  const handleSubmitAppeal = async () => {
    try {
      await appeal({
        moderationId: moderation?.id,
        message: appealingMessage.trim(),
      }).unwrap();
      setIsSuccessful(true);
    } catch (error: any) {
      pushError(`Error: ${error.message}`);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Backdrop />
      <Modal.Panel>
        <div
          className={mergeClassnames(
            'flex w-full flex-col items-center justify-center',
            !isSuccessful ? 'bg-white' : 'bg-neutral-98',
          )}
        >
          {/* Modal Header */}
          <div className={mergeClassnames('flex w-full items-center justify-center p-4', isSuccessful && 'pb-0')}>
            {isAppealing && (
              <ArrowLeft
                className={mergeClassnames('size-6 cursor-pointer text-[#343330]', isSuccessful && 'invisible')}
                onClick={() => isAppealing && setIsAppealing(false)}
              />
            )}
            {!isSuccessful && <h5 className="text-2xl font-medium leading-8">Appeal report</h5>}
            {isAppealing && (
              <X
                className={mergeClassnames('size-6 cursor-pointer text-[#343330]', !isSuccessful && 'invisible')}
                onClick={() => isSuccessful && onClose()}
              />
            )}
          </div>
          {/* Modal Body */}
          <div className={mergeClassnames('flex flex-col gap-4 p-6', isSuccessful && 'pt-0')}>
            {!isSuccessful ? (
              <>
                <p className="text-lg font-medium">
                  {isAppealing
                    ? 'Please explain why you believe this action was taken by mistake. We’ll carefully review your response and follow up shortly.'
                    : 'Someone else has reported you. The reporter give the reason below:'}
                </p>
                {!isAppealing ? (
                  <>
                    <ul className="list-disc space-y-2 pl-6">
                      {moderation?.reasons?.split('\n').map((each: string, index: number) => (
                        <li key={index}>{each}</li>
                      ))}
                    </ul>
                    {moderation?.customReason && (
                      <div
                        className="h-[162px] rounded-2xl bg-neutral-98 px-3 py-0.5 leading-10 text-neutral-40 outline outline-1 -outline-offset-1 outline-neutral-90"
                      >
                        {moderation?.customReason}
                      </div>
                    )}
                  </>
                ) : (
                  <TextArea
                    aria-multiline
                    rows={7}
                    placeholder={t('report_modal.other_reason_placeholder')}
                    value={appealingMessage}
                    onChange={e => setAppealingMessage(e.target.value)}
                  />
                )}
              </>
            ) : (
              <div className="flex w-full flex-col items-center gap-5">
                <div className="rounded-[43px] bg-[#D9FDEE] p-1">
                  <CheckCircle weight="fill" className="text-[48px] text-[#32D583]" />
                </div>
                <h6 className="text-center text-xl font-bold">Your appeal has been submitted.</h6>
                <p className="text-center">We’ll review it and notify you within 3 working days.</p>
              </div>
            )}
          </div>
          {/* Modal Footer */}
          <div className="flex w-full items-center gap-2.5 px-6 py-5 outline outline-1 outline-offset-1 outline-neutral-90">
            {!isAppealing ? (
              <>
                <Button
                  size="lg"
                  variant="outline"
                  fullWidth
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  size="lg"
                  fullWidth
                  onClick={() => setIsAppealing(true)}
                >
                  Appeal
                </Button>
              </>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                  <Checkbox
                    id="commit"
                    checked={isCommitChecked}
                    onChange={event => setIsCommitChecked(event.target.checked)}
                  />
                  <p>I confirm that the information I provided is accurate to the best of my knowledge.</p>
                </div>
                <Button
                  size="lg"
                  fullWidth
                  disabled={!isCommitChecked || appealingMessage.trim().length === 0 || isLoading}
                  animation={isLoading && 'progress'}
                  onClick={handleSubmitAppeal}
                >
                  Submit an Appeal
                </Button>
              </div>
            )}
          </div>
        </div>
      </Modal.Panel>
    </Modal>
  );
};

export default AppealToReportModal;
