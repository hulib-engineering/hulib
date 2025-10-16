'use client';

import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React, { useCallback, useMemo, useState } from 'react';

import { IndexStoryListSectionLayout } from '@/components/home/IndexStoryListCommonLayout';
import { HuberCard } from '@/components/hubers/HuberCard';
import NoResultFound from '@/components/NoResultFound';
import { TopicChip } from '@/layouts/webapp/ChipFilter';
import type { Huber as HuberType } from '@/libs/services/modules/huber/huberType';
import { useGetSearchByKeywordQuery } from '@/libs/services/modules/stories';
import type { Story } from '@/libs/services/modules/stories/storiesType';

const SearchHuberResults = ({ items }: { items: HuberType[] }) => {
  if (items.length === 0) {
    return undefined;
  }

  return (
    <div className="flex flex-col gap-8 rounded-[20px] p-5 shadow-sm">
      <h2 className="text-4xl font-medium leading-[44px] text-neutral-20">
        Hubers
      </h2>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {items?.map(huber => (
          <HuberCard key={huber.id} {...huber} />
        ))}
      </div>
    </div>
  );
};

type TabType = 'all' | 'story' | 'huber';

export default function Index() {
  const searchParams = useSearchParams();
  const qString = searchParams.get('q');

  const t = useTranslations('Research');

  const { data, isLoading } = useGetSearchByKeywordQuery({
    keyword: qString || '',
  }, {
    skip: !qString || qString.length === 0,
  });

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
    const stories: Story[] = data?.stories ?? [];
    const hubers = data?.hubers ?? [];

    switch (activeChip) {
      case 'story':
        return stories.length > 0 ? (
          <IndexStoryListSectionLayout
            title="Stories"
            stories={{ data: stories, hasNextPage: false }}
          />
        ) : <NoResultFound />;
      case 'huber':
        return hubers.length > 0 ? <SearchHuberResults items={hubers} /> : <NoResultFound />;
      default:
        return stories.length === 0 && hubers.length === 0 ? <NoResultFound />
          : (
              <>
                {stories.length > 0 && (
                  <IndexStoryListSectionLayout
                    title="Stories"
                    stories={{ data: stories, hasNextPage: false }}
                    containerClassName="p-0"
                  />
                )}
                <SearchHuberResults items={hubers} />
              </>
            );
    }
  }, [activeChip, data?.stories, data?.hubers]);

  return (
    <div className="mx-auto w-full py-12 lg:w-5/6">
      <div className="flex flex-col gap-6">
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

        {qString && !isLoading && (
          <div className="font-medium leading-tight">{searchResultInfo}</div>
        )}

        {renderSearchResults()}
      </div>
    </div>
  );
};
