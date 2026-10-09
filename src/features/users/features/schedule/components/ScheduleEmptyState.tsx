'use client';

import { useTranslations } from 'next-intl';
import React from 'react';

import { CalendarDots } from '@phosphor-icons/react';
import { mergeClassnames } from '@/components/core/private/utils';

type ScheduleEmptyStateProps = {
  className?: string;
};

export default function ScheduleEmptyState({ className }: ScheduleEmptyStateProps) {
  const t = useTranslations('Schedule.meeting_list');

  return (
    <div
      className={mergeClassnames(
        'flex min-h-[240px] flex-col items-center justify-center gap-3 rounded-2xl border border-neutral-90 bg-white p-6 text-center shadow-sm',
        className,
      )}
    >
      <div className="flex size-14 items-center justify-center rounded-full bg-primary-98 text-primary-50">
        <CalendarDots size={28} weight="bold" />
      </div>
      <p className="text-base font-semibold text-neutral-10">
        {t('empty.title')}
      </p>
      <p className="max-w-sm text-sm leading-5 text-neutral-40">
        {t('empty.description')}
      </p>
    </div>
  );
}
