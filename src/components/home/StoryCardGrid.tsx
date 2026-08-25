'use client';

import { useSession } from 'next-auth/react';
import React, { useMemo } from 'react';
import { StoryCard } from '@/app/[locale]/(unauth)/(landingpage)/_components/home/StoryCard';
import { mergeClassnames } from '@/components/core/private/utils';
import { useGetMyFavoritesQuery } from '@/libs/services/modules/user';
import type { Story as TStory } from '@/libs/services/modules/stories/storiesType';

type IStoryCardGridProps = {
  stories?: TStory[];
  className?: string;
  storyCardClassName?: string;
};

const StoryCardGrid = ({ stories, className, storyCardClassName }: IStoryCardGridProps) => {
  const { data: session } = useSession();
  const { data: favoriteStories } = useGetMyFavoritesQuery(undefined, {
    skip: !session,
  });

  const storiesWithFav = useMemo(() => {
    return stories && stories.map((story: TStory) => {
      const isFavorite
        = favoriteStories?.data
          && favoriteStories.data.some((favorite: any) => favorite.storyId === story.id);
      return { ...story, isFavorite };
    });
  }, [stories, favoriteStories]);

  return (
    <div
      className={mergeClassnames(
        'grid grid-cols-1 gap-5 rounded-lg',
        'md:grid-cols-[repeat(2,392px)] md:justify-center',
        'xl:grid-cols-[repeat(3,392px)]',
        className,
      )}
    >
      {storiesWithFav?.map(item => (
        <StoryCard key={item.id} data={item} className={storyCardClassName} />
      ))}
    </div>
  );
};

export { StoryCardGrid };
