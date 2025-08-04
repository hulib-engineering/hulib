'use client';

import { CaretLeft, CaretRight, Info } from '@phosphor-icons/react';
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
import * as React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { isEmpty } from 'lodash';
import Link from 'next/link';
import IconButton from '@/components/iconButton/IconButton';
import { mergeClassnames } from '@/components/private/utils';
import Button from '@/components/button/Button';
import { useGetTimeSlotsHuberQuery } from '@/libs/services/modules/time-slots';
import type { TimeSlot } from '@/libs/services/modules/time-slots/getAllTimeSlots';
import { AFTERNOON_TIME_START, EVENING_TIME_START, MORNING_TIME_START } from '@/libs/constants/date';
import { useGetHuberBookedSessionsQuery } from '@/libs/services/modules/huber';
import { ScheduleInfoItemLayout } from '@/components/schedule/ScheduleInfoItemLayout';

export default function BookingTimetable({ huberId, onSelectTime, onOpenHuberConv }: { huberId: number; onSelectTime: (date: Date, time: string) => void; onOpenHuberConv: () => void }) {
  const today = new Date();

  const locale = useLocale();
  const t = useTranslations('Schedule.MainScreen');

  const { data: timeSlots } = useGetTimeSlotsHuberQuery({
    id: huberId,
  });
  const { data: bookedSlots } = useGetHuberBookedSessionsQuery({
    id: huberId,
  });

  const [currentDate, setCurrentDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedTime, setSelectedTime] = useState('');

  const currentWeek = startOfWeek(today, { weekStartsOn: 1 });
  const displayedWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
  const filteredTimeSlots: TimeSlot[] = timeSlots?.filter(
    (timeSlot: TimeSlot) => timeSlot.dayOfWeek === selectedDate?.getDay(),
  ) ?? [];

  const groupTimeSlots = (slots: TimeSlot[]) => {
    const morningTimeSlots: string[] = [];
    const afternoonTimeSlots: string[] = [];
    const eveningTimeSlots: string[] = [];

    for (const time of slots) {
      const hour = Number(time.startTime.slice(0, 2));
      if (hour >= MORNING_TIME_START && hour < AFTERNOON_TIME_START) {
        morningTimeSlots.push(time.startTime);
      } else if (hour >= AFTERNOON_TIME_START && hour < EVENING_TIME_START) {
        afternoonTimeSlots.push(time.startTime);
      } else if (hour >= EVENING_TIME_START) {
        eveningTimeSlots.push(time.startTime);
      }
    }

    return { morningTimeSlots, afternoonTimeSlots, eveningTimeSlots };
  };
  const { morningTimeSlots, afternoonTimeSlots, eveningTimeSlots } = groupTimeSlots(filteredTimeSlots);
  const getWeekDays = () => {
    return Array.from({ length: 7 }, (_, i) => addDays(displayedWeek, i));
  };
  const canGoPrevious = () => {
    return !isSameWeek(displayedWeek, currentWeek, { weekStartsOn: 1 });
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
  const onClickDateItem = (item: Date) => {
    if (isBefore(startOfDay(item), startOfDay(new Date()))) {
      return;
    }
    setSelectedDate(item);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex w-full flex-col gap-2 rounded-2xl bg-white p-4 shadow-popover">
        <div className="flex items-center justify-between">
          <IconButton
            variant="ghost"
            size="sm"
            className={mergeClassnames(!canGoPrevious() ? 'text-neutral-70' : 'text-primary-50')}
            onClick={handlePrevWeek}
            disabled={!canGoPrevious()}
          >
            <CaretLeft />
          </IconButton>

          <span className="text-sm font-medium leading-4">
            {isSameWeek(displayedWeek, currentWeek, { weekStartsOn: 1 })
              ? t('this_week')
              : `${format(displayedWeek, 'MMM d')} - ${format(
                addDays(displayedWeek, 6),
                'MMM d, yyyy',
              )}`}
          </span>

          <IconButton
            variant="ghost"
            size="sm"
            className={mergeClassnames(!canGoNext() ? 'text-neutral-70' : 'text-primary-50')}
            onClick={handleNextWeek}
            disabled={!canGoNext()}
          >
            <CaretRight />
          </IconButton>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center">
          {getWeekDays().map(day =>
            <span key={day.getTime()} className="text-sm leading-4  text-neutral-40">{format(day, 'EEEEEE')}</span>,
          )}
        </div>

        <div className="grid grid-cols-7 gap-2 rounded-lg bg-neutral-98 py-0.5 text-center">
          {getWeekDays().map((day) => {
            const isPastDate = isBefore(startOfDay(day), startOfDay(new Date()));
            const isSelected
              = selectedDate?.toDateString() === day.toDateString();

            return (
              <Button
                key={day.getTime()}
                variant={isSelected ? 'primary' : 'ghost'}
                size="sm"
                className={mergeClassnames('w-full rounded-lg py-2 px-3', isToday(day) && 'border border-primary-60')}
                onClick={() => onClickDateItem(day)}
                disabled={isPastDate}
              >
                {format(day, 'd')}
              </Button>
            );
          })}
        </div>

        <div className="flex flex-col gap-4 rounded-2xl bg-neutral-98 p-4">
          <p className="text-sm font-medium leading-4 text-neutral-10">
            {selectedDate?.toLocaleDateString(locale === 'en' ? 'en-US' : 'vi-VI', {
              weekday: 'long',
              month: 'long',
              day: '2-digit',
            })}
          </p>
          {(['morning', 'afternoon', 'night'] as const).map((each) => {
            const timeSlotsByDayTime = each === 'morning' ? morningTimeSlots : each === 'afternoon' ? afternoonTimeSlots : eveningTimeSlots;

            return (
              <div
                key={each}
                className="flex flex-col gap-2"
              >
                <p className="text-neutral-40">
                  {t(each)}
                </p>
                {timeSlotsByDayTime.length > 0 && (
                  <div className="flex w-full items-center gap-1 overflow-x-auto">
                    {timeSlotsByDayTime.map((item) => {
                      const hour = Number.parseInt(item.split(':')[0] ?? '0', 10) ?? 0;
                      const minute = Number.parseInt(item.split(':')[1] ?? '0', 10) ?? 0;
                      const timeObj = selectedDate.setHours(hour, minute, 0, 0);
                      const isoSelectedTimeString = new Date(timeObj).toISOString();
                      const isBooked
                      = bookedSlots
                        && bookedSlots.length
                        && bookedSlots.includes(isoSelectedTimeString);

                      return (
                        <Button
                          key={item}
                          variant={selectedTime === item ? 'primary' : 'outline'}
                          size="sm"
                          className={mergeClassnames(
                            'flex-shrink-0 min-w-fit rounded-lg px-3 py-2 text-sm font-normal leading-4',
                            'focus:border-none focus:shadow-none',
                            isBooked && 'invisible',
                            selectedTime !== item && 'text-neutral-10',
                          )}
                          onClick={() => setSelectedTime(item)}
                        >
                          {item}
                          {' '}
                          {hour < 12 ? 'AM' : 'PM'}
                        </Button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex items-center justify-between gap-8">
        {!isEmpty(selectedTime) && (
          <p className="leading-5 text-neutral-20">
            {t('confirm_time')}
            {' '}
            <span className="text-primary-60">
              {selectedTime}
              {' '}
              {Number(selectedTime.split(':')[0]) < 12 ? 'AM' : 'PM'}
              {', '}
              {selectedDate?.toLocaleDateString(locale === 'en' ? 'en-US' : 'vi-VI', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: '2-digit',
              })}
            </span>
          </p>
        )}

        <Button
          size="lg"
          className="w-full xl:w-[300px]"
          disabled={isEmpty(selectedTime)}
          onClick={() => onSelectTime(selectedDate, selectedTime)}
        >
          {t('next')}
        </Button>
      </div>

      <ScheduleInfoItemLayout icon={<Info size={16} />} title={t('notice')} className="xl:hidden">
        <p className="text-sm font-normal text-neutral-40">
          {t('notice_text')}
        </p>
        <p className="text-sm font-normal text-neutral-40">
          {t('support_text')}
          &nbsp;
          <Link className="text-primary-60 underline" onClick={onOpenHuberConv} href="">
            {t('click_here')}
          </Link>
        </p>
      </ScheduleInfoItemLayout>
    </div>
  );
}
