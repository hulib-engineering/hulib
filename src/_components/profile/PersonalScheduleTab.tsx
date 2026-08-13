'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { WrenchIcon } from '@phosphor-icons/react';

import DayPickerStrip from './DayPickerStrip';
import { DAY_KEY_TO_JS_WEEKDAY } from './schedule/constants';
import { buildPendingFromGrouped } from './schedule/utils';
import TimeSlotGrid from './TimeSlotGrid';
import Button from '@/components/core/button/Button';
import Loader from '@/components/core/loader/Loader';
import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';
import { DAY_KEYS } from '@/libs/constants/date';
import { useTimeslotGrouping } from '@/libs/hooks/useTimeslotGrouping';
import {
  useCreateTimeslotsMutation,
  useGetTimeslotsQuery,
} from '@/libs/services/modules/time-slots';
import { type Timeslot, convertTimeSlotToUtc } from '@/utils/convertTimeSlotToUtc';

export default function PersonalScheduleTab() {
  const t = useTranslations('Time_slots');

  const { data: savedData, isLoading } = useGetTimeslotsQuery();
  const [createTimeslots, { isLoading: isSaving }] = useCreateTimeslotsMutation();

  const savedSlots = Array.isArray(savedData) ? savedData : (savedData?.data ?? []);
  const grouped = useTimeslotGrouping(savedSlots);

  const [isEditing, setIsEditing] = useState(false);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [pendingSlots, setPendingSlots] = useState<Timeslot[]>([]);

  const currentJsWeekday = DAY_KEY_TO_JS_WEEKDAY[currentDayIndex]!;
  const isLastDay = currentDayIndex === 6;

  const currentDayTimes = pendingSlots
    .filter(s => s.dayOfWeek === currentJsWeekday)
    .map(s => s.startTime);

  const slotsCountByIndex = DAY_KEY_TO_JS_WEEKDAY.map((jsDay) => {
    const g = isEditing ? null : grouped[jsDay];
    if (!isEditing) {
      return (g?.morning.length ?? 0) + (g?.afternoon.length ?? 0) + (g?.evening.length ?? 0);
    }
    return pendingSlots.filter(s => s.dayOfWeek === jsDay).length;
  });

  const enterEditMode = useCallback(() => {
    setPendingSlots(buildPendingFromGrouped(grouped));
    setCurrentDayIndex(0);
    setIsEditing(true);
  }, [grouped]);

  useEffect(() => {
    if (!isLoading && savedSlots.length === 0) {
      setIsEditing(true);
    }
  }, [isLoading, savedSlots.length]);

  const handleToggle = (time: string) => {
    const slot: Timeslot = { dayOfWeek: currentJsWeekday, startTime: time };
    setPendingSlots((prev) => {
      const exists = prev.some(s => s.dayOfWeek === slot.dayOfWeek && s.startTime === slot.startTime);
      return exists
        ? prev.filter(s => !(s.dayOfWeek === slot.dayOfWeek && s.startTime === slot.startTime))
        : [...prev, slot];
    });
  };

  const persistAndAdvance = async (slots: Timeslot[]) => {
    try {
      await createTimeslots({ timeSlots: slots.map(convertTimeSlotToUtc) }).unwrap();
      if (isLastDay) {
        pushSuccess(t('save_success'));
        setIsEditing(false);
      } else {
        setCurrentDayIndex(prev => prev + 1);
      }
    } catch {
      pushError(t('error_contact_admin'));
    }
  };

  const handleSaveAndNext = () => persistAndAdvance(pendingSlots);

  const handleSkipDay = () => {
    const withoutCurrentDay = pendingSlots.filter(s => s.dayOfWeek !== currentJsWeekday);
    setPendingSlots(withoutCurrentDay);
    return persistAndAdvance(withoutCurrentDay);
  };

  const nextDayKey = DAY_KEYS[isLastDay ? 0 : currentDayIndex + 1];
  const currentDayKey = DAY_KEYS[currentDayIndex];
  const nextDayLabel = nextDayKey ? t(nextDayKey.full) : '';
  const currentDayLabel = currentDayKey ? t(currentDayKey.full) : '';

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader />
      </div>
    );
  }

  if (!isEditing) {
    const viewDayTimes = [
      ...(grouped[currentJsWeekday]?.morning ?? []),
      ...(grouped[currentJsWeekday]?.afternoon ?? []),
      ...(grouped[currentJsWeekday]?.evening ?? []),
    ];
    return (
      <div className="flex flex-col gap-4 rounded-2xl bg-white md:p-5">
        <p className="text-sm text-neutral-20 md:text-base">{t('panel_description')}</p>

        <div className="flex flex-col gap-4 rounded-lg p-4 shadow-sm">
          <DayPickerStrip
            activeDayIndex={currentDayIndex}
            slotsCountByIndex={slotsCountByIndex}
            onDayChange={setCurrentDayIndex}
          />
          <TimeSlotGrid selectedTimes={viewDayTimes} readonly />
          <div className="flex justify-center">
            <Button
              variant="outline"
              iconLeft={<WrenchIcon size={16} weight="bold" />}
              onClick={enterEditMode}
              className="md:min-w-60"
            >
              {t('edit')}
            </Button>
          </div>
        </div>

      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-base text-neutral-20">{t('panel_description')}</p>

      <div className="flex flex-col gap-4 rounded-lg p-4 shadow-sm">
        <DayPickerStrip
          activeDayIndex={currentDayIndex}
          slotsCountByIndex={slotsCountByIndex}
          onDayChange={setCurrentDayIndex}
        />
        <TimeSlotGrid
          selectedTimes={currentDayTimes}
          onToggle={handleToggle}
        />
      </div>

      <div className="flex items-center gap-3">
        <Button
          className="flex-1"
          disabled={currentDayTimes.length === 0 || isSaving}
          animation={isSaving ? 'progress' : undefined}
          onClick={handleSaveAndNext}
        >
          {isLastDay ? t('save_schedule') : t('save_and_next', { day: nextDayLabel })}
        </Button>
        <button
          type="button"
          className="shrink-0 text-sm font-medium text-primary-50"
          onClick={handleSkipDay}
          disabled={isSaving}
        >
          {t('skip_day', { day: currentDayLabel })}
        </button>
      </div>
    </div>
  );
}
