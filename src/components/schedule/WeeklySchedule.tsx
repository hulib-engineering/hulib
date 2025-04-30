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
      { id: 23 },
      {
        skip: !user?.id || !isHuber,
      },
    );

  return (
    <div className="flex h-max flex-col pt-0 lg:flex-row lg:pl-[20px]">
      <div className="w-full lg:w-[344px]">
        <UpComingEvent />
        <MiniSchedule />
        {isHuber && !isLoadingTimeSlots && (
          <TimeSlot timeSlots={timeSlotHuber} />
        )}
      </div>
      <div className="h-full w-full lg:mx-[20px] lg:flex-1">
        <BigSchedule />
      </div>
    </div>
  );
};

export default WeeklySchedule;
