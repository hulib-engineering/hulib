'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { parse } from 'date-fns';
import { formatInTimeZone, fromZonedTime } from 'date-fns-tz';

import Button from '@/components/core/button/Button';
import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';
import TimeSlotListHeader from '@/layouts/timeslots/TimeSlotListHeader';
import { useCreateTimeslotsMutation } from '@/libs/services/modules/time-slots';
import { REFERENCE_MONDAY } from '@/utils/dateUtils';
import { mergeClassnames } from '@/components/core/private/utils';

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
export type TDaySlots = Record<TPeriodLabel, string[]>;
type ITimeslotRegistrationSectionProps = {
  onBack: () => void;
  onSucceed?: () => void;
};

export default function TimeslotRegistrationSection({ onBack, onSucceed }: ITimeslotRegistrationSectionProps) {
  const t = useTranslations('Time_slots');

  const [registerTimeSlots, { isLoading: isRegisteringTimeslots }] = useCreateTimeslotsMutation();

  const [weekDay, setWeekDay] = useState(new Date().getDay());
  const [selectedTimeslots, setSelectedTimeslots] = useState<{ dayOfWeek: number; startTime: string }[]>([]);

  const convertSlotToUtc = (slot: { dayOfWeek: number; startTime: string }) => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Parse the "clock time" with an anchor date (REFERENCE_MONDAY is Monday 00:00 UTC)
    const localDate = parse(slot.startTime, 'HH:mm', REFERENCE_MONDAY);

    // Move date forward to the correct weekday
    // Force it to the right weekday (relative to anchor Monday = 1)
    const anchorWeekday = REFERENCE_MONDAY.getDay();
    const diff = (slot.dayOfWeek - anchorWeekday + 7) % 7; // how many days to move
    localDate.setDate(REFERENCE_MONDAY.getDate() + diff);

    // step3: convert localDate → UTC
    const utcDate = fromZonedTime(localDate, tz);
    return {
      dayOfWeek: utcDate.getUTCDay(),
      startTime: formatInTimeZone(utcDate, 'UTC', 'HH:mm'),
    };
  };

  const handleClick = (slot: { dayOfWeek: number; startTime: string }) => {
    setSelectedTimeslots([...selectedTimeslots, slot]);
  };
  const handleUpdateClick = async () => {
    try {
      await registerTimeSlots({
        timeSlots: selectedTimeslots.map(selectedTimeslot => convertSlotToUtc(selectedTimeslot)),
      }).unwrap();
      pushSuccess(t('success_time_slots_description'));
    } catch (error: any) {
      pushError(t(error?.message || 'error_contact_admin'));
    } finally {
      if (onSucceed) {
        onSucceed();
      }
    }
  };

  return (
    <>
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
                          selectedTimeslots.some(
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
                className="hidden w-fit px-12 xl:flex"
                onClick={() => setWeekDay(prevState => prevState < 6 ? prevState + 1 : 0)}
              >
                Confirm
              </Button>
              <Button
                variant="outline"
                size="lg"
                animation={isRegisteringTimeslots && 'progress'}
                disabled={selectedTimeslots.length === 0 || isRegisteringTimeslots}
                className="w-fit px-12 xl:hidden"
                onClick={handleUpdateClick}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden w-full items-center justify-center gap-3 py-2 xl:flex">
        <Button
          variant="outline"
          size="lg"
          fullWidth
          onClick={onBack}
        >
          Back
        </Button>
        <Button
          size="lg"
          fullWidth
          animation={isRegisteringTimeslots && 'progress'}
          disabled={selectedTimeslots.length === 0 || isRegisteringTimeslots}
          onClick={handleUpdateClick}
        >
          Next
        </Button>
      </div>
    </>
  );
};
