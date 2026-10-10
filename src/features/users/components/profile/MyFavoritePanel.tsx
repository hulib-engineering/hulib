import { useTranslations } from 'next-intl';
import { skipToken } from '@reduxjs/toolkit/query';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { MyFavoriteEmpty } from './MyFavoriteEmpty';
import { ConfirmModal } from '@/components/ConfirmModal';
import Button from '@/components/core/button/Button';
import Checkbox from '@/components/core/checkbox/Checkbox';
import { mergeClassnames } from '@/components/core/private/utils';
import { pushSuccess } from '@/components/CustomToastifyContainer';
import { HuberCard } from '@/components/hubers/HuberCard';
import { HuberCardListSkeleton, StoriesSkeleton } from '@/components/loadingState/Skeletons';
import { StoryCard } from '@/features/stories/components/StoryCard';
import { TopicChip } from '@/layouts/webapp/ChipFilter';
import type { Huber } from '@/libs/services/modules/huber/huberType';
import type { Story as TStory } from '@/libs/services/modules/stories/storiesType';
import {
  useGetMyFavoriteHubersQuery,
  useGetMyFavoritesQuery,
  useGetUserFavoritesQuery,
  useRemoveMyFavHubersMutation,
  useRemoveMyFavoritesMutation,
} from '@/libs/services/modules/user';

const PAGE_SIZE = 8;

type ChipType = 'story' | 'huber';

type FavoriteStory = TStory & {
  storyId?: number;
};

