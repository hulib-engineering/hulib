'use client';

import { CaretLeft, CaretRight, Info, Warning } from '@phosphor-icons/react';
import {
  addDays,
  differenceInHours,
  differenceInWeeks,
  format,
  isBefore,
  isSameWeek,
  isToday,
  startOfDay,
  startOfWeek,
} from 'date-fns';
import { fromZonedTime } from 'date-fns-tz';
import { isEmpty } from 'lodash';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';
import * as React from 'react';

import Button from '@/components/button/Button';
import IconButton from '@/components/iconButton/IconButton';
import { mergeClassnames } from '@/components/private/utils';
import { ScheduleInfoItemLayout } from '@/layouts/scheduling/ScheduleInfoItemLayout';
import { useTimeslotGrouping } from '@/libs/hooks/useTimeslotGrouping';
import { useGetHuberBookedSessionsQuery } from '@/libs/services/modules/huber';
import { useGetTimeslotsByHuberQuery } from '@/libs/services/modules/time-slots';
import { CURRENT_TZ } from '@/utils/dateUtils';

type IBookingTimetableProps = {
  tz?: string;
  huberId: number;
  onSelectTime: (date: Date) => void;
  onOpenHuberConv: () => void;
};
export default function BookingTimetable({ tz, huberId, onSelectTime, onOpenHuberConv }: IBookingTimetableProps) {
  const today = new Date();

  const locale = useLocale();
  const t = useTranslations('Schedule.MainScreen');

  const { data: timeSlots } = useGetTimeslotsByHuberQuery({
    id: huberId,
  });
  const { data: bookedSlots } = useGetHuberBookedSessionsQuery({
    id: huberId,
  });

  const groupingTimeslots = useTimeslotGrouping(timeSlots, tz);
  console.log('groupingTimeslots', groupingTimeslots);

  const [currentDate, setCurrentDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedTime, setSelectedTime] = useState('');

  const currentWeek = startOfWeek(today, { weekStartsOn: 1 });
  const displayedWeek = startOfWeek(currentDate, { weekStartsOn: 1 });

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
  const handleNextToTimeConfirmation = () => {
    const [hours, minutes] = selectedTime.split(':').map(v => Number(v || 0));

    const localDateTimeStr = `${[
      selectedDate.getFullYear(),
      String(selectedDate.getMonth() + 1).padStart(2, '0'),
      String(selectedDate.getDate()).padStart(2, '0'),
    ].join('-')} ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;

    const utcInstant = fromZonedTime(localDateTimeStr, tz ?? CURRENT_TZ);
    onSelectTime(utcInstant);
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
          {(['morning', 'afternoon', 'evening'] as const).map((each) => {
            const weekday = selectedDate.getDay();

            return (
              <div
                key={each}
                className="flex flex-col gap-2"
              >
                <p className="text-neutral-40">
                  {t(each)}
                </p>
                {groupingTimeslots[weekday] && groupingTimeslots[weekday][each] && groupingTimeslots[weekday][each]?.length > 0 && (
                  <div className="flex w-full items-center gap-1 overflow-x-auto">
                    {groupingTimeslots[weekday][each].map((item) => {
                      const hour = Number.parseInt(item.split(':')[0] ?? '0', 10) ?? 0;
                      const minute = Number.parseInt(item.split(':')[1] ?? '0', 10) ?? 0;
                      const timeObj = selectedDate.setHours(hour, minute, 0, 0);
                      const selectedTimestamp = new Date(timeObj);
                      const isBooked
                      = bookedSlots
                        && bookedSlots.length
                        && bookedSlots.includes(selectedTimestamp.toISOString());
                      const isDisabled = differenceInHours(selectedTimestamp, new Date()) < 24;

                      return (
                        <Button
                          key={item}
                          variant={selectedTime === item ? 'primary' : 'outline'}
                          size="sm"
                          disabled={isDisabled}
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
        {!isEmpty(selectedTime) ? (
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
        ) : (
          <div className="flex gap-2 font-medium text-yellow-30">
            <Warning className="text-yellow-50" />
            <span className="text-sm leading-4">
              To help the Huber arrange their schedule, please choose a time slot at least 24 hours after your meeting request.
            </span>
          </div>
        )}

        <Button
          size="lg"
          className="w-full xl:w-[300px]"
          disabled={isEmpty(selectedTime)}
          onClick={handleNextToTimeConfirmation}
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
