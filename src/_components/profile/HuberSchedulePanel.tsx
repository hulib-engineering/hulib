'use client';

import { CalendarDots, StarFour } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import * as React from 'react';

import { mergeClassnames } from '@/components/core/private/utils';
import { StoriesSkeleton } from '@/components/loadingState/Skeletons';
import { DAY_KEYS } from '@/libs/constants/date';
import { useTimeslotGrouping } from '@/libs/hooks/useTimeslotGrouping';
import { useGetTimeslotsByHuberQuery } from '@/libs/services/modules/time-slots';
import { useAppSelector } from '@/libs/hooks';
import Button from '@/components/core/button/Button';
import Modal from '@/components/Modal';
import PersonalCalendarModal from '@/features/stories/components/PersonalCalendarModal';

type HuberSchedulePanelProps = {
  huberId: number;
};

const PERIODS = ['morning', 'afternoon', 'evening'] as const;

export default function HuberSchedulePanel({ huberId }: HuberSchedulePanelProps) {
  const tSchedule = useTranslations('Schedule.MainScreen');
  const tCommon = useTranslations('Common');
  const tTimeslot = useTranslations('Time_slots');
  const { data: timeSlots, isLoading, isFetching } = useGetTimeslotsByHuberQuery({ id: huberId });
  const groupedTimeslots = useTimeslotGrouping(timeSlots);
  const hasSlots = Object.keys(groupedTimeslots).length > 0;
  const userId = useAppSelector(state => state.auth.userInfo?.id);
  const isOwner = !!userId && Number(userId) === Number(huberId);
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

  if (isLoading || isFetching) {
    return <StoriesSkeleton />;
  }

  if (!hasSlots) {
    if (isOwner) {
      return (
        <>
          <div className="flex min-h-[280px] flex-col items-center justify-center gap-4 rounded-2xl bg-[#faf7fc] p-6 text-center shadow-sm">
            <div className="flex size-14 items-center justify-center rounded-full bg-white text-[#0858fa] shadow-sm">
              <StarFour size={28} weight="fill" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-base font-semibold text-neutral-10">{tCommon('my_schedule_empty_title')}</p>
              <p className="text-sm leading-5 text-[#0858fa]">{tCommon('update_schedule_online')}</p>
            </div>
            <Button
              iconLeft={<CalendarDots className="text-white" size={20} weight="bold" />}
              onClick={() => setIsCalendarOpen(true)}
            >
              {tCommon('update_personal_schedule')}
            </Button>
          </div>
          <Modal open={isCalendarOpen} onClose={() => setIsCalendarOpen(false)}>
            <Modal.Backdrop />
            <Modal.Panel className="w-full shadow-none lg:w-5/6 lg:max-w-6xl">
              <PersonalCalendarModal onClose={() => setIsCalendarOpen(false)} />
            </Modal.Panel>
          </Modal>
        </>
      );
    }
    return (
      <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-xl border border-neutral-90 bg-white p-6 text-center shadow-sm">
        <div className="bg-primary-95 flex size-14 items-center justify-center rounded-full text-primary-50">
          <CalendarDots size={28} weight="bold" />
        </div>
        <p className="text-base font-medium text-neutral-10">{tSchedule('unavailable')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      {DAY_KEYS.map((day) => {
        const dayValue = Number(day.short.slice(-1));
        const daySlots = groupedTimeslots[dayValue];

        if (!daySlots) {
          return null;
        }

        return (
          <section
            key={day.short}
            className="rounded-xl border border-lavender-90 bg-white p-4 shadow-sm"
          >
            <div className="mb-4 flex items-center gap-2">
              <div className="bg-primary-95 flex size-9 items-center justify-center rounded-full text-primary-50">
                <CalendarDots size={20} weight="bold" />
              </div>
              <h3 className="text-base font-semibold text-neutral-10">
                {tTimeslot(day.short)}
              </h3>
            </div>

            <div className="flex flex-col gap-3">
              {PERIODS.map((period) => {
                const slots = daySlots[period];

                if (!slots?.length) {
                  return null;
                }

                return (
                  <div key={period} className="flex flex-col gap-2">
                    <p className="text-sm font-medium text-neutral-40">
                      {tSchedule(period)}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {slots.map(slot => (
                        <span
                          key={slot}
                          className={mergeClassnames(
                            'rounded-lg border border-primary-80 bg-primary-98 px-3 py-2',
                            'text-sm font-medium leading-4 text-primary-50',
                          )}
                        >
                          {slot}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
