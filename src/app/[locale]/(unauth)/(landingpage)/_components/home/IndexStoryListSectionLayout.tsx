'use client';

import { CaretCircleRight } from '@phosphor-icons/react';
import React, { useMemo } from 'react';
import { useSession } from 'next-auth/react';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { StoryCard } from './StoryCard';

import Button from '@/components/core/button/Button';
import { mergeClassnames } from '@/components/core/private/utils';
import { StoriesSkeleton } from '@/components/loadingState/Skeletons';
import type { Story as StoryType } from '@/libs/services/modules/stories/storiesType';
import { useGetMyFavoritesQuery } from '@/libs/services/modules/user';

type Props = {
  title: string;
  stories?: { data: StoryType[]; hasNextPage: boolean };
  isLoading?: boolean;
  containerClassName?: string;
  showFilter?: boolean;
  filterComponent?: React.ReactNode;
};

export const IndexStoryListSectionLayout = (props: Props) => {
  const { title, stories, isLoading, containerClassName, showFilter, filterComponent } = props;

  const router = useRouter();
  const { data: session } = useSession();
  const t = useTranslations('Common');
  const { data: favoriteStories } = useGetMyFavoritesQuery(undefined, {
    skip: !session,
  });

  const storiesWithFav = useMemo(() => {
    return stories && stories?.data && stories?.data.map((story: StoryType) => {
      const isFavorite
        = favoriteStories
          && favoriteStories?.some((favorite: any) => favorite.storyId === story.id);
      return { ...story, isFavorite };
    });
  }, [stories, favoriteStories]);

  if (!isLoading && (!stories?.data || stories?.data.length === 0)) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="w-full p-4 lg:p-0">
        <StoriesSkeleton />
      </div>
    );
  }

  return (
    <div className={mergeClassnames(
      'relative left-1/2 w-screen -translate-x-1/2 bg-white shadow-sm',
      'flex flex-col gap-4 p-4',
      'lg:gap-8 lg:px-12 lg:shadow-none lg:bg-transparent xl:px-26 xxl:px-24',
      showFilter && 'gap-4',
      containerClassName,
    )}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-medium leading-8 text-primary-10 lg:text-4xl lg:leading-[44px]">{title}</h2>

        {(showFilter || stories?.hasNextPage) && (
          <Button
            iconLeft={<CaretCircleRight size={20} />}
            variant="ghost"
            size="sm"
            className="text-base font-medium leading-5 text-primary-50"
            onClick={() => router.push('/explore-story')}
          >
            {t('all')}
          </Button>
        )}
      </div>
      {showFilter && filterComponent}
      <div
        className={mergeClassnames(
          'grid grid-cols-1 gap-5 mx-auto',
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
