'use client';

import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';
import React, { useMemo, useState } from 'react';

import IconButton from '@/components/core/iconButton/IconButton';
import Pagination from '@/components/core/pagination/Pagination';
import { mergeClassnames } from '@/components/core/private/utils';
import { StoriesSkeleton } from '@/components/loadingState/Skeletons';
import MeetingCard from '@/features/users/features/schedule/components/MeetingCard';
import ScheduleEmptyState from '@/features/users/features/schedule/components/ScheduleEmptyState';
import ScheduleHeader from '@/features/users/features/schedule/components/ScheduleHeader';
import { useScheduleMeetings } from '@/features/users/features/schedule/hooks/useScheduleMeetings';
import type { ScheduleFilter } from '@/features/users/features/schedule/types';
import { applyFilters } from '@/features/users/features/schedule/utils/filters';

/** Dims the grid mid-fetch so a page change does not flash stale cards at full opacity. */
const gridClassName = (isFetching: boolean) => mergeClassnames(
  'grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3',
  isFetching && 'opacity-60 transition-opacity',
);

export default function MeetingCardGrid() {
  const {
    cards,
    counts,
    isLoading,
    isFetching,
    currentPage,
    totalPages,
    setCurrentPage,
  } = useScheduleMeetings();
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
            <div className={gridClassName(isFetching)}>
              {visibleCards.map(card => (
                <MeetingCard key={card.session.id} card={card} />
              ))}
            </div>
          )}

      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage - 1}
          setCurrentPage={page => setCurrentPage(page + 1)}
        >
          <Pagination.PrevButton as="div">
            {({ disabled }) => (
              <IconButton icon={<ArrowLeft />} variant="ghost" size="lg" disabled={disabled} />
            )}
          </Pagination.PrevButton>

          <Pagination.Pages />

          <Pagination.NextButton as="div">
            {({ disabled }) => (
              <IconButton icon={<ArrowRight />} variant="ghost" size="lg" disabled={disabled} />
            )}
          </Pagination.NextButton>
        </Pagination>
      )}
    </div>
  );
}
