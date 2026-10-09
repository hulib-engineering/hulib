'use client';

import { CalendarDots } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import * as React from 'react';

import { mergeClassnames } from '@/components/core/private/utils';
import { StoriesSkeleton } from '@/components/loadingState/Skeletons';
import { DAY_KEYS } from '@/libs/constants/date';
import { useTimeslotGrouping } from '@/libs/hooks/useTimeslotGrouping';
import { useGetTimeslotsByHuberQuery } from '@/libs/services/modules/time-slots';
import { PersonalCalendarEditor } from '@/features/stories/components/PersonalCalendarModal';
import MeetingCardGrid from '@/features/users/features/schedule/components/MeetingCardGrid';

type HuberSchedulePanelProps = {
  huberId: number;
  isOwner?: boolean;
  /** True only for a Huber viewing their own profile; Libers have no availability slots. */
  canManageSlots?: boolean;
};

const PERIODS = ['morning', 'afternoon', 'evening'] as const;

function OwnerSchedule({ canManageSlots }: { canManageSlots: boolean }) {
  const tTimeslot = useTranslations('Time_slots');
  const [tab, setTab] = React.useState<'personal' | 'meeting'>('personal');
  const tabs = [
    { value: 'personal', label: tTimeslot('personal_time_tab') },
    { value: 'meeting', label: tTimeslot('meeting_tab') },
  ] as const;

  // Availability slots belong to the Huber who is being read. A Liber has no slots of
  // their own to publish, so they go straight to the meeting list.
  if (!canManageSlots) {
    return <MeetingCardGrid />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div role="tablist" className="flex border-b border-neutral-90">
        {tabs.map(item => (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={tab === item.value}
            className={mergeClassnames(
              '-mb-px flex-1 border-b-2 border-transparent py-3 text-sm font-medium leading-4 text-neutral-20',
              tab === item.value && 'border-primary-50 text-primary-50',
            )}
            onClick={() => setTab(item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'personal'
        ? (
            <>
              <p className="text-base leading-6 text-neutral-10">{tTimeslot('panel_description')}</p>
              <PersonalCalendarEditor />
            </>
          )
        : (
            <MeetingCardGrid />
          )}
    </div>
  );
}

function ViewerSchedule({ huberId }: { huberId: number }) {
  const tSchedule = useTranslations('Schedule.MainScreen');
  const tTimeslot = useTranslations('Time_slots');
  const { data: timeSlots, isLoading, isFetching } = useGetTimeslotsByHuberQuery({ id: huberId });
  const groupedTimeslots = useTimeslotGrouping(timeSlots);

  if (isLoading || isFetching) {
    return <StoriesSkeleton />;
  }

  if (Object.keys(groupedTimeslots).length === 0) {
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

export default function HuberSchedulePanel({ huberId, isOwner = false, canManageSlots = false }: HuberSchedulePanelProps) {
  return isOwner ? <OwnerSchedule canManageSlots={canManageSlots} /> : <ViewerSchedule huberId={huberId} />;
}
