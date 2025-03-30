'use client';

import React from 'react';

import BigSchedule from './components/BigSchedule/BigSchedule';
import MiniSchedule from './components/MiniSchedule';
import TimeSlot from './components/TimeSlot';
import UpComingEvent from './components/UpComingEvent';

const WeeklySchedule = () => {
  return (
    <div className="flex h-max flex-row pl-[20px] pt-0">
      <div className="w-[30%]">
        <UpComingEvent />
        <MiniSchedule />
        <TimeSlot />
      </div>
      <div className="mx-[20px] h-full w-[70%]">
        <BigSchedule />
      </div>
    </div>
  );
};

export default WeeklySchedule;
