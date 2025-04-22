'use client';

import { Globe } from '@phosphor-icons/react';
import { isEmpty } from 'lodash';
import * as React from 'react';

import Button from '@/components/button/Button';
import { mergeClassnames } from '@/components/private/utils';
import {
  AFTERNOON_TIME_START,
  EVENING_TIME_START,
  MORNING_TIME_START,
} from '@/libs/constants/date';
import { useGetTimeSlotsHuberQuery } from '@/libs/services/modules/time-slots';
import type { TimeSlot } from '@/libs/services/modules/time-slots/getAllTimeSlots';

import OneWeek from '../schedule/components/OneWeek';
import ScheduleBasicInfo from './ScheduleBasicInfo';

export interface IAttendee {
  icon: string;
  role: string;
  fullName: string;
}

export const MainScreen = ({
  attendees,
  selectDate,
  selectTime,
  huberId,
  onSelectDay,
  onSelectTime,
  nextStep,
}: {
  attendees: { liber: IAttendee; huber: any };
  selectDate: Date;
  selectTime: string;
  huberId: number;
  onSelectDay: (day: Date) => void;
  onSelectTime: (time: string) => void;
  nextStep: () => void;
}) => {
  const { data: timeSlots } = useGetTimeSlotsHuberQuery({
    id: Number(huberId),
  });

  const filterTimeSlots: TimeSlot[] = React.useMemo(() => {
    return (
      timeSlots?.filter(
        (timeSlot: TimeSlot) => timeSlot.dayOfWeek === selectDate?.getDay(),
      ) ?? []
    );
  }, [selectDate, timeSlots]);

  const convertToAmPm = (time24hr: string): string => {
    const [hour24, minute] = time24hr.split(':').map(Number);
    const safeHour24 = hour24 ?? 0;
    const period = safeHour24 >= 12 ? 'PM' : 'AM';
    const hour12 = safeHour24 % 12 === 0 ? 12 : safeHour24 % 12;

    return `${hour12}:${minute?.toString().padStart(2, '0')} ${period}`;
  };

  const morningTimeSlot = React.useMemo(() => {
    const times = filterTimeSlots
      .filter(
        (time) =>
          Number(time.startTime.slice(0, 2)) >= MORNING_TIME_START &&
          Number(time.startTime.slice(0, 2)) < AFTERNOON_TIME_START,
      )
      .map((item) => item.startTime);
    return times.map((it) => convertToAmPm(it));
  }, [filterTimeSlots]);

  const afterNoonTimeSlot = React.useMemo(() => {
    const times = filterTimeSlots
      .filter(
        (time) =>
          Number(time.startTime.slice(0, 2)) >= AFTERNOON_TIME_START &&
          Number(time.startTime.slice(0, 2)) < EVENING_TIME_START,
      )
      .map((item) => item.startTime);
    return times.map((it) => convertToAmPm(it));
  }, [filterTimeSlots]);

  const eveningTimeSlot = React.useMemo(() => {
    const times = filterTimeSlots
      .filter(
        (time) => Number(time.startTime.slice(0, 2)) >= EVENING_TIME_START,
      )
      .map((item) => item.startTime);
    return times.map((it) => convertToAmPm(it));
  }, [filterTimeSlots]);

  const onClickDate = (day: Date) => {
    if (selectDate === day) {
      return;
    }
    onSelectDay(day);
  };

  const onClickTime = (time: string) => {
    if (selectTime === time) {
      return;
    }
    onSelectTime(time);
  };

  const timeBlock = (list: string[]) => {
    if (list.length === 0) {
      return null;
    }
    return (
      <div className="flex w-full flex-wrap items-center gap-x-1 gap-y-2 xl:p-3">
        {list.map((item) => (
          <button
            key={item}
            type="button"
            className={mergeClassnames(
              'rounded-full px-3 py-1 text-sm font-medium border hover:opacity-70',
              selectTime === item
                ? 'bg-primary-50 border-primary-50 text-white'
                : 'bg-white border-neutral-90 text-neutral-10',
            )}
            onClick={() => onClickTime(item)}
          >
            {item}
          </button>
        ))}
      </div>
    );
  };

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const timeLineClass =
    'flex grid-cols-[100px_auto] min-h-[60px] flex-col items-center gap-x-4 gap-y-2 md:grid';

  return (
    <div className="flex h-full w-full flex-col gap-6 bg-neutral-98 xl:flex-row">
      <ScheduleBasicInfo attendees={attendees} />
      <div className="flex w-full flex-col gap-y-4 rounded-3xl bg-white p-4 xl:w-2/3 xl:p-8">
        <h4 className="text-[28px] font-medium">Schedule your meeting</h4>
        <p className="text-[18px] font-normal text-neutral-20">
          Choose your meeting time
        </p>
        <p className="text-base font-normal text-neutral-40">
          Huber&apos;s time zone
        </p>
        <div className="flex items-center gap-x-2 text-sm font-medium text-[#009BEE]">
          <Globe size={16} color="#009BEE" weight="fill" />
          ICT | GMT-7
        </div>
        <div className="flex flex-col">
          <OneWeek
            selectDate={selectDate}
            setSelectDate={onClickDate}
            todayClass="border border-neutral-80"
            selectedClass="border border-primary-500 bg-primary-50 text-white"
          />

          <p className="text-xs font-normal text-neutral-60">
            Please choose a time
          </p>
        </div>

        <div className="flex flex-col gap-y-2 rounded-3xl bg-white p-4 shadow-lg">
          <p className="text-sm font-medium text-neutral-10">
            {selectDate?.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: '2-digit',
            })}
          </p>
          <div className="flex flex-col gap-y-2">
            <div className={timeLineClass}>
              <span className="text-base font-normal text-neutral-40">
                Morning
              </span>
              {morningTimeSlot.length > 0 && timeBlock(morningTimeSlot)}
            </div>
            <div className={timeLineClass}>
              <span className="text-base font-normal text-neutral-40">
                Afternoon
              </span>
              {afterNoonTimeSlot.length > 0 && timeBlock(afterNoonTimeSlot)}
            </div>
            <div className={timeLineClass}>
              <span className="text-base font-normal text-neutral-40">
                Night
              </span>
              {eveningTimeSlot.length > 0 && timeBlock(eveningTimeSlot)}
            </div>
          </div>
        </div>
        <p className="text-xs font-normal text-neutral-60">
          Please choose a time
        </p>

        <Button
          variant="primary"
          className="w-full text-base font-medium text-white md:w-[300px]"
          disabled={!selectDate || isEmpty(selectTime)}
          onClick={nextStep}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
