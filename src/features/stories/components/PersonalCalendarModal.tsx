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
import { useCreateTimeslotsMutation } from '@/libs/services/modules/time-slots';
import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';

// import IconButton from '@/components/core/iconButton/IconButton';

type PCModal = {
  onClose: () => void;
};

type Day = (typeof DAYS)[number];

const DAY_TO_FULL_KEY: Record<Day, 'day_full_0' | 'day_full_1' | 'day_full_2' | 'day_full_3' | 'day_full_4' | 'day_full_5' | 'day_full_6'> = {
  Monday: 'day_full_1',
  Tuesday: 'day_full_2',
  Wednesday: 'day_full_3',
  Thursday: 'day_full_4',
  Friday: 'day_full_5',
  Saturday: 'day_full_6',
  Sunday: 'day_full_0',
};

const DAY_TO_SHORT_EN: Record<Day, 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'> = {
  Monday: 'Mon',
  Tuesday: 'Tue',
  Wednesday: 'Wed',
  Thursday: 'Thu',
  Friday: 'Fri',
  Saturday: 'Sat',
  Sunday: 'Sun',
};

type BottomButtonsType = {
  isDayPicked: (day: Day) => boolean;
  currentChosenDay: Day;
  nextDay: (day: Day) => Day;
  onSaveAndNext: () => void;
  onSkip: () => void;
  isSaving?: boolean;
};

function BottomButtons(props: BottomButtonsType) {
  const tSlots = useTranslations('Time_slots');
  const t = useTranslations('PersonalCalendarModal');
  const nextDayLabel = tSlots(DAY_TO_FULL_KEY[props.nextDay(props.currentChosenDay)]);
  const currentDayLabel = tSlots(DAY_TO_FULL_KEY[props.currentChosenDay]);
  return (
    <div className="flex items-center justify-between gap-4">
      <Button
        className={mergeClassnames(
          'w-full max-w-lg rounded-full',

        )}
        disabled={!props.isDayPicked(props.currentChosenDay) || props.isSaving}
        animation={props.isSaving ? 'progress' : undefined}
        onClick={props.onSaveAndNext}
      >
        {tSlots('save_and_next', { day: nextDayLabel })}
      </Button>
      <Button
        type="button"
        variant="ghost"
        className="max-sm:w-full"
        onClick={props.onSkip}
        aria-label="Close"
      >
        {t('i_am_busy', { day: currentDayLabel })}
      </Button>
    </div>
  );
};
const MemoBottomButtons = memo(BottomButtons);

function PersonalCalendar(_props: PCModal) {
  const tSlots = useTranslations('Time_slots');
  const t = useTranslations('PersonalCalendarModal');
  const tCommon = useTranslations('Common');

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
  const [createTimeslots, { isLoading: isCreating }] = useCreateTimeslotsMutation();
  const dayOfWeekMap: Record<Day, number> = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
    Sunday: 0,
  };

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
  }, [DAYS]);

  // Check if a given day has selected time slots
  const isDayPicked = useCallback(
    (day: Day) => timeSlotsByDay[day].size > 0,
    [timeSlotsByDay],
  );

  const handleSaveAndNext = useCallback(async () => {
    const slots = timeSlotsByDay[currentChosenDay];
    if (slots.size > 0) {
      try {
        await createTimeslots({
          timeSlots: Array.from(slots).map(time => ({
            dayOfWeek: dayOfWeekMap[currentChosenDay],
            startTime: time,
          })),
        }).unwrap();
        pushSuccess(tSlots('save_success'));
      } catch {
        pushError(tCommon('error_contact_admin'));
        return;
      }
    }
    setCurrentChosenDay(current => nextDay(current));
  }, [currentChosenDay, timeSlotsByDay, createTimeslots, nextDay, tSlots]);

  const handleSkip = useCallback(() => {
    setCurrentChosenDay(current => nextDay(current));
  }, [nextDay]);

  return (
    <div
      className="flex h-full flex-col items-center gap-6 px-2 pb-20
        pt-6 *:w-full *:max-w-[780px]"
    >
      {/* A Texts */}
      <div className="text-left">
        <h6 className="mb-2 text-[20px] font-medium leading-7 text-neutral-1">{t('when_am_i_free')}</h6>
        <p className="text-[14px] font-normal leading-4 text-neutral-10">
          {t('description')}
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
                'flex-1 rounded-lg text-xs leading-[14px] font-normal bg-[#F9F9F9]',
                day === currentChosenDay ? 'bg-[#CDDDFE] text-[#0442BF]' : 'text-gray-600',
              )}
              onClick={() => setCurrentChosenDay(day)}
            >
              <span>
                <span className="sm:hidden">
                  {DAY_TO_SHORT_EN[day]}
                </span>
                <span className="hidden sm:inline">
                  {tSlots(DAY_TO_FULL_KEY[day])}
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
                    'text-sm leading-4 font-medium border border-[#C2C6CF] text-gray-700 bg-white hover:bg-[#FFAB67] rounded-md',
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
          <MemoBottomButtons
            currentChosenDay={currentChosenDay}
            nextDay={nextDay}
            onSaveAndNext={handleSaveAndNext}
            onSkip={handleSkip}
            isDayPicked={isDayPicked}
            isSaving={isCreating}
          />
        </div>
      </div>

      {/* 3A. Bottom Buttons - mobile screen */}
      <div className="sm:hidden">
        <MemoBottomButtons
          currentChosenDay={currentChosenDay}
          nextDay={nextDay}
          onSaveAndNext={handleSaveAndNext}
          onSkip={handleSkip}
          isDayPicked={isDayPicked}
          isSaving={isCreating}
        />
      </div>
    </div>
  );
}

function Header(props: PCModal) {
  const tCommon = useTranslations('Common');
  const t = useTranslations('PersonalCalendarModal');

  return (
    <div className="flex items-center justify-between border-b px-4 pb-2 pt-4 sm:px-8 sm:py-4">
      <h3 className="text-xl leading-7 sm:text-3xl">{tCommon('update_personal_schedule')}</h3>
      <Button
        type="button"
        variant="ghost"
        className="text-sm font-medium leading-4 sm:text-base"
        onClick={props.onClose}
        aria-label="Close"
      >
        {t('update_later')}
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
