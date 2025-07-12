'use client';

import React from 'react';

import { useAppSelector, useDeviceType } from '@/libs/hooks';
import { useGetReadingSessionsQuery } from '@/libs/services/modules/reading-session';
import { useGetTimeSlotsHuberQuery } from '@/libs/services/modules/time-slots';

import BigSchedule from './components/BigSchedule/BigSchedule';
import MobileSchedule from './components/BigSchedule/MobileSchedule';
import EmptyMeetingsState from './components/EmptyMeetingsState';
import MiniSchedule from './components/MiniSchedule';
import TimeSlot from './components/TimeSlot';
import UpComingEvent from './components/UpComingEvent';

const WeeklySchedule = () => {
  const user = useAppSelector((state) => state.auth.userInfo);
  const isHuber = user?.role?.name === 'Huber';
  const { deviceType } = useDeviceType();
  const isMobile = deviceType === 'mobile';

  const { data: timeSlotHuber, isLoading: isLoadingTimeSlots } =
    useGetTimeSlotsHuberQuery(
      { id: user?.id },
      { skip: !user?.id || !isHuber },
    );

  const { data: readingSessions, isLoading: isLoadingReadingSessions } =
    useGetReadingSessionsQuery({ upcoming: true });

  const hasUpcomingEvent = readingSessions?.length > 0;

  return (
    <div className="flex h-max flex-col pt-0 lg:flex-row lg:pl-[20px]">
      <div className="w-full lg:w-[344px]">
        {!isLoadingReadingSessions &&
          (hasUpcomingEvent ? (
            <UpComingEvent isHuber={isHuber} />
          ) : (
            <EmptyMeetingsState isHuber={isHuber} />
          ))}

        <MiniSchedule />
        {isHuber && !isLoadingTimeSlots && (
          <TimeSlot timeSlots={timeSlotHuber} />
        )}
      </div>
      <div className="size-full lg:mx-[20px] lg:flex-1">
        {isMobile ? <MobileSchedule /> : <BigSchedule />}
      </div>
    </div>
  );
};

export default WeeklySchedule;
