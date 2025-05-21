'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import Button from '@/components/button/Button';
import AvailableSchedule from '@/components/common/AvailableSchedule';
import HeadSlots from '@/components/common/HeadSlots';
import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';
import Modal from '@/components/Modal';
import {
  AFTERNOON_TIME_START,
  DAY_STRING,
  EVENING_TIME_START,
  MONTH_STRING,
  MORNING_TIME_START,
  WEEK_DAY_MAP,
  WEEK_STRING,
  YEAR_STRING,
} from '@/libs/constants/date';
import { useCreateTimeSlotsMutation } from '@/libs/services/modules/time-slots';
import type {
  TimeSlotItem,
  TimeSlots,
} from '@/libs/services/modules/time-slots/timeSlotsType';

type TimeSlotType = 'morning' | 'afternoon' | 'evening';
type DayTimeSlots = Record<TimeSlotType, any[]>;
type WeekTimeSlots = Record<string, DayTimeSlots>;

function TimeSlot({ timeSlots }: { timeSlots: any }) {
  const [currentDate, setCurrentDate] = useState<any>('');
  const listTime: string[] = [];
  const [listDay, setListDay] = useState<Record<string, TimeSlots>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createTimeSlots, { isLoading }] = useCreateTimeSlotsMutation();
  const t = useTranslations('Time_slots');

  const handleUpdateTimeSlot: () => void = () => {
    setIsModalOpen(true);
  };

  const submitUpdateSlots = async () => {
    try {
      const sanitizedListDay = Object.entries(listDay).flatMap(([_, slots]) =>
        (['morning', 'afternoon', 'evening'] as const).flatMap((timeSlot) =>
          (slots[timeSlot as keyof TimeSlots] || []).map(
            ({ startTime, dayOfWeek }: TimeSlotItem) => ({
              dayOfWeek,
              startTime,
            }),
          ),
        ),
      );

      await createTimeSlots({ timeSlots: sanitizedListDay }).unwrap();
      pushSuccess(t('success_time_slots_description'));
    } catch (error: any) {
      pushError(t(error?.message || 'error_contact_admin'));
    } finally {
      setIsModalOpen(false);
    }
  };

  const getCurrentDay = () => {
    const today = new Date().getDay();
    setCurrentDate(WEEK_STRING[today]);
  };

  useEffect(() => {
    getCurrentDay();
  }, []);

  // display time slot depend on day was choosed
  const handleSelectDay = (day: number | string) => {
    if (typeof day === 'number') {
      // Convert numeric day to string format ('MON', 'TUE', etc.)

      setCurrentDate(WEEK_STRING[day as keyof typeof WEEK_STRING]);
    } else {
      setCurrentDate(day);
    }
  };

  useEffect(() => {
    if (listTime.length > 0) {
      const date = new Date();
      const formatter = new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });

      const parts = formatter.formatToParts(date);
      const day = parts.find((p) => p.type === DAY_STRING)?.value;
      const month = parts.find((p) => p.type === MONTH_STRING)?.value;
      const year = parts.find((p) => p.type === YEAR_STRING)?.value;
      setCurrentDate(`${day} ${month}, ${year}`);
    }
  }, []);

  const updateSelectedTime = (time: string, day: number) => {
    const [hours, minutes] = time.split(':').map(Number);
    const startTime = (hours ?? 0) + (minutes ?? 0) / 60;

    let timeSlotType: keyof TimeSlots = 'morning';
    if (startTime >= AFTERNOON_TIME_START && startTime < EVENING_TIME_START) {
      timeSlotType = 'afternoon';
    } else if (startTime >= EVENING_TIME_START) {
      timeSlotType = 'evening';
    }

    setListDay((prev) => {
      const updatedDay = WEEK_STRING[day] as string;
      const existingTimeSlot = prev[updatedDay]?.[timeSlotType]?.find(
        (slot) => slot.startTime === time,
      );

      const updatedTimeSlot = existingTimeSlot
        ? prev[updatedDay]?.[timeSlotType]?.filter(
            (slot) => slot.startTime !== time,
          )
        : [
            ...(prev[updatedDay]?.[timeSlotType] || []),
            { startTime: time, dayOfWeek: day },
          ];

      return {
        ...prev,
        [updatedDay]: {
          morning: prev[updatedDay]?.morning || [],
          afternoon: prev[updatedDay]?.afternoon || [],
          evening: prev[updatedDay]?.evening || [],
          [timeSlotType]: updatedTimeSlot,
        },
      };
    });
  };

  const getTimeSlotType = (startTime: number): TimeSlotType => {
    if (startTime >= MORNING_TIME_START && startTime < AFTERNOON_TIME_START) {
      return 'morning';
    }
    if (startTime >= AFTERNOON_TIME_START && startTime < EVENING_TIME_START) {
      return 'afternoon';
    }
    return 'evening';
  };

  const formatData = (result: any) => {
    // Initialize empty time slots for each day
    const weekTimeSlots: WeekTimeSlots = {
      MON: { morning: [], afternoon: [], evening: [] },
      TUE: { morning: [], afternoon: [], evening: [] },
      WED: { morning: [], afternoon: [], evening: [] },
      THU: { morning: [], afternoon: [], evening: [] },
      FRI: { morning: [], afternoon: [], evening: [] },
      SAT: { morning: [], afternoon: [], evening: [] },
      SUN: { morning: [], afternoon: [], evening: [] },
    };

    // Map day numbers to day strings
    const dayMap: Record<number, string> = {
      1: 'MON',
      2: 'TUE',
      3: 'WED',
      4: 'THU',
      5: 'FRI',
      6: 'SAT',
      0: 'SUN',
    };

    result.forEach((element: any) => {
      const stringDate = element?.startTime ?? 0;
      const [hours, minutes] = stringDate.split(':').map(Number);
      const startTime = (hours ?? 0) + (minutes ?? 0) / 60;

      const { dayOfWeek } = element;
      const dayString = dayMap[dayOfWeek];

      if (dayString && weekTimeSlots[dayString]) {
        const timeSlotType = getTimeSlotType(startTime);
        weekTimeSlots[dayString][timeSlotType].push(element);
      }
    });

    setListDay({
      ...listDay,
      ...weekTimeSlots,
    });
  };

  useEffect(() => {
    if (timeSlots) {
      formatData(timeSlots);
    }
  }, [timeSlots]);

  const hasMorningSlots = (listDay[currentDate]?.morning?.length || 0) > 0;
  const hasAfternoonSlots = (listDay[currentDate]?.afternoon?.length || 0) > 0;
  const hasEveningSlots = (listDay[currentDate]?.evening?.length || 0) > 0;

  return (
    <div className="mb-[20px] flex flex-col justify-center rounded-[12px] bg-[#fff] p-[16px] drop-shadow-md">
      <div className="my-[10px]">
        <p className="text-[18px] font-[500] leading-[28px] text-[#03191C]">
          {t('available_time_slots')}
        </p>
        <p className="text-[12px] font-[500] leading-[16px] text-[#03191C]">
          {t('available_time_slots_description')}
        </p>
      </div>
      {/* {currentDate} */}
      <HeadSlots
        dayOfWeek={WEEK_DAY_MAP[currentDate]}
        onChangeDayOfWeek={(day: number) => handleSelectDay(day)}
        selectedTimes={
          listDay[currentDate]?.morning.concat(
            listDay[currentDate]?.afternoon,
            listDay[currentDate]?.evening,
          ) || []
        }
        availableSlot
      />
      <div>
        {hasMorningSlots && (
          <div className="mb-[10px] flex flex-wrap items-center justify-start gap-[4px] rounded-[8px] bg-[#F9F9F9] p-[8px]">
            {(listDay[currentDate] as { morning: any[] }).morning.map(
              (time: any, index: any) => (
                <div
                  key={index}
                  className="my-[2px] flex h-[20px] w-[calc((100%/6)-4px)] items-center justify-center rounded-[16px] bg-[#D9F9CF] text-[8px] text-[#2A8010]"
                >
                  {time.startTime}
                </div>
              ),
            )}
          </div>
        )}

        {hasAfternoonSlots && (
          <div className="mb-[10px] flex flex-wrap items-center justify-start gap-[4px] rounded-[8px] bg-[#F9F9F9] p-[8px]">
            {(listDay[currentDate] as { afternoon: any[] }).afternoon.map(
              (time: any, index: any) => (
                <div
                  key={index}
                  className="my-[2px] flex h-[20px] w-[calc((100%/6)-4px)] items-center justify-center rounded-[16px] bg-[#D9F9CF] text-[8px] text-[#2A8010]"
                >
                  {time.startTime}
                </div>
              ),
            )}
          </div>
        )}
        {hasEveningSlots && (
          <div className="mb-[10px] flex flex-wrap items-center justify-start gap-[4px] rounded-[8px] bg-[#F9F9F9] p-[8px]">
            {(listDay[currentDate] as { evening: any[] }).evening.map(
              (time: any, index: any) => (
                <div
                  key={index}
                  className="my-[2px] flex h-[20px] w-[calc((100%/6)-4px)] items-center justify-center rounded-[16px] bg-[#D9F9CF] text-[8px] text-[#2A8010]"
                >
                  {time?.startTime}
                </div>
              ),
            )}
          </div>
        )}
      </div>

      <div className="mt-2 w-full">
        <button
          type="button"
          onClick={handleUpdateTimeSlot}
          className="hove:opacity-[0.9] mb-[10px] flex min-h-[30px] w-full items-center justify-center rounded-[20px] bg-[#0442BF] p-[8px]"
        >
          {/* <CalendarPlus size={16} color="#ffffff" className="inline-block mt-[-4px]"/> */}
          <span className="ml-[6px] inline-block text-[14px] font-[500] leading-[20px] text-white">
            {t('update_time_slots')}
          </span>
        </button>
      </div>
      {isModalOpen && (
        <Modal
          onClose={() => setIsModalOpen(false)}
          open={isModalOpen}
          disableClosingTrigger={false}
        >
          <Modal.Backdrop />
          <Modal.Panel className="inset-0 flex w-[550px] items-center justify-center">
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <Modal.Title>{t('available_time_slots')} </Modal.Title>
              <span>{t('select_time_slots')}</span>
              <HeadSlots
                dayOfWeek={WEEK_DAY_MAP[currentDate]}
                onChangeDayOfWeek={(day: number) => handleSelectDay(day)}
                selectedTimes={
                  listDay[currentDate]?.morning.concat(
                    listDay[currentDate]?.afternoon,
                    listDay[currentDate]?.evening,
                  ) || []
                }
              />
              <AvailableSchedule
                onSelectTime={(time: string, day: number) =>
                  updateSelectedTime(time, day)
                }
                selectedTimes={
                  listDay[currentDate]?.morning.concat(
                    listDay[currentDate]?.afternoon,
                    listDay[currentDate]?.evening,
                  ) || []
                }
                currentDay={WEEK_DAY_MAP[currentDate] || 0}
              />
              <div className="mt-6 flex justify-end">
                <Button
                  onClick={submitUpdateSlots}
                  className=" w-full"
                  animation={isLoading ? 'progress' : undefined}
                >
                  {t('update_time_slots')}
                </Button>
              </div>
            </div>
          </Modal.Panel>
        </Modal>
      )}
    </div>
  );
}

export default TimeSlot;
