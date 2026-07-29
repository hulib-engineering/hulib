'use client';

import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
// import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

import Button from '@/components/core/button/Button';
import { mergeClassnames } from '@/components/core/private/utils';
import { useGetReadingSessionsQuery } from '@/libs/services/modules/reading-session';
import type { ReadingSession } from '@/libs/services/modules/reading-session/createNewReadingSession';
import { useGetTimeslotsByHuberQuery } from '@/libs/services/modules/time-slots';
import { useTimeslotGrouping } from '@/libs/hooks/useTimeslotGrouping';

const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

type GroupedReadingSessions = Record<string, ReadingSession[]>;
type MonthCalendarProps = {
  onChange: (date: Date) => void;
  type?: string;
  huberId?: number;
  chosenDay: Date; // Clicked day on the MiniCalendar
  // onUpdateTimeslots: () => void;
};

export default function MiniCalendar({ onChange, type, huberId, chosenDay }: MonthCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthStartDate = new Date(monthStart);
  monthStartDate.setHours(0, 0, 0, 0);
  const monthEnd = endOfMonth(monthStart);
  const monthEndDate = new Date(monthEnd);
  monthEndDate.setHours(23, 59, 59, 999);
  const start = startOfWeek(monthStart, { weekStartsOn: 0 });
  const end = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start, end });

  const { data: timeSlots } = useGetTimeslotsByHuberQuery({
    id: huberId,
  });
  const groupingTimeslots = useTimeslotGrouping(timeSlots);

  const { data } = useGetReadingSessionsQuery({
    startedAt: monthStartDate.toISOString(),
    endedAt: monthEndDate.toISOString(),
  });

  const groupedReadingSessions = useMemo(() => {
    if (!data) {
      return {};
    }
    return data.reduce((acc: GroupedReadingSessions, session: ReadingSession) => {
      const dateKey = new Date(session.startedAt).toLocaleDateString();

      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }

      acc[dateKey].push(session);

      return acc;
    }, {} as GroupedReadingSessions);
  }, [data]);

  return (
    <div className="flex flex-col gap-1 rounded-lg bg-white px-4 py-2 shadow-sm lg:max-w-[25rem] xl:px-2">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 p-2">
        <button
          type="button"
          onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
        >
          <CaretLeft className="text-primary-50" />
        </button>
        <span className="text-center text-sm font-medium leading-4 text-neutral-10">
          {format(currentMonth, 'MMMM - yyyy')}
        </span>
        <button
          type="button"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        >
          <CaretRight className="text-primary-50" />
        </button>
      </div>

      {/* <p className="text-center text-xs text-neutral-40">
        {`Today, ${format(new Date(), 'dd MMM, yyyy')}`}
      </p> */}

      {/* Weekday header */}
      <div className="grid grid-cols-7">
        {weekdays.map(day => (
          <div key={day} className="py-2 text-center text-sm leading-4 text-neutral-40">{day}</div>
        ))}
      </div>
      {/* Day grid */}
      <div className="grid grid-cols-7 gap-[6px] text-center text-sm">
        {days.map((day) => {
          const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
          const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
          const conditionBlueText = type === 'booking'
            ? groupedReadingSessions[day.toLocaleDateString()]?.length > 0 // default calendar: if the day has some 'sessions' - whatever it is
            : groupingTimeslots[day.getDay()]; // booking calendar: if the day has some available time slots
          const isPastDate = isBefore(startOfDay(day), startOfDay(new Date()));
          const disabled = !isCurrentMonth || isPastDate;
          const isSelected
              = chosenDay?.toDateString() === day.toDateString();

          return (
            <Button
              key={day.getTime()}
              variant="ghost"
              size="sm"
              disabled={disabled}
              onClick={() => onChange(day)}
              className={mergeClassnames(
                'transition-colors h-fit rounded-lg px-0 py-3 text-center text-sm leading-4',
                'disabled:text-neutral-70',
                isCurrentMonth && 'text-neutral-10',
                isToday && !disabled && 'border border-primary-60 focus:border-primary-60 bg-white',
                conditionBlueText && 'text-primary-50',
                isSelected && 'bg-primary-50 text-white border-none active:border-none hover:bg-primary-50 focus:ring-0',
              )}
            >
              {format(day, 'd')}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
