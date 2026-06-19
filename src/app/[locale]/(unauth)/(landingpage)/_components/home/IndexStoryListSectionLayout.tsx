'use client';

import { CaretCircleRight } from '@phosphor-icons/react';
import React, { useMemo } from 'react';
import { useSession } from 'next-auth/react';

import { StoryCard } from './StoryCard';

import Button from '@/components/core/button/Button';
import { Chip } from '@/components/core/chip/Chip';
import { mergeClassnames } from '@/components/core/private/utils';
import { StoriesSkeleton } from '@/components/loadingState/Skeletons';
import type { Story as StoryType, Story as TStory } from '@/libs/services/modules/stories/storiesType';
import { useGetMyFavoritesQuery } from '@/libs/services/modules/user';

type TFilter = {
  id: string | number;
  name: string;
};

type IIndexStoryListSectionLayoutProps = | {
  title: string;
  stories?: { data: TStory[]; hasNextPage: boolean };
  isLoading?: boolean;
  showFilter: true;
  containerClassName?: string;
  filters: TFilter[];
  selectedFilterId: string | number | null;
  onFilterChange: (filter: unknown) => void;
  onSeeAllClick?: () => void;
} | {
  title: string;
  stories?: { data: TStory[]; hasNextPage: boolean };
  isLoading?: boolean;
  showFilter?: false;
  containerClassName?: string;
  onSeeAllClick?: () => void;
};

const IndexStoryListSectionLayout = (props: IIndexStoryListSectionLayoutProps) => {
  const { data: session } = useSession();
  const { data: favoriteStories } = useGetMyFavoritesQuery(undefined, {
    skip: !session,
  });

  const storiesWithFav = useMemo(() => {
    return props.stories && props.stories?.data && props.stories?.data.map((story: StoryType) => {
      const isFavorite
        = favoriteStories
          && favoriteStories?.some((favorite: any) => favorite.storyId === story.id);
      return { ...story, isFavorite };
    });
  }, [props.stories, favoriteStories]);

  if (!props.isLoading && (!props.stories?.data || props.stories?.data.length === 0)) {
    return null;
  }

  if (props.isLoading) {
    return (
      <div className="w-full p-4 lg:p-0">
        <StoriesSkeleton />
      </div>
    );
  }

  return (
    <div className={mergeClassnames(
      'relative left-1/2 flex w-screen -translate-x-1/2 flex-col gap-4 bg-white px-4 py-4 shadow-sm',
      'lg:gap-8 lg:py-5 lg:shadow-none lg:bg-transparent xl:px-0 xxl:px-24',
      props.showFilter && 'gap-4',
      props.containerClassName,
    )}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-medium leading-8 text-primary-10 lg:text-4xl lg:leading-[44px]">{props.title}</h2>

        {(props.showFilter || props.stories?.hasNextPage) && (
          <Button
            iconLeft={<CaretCircleRight size={20} />}
            variant="ghost"
            size="sm"
            className="text-base font-medium leading-5 text-primary-50"
            onClick={props.onSeeAllClick}
          >
            Tất cả
          </Button>
        )}
      </div>
      {props.showFilter && props.filters.length > 0 && (
        <div className="scrollbar-hide flex w-full items-center gap-2 overflow-x-auto py-2">
          {props.filters.map(topic => (
            <Chip
              key={topic.id}
              className={mergeClassnames(
                'h-full min-w-0 shrink-0 overflow-visible whitespace-nowrap rounded-2xl py-1 px-2 lg:py-2',
                'text-xs font-medium leading-[14px] lg:text-sm lg:font-normal lg:leading-4',
                'hover:border hover:border-primary-80 hover:bg-primary-90 hover:text-primary-60',
                props.selectedFilterId === topic.id ? 'border border-primary-80 bg-primary-90 text-primary-60' : 'bg-neutral-90 text-neutral-20',
              )}
              onClick={() => props.onFilterChange(topic.id)}
            >
              {topic.name}
            </Chip>
          ))}
        </div>
      )}
      <div
        className={mergeClassnames(
          'grid grid-cols-1 gap-5 rounded-lg',
          'lg:grid-cols-2',
          'xxl:grid-cols-3',
          '3xl:grid-cols-4',
        )}
      >
        {storiesWithFav?.map(item => (
          <StoryCard key={item.id} data={item} />
        ))}
      </div>
    </div>
  );
};

export { IndexStoryListSectionLayout };
