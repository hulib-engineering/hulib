'use client';

import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import { addDays, format, isToday, startOfWeek } from 'date-fns';
import { useState } from 'react';

export default function OneWeek() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 0 });
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getWeekDays = () => {
    return Array.from({ length: 7 }, (_, i) => addDays(startOfCurrentWeek, i));
  };

  const handlePrevWeek = () => {
    setCurrentDate(addDays(currentDate, -7));
  };

  const handleNextWeek = () => {
    setCurrentDate(addDays(currentDate, 7));
  };

  return (
    <div className="mx-auto max-h-[150px] w-full max-w-[772px] rounded-lg bg-white p-4 shadow-lg">
      <div className="mb-2 flex items-center justify-between">
        <button type="button" onClick={handlePrevWeek}>
          <CaretLeft className="h-5 w-5 text-[#0442BF]" />
        </button>
        <span className="text-center text-[14px] font-[500] leading-[16px] text-[#171819]">
          This week
        </span>
        <button type="button" onClick={handleNextWeek}>
          <CaretRight className="h-5 w-5 text-[#0442BF]" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center">
        {getWeekDays().map((day, index) => (
          <div key={index} className="flex flex-col items-center">
            <span className="my-[10px] text-center text-[14px] font-[400] leading-[16px] text-[#5C6063]">
              {format(day, 'E')}
            </span>
            <button
              type="button"
              onClick={() => setSelectedDate(day)}
              className={`flex h-[64px] w-[100px] items-center justify-center rounded-lg text-[14px] font-[400] leading-[14px] text-[#171819] transition-all
                ${isToday(day) ? '[#171819] border border-[#C2C6CF]' : ''}
                ${
                  selectedDate?.toDateString() === day.toDateString()
                    ? 'bg-[#0442BF] text-white'
                    : 'hover:bg-gray-200'
                }
                `}
            >
              {format(day, 'd')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
