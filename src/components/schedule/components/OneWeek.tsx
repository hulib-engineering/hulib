'use client';

import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import { addDays, format, isToday, startOfWeek } from 'date-fns';
import { useState } from 'react';

type Props = {
  selectDate: Date | null;
  setSelectDate?: (date: Date) => void;
  todayClass?: string;
  selectedClass?: string;
};

export default function OneWeek({
  selectDate,
  setSelectDate,
  todayClass = 'border border-blue-500 text-blue-500',
  selectedClass = 'border bg-blue-600 text-white',
}: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 0 });
  const [selectedDate, setSelectedDate] = useState<Date | null>(selectDate);

  const onClickDateItem = (item: Date) => {
    setSelectedDate(item);
    setSelectDate?.(item);
  };

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
    <div className="mx-auto w-full rounded-lg bg-white p-4 shadow-lg">
      <div className="mb-2 flex items-center justify-between">
        <button type="button" onClick={handlePrevWeek}>
          <CaretLeft className="h-5 w-5 text-gray-500" />
        </button>
        <span className="font-semibold">This week</span>
        <button type="button" onClick={handleNextWeek}>
          <CaretRight className="h-5 w-5 text-gray-500" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center">
        {getWeekDays().map((day, index) => (
          <div key={index} className="flex w-full flex-col items-center">
            <span className="text-sm text-gray-500">{format(day, 'E')}</span>
            <button
              type="button"
              onClick={() => onClickDateItem(day)}
              className={`flex h-16 w-full items-center justify-center rounded-md transition-all
                ${isToday(day) ? todayClass : 'border-gray-300'}
                ${
                  selectedDate?.toDateString() === day.toDateString()
                    ? selectedClass
                    : 'hover:bg-gray-200'
                }`}
            >
              {format(day, 'd')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
