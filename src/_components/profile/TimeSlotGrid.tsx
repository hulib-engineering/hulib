'use client';

import { useTranslations } from 'next-intl';

import { TIMESLOTS_BY_PERIOD } from './schedule/constants';
import type { Period } from './schedule/types';
import { formatTime } from './schedule/utils';
import { mergeClassnames } from '@/components/core/private/utils';

type TimeSlotGridProps = {
  selectedTimes: string[];
  readonly?: boolean;
  onToggle?: (time: string) => void;
};

export default function TimeSlotGrid({ selectedTimes, readonly = false, onToggle }: TimeSlotGridProps) {
  const t = useTranslations('Time_slots');

  return (
    <div className="flex flex-col gap-2 rounded-xl bg-neutral-98 p-2 md:gap-4 md:p-4">
      {(Object.entries(TIMESLOTS_BY_PERIOD) as [Period, readonly string[]][]).map(([period, slots]) => (
        <div key={period} className="flex flex-col gap-3 rounded-lg bg-white p-4">
          <p className="text-sm font-medium text-neutral-40">{t(period)}</p>
          <div className="flex flex-wrap gap-2">
            {slots.map((time) => {
              const isSelected = selectedTimes.includes(time);
              return (
                <button
                  key={time}
                  type="button"
                  disabled={readonly}
                  className={mergeClassnames(
                    'rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                    isSelected
                      ? 'border-orange-50 bg-orange-50 text-white'
                      : 'border-neutral-90 bg-white text-neutral-20',
                    readonly && 'cursor-default',
                  )}
                  onClick={() => !readonly && onToggle?.(time)}
                >
                  {formatTime(time)}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
