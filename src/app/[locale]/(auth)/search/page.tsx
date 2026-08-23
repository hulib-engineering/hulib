'use client';

import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React, { useCallback, useMemo, useState } from 'react';

import { HuberCardGrid } from '@/components/hubers/HuberCardGrid';
import { HuberCardListSkeleton, StoriesSkeleton } from '@/components/loadingState/Skeletons';
import SearchNotFound from '@/components/SearchNotFound';
import { TopicChip } from '@/layouts/webapp/ChipFilter';
import { useGetSearchByKeywordQuery } from '@/libs/services/modules/stories';
import type { Story } from '@/libs/services/modules/stories/storiesType';
import { StoryCardGrid } from '@/components/home/StoryCardGrid';

type TabType = 'all' | 'story' | 'huber';

export default function Index() {
  const searchParams = useSearchParams();
  const qString = searchParams.get('q');

  const t = useTranslations('Research');

  const { data, isLoading, isFetching } = useGetSearchByKeywordQuery(
    {
      keyword: qString || '',
    },
    {
      skip: !qString || qString.length === 0,
    },
  );

  // Show loading on every new search round: first load (isLoading) and
  // subsequent keyword changes while on the page (isFetching covers
  // re-fetches of cached keywords, e.g. picking one from recent searches).
  const isSearching = isLoading || isFetching;

  const [activeChip, setActiveChip] = useState<TabType>('all');

  const ResultTypeChips = useMemo(
    () => [
      { key: 'all' as TabType, label: t('tabs.all') || 'All' },
      { key: 'story' as TabType, label: t('tabs.story') || 'Story' },
      { key: 'huber' as TabType, label: t('tabs.huber') || 'Huber' },
    ],
    [t],
  );
  const searchResultInfo = useMemo(() => {
    const stories = data?.stories || [];
    const hubers = data?.hubers || [];
    const totalResults = stories.length + hubers.length;

    const getMessage = (key: TabType, count: number) => (
      <>
        <span className="text-primary-50">{count}</span>
        {' '}
        {t(`results.${key}_match`)}
        {' '}
        <span className="font-bold">
          &quot;
          {qString}
          &quot;
        </span>
      </>
    );

    switch (activeChip) {
      case 'story':
        return getMessage('story', stories.length);
      case 'huber':
        return getMessage('huber', hubers.length);
      default:
        return getMessage('all', totalResults);
    }
  }, [activeChip, data?.stories, data?.hubers, qString, t]);

  const renderSearchResults = useCallback(() => {
    if (isSearching) {
      switch (activeChip) {
        case 'story':
          return <StoriesSkeleton />;
        case 'huber':
          return <HuberCardListSkeleton />;
        default:
          return (
            <>
              <StoriesSkeleton />
              <HuberCardListSkeleton />
            </>
          );
      }
    }

    const stories: Story[] = data?.stories ?? [];
    const hubers = data?.hubers ?? [];

    switch (activeChip) {
      case 'story':
        return stories.length > 0 ? (
          <StoryCardGrid stories={stories} />
        ) : (
          <SearchNotFound />
        );
      case 'huber':
        return hubers.length > 0 ? (
          <HuberCardGrid items={hubers} />
        ) : (
          <SearchNotFound />
        );
      default:
        return stories.length === 0 && hubers.length === 0 ? (
          <SearchNotFound />
        ) : (
          <>
            {stories.length > 0 && (
              <StoryCardGrid stories={stories} />
            )}
            <HuberCardGrid items={hubers} />
          </>
        );
    }
  }, [activeChip, data?.stories, data?.hubers, isSearching]);

  return (
    <div className="mx-auto w-full py-12 lg:w-5/6">
      <div className="flex flex-col gap-6 px-4">
        <div className="scrollbar-hide flex w-full flex-nowrap items-center gap-2 overflow-x-auto py-2">
          {ResultTypeChips.map(chip => (
            <TopicChip
              key={chip.key}
              isActive={activeChip === chip.key}
              className="min-w-[46px]"
              onClick={() => setActiveChip(chip.key)}
            >
              {chip.label}
            </TopicChip>
          ))}
        </div>

        {qString && !isSearching && (
          <div className="font-medium leading-tight">{searchResultInfo}</div>
        )}

        {renderSearchResults()}
      </div>
    </div>
  );
}
