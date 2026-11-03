'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import type { HuberFeedbackValue, SessionFeedbackValue } from './types';
import { FeedbackSuccessStep } from './FeedbackSuccessStep';
import { HuberFeedbackStep } from './HuberFeedbackStep';
import { SessionFeedbackStep } from './SessionFeedbackStep';
import Modal from '@/components/Modal';
import { pushError } from '@/components/CustomToastifyContainer';
import type { ReadingSessionFeedbackPayload } from '@/libs/services/modules/reading-session';
import type { ReadingSession } from '@/libs/services/modules/reading-session/createNewReadingSession';

type FeedbackStep = 'session' | 'huber' | 'success';

export type PostMeetingFeedbackModalProps = {
  open: boolean;
  session: ReadingSession;
  onCancel: () => void;
  onHome: () => void;
  onSubmit: (payload: ReadingSessionFeedbackPayload) => Promise<boolean>;
};

const DEFAULT_SESSION_VALUE: SessionFeedbackValue = {
  feelingRating: 2,
  satisfactionRating: 2,
  content: '',
};

const DEFAULT_HUBER_VALUE: HuberFeedbackValue = {
  rating: 0,
  content: '',
};

export function PostMeetingFeedbackModal({
  open,
  session,
  onCancel,
  onHome,
  onSubmit,
}: PostMeetingFeedbackModalProps) {
  const t = useTranslations('feedback_form');

  const [step, setStep] = useState<FeedbackStep>('session');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionValue, setSessionValue] = useState<SessionFeedbackValue>(DEFAULT_SESSION_VALUE);
  const [huberValue, setHuberValue] = useState<HuberFeedbackValue>(DEFAULT_HUBER_VALUE);

  useEffect(() => {
    if (!open) {
      return;
    }
    setStep('session');
    setIsSubmitting(false);
    setSessionValue(DEFAULT_SESSION_VALUE);
    setHuberValue(DEFAULT_HUBER_VALUE);
  }, [open, session.id]);

  const submit = async (skipped: boolean) => {
    setIsSubmitting(true);

    const payload: ReadingSessionFeedbackPayload = {
      feelingRating: sessionValue.feelingRating + 1,
      satisfactionRating: sessionValue.satisfactionRating + 1,
      sessionContent: sessionValue.content.trim() || undefined,
      huber: skipped
        ? { skipped: true }
        : {
            skipped: false,
            rating: huberValue.rating,
            content: huberValue.content.trim() || undefined,
          },
    };

    try {
      const isSuccess = await onSubmit(payload);
      if (isSuccess) {
        setStep('success');
      } else {
        pushError(t('submit_failed'));
      }
    } catch {
      pushError(t('submit_failed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} disableClosingTrigger onClose={onCancel}>
      <Modal.Backdrop className="bg-[#2E3032]/50" />
      <Modal.Panel className="flex h-[calc(100dvh-2rem)] w-full max-w-xl flex-col overflow-hidden rounded-3xl bg-white p-5 sm:h-auto sm:max-h-[calc(100dvh-2rem)]">
        {step === 'session' && (
          <SessionFeedbackStep
            summary={{
              startedAt: session.startedAt,
              startTime: session.startTime,
              endTime: session.endTime,
              bookedHuber: session.humanBook,
              me: session.reader,
              isVibing: true,
            }}
            value={sessionValue}
            isSubmitting={isSubmitting}
            onChange={partial => setSessionValue(prev => ({ ...prev, ...partial }))}
            onCancel={onCancel}
            onNext={() => setStep('huber')}
          />
        )}

        {step === 'huber' && (
          <HuberFeedbackStep
            huber={session.humanBook}
            value={huberValue}
            isSubmitting={isSubmitting}
            onChange={partial => setHuberValue(prev => ({ ...prev, ...partial }))}
            onSkip={() => void submit(true)}
            onConfirm={() => void submit(false)}
          />
        )}

        {step === 'success' && <FeedbackSuccessStep onHome={onHome} />}
      </Modal.Panel>
    </Modal>
  );
}
