import { ArrowRightIcon, CalendarDotsIcon } from '@phosphor-icons/react';

import { useLocale, useTranslations } from 'next-intl';
// import { CURRENT_TZ, formatTimezone } from '@/utils/dateUtils';
import { format } from 'date-fns';
import { ScheduleInfoItemLayout } from '@/layouts/scheduling/ScheduleInfoItemLayout';

function Date({ displayedTime }: any) {
  const locale = useLocale();
  return (
    <div className="bg-primary-98 text-primary-50">
      {displayedTime?.toLocaleDateString(locale === 'en' ? 'en-GB' : 'vi-VI', {
        weekday: 'long',
        month: 'long',
        day: '2-digit',
        year: 'numeric',
      })}
      {/* <span className="text-right">{formatTimezone(CURRENT_TZ)}</span> */}
    </div>
  );
}

function Hour({ displayedTime }: any) {
  return (
    <span className="flex flex-row gap-4">
      {format(displayedTime, 'HH:mm')}
      <ArrowRightIcon size={16} className="shrink-0" weight="bold" color="#8F9397" />
      {format(displayedTime.getTime() + 30 * 60 * 1000, 'HH:mm')}
    </span>
  );
}

export function Time(props: any) {
  const t = useTranslations('Schedule.MainScreen');

  return (
    <ScheduleInfoItemLayout icon={<CalendarDotsIcon size={16} className="mb-1" />} title={t('time')}>
      <div className="flex flex-col rounded-sm bg-primary-98 p-1 text-primary-50">
        <Date {...props} />
        <Hour {...props} />
      </div>
    </ScheduleInfoItemLayout>
  );
}
