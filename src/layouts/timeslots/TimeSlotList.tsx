'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { toZonedTime } from 'date-fns-tz';
import { format } from 'date-fns';

import type { TDaySlots } from './TimeslotRegistrationSection';
import TimeslotRegistrationSection from './TimeslotRegistrationSection';
import TimeSlotListHeader from './TimeSlotListHeader';

import Button from '@/components/button/Button';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import Modal from '@/components/Modal';
import {
  AFTERNOON_TIME_START,
  EVENING_TIME_START,
  MORNING_TIME_START,
} from '@/libs/constants/date';
import { useAppSelector } from '@/libs/hooks';
import { useGetTimeslotsByHuberQuery } from '@/libs/services/modules/time-slots';
import { ROLE_NAME, Role } from '@/types/common';
import { REFERENCE_MONDAY } from '@/utils/dateUtils';

type TPeriodLabel = 'morning' | 'afternoon' | 'evening';

export default function TimeSlotList() {
  const t = useTranslations('Time_slots');

  const userInfo = useAppSelector(state => state.auth.userInfo);
  const isHuber = userInfo?.role?.name === ROLE_NAME[Role.HUBER];

  const { data, isLoading: isGettingTimeslots } = useGetTimeslotsByHuberQuery(
    { id: userInfo?.id },
    { skip: !userInfo?.id || !isHuber },
  );

  const [weekDay, setWeekDay] = useState(new Date().getDay());
  const [timeslotsByDayAndPeriod, setTimeslotsByDayAndPeriod] = useState<Record<string, TDaySlots>>({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const getPeriodLabel = (timeslot: string): TPeriodLabel => {
      const [hours, minutes] = timeslot.split(':').map(Number);
      const startTime = (hours ?? 0) + (minutes ?? 0) / 60;
      if (startTime >= MORNING_TIME_START && startTime < AFTERNOON_TIME_START) {
        return 'morning';
      }
      if (startTime >= AFTERNOON_TIME_START && startTime < EVENING_TIME_START) {
        return 'afternoon';
      }
      return 'evening';
    };
    const convertUtcToLocal = (slot: { dayOfWeek: number; startTime: string }): { weekday: number; timeslot: string } => {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

      // Build UTC datetime relative to anchor
      const [hours, minutes] = slot.startTime.split(':').map(Number);

      const anchorWeekday = REFERENCE_MONDAY.getDay();
      const diff = (slot.dayOfWeek - anchorWeekday + 7) % 7; // how many days to move
      const utcDate = new Date(Date.UTC(
        REFERENCE_MONDAY.getUTCFullYear(),
        REFERENCE_MONDAY.getUTCMonth(),
        REFERENCE_MONDAY.getUTCDate() + diff,
        hours ?? 0,
        minutes ?? 0,
      ));

      // Convert to a local timezone
      const zoned = toZonedTime(utcDate, tz);

      return {
        weekday: zoned.getDay(),
        timeslot: format(zoned, 'HH:mm'),
      };
    };
    const groupSlotsByWeekday = (slots: { dayOfWeek: number; startTime: string }[]) => {
      const grouped: Record<number, TDaySlots> = {};

      slots.forEach((slot) => {
        const local = convertUtcToLocal(slot);
        const period = getPeriodLabel(local.timeslot);

        if (!grouped[local.weekday]) {
          grouped[local.weekday] = { morning: [], afternoon: [], evening: [] };
        }
        const daySlots = grouped[local.weekday]!; // non-null now
        daySlots[period].push(local.timeslot);
      });

      // sort times in each period
      Object.values(grouped).forEach((periods) => {
        (Object.keys(periods) as TPeriodLabel[]).forEach((p) => {
          periods[p]?.sort((a, b) => a.localeCompare(b));
        });
      });

      return grouped;
    };

    if (data) {
      const groupedData = groupSlotsByWeekday(data);
      setTimeslotsByDayAndPeriod(groupedData);
    }
  }, [data]);

  const currentDayMorningSlots = timeslotsByDayAndPeriod[weekDay]?.morning || [];
  const currentDayAfternoonSlots = timeslotsByDayAndPeriod[weekDay]?.afternoon || [];
  const currentDayEveningSlots = timeslotsByDayAndPeriod[weekDay]?.evening || [];
  const totalSlotNum = currentDayMorningSlots.length + currentDayAfternoonSlots.length + currentDayEveningSlots.length;

  if (!isHuber) {
    return null;
  }

  if (isGettingTimeslots) {
    return (<LoadingSkeleton />);
  }

  return (
    <div className="flex flex-col justify-center gap-4 rounded-xl bg-white px-4 py-3 shadow-md">
      <div className="flex flex-col font-medium text-[#03191C]">
        <p className="text-[18px] leading-7">
          {t('available_time_slots')}
        </p>
        <p className="text-sm leading-4">
          {t('available_time_slots_description')}
        </p>
      </div>
      <div className="flex flex-col gap-2.5">
        <TimeSlotListHeader
          scrollable
          currentDayOfWeek={weekDay}
          onCurrentDayOfWeekChange={(day: number) => setWeekDay(day)}
          slots={totalSlotNum}
        />
        <div className="flex flex-col gap-2.5">
          {currentDayMorningSlots.length > 0 && (
            <div className="flex w-full items-center gap-1 overflow-x-auto rounded-lg bg-white p-2">
              {currentDayMorningSlots.map((time, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 rounded-[100px] border border-green-80 bg-green-90 px-2 py-1 text-sm font-medium leading-4 text-green-30"
                >
                  {time}
                </div>
              ))}
            </div>
          )}

          {currentDayAfternoonSlots.length > 0 && (
            <div className="flex w-full items-center gap-1 overflow-x-auto rounded-lg bg-white p-2">
              {currentDayAfternoonSlots.map((time, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 rounded-[100px] border border-green-80 bg-green-90 px-2 py-1 text-sm font-medium leading-4 text-green-30"
                >
                  {time}
                </div>
              ))}
            </div>
          )}

          {currentDayEveningSlots.length > 0 && (
            <div className="flex w-full items-center gap-1 overflow-x-auto rounded-lg bg-white p-2">
              {currentDayEveningSlots.map((time, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 rounded-[100px] border border-green-80 bg-green-90 px-2 py-1 text-sm font-medium leading-4 text-green-30"
                >
                  {time}
                </div>
              ))}
            </div>
          )}
        </div>
        <Button
          size="lg"
          onClick={() => setIsEditModalOpen(true)}
        >
          {t('update_time_slots')}
        </Button>
      </div>
      {/* Edit timeslots modal */}
      {isEditModalOpen && (
        <Modal
          open
          disableClosingTrigger={false}
          onClose={() => setIsEditModalOpen(false)}
        >
          <Modal.Backdrop />
          <Modal.Panel className="max-w-[600px] rounded-[20px] p-5 shadow-none">
            <div className="flex flex-col gap-6">
              <h2 className="text-4xl font-medium leading-[44px] text-black">Update your slots</h2>
              <TimeslotRegistrationSection
                onBack={() => setIsEditModalOpen(false)}
                onSucceed={() => setIsEditModalOpen(false)}
              />
            </div>
          </Modal.Panel>
        </Modal>
      )}
    </div>
  );
};
