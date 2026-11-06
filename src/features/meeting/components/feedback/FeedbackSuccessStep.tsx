'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

import Button from '@/components/core/button/Button';

export type FeedbackSuccessStepProps = {
  onHome: () => void;
};

export function FeedbackSuccessStep({ onHome }: FeedbackSuccessStepProps) {
  const t = useTranslations('feedback_form');

  return (
    <div className="flex h-full min-h-0 flex-col items-center justify-between gap-6">
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-6 overflow-y-auto">
        <Image
          src="/assets/images/feedback/feedback-success-illustration.png"
          alt=""
          width={400}
          height={400}
          className="size-auto max-h-[40dvh] max-w-md object-contain"
          priority
        />
        <h4 className="text-center text-2xl font-semibold leading-9 text-black xl:text-[28px]">
          {t('thank_you')}
        </h4>
        <p className="mx-auto max-w-md text-center text-sm leading-6 text-neutral-30">
          {t('feedback_value')}
        </p>
      </div>

      <Button fullWidth onClick={onHome}>
        {t('continue_reading')}
      </Button>
    </div>
  );
}
