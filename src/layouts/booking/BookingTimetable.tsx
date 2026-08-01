'use client';

import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import {
  addDays,
  differenceInHours,
  // differenceInWeeks, [C1]
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
import { useEffect, useState } from 'react';
import * as React from 'react';

import Button from '@/components/core/button/Button';
import IconButton from '@/components/core/iconButton/IconButton';
import { mergeClassnames } from '@/components/core/private/utils';
// import { Link } from '@/libs/i18nNavigation';
// import { ScheduleInfoItemLayout } from '@/layouts/scheduling/ScheduleInfoItemLayout';
import { useTimeslotGrouping } from '@/libs/hooks/useTimeslotGrouping';
// import TimeslotWarning from '@/app/[locale]/(auth)/explore-story/[id]/booking/_components/TimeslotWarning';
import { useGetHuberBookedSessionsQuery } from '@/libs/services/modules/huber';
import { useGetTimeslotsByHuberQuery } from '@/libs/services/modules/time-slots';
import { CURRENT_TZ } from '@/utils/dateUtils';
import { DAY_KEYS } from '@/libs/constants/date';

// CHANGE: Removed the date limit on how you can only choose week in range <= 4 weeks (a month) - as the designer has said there's no cap on that.
// In case the condition is actually needed, please revert (de-comment) the code lines I have marked with [C1]

type IBookingTimetableProps = {
  tz?: string;
  huberId: number;
  onSelectTime: (date: Date) => void;
  // onOpenHuberConv: () => void;
  MiniCalendarChosenDay?: Date;
  setMiniCalendarChosenDay?: React.Dispatch<React.SetStateAction<Date>>;
};

type TimeslotPeriodRowProps = {
  slots: string[]; // groupingTimeslots[weekday][each]
  selectedDate: Date;
  selectedTime: string;
  bookedSlots?: string[];
  setSelectedTime: (time: string) => void;
};

function TimeslotPeriodRow(props: TimeslotPeriodRowProps) {
  return (
    <div className="flex w-full items-center gap-1 overflow-x-auto">
      {props.slots.map((item) => {
        const hour = Number.parseInt(item.split(':')[0] ?? '0', 10) ?? 0;
        const minute = Number.parseInt(item.split(':')[1] ?? '0', 10) ?? 0;
        const selectedTimestamp = new Date(props.selectedDate);
        selectedTimestamp.setHours(hour, minute, 0, 0);
        const isBooked
        = props.bookedSlots
          && props.bookedSlots.length
          && props.bookedSlots.includes(selectedTimestamp.toISOString());
        const isDisabled = differenceInHours(selectedTimestamp, new Date()) < 24;

        return (
          <Button
            key={item}
            variant={props.selectedTime === item ? 'fill' : 'outline'}
            size="sm"
            disabled={isDisabled}
            className={mergeClassnames(
              'flex-shrink-0 min-w-fit rounded-lg px-3 py-2',
              'text-sm font-normal leading-4',
              'focus:ring-0',
              isBooked && 'invisible',
              props.selectedTime !== item && 'text-primary-50',
            )}
            onClick={() => props.setSelectedTime(item)}
          >
            {item}
            {' '}
            {hour < 12 ? 'AM' : 'PM' }
            {props.selectedTime === item && <span className="max-lg:hidden">✓</span>}
          </Button>
        );
      })}
    </div>
  );
}

export default function BookingTimetable({ tz, huberId, onSelectTime, /* onOpenHuberConv, */ MiniCalendarChosenDay = new Date(), setMiniCalendarChosenDay = () => {} }: IBookingTimetableProps) {
  const today = new Date();

  const locale = useLocale();
  const t = useTranslations('Schedule.MainScreen');
  const tTimeslot = useTranslations('Time_slots');

  const { data: timeSlots } = useGetTimeslotsByHuberQuery({
    id: huberId,
  });
  const { data: bookedSlots } = useGetHuberBookedSessionsQuery({
    id: huberId,
  });

  const groupingTimeslots = useTimeslotGrouping(timeSlots, tz);

  const [currentDate, setCurrentDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedTime, setSelectedTime] = useState('');

  const currentWeek = startOfWeek(today, { weekStartsOn: 1 });
  const displayedWeek = startOfWeek(currentDate, { weekStartsOn: 1 });

  useEffect(() => {
    setCurrentDate(MiniCalendarChosenDay);
    setSelectedDate(MiniCalendarChosenDay);
  }, [MiniCalendarChosenDay]);

  const getWeekDays = () => {
    return Array.from({ length: 7 }, (_, i) => addDays(displayedWeek, i));
  };
  const canGoPrevious = () => {
    return !isSameWeek(displayedWeek, currentWeek, { weekStartsOn: 1 });
  };
  /* const canGoNext = () => {
    const weeksFromCurrent = differenceInWeeks(displayedWeek, currentWeek);
    return weeksFromCurrent < 3;
  };
  [C1] */

  const handlePrevWeek = () => {
    if (canGoPrevious()) {
      setCurrentDate(addDays(currentDate, -7));
    }
  };
  const handleNextWeek = () => {
    // if (canGoNext()) { [C1]
    setCurrentDate(addDays(currentDate, 7));
    // } [C1]
  };
  const onClickDateItem = (item: Date) => {
    if (isBefore(startOfDay(item), startOfDay(new Date()))) {
      return;
    }
    setSelectedDate(item);
    setMiniCalendarChosenDay(item);
    if (selectedTime) {
      const [h = 0, m = 0] = selectedTime.split(':').map(v => Number(v || 0));
      const newTimestamp = new Date(item);
      newTimestamp.setHours(h, m, 0, 0);
      if (differenceInHours(newTimestamp, new Date()) < 24) {
        setSelectedTime('');
      }
    }
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

  const weekday = selectedDate.getDay();
  const daySlots = groupingTimeslots[weekday];

  return (
    <div className="flex w-full flex-col gap-5">
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
            // className={mergeClassnames(!canGoNext() ? 'text-neutral-70' : 'text-primary-50')} [C1]
            className={mergeClassnames('text-primary-50')}
            onClick={handleNextWeek}
            // disabled={!canGoNext()} [C1]
          >
            <CaretRight />
          </IconButton>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center">
          {DAY_KEYS.map(day =>
            <span key={day.short} className="text-sm leading-4 text-neutral-40">{tTimeslot(day.short)}</span>,
          )}
        </div>

        <div className="grid grid-cols-7 gap-2 rounded-lg bg-neutral-98 py-0.5 text-center">
          {getWeekDays().map((day) => {
            const isPastDate = isBefore(startOfDay(day), startOfDay(new Date()));
            const isSelected
              = selectedDate?.toDateString() === day.toDateString();
            const isUnavailable = !groupingTimeslots[day.getDay()];

            return (
              <Button
                key={day.getTime()}
                variant={isSelected ? 'fill' : 'ghost'}
                size="sm"
                className={
                  mergeClassnames('w-full rounded-lg py-2 px-3', isToday(day) && 'border border-primary-60', isUnavailable && 'text-neutral-70', isSelected && isUnavailable && 'bg-neutral-90 hover:bg-neutral-90 border-none focus:ring-0')
                }
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
          {daySlots
            ? (['morning', 'afternoon', 'evening'] as const).map((period) => {
                const slots = daySlots[period];

                if (!slots?.length) {
                  return null;
                }

                return (
                  <div key={period} className="flex flex-col gap-3 bg-white p-3">
                    <p className="text-neutral-40">{t(period)}</p>
                    <TimeslotPeriodRow
                      slots={slots}
                      selectedDate={selectedDate}
                      selectedTime={selectedTime}
                      bookedSlots={bookedSlots}
                      setSelectedTime={setSelectedTime}
                    />
                  </div>
                );
              })
            : (
                <p className="text-[#FF2C94]">{t('unavailable')}</p>
              )}
        </div>
      </div>
      <div className="flex items-center justify-between gap-8">
        {!isEmpty(selectedTime) ? (
          <p className="leading-5 text-neutral-20">
            {t('confirm_time')}
            {' '}
            <span className="max-lg:text-primary-60">
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
          <>
            {/* <TimeslotWarning /> */}
          </>
        )}

        <Button
          size="lg"
          className="w-[300px] max-lg:w-full"
          disabled={isEmpty(selectedTime)}
          onClick={handleNextToTimeConfirmation}
        >
          {t('next')}
        </Button>
      </div>

      {/* <ScheduleInfoItemLayout icon={<Info size={16} />} title={t('notice')} className="xl:hidden">
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
      </ScheduleInfoItemLayout> */}
    </div>
  );
}
