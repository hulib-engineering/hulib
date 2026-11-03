'use client';

import { ArrowRight, CalendarDot, User } from '@phosphor-icons/react';
import type { ComponentProps } from 'react';
import { useLocale, useTranslations } from 'next-intl';

import { mergeClassnames } from '@/components/core/private/utils';
import { ScheduleInfoItemLayout } from '@/layouts/scheduling/ScheduleInfoItemLayout';
import { SessionAttendees } from '@/layouts/scheduling/SessionAttendees';

type AttendeesProps = ComponentProps<typeof SessionAttendees>;

export type SessionSummaryCardProps = {
  startedAt: string;
  startTime: string;
  endTime: string;
  bookedHuber: AttendeesProps['bookedHuber'];
  me: AttendeesProps['me'];
  isVibing: boolean;
  className?: string;
};

export function SessionSummaryCard({
  startedAt,
  startTime,
  endTime,
  bookedHuber,
  me,
  isVibing,
  className,
}: SessionSummaryCardProps) {
  const locale = useLocale();
  const t = useTranslations('feedback_form');

  const date = new Date(startedAt).toLocaleDateString(locale === 'en' ? 'en-GB' : 'vi-VI', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className={mergeClassnames('w-full rounded-2xl border-[1.5px] border-primary-50 bg-white p-4', className)}>
      <ScheduleInfoItemLayout icon={<CalendarDot className="text-primary-60" />} title={t('session_time')}>
        <div className="mt-1 rounded-lg bg-primary-98 px-3 py-2 text-sm font-semibold text-primary-50">
          <p>{date}</p>
          <p className="mt-1 flex items-center gap-2">
            <span>{startTime}</span>
            <ArrowRight size={14} weight="bold" />
            <span>{endTime}</span>
          </p>
        </div>
      </ScheduleInfoItemLayout>
      <SessionAttendees
        bookedHuber={bookedHuber}
        me={me}
        isVibing={isVibing}
        icon={<User className="text-primary-60" />}
        classname="mt-4"
        childClassname="pl-4"
      />
    </div>
  );
}
