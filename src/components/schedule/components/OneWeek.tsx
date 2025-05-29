'use client';

import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import {
  addDays,
  format,
  isBefore,
  isToday,
  startOfDay,
  startOfWeek,
} from 'date-fns';
import { useState } from 'react';

import Button from '@/components/button/Button';

type Props = {
  selectDate: Date | null;
  setSelectDate?: (date: Date) => void;
  todayClass?: string;
  selectedClass?: string;
};

export default function OneWeek({
  selectDate,
  setSelectDate,
  todayClass = 'border border-primary-500 text-primary-500 bg-primary-50',
  selectedClass = 'border bg-primary-500 text-white',
}: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 0 });
  const [selectedDate, setSelectedDate] = useState<Date | null>(selectDate);

  const onClickDateItem = (item: Date) => {
    if (isBefore(startOfDay(item), startOfDay(new Date()))) {
      return;
    }
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
        {getWeekDays().map((day, index) => {
          const isPastDate = isBefore(startOfDay(day), startOfDay(new Date()));
          const isSelected =
            selectedDate?.toDateString() === day.toDateString();
          const isTodayDate = isToday(day);

          return (
            <div key={index} className="flex w-full flex-col items-center">
              <span className="text-sm text-gray-500">{format(day, 'E')}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onClickDateItem(day)}
                disabled={isPastDate}
                className={`flex h-10 w-full items-center justify-center rounded-md transition-all
                  ${isTodayDate ? todayClass : 'border-gray-300'}
                  ${
                    !isPastDate && isSelected
                      ? selectedClass
                      : !isPastDate
                        ? 'hover:bg-gray-200'
                        : ''
                  }`}
              >
                {format(day, 'd')}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
