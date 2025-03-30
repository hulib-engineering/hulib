'use client';

import { useState } from 'react';
import { format, startOfWeek, addDays, isToday } from 'date-fns';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';

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
    <div className="p-4 w-full max-w-[772px] max-h-[150px] mx-auto bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <button onClick={handlePrevWeek}>
          <CaretLeft className="w-5 h-5 text-[#0442BF]" />
        </button>
        <span className="font-[500] text-[14px] leading-[16px] text-center text-[#171819]">This week</span>
        <button onClick={handleNextWeek}>
          <CaretRight className="w-5 h-5 text-[#0442BF]" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center">
        {getWeekDays().map((day, index) => (
          <div key={index} className="flex flex-col items-center">
            <span className="font-[400] text-[14px] leading-[16px] text-center text-[#5C6063] my-[10px]">{format(day, 'E')}</span>
            <button
              onClick={() => setSelectedDate(day)}
              className={`w-[100px] font-[400] text-[14px] leading-[14px] h-[64px] flex items-center justify-center rounded-lg text-[#171819] transition-all
                ${isToday(day) ? 'border border-[#C2C6CF] [#171819]' : ''}
                ${selectedDate?.toDateString() === day.toDateString() ? 'bg-[#0442BF] text-white' : 'hover:bg-gray-200'}
                `}            >
              {format(day, 'd')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
