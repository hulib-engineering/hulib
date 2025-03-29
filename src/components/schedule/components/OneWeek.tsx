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
    <div className="p-4 w-full max-w-md mx-auto bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <button onClick={handlePrevWeek}>
          <CaretLeft className="w-5 h-5 text-gray-500" />
        </button>
        <span className="font-semibold">This week</span>
        <button onClick={handleNextWeek}>
          <CaretRight className="w-5 h-5 text-gray-500" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center">
        {getWeekDays().map((day, index) => (
          <div key={index} className="flex flex-col items-center">
            <span className="text-sm text-gray-500">{format(day, 'E')}</span>
            <button
              onClick={() => setSelectedDate(day)}
              className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-all
                ${isToday(day) ? 'border-blue-500 text-blue-500' : 'border-gray-300'}
                ${selectedDate.toDateString() === day.toDateString() ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`}
            >
              {format(day, 'd')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
