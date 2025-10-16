'use client';

import { CaretCircleRight } from '@phosphor-icons/react';
import React, { useMemo } from 'react';

import Button from '@/components/core/button/Button';
import { Chip } from '@/components/core/chip/Chip';
import { mergeClassnames } from '@/components/core/private/utils';
import { StoriesSkeleton } from '@/components/loadingState/Skeletons';
import { StoryCard } from '@/components/stories/StoryCard';
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
  const { data: favoriteStories } = useGetMyFavoritesQuery();

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
      'flex w-full flex-col gap-4 px-4 py-4 shadow-sm bg-white',
      'lg:gap-8 lg:py-5 lg:shadow-none lg:bg-transparent',
      props.showFilter && 'gap-4',
      props.containerClassName,
    )}
    >
      <h2 className="text-2xl font-medium leading-8 text-primary-10 lg:text-4xl lg:leading-[44px]">{props.title}</h2>
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
          'grid grid-cols-1 gap-4 rounded-lg',
          'sm:gap-6 sm:px-4',
          'md:grid-cols-2 md:gap-8 md:px-0',
          'xl:grid-cols-3',
        )}
      >
        {storiesWithFav?.map(item => (
          <StoryCard key={item.id} data={item} />
        ))}
      </div>
      {(props.showFilter || props.stories?.hasNextPage) && (
        <div className="flex items-center justify-center">
          <Button
            iconLeft={<CaretCircleRight />}
            variant="outline"
            size="lg"
            className="hidden lg:flex lg:w-[400px]"
            onClick={props.onSeeAllClick}
          >
            See all
          </Button>
          <Button
            iconLeft={<CaretCircleRight />}
            variant="outline"
            size="sm"
            className="w-full lg:hidden"
            onClick={props.onSeeAllClick}
          >
            See all
          </Button>
        </div>
      )}
    </div>
  );
};

export { IndexStoryListSectionLayout };
