import { useTranslations } from 'next-intl';
import { skipToken } from '@reduxjs/toolkit/query';
import React, { useEffect, useRef, useState } from 'react';

import { ConfirmModal } from '../../components/ConfirmModal';
import { MyFavoriteEmpty } from './MyFavoriteEmpty';
import { pushSuccess } from '@/components/CustomToastifyContainer';
import { StoriesSkeleton } from '@/components/loadingState/Skeletons';
import {
  useGetMyFavoritesQuery,
  useGetUserFavoritesQuery,
  useRemoveMyFavoritesMutation,
} from '@/libs/services/modules/user';
import { mergeClassnames } from '@/components/core/private/utils';
import { StoryCard } from '@/features/stories/components/StoryCard';
import type { Story as TStory } from '@/libs/services/modules/stories/storiesType';
import Button from '@/components/core/button/Button';

const PAGE_SIZE = 8;

type FavoriteStory = TStory & {
  storyId?: number;
};

type MyFavoritePanelProps = {
  userId?: number;
  readOnly?: boolean;
};

const normalizeFavoriteStory = (story: FavoriteStory): TStory => ({
  ...story,
  id: story.storyId ?? story.id,
  storyId: story.storyId ?? story.id,
  isFavorite: true,
});

const getFavoriteStories = (favoritesData?: { data?: FavoriteStory[] } | FavoriteStory[]) => {
  if (!favoritesData) {
    return [];
  }

  return Array.isArray(favoritesData) ? favoritesData : favoritesData.data ?? [];
};

const getHasNextPage = (favoritesData?: { hasNextPage?: boolean } | FavoriteStory[]) => {
  if (!favoritesData || Array.isArray(favoritesData)) {
    return false;
  }

  return Boolean(favoritesData.hasNextPage);
};

export default function MyFavoritePanel({ userId, readOnly = false }: MyFavoritePanelProps) {
  const tExplore = useTranslations('ExploreStory');
  const tMyFavorites = useTranslations('MyFavorites');

  const [page, setPage] = useState(1);
  const [allStories, setAllStories] = useState<TStory[]>([]);
  const prevPageRef = useRef(1);
  const isViewingUserFavorites = typeof userId === 'number';

  const {
    data: myFavoritesData,
    isLoading: isLoadingMyFavorites,
    isFetching: isFetchingMyFavorites,
  } = useGetMyFavoritesQuery(isViewingUserFavorites ? skipToken : { page, limit: PAGE_SIZE });
  const {
    data: userFavoritesData,
    isLoading: isLoadingUserFavorites,
    isFetching: isFetchingUserFavorites,
  } = useGetUserFavoritesQuery(isViewingUserFavorites ? { userId } : skipToken);

  const [removeMyFavorites, { isLoading: isRemovingMyFavorites }] = useRemoveMyFavoritesMutation();

  const [isShowModalRemoveAll, setIsShowModalRemoveAll] = useState(false);

  useEffect(() => {
    if (!myFavoritesData || isViewingUserFavorites) {
      return;
    }
    const favoriteStories = getFavoriteStories(myFavoritesData);

    if (prevPageRef.current === 1 || page === 1) {
      setAllStories(favoriteStories.map(normalizeFavoriteStory));
    } else {
      setAllStories(prev => [...prev, ...favoriteStories.map(normalizeFavoriteStory)]);
    }
    prevPageRef.current = page;
  }, [isViewingUserFavorites, myFavoritesData, page]);

  useEffect(() => {
    if (!isViewingUserFavorites) {
      return;
    }
    setAllStories((userFavoritesData ?? []).map(normalizeFavoriteStory));
  }, [isViewingUserFavorites, userFavoritesData]);

  const isLoading = isViewingUserFavorites ? isLoadingUserFavorites : isLoadingMyFavorites;
  const isFetching = isViewingUserFavorites ? isFetchingUserFavorites : isFetchingMyFavorites;

  if (isLoading && page === 1) {
    return <StoriesSkeleton />;
  }

  const handleRemoveAllFavorites = async () => {
    try {
      await removeMyFavorites().unwrap();
      pushSuccess(tExplore('story_removed_from_favorites'));
      setAllStories([]);
      setIsShowModalRemoveAll(false);
      setPage(1);
    } catch (error: any) {
      console.error('Error removing all favorites:', error);
    }
  };

  if (allStories.length === 0 && !isLoading && !isFetching) {
    if (readOnly) {
      return (
        <MyFavoriteEmpty
          title={tMyFavorites('no_favorite_title')}
          description={tMyFavorites('no_favorite_desc')}
          showRecommendations={false}
        />
      );
    }

    return (
      <MyFavoriteEmpty
        title={tMyFavorites('no_favorite_title')}
        description={tMyFavorites('no_favorite_desc')}
      />
    );
  }

  return (
    <div className="flex w-full flex-col gap-4 lg:mt-1">
      <div
        className={mergeClassnames(
          'grid grid-cols-1 gap-3 rounded-xl',
          'md:grid-cols-2',
        )}
      >
        {allStories.map((item: TStory) => (
          <StoryCard
            className="w-full"
            key={item.id}
            data={{ ...item, isFavorite: true }}
            forceConfirm={!readOnly}
            withoutActions={readOnly}
          />
        ))}
      </div>

      {!readOnly && getHasNextPage(myFavoritesData) && (
        <div className="flex justify-center pt-2">
          <Button
            variant="outline"
            size="lg"
            disabled={isFetching}
            animation={isFetching ? 'progress' : undefined}
            onClick={() => setPage(prev => prev + 1)}
          >
            {tMyFavorites('see_more')}
          </Button>
        </div>
      )}

      <ConfirmModal
        title={tMyFavorites('delete_confirm_all')}
        isConfirmDisable={isRemovingMyFavorites}
        isOpen={isShowModalRemoveAll}
        onClose={() => setIsShowModalRemoveAll(false)}
        onConfirm={handleRemoveAllFavorites}
      />
    </div>
  );
}
