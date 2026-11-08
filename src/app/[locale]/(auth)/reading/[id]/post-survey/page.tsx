'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import type { HuberFeedbackValue, SessionFeedbackValue } from '@/features/meeting/components/feedback/types';
import type { ReadingSessionFeedbackPayload } from '@/libs/services/modules/reading-session';
import Loading from '@/app/[locale]/loading';
import { pushError } from '@/components/CustomToastifyContainer';
import { FeedbackSuccessStep } from '@/features/meeting/components/feedback/FeedbackSuccessStep';
import { HuberFeedbackStep } from '@/features/meeting/components/feedback/HuberFeedbackStep';
import { SessionFeedbackStep } from '@/features/meeting/components/feedback/SessionFeedbackStep';
import { redirect, useRouter } from '@/libs/i18nNavigation';
import {
  useGetReadingSessionByIdQuery,
  useSubmitReadingSessionFeedbackMutation,
} from '@/libs/services/modules/reading-session';
import { StatusEnum } from '@/types/common';

type Step = 'session' | 'huber' | 'success';

const DEFAULT_SESSION_VALUE: SessionFeedbackValue = {
  feelingRating: 2,
  satisfactionRating: 2,
  content: '',
};

const DEFAULT_HUBER_VALUE: HuberFeedbackValue = {
  rating: 0,
  content: '',
};

export default function PostSurvey() {
  const router = useRouter();
  const params = useParams();
  const sessionId = Array.isArray(params.id) ? params.id[0] : params.id;
  const t = useTranslations('feedback_form');

  const { data: readingSession } = useGetReadingSessionByIdQuery(Number(sessionId), {
    skip: !sessionId,
  });
  const [submitFeedback, { isLoading }] = useSubmitReadingSessionFeedbackMutation();

  const [step, setStep] = useState<Step>('session');
  const [sessionValue, setSessionValue] = useState<SessionFeedbackValue>(DEFAULT_SESSION_VALUE);
  const [huberValue, setHuberValue] = useState<HuberFeedbackValue>(DEFAULT_HUBER_VALUE);

  const handleSubmit = async (skipped: boolean) => {
    if (!sessionId) {
      return;
    }

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
      await submitFeedback({ id: sessionId, ...payload }).unwrap();
      setStep('success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      pushError(t('submit_failed'));
    }
  };

  if (!readingSession) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (
    readingSession.sessionStatus !== StatusEnum.Finished
    && readingSession.sessionStatus?.toLowerCase() !== StatusEnum.Finished
  ) {
    redirect('/my-schedule');
  }

  return (
    <div className="flex size-full items-center justify-center p-0 pb-6 xl:p-6">
      <div className="flex w-full max-w-xl flex-col gap-6 bg-white p-4 xl:rounded-[20px] xl:p-5">
        {step === 'session' && (
          <SessionFeedbackStep
            summary={{
              startedAt: readingSession.startedAt,
              startTime: readingSession.startTime,
              endTime: readingSession.endTime,
              bookedHuber: readingSession.humanBook,
              me: readingSession.reader,
              isVibing: true,
            }}
            value={sessionValue}
            isSubmitting={isLoading}
            onChange={partial => setSessionValue(prev => ({ ...prev, ...partial }))}
            onCancel={() => router.push('/')}
            onNext={() => setStep('huber')}
          />
        )}

        {step === 'huber' && (
          <HuberFeedbackStep
            huber={readingSession.humanBook}
            value={huberValue}
            isSubmitting={isLoading}
            onChange={partial => setHuberValue(prev => ({ ...prev, ...partial }))}
            onSkip={() => void handleSubmit(true)}
            onConfirm={() => void handleSubmit(false)}
          />
        )}

        {step === 'success' && <FeedbackSuccessStep onHome={() => router.push('/')} />}
      </div>
    </div>
  );
}
