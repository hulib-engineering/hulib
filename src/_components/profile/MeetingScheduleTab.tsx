'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { CalendarDotIcon, CaretDownIcon } from '@phosphor-icons/react';

import MeetingCard from './MeetingCard';
import { FILTER_OPTIONS } from './schedule/constants';
import type { FilterKey } from './schedule/types';
import { filterSessions, sortSessions } from './schedule/utils';
import Loader from '@/components/core/loader/Loader';
import { mergeClassnames } from '@/components/core/private/utils';
import { useAppSelector } from '@/libs/hooks';
import { useGetReadingSessionsQuery } from '@/libs/services/modules/reading-session';
import type { ReadingSession } from '@/libs/services/modules/reading-session/createNewReadingSession';

export default function MeetingScheduleTab() {
  const t = useTranslations('Time_slots');
  const userId = useAppSelector(state => state.auth.userInfo?.id);

  const [filter, setFilter] = useState<FilterKey>('all');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { data, isLoading } = useGetReadingSessionsQuery({});
  const raw: ReadingSession[] = Array.isArray(data) ? data : ((data as any)?.data ?? []);
  const sessions = sortSessions(raw, userId);
  const visible = filterSessions(sessions, filter, userId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader />
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 px-8 py-10">
        <CalendarDotIcon size={80} weight="light" className="text-primary-50" />
        <p className="text-center text-xl font-medium text-primary-50">
          {t('meeting_empty_title')}
        </p>
        <p className="text-center text-sm leading-relaxed text-neutral-40">
          {t('meeting_empty_description')}
        </p>
      </div>
    );
  }

  const filterLabel: Record<FilterKey, string> = {
    all: t('filter_all'),
    invitation: t('filter_invitation'),
    my_request: t('filter_my_request'),
    done: t('filter_done'),
    missed: t('filter_missed'),
  };

  const handleSelectFilter = (opt: FilterKey) => {
    setFilter(opt);
    setDropdownOpen(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <div className="relative">
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-full border border-neutral-90 bg-white px-4 py-2 text-sm text-neutral-20"
            onClick={() => setDropdownOpen(prev => !prev)}
          >
            <span className="font-medium text-neutral-40">{t('filter_view_label')}</span>
            <span>{filterLabel[filter]}</span>
            <CaretDownIcon
              size={14}
              className={mergeClassnames('transition-transform', dropdownOpen && 'rotate-180')}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full z-10 mt-1 min-w-[160px] overflow-hidden rounded-xl border border-neutral-90 bg-white shadow-md">
              {FILTER_OPTIONS.map(opt => (
                <button
                  key={opt}
                  type="button"
                  className={mergeClassnames(
                    'w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-neutral-98',
                    filter === opt ? 'font-medium text-primary-50' : 'text-neutral-20',
                  )}
                  onClick={() => handleSelectFilter(opt)}
                >
                  {filterLabel[opt]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {visible.length === 0
        ? (
            <p className="py-8 text-center text-sm text-neutral-40">{t('filter_no_results')}</p>
          )
        : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {visible.map(session => (
                <MeetingCard key={session.id} session={session} />
              ))}
            </div>
          )}
    </div>
  );
}
