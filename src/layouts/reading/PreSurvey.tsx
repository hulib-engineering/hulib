'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import type { z } from 'zod';
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { isEmpty } from 'lodash';
import Button from '@/components/core/button/Button';
import RatingScale from '@/components/meeting/RatingScale';
import { SurveyValidation } from '@/validations/SurveyValidation';
import { newLineMessage } from '@/utils/i18NRichTextUtils';
import { useUpdateReadingSessionMutation } from '@/libs/services/modules/reading-session';
import Alert from '@/components/meeting/Alert';

const SurveyQuestions = [
  { title: 'quest_1', level: 'good' },
  { title: 'quest_2', level: 'relevant' },
  { title: 'quest_3', level: 'relevant' },
  { title: 'quest_4', level: 'helpful' },
] as const;

export default function PreSurvey({ sessionId, onFinish }: { sessionId: number; onFinish: () => void }) {
  const router = useRouter();

  const t = useTranslations('Reading.PreSurvey');

  const [updateReadingSession]
    = useUpdateReadingSessionMutation();

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(SurveyValidation),
    defaultValues: {
      answers: Array.from({ length: 4 }, (_, index) => ({ answer: 0, questionId: index })),
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessfullySubmitted, setIsSuccessfullySubmitted] = useState(false);

  const handleSubmitSurvey = handleSubmit(async (data) => {
    setIsSubmitting(true);
    try {
      await updateReadingSession({
        id: sessionId,
        presurvey: data.answers.map(answer => ({
          id: answer.questionId,
          rating: answer.answer,
        })),
      }).unwrap();
      localStorage.setItem(
        `is_done_survey_for_reading_${sessionId}`,
        'true',
      );
      setIsSuccessfullySubmitted(true);
      setTimeout(() => {
        setIsSuccessfullySubmitted(false);
        onFinish();
      }, 2000);
    } catch (error: any) {
      setIsSuccessfullySubmitted(false);
      onFinish();
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <div className="relative size-full">
      <div className="flex size-full items-center justify-center p-2 xl:p-6">
        <div className="flex w-full max-w-xl flex-col justify-between gap-7 rounded-[20px] bg-white p-5 shadow-popover">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="lg"
              iconLeft={<ArrowLeft />}
              className="text-black"
              onClick={() => router.back()}
            >
              {t('back')}
            </Button>
            <Button variant="ghost" size="lg" iconRight={<ArrowRight />}>{t('skip')}</Button>
          </div>
          <div className="flex flex-col gap-7 xl:gap-6">
            {/* Header Section */}
            <div className="flex items-center gap-7">
              <Image
                src="/assets/icons/lucky-leaf.svg"
                alt="Leaf icon"
                width={22}
                height={28}
                className="h-7 w-[22px] object-cover"
              />
              <h5 className="text-center text-xl font-medium text-black xl:text-2xl">
                {t('title')}
              </h5>
            </div>
            <p className="leading-5">{t.rich('subtitle', { br: newLineMessage() })}</p>
            {/* Survey Form */}
            <div className="flex flex-col gap-8 xl:gap-7">
              {SurveyQuestions.map((question, index) => (
                <RatingScale<z.infer<typeof SurveyValidation>>
                  key={index}
                  question={t(`questions.${question.title}`)}
                  leftLabel={t(`not_${question.level}`)}
                  rightLabel={t(`very_${question.level}`)}
                  name={`answers.${index}.answer`}
                  control={control}
                />
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            variant="primary"
            onClick={handleSubmitSurvey}
            disabled={!isEmpty(errors) || isSubmitting}
            animation={isSubmitting && 'progress'}
            className="w-full text-sm sm:text-base"
          >
            {t('submit')}
          </Button>
        </div>
      </div>
      {isSuccessfullySubmitted && <Alert className="absolute left-1/2 top-10 -translate-x-1/2" />}
    </div>
  );
}
