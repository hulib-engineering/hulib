'use client';

import { useTranslations } from 'next-intl';

import type { SessionSummaryCardProps } from './SessionSummaryCard';
import type { SessionFeedbackValue } from './types';
import { SessionSummaryCard } from './SessionSummaryCard';
import Button from '@/components/core/button/Button';
import TextArea from '@/components/core/textArea/TextArea';
import { EmojiRateScale } from '@/components/EmojiRateScale';

export type SessionFeedbackStepProps = {
  summary: Omit<SessionSummaryCardProps, 'className'>;
  value: SessionFeedbackValue;
  isSubmitting?: boolean;
  onChange: (value: Partial<SessionFeedbackValue>) => void;
  onCancel: () => void;
  onNext: () => void;
};

export function SessionFeedbackStep({
  summary,
  value,
  isSubmitting,
  onChange,
  onCancel,
  onNext,
}: SessionFeedbackStepProps) {
  const t = useTranslations('feedback_form');

  return (
    <div className="flex h-full flex-col gap-5">
      <h4 className="text-center text-xl font-semibold leading-7 text-black xl:text-2xl">
        {t('session_feedback')}
      </h4>

      <div className="flex flex-1 flex-col gap-6 overflow-y-auto pb-2">
        <SessionSummaryCard {...summary} />

        <div className="flex flex-col gap-3">
          <p className="text-center text-base font-medium leading-6 text-neutral-10">
            {t('how_do_you_feel')}
          </p>
          <EmojiRateScale
            value={value.feelingRating}
            onChange={rating => onChange({ feelingRating: rating })}
            lowestRateText={t('not_good')}
            highestRateText={t('very_good')}
          />
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-center text-base font-medium leading-6 text-neutral-10">
            {t('did_session_satisfy')}
          </p>
          <EmojiRateScale
            value={value.satisfactionRating}
            onChange={rating => onChange({ satisfactionRating: rating })}
            lowestRateText={t('not_satisfied')}
            highestRateText={t('very_satisfied')}
          />
        </div>

        <TextArea
          rows={5}
          placeholder={t('share_more')}
          value={value.content}
          onChange={event => onChange({ content: event.target.value })}
        />
      </div>

      <div className="flex w-full gap-3">
        <Button variant="outline" fullWidth onClick={onCancel} disabled={isSubmitting}>
          {t('cancel')}
        </Button>
        <Button fullWidth onClick={onNext} disabled={isSubmitting} animation={isSubmitting && 'progress'}>
          {t('next')}
        </Button>
      </div>
    </div>
  );
}
