'use client';

import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import {
  addDays,
  differenceInWeeks,
  format,
  isBefore,
  isSameWeek,
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
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);

  const currentWeek = startOfWeek(today, { weekStartsOn: 0 });

  const displayedWeek = startOfWeek(currentDate, { weekStartsOn: 0 });

  const [selectedDate, setSelectedDate] = useState<Date | null>(selectDate);

  const onClickDateItem = (item: Date) => {
    if (isBefore(startOfDay(item), startOfDay(new Date()))) {
      return;
    }
    setSelectedDate(item);
    setSelectDate?.(item);
  };

  const getWeekDays = () => {
    return Array.from({ length: 7 }, (_, i) => addDays(displayedWeek, i));
  };

  const canGoPrevious = () => {
    return !isSameWeek(displayedWeek, currentWeek, { weekStartsOn: 0 });
  };

  const canGoNext = () => {
    const weeksFromCurrent = differenceInWeeks(displayedWeek, currentWeek);
    return weeksFromCurrent < 3;
  };

  const handlePrevWeek = () => {
    if (canGoPrevious()) {
      setCurrentDate(addDays(currentDate, -7));
    }
  };

  const handleNextWeek = () => {
    if (canGoNext()) {
      setCurrentDate(addDays(currentDate, 7));
    }
  };

  return (
    <div className="mx-auto w-full rounded-lg bg-white p-4 shadow-lg">
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={handlePrevWeek}
          disabled={!canGoPrevious()}
          className={`${
            !canGoPrevious()
              ? 'cursor-not-allowed opacity-50'
              : 'hover:bg-gray-100'
          } rounded p-1`}
        >
          <CaretLeft className="size-5 text-gray-500" />
        </button>

        <span className="font-semibold">
          {isSameWeek(displayedWeek, currentWeek, { weekStartsOn: 0 })
            ? 'This week'
            : `${format(displayedWeek, 'MMM d')} - ${format(
              addDays(displayedWeek, 6),
              'MMM d, yyyy',
            )}`}
        </span>

        <button
          type="button"
          onClick={handleNextWeek}
          disabled={!canGoNext()}
          className={`${
            !canGoNext() ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-100'
          } rounded p-1`}
        >
          <CaretRight className="size-5 text-gray-500" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center">
        {getWeekDays().map((day, index) => {
          const isPastDate = isBefore(startOfDay(day), startOfDay(new Date()));
          const isSelected
            = selectedDate?.toDateString() === day.toDateString();
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
