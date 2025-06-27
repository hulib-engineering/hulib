'use client';

import {
  CaretCircleDown,
  CaretCircleRight,
  CaretCircleUp,
} from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import React, { useMemo } from 'react';

import { FlipBook } from '@/components/flipBook/FlipBook';
import { mergeClassnames } from '@/components/private/utils';
import { useAppSelector } from '@/libs/hooks';
import { useGetFavoritesStoryQuery } from '@/libs/services/modules/fav-stories';
import type { Story as StoryType } from '@/libs/services/modules/stories/storiesType';

import Button from '../button/Button';
import ListTopics from './ListTopics';
import StoriesSkeleton from './StoriesSkeleton';

interface StoriesListProps {
  title: string;
  description?: string;
  stories?: StoryType[];
  isLoading: boolean;
  showTopics?: boolean;
  hasNextPage?: boolean;
  // refetchStories?: () => void;
  onSeeAllClick?: () => void;
  isExpandable?: boolean;
  isExpanded?: boolean;
  seeAllText?: string;
  hideAllText?: string;
  navigateToExplore?: boolean;
}

const StoriesList = ({
  title,
  description,
  stories = [],
  isLoading,
  showTopics = false,
  hasNextPage = false,
  // refetchStories = () => {},
  onSeeAllClick,
  isExpandable = false,
  isExpanded = false,
  seeAllText = 'View More',
  hideAllText = 'Hide All',
  navigateToExplore = false,
}: StoriesListProps) => {
  const userInfo = useAppSelector((state) => state.auth.userInfo);
  const router = useRouter();

  const { data: favoriteStories } = useGetFavoritesStoryQuery(userInfo?.id, {
    skip: !userInfo?.id,
  });

  const storiesWithFavorites = useMemo(() => {
    return stories?.map((story: StoryType) => {
      const isFavorite =
        favoriteStories &&
        favoriteStories?.some((favorite: any) => favorite.storyId === story.id);
      return { ...story, isFavorite };
    });
  }, [stories, favoriteStories]);

  if (isLoading) return <StoriesSkeleton />;

  return (
    <div className="mt-8 items-center justify-center rounded-lg md:p-5">
      <h3 className="text-[2.375rem] font-medium leading-[2.75rem] text-primary-10">
        {title}
      </h3>
      {description && (
        <p className="text-lg font-normal text-neutral-20">{description}</p>
      )}

      {showTopics && <ListTopics />}

      {stories?.length > 0 ? (
        <div
          className={mergeClassnames(
            'mt-6 grid grid-cols-1 gap-4 px-2 rounded-lg',
            'sm:gap-6 sm:px-4',
            'md:grid-cols-2 md:gap-8 md:px-0',
            'xl:grid-cols-3',
          )}
        >
          {storiesWithFavorites?.map((item: StoryType) => (
            <FlipBook key={item.id} data={item} refetch={() => {}} />
          ))}
        </div>
      ) : (
        <p className="w-full text-center">No data available</p>
      )}

      {hasNextPage && (
        <div className="mt-8 flex w-full items-center justify-center">
          {navigateToExplore ? (
            <Button
              variant="outline"
              onClick={() => router.push('explore-story')}
            >
              <CaretCircleRight />
              <p className="text-base font-medium leading-5 text-primary-50">
                See All Stories
              </p>
            </Button>
          ) : isExpandable ? (
            <Button
              variant="outline"
              iconLeft={
                isExpanded ? (
                  <CaretCircleUp size={16} color="#0442BF" />
                ) : (
                  <CaretCircleDown size={16} color="#0442BF" />
                )
              }
              onClick={onSeeAllClick}
            >
              {isExpanded ? hideAllText : seeAllText}
            </Button>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default StoriesList;
