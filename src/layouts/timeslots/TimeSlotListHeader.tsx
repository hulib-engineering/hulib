'use client';

import { useTranslations } from 'next-intl';
import { DAY_KEYS } from '@/libs/constants/date';
import { mergeClassnames } from '@/components/core/private/utils';

type ITimeSlotListHeaderProps = {
  currentDayOfWeek: number;
  onCurrentDayOfWeekChange: (value: number) => void;
  slots?: number;
  scrollable?: boolean;
};

export default function TimeSlotListHeader({
  currentDayOfWeek = 0,
  onCurrentDayOfWeekChange,
  slots = 0,
  scrollable = false,
}: ITimeSlotListHeaderProps) {
  const t = useTranslations('Time_slots');

  return (
    <div className="flex flex-col gap-2">
      {/* Day Selector Row */}
      <div className={mergeClassnames(
        'flex rounded-[100px] bg-neutral-variant-98 px-1 py-0.5',
        scrollable && 'w-full overflow-x-auto scrollbar-hide',
      )}
      >
        {DAY_KEYS.map((day, dayIndex) => (
          <div
            key={dayIndex}
            role="button"
            tabIndex={0}
            className={mergeClassnames(
              'flex-1 cursor-pointer rounded-[100px] px-2.5 py-2 transition-colors text-black text-sm leading-4 text-center',
              currentDayOfWeek === dayIndex && 'bg-primary-90 text-primary-50',
              scrollable && 'rounded-lg',
            )}
            onClick={() => onCurrentDayOfWeekChange(dayIndex)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onCurrentDayOfWeekChange(dayIndex);
              }
            }}
          >
            <p className={mergeClassnames(scrollable && 'w-[31px]')}>{t(day.short)}</p>
          </div>
        ))}
      </div>

      {/* Message below the day selector */}
      <p className={mergeClassnames(
        'text-xs',
        slots > 0 ? 'text-green-40' : 'text-center text-pink-30',
        !scrollable && 'text-center',
      )}
      >
        {slots > 0
          ? t('slots_message', { slots, day: t(DAY_KEYS[currentDayOfWeek]!.full) })
          : t(DAY_KEYS[currentDayOfWeek]!.prompt)}
      </p>
    </div>
  );
}
