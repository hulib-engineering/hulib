import { useTranslations } from 'next-intl';
import React, { useEffect, useRef, useState } from 'react';

import { ConfirmModal } from './ConfirmModal';
import { LiberMyFavoriteEmpty } from './LiberMyFavoriteEmpty';
import { pushSuccess } from '@/components/CustomToastifyContainer';
import { StoriesSkeleton } from '@/components/loadingState/Skeletons';
import {
  useGetMyFavoritesQuery,
  useRemoveMyFavoritesMutation,
} from '@/libs/services/modules/user';
import { mergeClassnames } from '@/components/core/private/utils';
import { StoryCard } from '@/features/stories/components/StoryCard';
import type { Story as TStory } from '@/libs/services/modules/stories/storiesType';
import Button from '@/components/core/button/Button';

const PAGE_SIZE = 8;

export default function LiberMyFavorite() {
  const tExplore = useTranslations('ExploreStory');
  const tMyFavorites = useTranslations('MyFavorites');

  const [page, setPage] = useState(1);
  const [allStories, setAllStories] = useState<TStory[]>([]);
  const prevPageRef = useRef(1);

  const { data, isLoading, isFetching } = useGetMyFavoritesQuery({ page, limit: PAGE_SIZE });

  const [removeMyFavorites, { isLoading: isRemovingMyFavorites }] = useRemoveMyFavoritesMutation();

  const [isShowModalRemoveAll, setIsShowModalRemoveAll] = useState(false);

  useEffect(() => {
    if (!data) {
      return;
    }
    if (prevPageRef.current === 1 || page === 1) {
      setAllStories(data);
    } else {
      setAllStories(prev => [...prev, ...data]);
    }
    prevPageRef.current = page;
  }, [data, page]);

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
    return (
      <LiberMyFavoriteEmpty
        title=" Bạn chưa yêu thích câu chuyện nào"
        description=" Xem những câu chuyện dưới đây, biết đâu sẽ kết nối được điều bạn tìm kiếm bấy lâu"
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
            forceConfirm
          />
        ))}
      </div>

      {data?.hasNextPage && (
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
