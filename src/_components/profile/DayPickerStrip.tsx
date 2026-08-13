'use client';

import { useTranslations } from 'next-intl';
import { CalendarCheckIcon } from '@phosphor-icons/react';
import { mergeClassnames } from '@/components/core/private/utils';
import { DAY_KEYS } from '@/libs/constants/date';

type DayPickerStripProps = {
  activeDayIndex: number;
  slotsCountByIndex: number[];
  onDayChange: (index: number) => void;
};

export default function DayPickerStrip({
  activeDayIndex,
  slotsCountByIndex,
  onDayChange,
}: DayPickerStripProps) {
  const t = useTranslations('Time_slots');

  return (
    <div className="flex w-full rounded-lg bg-neutral-98 p-0.5">
      {DAY_KEYS.map((day, index) => {
        const isActive = activeDayIndex === index;
        const hasSlots = (slotsCountByIndex[index] ?? 0) > 0;

        return (
          <button
            key={index}
            type="button"
            className={mergeClassnames(
              'relative flex flex-1 items-center gap-2 justify-center rounded-lg py-2 text-sm transition-colors',
              isActive ? 'bg-primary-90 font-medium text-primary-40' : 'text-neutral-20',
            )}
            onClick={() => onDayChange(index)}
          >
            <span className="lg:hidden">{t(day.short)}</span>
            <span className="hidden lg:inline">{t(day.full)}</span>
            {hasSlots && (
              <CalendarCheckIcon size={16} weight="bold" />
            )}
          </button>
        );
      })}
    </div>
  );
}
