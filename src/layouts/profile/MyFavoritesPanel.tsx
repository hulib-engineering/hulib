import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import Image from 'next/image';

import { useRouter } from 'next/navigation';
import { useGetMyFavoritesQuery, useRemoveMyFavoritesMutation } from '@/libs/services/modules/user';
import { StoriesSkeleton } from '@/components/stories/StoriesSkeleton';
import Button from '@/components/core/button/Button';
import { mergeClassnames } from '@/components/core/private/utils';
import { StoryCard } from '@/components/stories/StoryCard';
import type { Story as TStory } from '@/libs/services/modules/stories/storiesType';
import Checkbox from '@/components/core/checkbox/Checkbox';
import Modal from '@/components/Modal';
import { pushSuccess } from '@/components/CustomToastifyContainer';

export default function MyFavoritesPanel() {
  const router = useRouter();

  const tExplore = useTranslations('ExploreStory');
  const tMyFavorites = useTranslations('MyFavorites');

  const { data, isLoading } = useGetMyFavoritesQuery();
  const [removeMyFavorites, { isLoading: isRemovingMyFavorites }] = useRemoveMyFavoritesMutation();

  const [isShowModalRemoveAll, setIsShowModalRemoveAll] = useState(false);
  const [isSelectAll, setIsSelectAll] = useState(false);

  if (isLoading) {
    return <StoriesSkeleton />;
  }

  const handleRemoveAllFavorites = async () => {
    try {
      const response = await removeMyFavorites().unwrap();
      setIsSelectAll(false);
      setIsShowModalRemoveAll(false);
      pushSuccess(
        response?.message || tExplore('story_removed_from_favorites'),
      );
    } catch (error) {
      console.error('Error removing all favorites:', error);
    }
  };

  return (
    <div className="flex w-full flex-col gap-0 px-4 py-5 lg:mt-1 lg:gap-4 lg:p-0">
      {data?.length > 0 && (
        <div className="flex items-center justify-between py-[10px] lg:py-0">
          <div className="flex items-center gap-[5px]">
            <Checkbox
              id="select-all"
              checked={isSelectAll}
              onChange={event => setIsSelectAll(event.target.checked)}
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

      {data?.length > 0
        ? (
            <div
              className={mergeClassnames(
                'grid grid-cols-1 gap-6 rounded-xl',
                'md:grid-cols-2',
                'lg:pb-6',
                'xl:grid-cols-3',
              )}
            >
              {data?.map((item: TStory) => (
                <StoryCard
                  key={item.id}
                  data={{ ...item, isFavorite: true }}
                  forceConfirm
                  className={isSelectAll ? 'bg-primary-98 transition-colors' : undefined}
                />
              ))}
            </div>
          )
        : (
            <div className="flex flex-col items-center justify-center gap-5">
              <Image
                src="/assets/images/no-results-found.png"
                className="h-[378px] w-[482px] object-contain"
                width={482}
                height={378}
                quality={100}
                alt="banner"
              />
              <div className="flex flex-col gap-2 text-center text-primary-10">
                <h5 className="text-2xl font-bold">
                  {tMyFavorites('no_favorite_story')}
                </h5>
                <p>{tMyFavorites('explore_stories')}</p>
              </div>
              <Button size="lg" onClick={() => router.push('/explore-story')}>
                {tExplore('explore_more_stories')}
              </Button>
            </div>
          )}

      <Modal open={isShowModalRemoveAll} onClose={() => setIsShowModalRemoveAll(false)}>
        <Modal.Backdrop />
        <Modal.Panel className="w-full p-5 shadow-none sm:max-w-xl">
          <div className="flex flex-col items-center justify-center gap-8">
            <h4 className="text-center text-[28px] font-medium leading-9 text-black">
              {tMyFavorites('delete_confirm_all')}
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
                disabled={isRemovingMyFavorites}
                animation={isRemovingMyFavorites && 'progress'}
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
