'use client';

import { Bookmarks, CaretCircleRight } from '@phosphor-icons/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React from 'react';

import { FlipBook } from '@/components/flipBook/FlipBook';
import { mergeClassnames } from '@/components/private/utils';
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

  const handleAddToFavorites = () => {
    // TODO: Implement add to favorites
  };

  const renderActions = (storyId: number) => {
    return (
      <div
        className={mergeClassnames(
          'flex w-full items-center gap-2 justify-self-end mt-3 absolute bottom-[10px]',
          'md:flex-row md:mt-2 md:px-3 md:pl-0',
        )}
      >
        <Button
          variant="primary"
          className={mergeClassnames(
            'text-base h-8 max-h-8 w-[120px] flex-none rounded-full px-[12px] py-[12px]',
            'md:h-[44px] md:max-h-[44px] md:w-[105px]',
          )}
          onClick={() => router.push(`/explore-story/${storyId}`)}
        >
          Read all
        </Button>
        <Button
          variant="outline"
          className={mergeClassnames(
            'w-full h-8',
            'md:size-10 md:min-h-10 md:min-w-10',
          )}
          iconOnly
          onClick={() => handleAddToFavorites()}
        >
          <Bookmarks size={20} />
        </Button>
      </div>
    );
  };

  return (
    <div className="mt-8 items-center justify-center rounded-lg bg-white md:p-5">
      <h3 className="text-[2.375rem] font-medium leading-[2.75rem] text-primary-10">
        {t('explore_stories.title')}
      </h3>
      <ListTopics currentPathName="home" />
      {loadingStories ? (
        <div className="relative mt-4 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <StoriesSkeleton />
        </div>
      ) : storiesPages?.data?.length > 0 ? (
        <div
          className={mergeClassnames(
            'mt-6 grid grid-cols-1 gap-8 rounded-lg bg-white',
            'md:grid-cols-2 md:p-5',
            'xl:grid-cols-3',
          )}
        >
          {storiesPages?.data?.map((item: StoryType) => (
            <FlipBook
              key={item.id}
              data={item}
              renderActions={() => renderActions(item?.id)}
            />
          ))}
        </div>
      ) : (
        <p className="w-full text-center">{t('no_data')}</p>
      )}
      {storiesPages?.data?.length > 6 && (
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
