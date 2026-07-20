'use client';

import { memo, useCallback, useState } from 'react';
import { CalendarCheck } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import Button from '@/components/core/button/Button';
import { mergeClassnames } from '@/components/core/private/utils';
import {
  DAYS_OF_WEEK as DAYS,
  TIME_SLOTS,
} from '@/libs/constants/date';

// import IconButton from '@/components/core/iconButton/IconButton';

type PCModal = {
  onClose: () => void;
};

type Day = (typeof DAYS)[number];

type BottomButtonsType = {
  isDayPicked: (day: Day) => boolean;
  currentChosenDay: Day;
  nextDay: (day: Day) => Day;
  onClose: () => void;
};

const BottomButtons = memo((props: BottomButtonsType) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <Button
        className={mergeClassnames(
          'w-full max-w-lg rounded-full',

        )}
        disabled={!props.isDayPicked(props.currentChosenDay)}
      >
        Lưu & qua
        {' '}
        {props.nextDay(props.currentChosenDay)}
      </Button>
      <Button
        type="button"
        variant="ghost"
        className="max-sm:w-full"
        onClick={props.onClose}
        aria-label="Close"
      >
        {props.nextDay(props.currentChosenDay)}
        {' '}
        tớ bận
      </Button>
    </div>
  );
});

function PersonalCalendar(props: PCModal) {
  /* TODO: Make it so the chosen timeslots will only be saved when pressed on the bottom left button - (for the current Day of Week).
  As of now they are still saved irregardless. */

  const [currentChosenDay, setCurrentChosenDay] = useState<Day>('Monday');
  const [timeSlotsByDay, setTimeSlotsByDay] = useState<
    Record<Day, Set<string>>
  >({
    Monday: new Set(),
    Tuesday: new Set(),
    Wednesday: new Set(),
    Thursday: new Set(),
    Friday: new Set(),
    Saturday: new Set(),
    Sunday: new Set(),
  });

  const toggleTimeSlot = useCallback((slot: string) => {
    setTimeSlotsByDay((prev) => {
      const next = { ...prev };
      const daySlots = new Set(next[currentChosenDay]);
      if (daySlots.has(slot)) {
        daySlots.delete(slot);
      } else {
        daySlots.add(slot);
      }
      next[currentChosenDay] = daySlots;
      return next;
    });
  }, [currentChosenDay]);

  const nextDay = useCallback((day: Day): Day => {
    const idx = DAYS.indexOf(day);
    return DAYS[(idx + 1) % DAYS.length] as Day;
  }, []);

  // Check if a given day has selected time slots
  const isDayPicked = useCallback(
    (day: Day) => timeSlotsByDay[day].size > 0,
    [timeSlotsByDay],
  );

  return (
    <div
      className="flex h-full flex-col items-center gap-6 px-2 pb-20
        pt-6 *:w-full *:max-w-[780px]"
    >
      {/* A Texts */}
      <div className="text-left">
        <h6 className="mb-2 text-[20px] font-medium leading-6">Khi nào mình rảnh nhỉ?</h6>
        <p className="text-[14px] font-light leading-4">
          Chọn vài khung giờ phù hợp để bạn có thể trò chuyện trực tiếp với mọi người
        </p>
      </div>

      {/* B Personal Calendar bg-[#F9F9F9] */}
      <div className="w-full rounded-2xl
        p-2 shadow-[0px_4px_5px_0px_#1C1E211A,0px_0px_4px_0px_#0F0F100F]
        sm:p-6"
      >

        {/* 1. Days of the week */}
        <div className="mb-4 flex justify-between rounded-xl bg-[#F9F9F9] sm:p-1">
          {DAYS.map(day => (
            <Button
              key={day}
              variant="ghost"
              aria-pressed={day === currentChosenDay}
              className={mergeClassnames(
                'flex-1 rounded-lg text-sm font-medium bg-[#F9F9F9]',
                day === currentChosenDay ? 'bg-[#CDDDFE] text-[#0442BF]' : 'text-gray-600',
              )}
              onClick={() => setCurrentChosenDay(day)}
            >
              <span>
                <span className="sm:hidden">
                  {day.slice(0, 3) /* This is for the English Days of Weeks - do figure out a way to abbreviate the Vietnamese version */}
                </span>
                <span className="hidden sm:inline">
                  {day}
                </span>
                {' '}
                <CalendarCheck className={mergeClassnames(
                  'inline mb-0.5',
                  /* conditions that will make the icon 'hidden' or not */
                )}
                />
              </span>
            </Button>
          ))}
        </div>

        {/* 2. Time Slots Grid */}
        <div className="flex flex-col gap-2 rounded-xl bg-[#F9F9F9] p-2 sm:mb-8 sm:gap-4 sm:p-4">
          {(['morning', 'afternoon', 'evening'] as const).map(period => (
            <div key={period} className="grid grid-cols-4 gap-1 rounded-xl bg-white p-3 sm:grid-cols-6">
              {TIME_SLOTS[period].map((time: string) => (
                <Button
                  key={time}
                  variant="outline"
                  className={mergeClassnames(
                    'border border-[#C2C6CF] text-gray-700 bg-white hover:bg-[#FFAB67] rounded-md',
                    'active:text-gray-700',
                    timeSlotsByDay[currentChosenDay].has(time)
                    && 'bg-orange-50 text-white hover:bg-orange-50 focus:text-white active:text-white',
                  )}
                  onClick={() => toggleTimeSlot(time)}
                >
                  {time}
                </Button>
              ))}
            </div>
          ))}
        </div>

        {/* 3A. Bottom Buttons - normal screen */}
        <div className="max-sm:hidden">
          <BottomButtons
            currentChosenDay={currentChosenDay}
            nextDay={nextDay}
            onClose={props.onClose}
            isDayPicked={isDayPicked}
          />
        </div>
      </div>

      {/* 3A. Bottom Buttons - mobile screen */}
      <div className="sm:hidden">
        <BottomButtons
          currentChosenDay={currentChosenDay}
          nextDay={nextDay}
          onClose={props.onClose}
          isDayPicked={isDayPicked}
        />
      </div>
    </div>
  );
}

function Header(props: PCModal) {
  const tCommon = useTranslations('Common');

  return (
    <div className="flex items-center justify-between border-b px-4 pb-2 pt-4 sm:px-8 sm:py-4">
      <h3 className="sm:text-3xl">{tCommon('update_personal_schedule')}</h3>
      <Button
        type="button"
        variant="ghost"
        className=""
        onClick={props.onClose}
        aria-label="Close"
      >
        Cập nhật sau
      </Button>
    </div>
  );
}

export default function PersonalCalendarModal(props: PCModal) {
  return (
    <div className="flex size-full max-h-[900px] flex-col rounded-2xl bg-white shadow-lg">
      <Header {...props} />
      <PersonalCalendar {...props} />
    </div>
  );
}
