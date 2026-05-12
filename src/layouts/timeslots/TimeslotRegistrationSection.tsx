'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import Button from '@/components/core/button/Button';
import type { Timeslot } from '@/utils/convertTimeSlotToUtc';
import { mergeClassnames } from '@/components/core/private/utils';
import TimeSlotListHeader from '@/layouts/timeslots/TimeSlotListHeader';

const TimeslotsByPeriod = {
  morning: [
    '06:00',
    '06:30',
    '07:00',
    '07:30',
    '08:00',
    '08:30',
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
  ],
  afternoon: [
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
  ],
  evening: [
    '18:00',
    '18:30',
    '19:00',
    '19:30',
    '20:00',
    '20:30',
    '21:00',
    '21:30',
    '22:00',
    '22:30',
    '23:00',
    '23:30',
  ],
};

type TPeriodLabel = 'morning' | 'afternoon' | 'evening';

type ITimeslotRegistrationSectionProps = {
  selectedSlots?: Timeslot[];
  onSlotToggle?: (slot: Timeslot) => void;
};

export default function TimeslotRegistrationSection({
  selectedSlots = [],
  onSlotToggle,
}: ITimeslotRegistrationSectionProps = {}) {
  const t = useTranslations('Time_slots');
  const [weekDay, setWeekDay] = useState(new Date().getDay());

  const handleClick = (slot: Timeslot) => {
    onSlotToggle?.(slot);
  };

  return (
    <div className="rounded-none bg-white px-4 py-5 shadow-sm xl:rounded-xl xl:px-5">
      <div className="mx-auto flex w-full max-w-md flex-col gap-2">
        <div className="flex flex-col font-medium text-[#03191C]">
          <p className="text-[18px] leading-7">
            {t('available_time_slots')}
          </p>
          <p className="text-sm leading-4">
            {t('available_time_slots_description')}
          </p>
        </div>
        <div className="flex flex-col gap-2.5 py-4">
          <TimeSlotListHeader
            currentDayOfWeek={weekDay}
            onCurrentDayOfWeekChange={(day: number) => setWeekDay(day)}
          />
          <div className="flex flex-col gap-2.5">
            {Object.entries(TimeslotsByPeriod).map(([period, slots]) => (
              <div key={period} className="rounded-lg bg-neutral-98 p-3">
                <div className="grid grid-cols-6 gap-2">
                  {slots.map(slot => (
                    <div
                      key={`${weekDay}-${slot}`}
                      role="button"
                      tabIndex={0}
                      className={mergeClassnames(
                        'transition-colors rounded-[100px] px-2 py-1 text-center text-sm font-medium leading-4',
                        selectedSlots.some(
                          selectedSlot => selectedSlot.dayOfWeek === weekDay && selectedSlot.startTime === slot,
                        )
                          ? 'bg-green-90 text-green-30' : 'bg-neutral-90 text-neutral-50',
                      )}
                      onClick={() => handleClick({ dayOfWeek: weekDay, startTime: slot })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleClick({ dayOfWeek: weekDay, startTime: slot });
                        }
                      }}
                    >
                      {slot}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center">
            <Button
              variant="outline"
              size="lg"
              className="w-fit px-12"
              onClick={() => setWeekDay(prevState => prevState < 6 ? prevState + 1 : 0)}
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export type TDaySlots = Record<TPeriodLabel, string[]>;
export type { Timeslot } from '@/utils/convertTimeSlotToUtc';
