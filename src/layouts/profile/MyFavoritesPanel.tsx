import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import Button from '@/components/core/button/Button';
import Checkbox from '@/components/core/checkbox/Checkbox';
import { mergeClassnames } from '@/components/core/private/utils';
import { pushSuccess } from '@/components/CustomToastifyContainer';
import { HuberCard } from '@/components/hubers/HuberCard';
import Modal from '@/components/Modal';
import { StoryCard } from '@/components/stories/StoryCard';
import { HuberCardListSkeleton, StoriesSkeleton } from '@/components/loadingState/Skeletons';
import { TopicChip } from '@/layouts/webapp/ChipFilter';
import type { Huber } from '@/libs/services/modules/huber/huberType';
import type { Story as TStory } from '@/libs/services/modules/stories/storiesType';
import {
  useGetMyFavoriteHubersQuery,
  useGetMyFavoritesQuery,
  useRemoveMyFavHubersMutation,
  useRemoveMyFavoritesMutation,
} from '@/libs/services/modules/user';

type ChipType = 'story' | 'huber';

const FavoriteType = [
  { key: 'story' as ChipType, label: 'Story' },
  { key: 'huber' as ChipType, label: 'Huber' },
];

export default function MyFavoritesPanel() {
  const router = useRouter();

  const tExplore = useTranslations('ExploreStory');
  const tMyFavorites = useTranslations('MyFavorites');

  const { data: favStories, isLoading: isFavStoriesLoading } = useGetMyFavoritesQuery();
  const { data: favHubers, isLoading: isFavHubersLoading } = useGetMyFavoriteHubersQuery();
  const [removeMyFavorites, { isLoading: isRemovingMyFavorites }] = useRemoveMyFavoritesMutation();
  const [removeMyFavHubers, { isLoading: isRemovingMyFavHubers }] = useRemoveMyFavHubersMutation();
  const hasStories = favStories?.length > 0;
  const hasHubers = favHubers?.length > 0;
  const hasAnyFavorites = hasStories || hasHubers;
  const isLoading = isFavStoriesLoading || isFavHubersLoading;

  const [activeChip, setActiveChip] = useState<ChipType>('story');
  const [isShowModalRemoveAll, setIsShowModalRemoveAll] = useState(false);
  const [isSelectAll, setIsSelectAll] = useState(false);

  useEffect(() => {
    setIsSelectAll(false);
  }, [activeChip]);

  const renderEmptyState = (type: ChipType) => (
    <div className="flex flex-col items-center justify-center gap-5">
      <Image
        src="/assets/images/no-results-found.png"
        className="h-[378px] w-[482px] object-contain"
        width={482}
        height={378}
        quality={100}
        alt="no-results"
      />
      <div className="flex flex-col gap-2 text-center text-primary-10">
        <h5 className="text-2xl font-bold">
          {type === 'story'
            ? tMyFavorites('no_favorite_story')
            : tMyFavorites('no_favorite_huber')}
        </h5>
        <p>
          {type === 'story'
            ? tMyFavorites('explore_stories')
            : tMyFavorites('explore_hubers')}
        </p>
      </div>
      <Button
        size="lg"
        onClick={() =>
          router.push(type === 'story' ? '/explore-story' : '/explore-hubers')}
      >
        {type === 'story' ? 'Explore more stories' : 'Explore more hubers'}
      </Button>
    </div>
  );
  const renderContent = (type: ChipType) => {
    if (isLoading) {
      return type === 'story' ? <StoriesSkeleton /> : <HuberCardListSkeleton />;
    }

    const list = type === 'story' ? favStories : favHubers;
    const hasData = type === 'story' ? hasStories : hasHubers;

    if (!hasData) {
      return renderEmptyState(type);
    }

    return (
      <>
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

        {type === 'story' ? (
          <div
            className={mergeClassnames(
              'grid grid-cols-1 gap-6 rounded-xl',
              'md:grid-cols-2',
              'lg:pb-6',
              'xl:grid-cols-3',
            )}
          >
            {list?.map((item: TStory) => (
              <StoryCard
                key={item.id}
                data={{ ...item, isFavorite: true }}
                forceConfirm
                className={mergeClassnames(isSelectAll && 'bg-primary-98 transition-colors')}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {list?.map((item: { huberId: number; huber: Huber }) => (
              <HuberCard key={item.huberId} {...item.huber} isFavorite />
            ))}
          </div>
        )}
      </>
    );
  };
  const handleRemoveAllFavorites = async () => {
    try {
      if (activeChip === 'story') {
        const res = await removeMyFavorites().unwrap();
        pushSuccess(res?.message || tExplore('story_removed_from_favorites'));
      } else {
        const res = await removeMyFavHubers().unwrap();
        pushSuccess(res?.message || tExplore('huber_removed_from_favorites'));
      }
      setIsSelectAll(false);
      setIsShowModalRemoveAll(false);
    } catch (error) {
      console.error('Error removing all favorites:', error);
    }
  };

  if (!hasAnyFavorites && !isLoading) {
    return renderEmptyState('story'); // show a unified empty view when no favorites at all
  }

  return (
    <div className="flex w-full flex-col gap-0 px-4 py-5 lg:mt-1 lg:gap-4 lg:p-0">
      {hasAnyFavorites && (
        <div className="scrollbar-hide flex w-full flex-nowrap items-center gap-2 overflow-x-auto py-2">
          {FavoriteType.map(chip => (
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

      {renderContent(activeChip)}

      <Modal open={isShowModalRemoveAll} onClose={() => setIsShowModalRemoveAll(false)}>
        <Modal.Backdrop />
        <Modal.Panel className="w-full p-5 shadow-none sm:max-w-xl">
          <div className="flex flex-col items-center justify-center gap-8">
            <h4 className="text-center text-[28px] font-medium leading-9 text-black">
              {activeChip === 'story'
                ? tMyFavorites('delete_confirm_all') : tMyFavorites('delete_confirm_all_hubers')}
            </h4>
            <div className="flex w-full items-center gap-3">
              <Button
                variant="outline"
                size="lg"
                fullWidth
                onClick={() => setIsShowModalRemoveAll(false)}
              >
                {tMyFavorites('cancel')}
              </Button>
              <Button
                size="lg"
                fullWidth
                disabled={isRemovingMyFavorites || isRemovingMyFavHubers}
                animation={(isRemovingMyFavorites || isRemovingMyFavHubers) && 'progress'}
                onClick={handleRemoveAllFavorites}
              >
                {tMyFavorites('confirm')}
              </Button>
            </div>
          </div>
        </Modal.Panel>
      </Modal>
    </div>
  );
};