type FavoriteHuber = {
  huberId: number;
  huber: Huber;
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

const getFavoriteStories = (
  favoritesData?: { data?: FavoriteStory[] } | FavoriteStory[] | null,
): FavoriteStory[] => {
  if (!favoritesData) {
    return [];
  }

  return Array.isArray(favoritesData) ? favoritesData : favoritesData.data ?? [];
};

const getHasNextPage = (favoritesData?: { hasNextPage?: boolean } | FavoriteStory[] | null) => {
  if (!favoritesData || Array.isArray(favoritesData)) {
    return false;
  }

  return Boolean(favoritesData.hasNextPage);
};

export default function MyFavoritePanel({ userId, readOnly = false }: MyFavoritePanelProps) {
  const tExplore = useTranslations('ExploreStory');
  const tMyFavorites = useTranslations('MyFavorites');

  const isViewingUserFavorites = typeof userId === 'number';
  const canManage = !readOnly && !isViewingUserFavorites;

  const [page, setPage] = useState(1);
  const [allStories, setAllStories] = useState<TStory[]>([]);
  const prevPageRef = useRef(1);

  const [activeChip, setActiveChip] = useState<ChipType>('story');
  const [isShowModalRemoveAll, setIsShowModalRemoveAll] = useState(false);
  const [isSelectAll, setIsSelectAll] = useState(false);

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
  const { data: favHubers, isLoading: isLoadingHubers } = useGetMyFavoriteHubersQuery(
    isViewingUserFavorites ? skipToken : undefined,
  );

  const [removeMyFavorites, { isLoading: isRemovingMyFavorites }] = useRemoveMyFavoritesMutation();
  const [removeMyFavHubers, { isLoading: isRemovingMyFavHubers }] = useRemoveMyFavHubersMutation();

  // Own favorites: accumulate pages
  useEffect(() => {
    if (!myFavoritesData || isViewingUserFavorites) {
      return;
    }
    const favoriteStories = getFavoriteStories(myFavoritesData).map(normalizeFavoriteStory);

    if (prevPageRef.current === 1 || page === 1) {
      setAllStories(favoriteStories);
    } else {
      setAllStories(prev => [...prev, ...favoriteStories]);
    }
    prevPageRef.current = page;
  }, [isViewingUserFavorites, myFavoritesData, page]);

  // Other user's favorites: derived, no effect/state needed
  const userStories = useMemo(
    () => getFavoriteStories(userFavoritesData).map(normalizeFavoriteStory),
    [userFavoritesData],
  );

  useEffect(() => {
    setIsSelectAll(false);
  }, [activeChip]);

  const stories = isViewingUserFavorites ? userStories : allStories;
  const hubers: FavoriteHuber[] = favHubers?.data ?? [];
  const hasStories = stories.length > 0;
  const hasHubers = hubers.length > 0;
  const hasAnyFavorites = hasStories || hasHubers;

  const isLoading = isViewingUserFavorites
    ? isLoadingUserFavorites
    : isLoadingMyFavorites || isLoadingHubers;
  const isFetching = isViewingUserFavorites ? isFetchingUserFavorites : isFetchingMyFavorites;

  const favoriteTypes = [
    { key: 'story' as ChipType, label: tMyFavorites('story') },
    { key: 'huber' as ChipType, label: tMyFavorites('huber') },
  ] as const;

  const handleRemoveAllFavorites = async () => {
    try {
      if (activeChip === 'story') {
        const res = await removeMyFavorites().unwrap();
        pushSuccess(res?.message || tExplore('story_removed_from_favorites'));
        setAllStories([]);
        setPage(1);
      } else {
        const res = await removeMyFavHubers().unwrap();
        pushSuccess(res?.message || tExplore('huber_removed_from_favorites'));
      }
      setIsSelectAll(false);
      setIsShowModalRemoveAll(false);
    } catch (error: any) {
      console.error('Error removing all favorites:', error);
    }
  };

  if (isLoading && page === 1) {
    return activeChip === 'huber' && !isViewingUserFavorites
      ? <HuberCardListSkeleton />
      : <StoriesSkeleton />;
  }

  if (!hasAnyFavorites && !isLoading && !isFetching) {
    return (
      <MyFavoriteEmpty
        title={tMyFavorites('no_favorite_title')}
        description={tMyFavorites('no_favorite_desc')}
        showRecommendations={!readOnly}
      />
    );
  }

  const renderEmptyTab = (type: ChipType) => (
    <MyFavoriteEmpty
      title={type === 'story' ? tMyFavorites('no_favorite_story') : tMyFavorites('no_favorite_huber')}
      description={type === 'story' ? tMyFavorites('explore_stories') : tMyFavorites('explore_hubers')}
      showRecommendations={false}
    />
  );

  const renderContent = (type: ChipType) => {
    const hasData = type === 'story' ? hasStories : hasHubers;

    if (!hasData) {
      return renderEmptyTab(type);
    }

    return (
      <>
        {canManage && (
          <div className="flex items-center justify-between py-2.5 lg:py-0">
            <div className="flex items-center gap-[5px]">
              <Checkbox
                id="select-all"
                checked={isSelectAll}
                onChange={e => setIsSelectAll(e.target.checked)}
              />
              <span>{tMyFavorites('choose_all')}</span>
            </div>
            {isSelectAll && (
              <Button
                variant="ghost"
                size="lg"
                className="underline"
                onClick={() => setIsShowModalRemoveAll(true)}
              >
                {tMyFavorites('remove')}
              </Button>
            )}
          </div>
        )}

        {type === 'story' ? (
          <>
            <div className={mergeClassnames('grid grid-cols-1 gap-3 rounded-xl', 'md:grid-cols-2')}>
              {stories.map((item: TStory) => (
                <StoryCard
                  className={mergeClassnames('w-full', isSelectAll && 'bg-primary-98 transition-colors')}
                  key={item.id}
                  data={{ ...item, isFavorite: true }}
                  forceConfirm={!readOnly}
                  withoutActions={readOnly}
                />
              ))}
            </div>

            {canManage && getHasNextPage(myFavoritesData) && (
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
          </>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {hubers.map(item => (
              <HuberCard key={item.huberId} {...item.huber} isFavorite />
            ))}
          </div>
        )}
      </>
    );
  };

  return (
    <div className="flex w-full flex-col gap-4 lg:mt-1">
      {!isViewingUserFavorites && hasAnyFavorites && (
        <div className="scrollbar-hide flex w-full flex-nowrap items-center gap-2 overflow-x-auto py-2">
          {favoriteTypes.map(chip => (
            <TopicChip
              key={chip.key}
              isActive={activeChip === chip.key}
              onClick={() => setActiveChip(chip.key)}
            >
              {chip.label}
            </TopicChip>
          ))}
        </div>
      )}

      {renderContent(isViewingUserFavorites ? 'story' : activeChip)}

      {canManage && (
        <ConfirmModal
          title={
            activeChip === 'story'
              ? tMyFavorites('delete_confirm_all')
              : tMyFavorites('delete_confirm_all_hubers')
          }
          isConfirmDisable={isRemovingMyFavorites || isRemovingMyFavHubers}
          isOpen={isShowModalRemoveAll}
          onClose={() => setIsShowModalRemoveAll(false)}
          onConfirm={handleRemoveAllFavorites}
        />
      )}
    </div>
  );
}
