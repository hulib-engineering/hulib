'use client';

import { useTranslations } from 'next-intl';

import { mergeClassnames } from '@/components/core/private/utils';

type ITimeSlotListHeaderProps = {
  currentDayOfWeek: number;
  onCurrentDayOfWeekChange: (value: number) => void;
  slots?: number;
  scrollable?: boolean;
};

const DAY_KEYS = [
  { short: 'day_short_0', full: 'day_full_0', prompt: 'day_prompt_0' },
  { short: 'day_short_1', full: 'day_full_1', prompt: 'day_prompt_1' },
  { short: 'day_short_2', full: 'day_full_2', prompt: 'day_prompt_2' },
  { short: 'day_short_3', full: 'day_full_3', prompt: 'day_prompt_3' },
  { short: 'day_short_4', full: 'day_full_4', prompt: 'day_prompt_4' },
  { short: 'day_short_5', full: 'day_full_5', prompt: 'day_prompt_5' },
  { short: 'day_short_6', full: 'day_full_6', prompt: 'day_prompt_6' },
] as const;

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
