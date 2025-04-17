'use client';

import React from 'react';

import { useAppSelector } from '@/libs/hooks';
import { useGetTimeSlotsHuberQuery } from '@/libs/services/modules/time-slots';

import BigSchedule from './components/BigSchedule/BigSchedule';
import MiniSchedule from './components/MiniSchedule';
import TimeSlot from './components/TimeSlot';
import UpComingEvent from './components/UpComingEvent';

const WeeklySchedule = () => {
  const user = useAppSelector((state) => state.auth.userInfo);
  const isHuber = user?.role?.name === 'Human Book';
  const { data: timeSlotHuber, isLoading: isLoadingTimeSlots } =
    useGetTimeSlotsHuberQuery(
      { id: user?.id },
      {
        skip: !user?.id || !isHuber,
      },
    );

  return (
    <div className="flex h-max flex-row pl-[20px] pt-0">
      <div className="w-[30%]">
        <UpComingEvent />
        <MiniSchedule />
        {isHuber && !isLoadingTimeSlots && (
          <TimeSlot timeSlots={timeSlotHuber} />
        )}
      </div>
      <div className="mx-[20px] h-full w-[70%]">
        <BigSchedule />
      </div>
    </div>
  );
};

export default WeeklySchedule;
