'use client';

import { useTranslations } from 'next-intl';

import type { HuberFeedbackValue, HuberIdentity } from './types';
import { Rating } from '@/components/Rating';
import Button from '@/components/core/button/Button';
import Avatar from '@/components/core/avatar/Avatar';
import Label from '@/components/Label';
import TextArea from '@/components/core/textArea/TextArea';
import { GreenTick } from '@/features/users/components/profile/GreenTick';

export type HuberFeedbackStepProps = {
  huber: HuberIdentity;
  value: HuberFeedbackValue;
  isSubmitting?: boolean;
  onChange: (value: Partial<HuberFeedbackValue>) => void;
  onSkip: () => void;
  onConfirm: () => void;
};

export function HuberFeedbackStep({
  huber,
  value,
  isSubmitting,
  onChange,
  onSkip,
  onConfirm,
}: HuberFeedbackStepProps) {
  const t = useTranslations('feedback_form');

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 sm:gap-4">
      <h4 className="shrink-0 text-center text-xl font-semibold leading-7 text-black xl:text-2xl">
        {t('feedback_for_huber')}
      </h4>

      <div className="flex min-h-0 flex-1 flex-col items-center gap-3 overflow-y-auto pb-2 sm:gap-4">
        <Avatar
          size="2xl"
          imageUrl={huber?.photo?.path}
          name={huber?.fullName}
          className="size-20 sm:size-24"
        />

        <span className="rounded-lg bg-gradient-to-b from-blue-50 to-lavender-40 px-3 py-1 text-sm font-medium text-white">
          Huber
        </span>

        <div className="flex items-center gap-1.5">
          <span className="text-xl font-medium text-neutral-10">
            {huber?.fullName || 'Unknown'}
          </span>
          <GreenTick size={12} />
        </div>

        <div className="flex w-full flex-col gap-3">
          <p className="text-center text-base font-medium leading-6 text-neutral-10">
            {t('how_many_love')}
          </p>
          <Rating
            value={value.rating}
            onChange={rating => onChange({ rating })}
            activeColor="pink-50"
          />
        </div>

        <div className="flex w-full flex-col gap-2">
          <Label>{t('say_something')}</Label>
          <TextArea
            rows={3}
            placeholder={t('write_something')}
            value={value.content}
            onChange={event => onChange({ content: event.target.value })}
          />
        </div>
      </div>

      <div className="flex w-full shrink-0 gap-3">
        <Button variant="outline" fullWidth onClick={onSkip} disabled={isSubmitting}>
          {t('skip')}
        </Button>
        <Button
          fullWidth
          onClick={onConfirm}
          disabled={isSubmitting || value.rating === 0}
          animation={isSubmitting && 'progress'}
        >
          {t('confirm')}
        </Button>
      </div>
    </div>
  );
}
