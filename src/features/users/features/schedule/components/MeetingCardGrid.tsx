'use client';

import React, { useMemo, useState } from 'react';

import { StoriesSkeleton } from '@/components/loadingState/Skeletons';
import MeetingCard from '@/features/users/features/schedule/components/MeetingCard';
import ScheduleEmptyState from '@/features/users/features/schedule/components/ScheduleEmptyState';
import ScheduleHeader from '@/features/users/features/schedule/components/ScheduleHeader';
import { useScheduleMeetings } from '@/features/users/features/schedule/hooks/useScheduleMeetings';
import type { ScheduleFilter } from '@/features/users/features/schedule/types';
import { applyFilters } from '@/features/users/features/schedule/utils/filters';

export default function MeetingCardGrid() {
  const { cards, counts, isLoading } = useScheduleMeetings();
  const [filters, setFilters] = useState<ScheduleFilter[]>([]);

  const visibleCards = useMemo(() => applyFilters(cards, filters), [cards, filters]);

  if (isLoading) {
    return <StoriesSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6">
      <ScheduleHeader counts={counts} filters={filters} onFiltersChange={setFilters} />

      {visibleCards.length === 0
        ? <ScheduleEmptyState />
        : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {visibleCards.map(card => (
                <MeetingCard key={card.session.id} card={card} />
              ))}
            </div>
          )}
    </div>
  );
}
