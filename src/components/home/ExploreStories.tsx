'use client';

import { CaretCircleRight } from '@phosphor-icons/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React from 'react';

import { FlipBook } from '@/components/flipBook/FlipBook';
import { useGetStoriesQuery } from '@/libs/services/modules/stories';
import type { Story as StoryType } from '@/libs/services/modules/stories/storiesType';

import Button from '../button/Button';
import ListTopics from '../stories/ListTopics';
import StoriesSkeleton from '../stories/StoriesSkeleton';

const ExploreStories = () => {
  const t = useTranslations('Home');
  const router = useRouter();
  const searchParams = useSearchParams();

  const topicIds = searchParams.get('topicIds');

  const { data: storiesPages, isLoading: loadingStories } = useGetStoriesQuery({
    page: 1,
    limit: 5,
    topicIds: topicIds ? topicIds.split(',').map(Number) : undefined,
  });

  return (
    <div className="md:p-5 mt-8 items-center justify-center rounded-lg bg-white">
      <h3 className="text-[2.375rem] font-medium leading-[2.75rem] text-primary-10">
        {t('explore_stories.title')}
      </h3>
      <ListTopics currentPathName="home" />
      {loadingStories ? (
        <div className="md:grid-cols-2 lg:grid-cols-3 relative mt-4 grid grid-cols-1 gap-8">
          <StoriesSkeleton />
        </div>
      ) : storiesPages?.data?.length > 0 ? (
        <div className="2xl:gap-12 relative mt-4 flex flex-wrap items-center justify-center gap-8 xxl:justify-start">
          {storiesPages?.data?.map((item: StoryType) => (
            <FlipBook key={item.id} data={item} />
          ))}
        </div>
      ) : (
        <p className="w-full text-center">{t('no_data')}</p>
      )}
      {storiesPages?.data?.length > 0 && (
        <div className="mt-8 flex w-full items-center justify-center">
          <Button
            variant="outline"
            onClick={() => router.push('explore-story')}
          >
            <CaretCircleRight />
            <p className="text-base font-medium leading-5 text-primary-50">
              {t('newest_stories.btn1')}
            </p>
          </Button>
        </div>
      )}
    </div>
  );
};

export default ExploreStories;
