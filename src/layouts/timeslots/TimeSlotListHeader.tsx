'use client';

import { mergeClassnames } from '@/components/private/utils';

type TWeekDay = {
  title: string;
  name: string;
  text: string;
};
const WeekDays: Record<number, TWeekDay> = {
  0: {
    title: 'SUN',
    name: 'Sunday',
    text: 'Wait, you\'re working on Sunday too? 😆',
  },
  1: {
    title: 'MON',
    name: 'Monday',
    text: 'Hey, are you really that busy on Monday? 😊',
  },
  2: {
    title: 'TUE',
    name: 'Tuesday',
    text: 'Is setting aside just 30 minutes really that hard? 😢',
  },
  3: {
    title: 'WED',
    name: 'Wednesday',
    text: 'Come on, is 30 minutes that tough to spare? 😢',
  },
  4: {
    title: 'THU',
    name: 'Thursday',
    text: 'Is setting aside just 30 minutes really that hard? 😢',
  },
  5: {
    title: 'FRI',
    name: 'Friday',
    text: 'Come on, is 30 minutes that tough to spare? 😢',
  },
  6: {
    title: 'SAT',
    name: 'Saturday',
    text: 'Hey, are you really that busy on Saturday? 🤔',
  },
};

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
  return (
    <div className="flex flex-col gap-2">
      {/* Day Selector Row */}
      <div className={mergeClassnames(
        'flex rounded-[100px] bg-neutral-variant-98 px-1 py-0.5',
        scrollable && 'w-full overflow-x-auto scrollbar-hide',
      )}
      >
        {Object.entries(WeekDays).map(([key, day]) => (
          <div
            key={key}
            role="button"
            tabIndex={0}
            className={mergeClassnames(
              'flex-1 cursor-pointer rounded-[100px] px-2.5 py-2 transition-colors text-black text-sm leading-4 text-center',
              currentDayOfWeek === Number(key) && 'bg-primary-90 text-primary-50',
              scrollable && 'rounded-lg',
            )}
            onClick={() => onCurrentDayOfWeekChange(Number(key))}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onCurrentDayOfWeekChange(Number(key));
              }
            }}
          >
            <p className={mergeClassnames(scrollable && 'w-[31px]')}>{day.title}</p>
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
          ? `Amazing!!! You can meet ${slots} Libers every ${WeekDays[currentDayOfWeek]?.name ?? 'day'}`
          : WeekDays[currentDayOfWeek]?.text ?? 'You did not choose any available time slot in this day, update now to meet with more people'}
      </p>
    </div>
  );
}
