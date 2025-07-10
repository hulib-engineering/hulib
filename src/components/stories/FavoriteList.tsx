'use client';

import { BookmarkSimple } from '@phosphor-icons/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React from 'react';

import { FlipBook } from '@/components/flipBook/FlipBook';
import { mergeClassnames } from '@/components/private/utils';
import { useAppSelector } from '@/libs/hooks';
import { logger } from '@/libs/Logger';
import {
  useDeleteAllFavoriteStoriesMutation,
  useDeleteFavoriteStoryMutation,
  useGetFavoritesStoryQuery,
} from '@/libs/services/modules/fav-stories';
import type { Story as StoryType } from '@/libs/services/modules/stories/storiesType';

import Button from '../button/Button';
import { pushSuccess } from '../CustomToastifyContainer';
import RemoveAllFavoriteModal from '../profile/FavoriteTab/modal/RemoveAllFavoriteModal';
import RemoveFavoriteModal from '../profile/FavoriteTab/modal/RemoveFavoriteModal';
import ListTopics from './ListTopics';
import StoriesSkeleton from './StoriesSkeleton';

interface FavoriteListProps {
  title: string;
  description?: string;
  stories?: StoryType[];
  isLoading: boolean;
  showTopics?: boolean;
  // refetchStories?: () => void;
  onSeeAllClick?: () => void;
}

const FavoriteList = ({
  title: _title,
  description: _description,
  stories: _stories = [],
  isLoading,
  showTopics = false,
  // refetchStories = () => {},
  onSeeAllClick: _onSeeAllClick,
}: FavoriteListProps) => {
  const tExplore = useTranslations('ExploreStory');
  const tMyFavorites = useTranslations('MyFavorites');

  const userInfo = useAppSelector((state) => state.auth.userInfo);
  const [isShowModal, setIsShowModal] = React.useState(false);
  const [isShowModalRemoveAll, setIsShowModalRemoveAll] = React.useState(false);
  const [currentStoryData, setCurrentStoryData] =
    React.useState<StoryType | null>();

  const [isSelectAll, setIsSelectAll] = React.useState(false);

  const router = useRouter();

  const { data: favoriteStories, refetch } = useGetFavoritesStoryQuery(
    userInfo?.id,
    {
      skip: !userInfo?.id,
    },
  );

  const [deleteFavoriteStory] = useDeleteFavoriteStoryMutation();
  const [deleteAllFavoriteStories] = useDeleteAllFavoriteStoriesMutation();

  if (isLoading) return <StoriesSkeleton />;

  const handleRemoveFavorite = async () => {
    try {
      const response = await deleteFavoriteStory({
        storyId: currentStoryData?.storyId,
        userId: userInfo?.id,
      }).unwrap();

      refetch();
      setCurrentStoryData(null);

      pushSuccess(
        response?.message || tExplore('story_removed_from_favorites'),
      );
    } catch (error) {
      logger.error('Error removing favorite story:', error);
    }
  };

  const handleRemoveAllFavorites = async () => {
    if (!isSelectAll) return;

    try {
      await deleteAllFavoriteStories({
        userId: userInfo?.id,
      }).unwrap();
    } catch (error) {
      logger.error('Error removing all favorites:', error);
    }
  };

  const renderActionsRead = (item: StoryType) => {
    return (
      <div
        className={mergeClassnames(
          'flex w-full items-center gap-2 justify-self-end mt-3 absolute bottom-[10px]',
          'md:flex-row md:mt-2 md:px-3 md:pl-0',
        )}
      >
        <Button
          variant="primary"
          className={mergeClassnames(
            'text-base h-8 max-h-8 w-[120px] flex-none rounded-full px-[12px] py-[12px]',
            'md:h-[44px] md:max-h-[44px] md:w-[105px]',
          )}
          onClick={() => router.push(`/explore-story/${item?.storyId}`)}
        >
          {tExplore('read_story')}
        </Button>
        <Button
          variant="outline"
          className={mergeClassnames(
            'w-full h-8',
            'md:size-10 md:min-h-10 md:min-w-10 bg-white border-neutral-variant',
          )}
          iconOnly
          onClick={() => {
            setCurrentStoryData(item);
            setIsShowModal(true);
          }}
        >
          <BookmarkSimple size={20} weight="fill" color="#F6CE3C" />
        </Button>
      </div>
    );
  };

  return (
    <div className="w-full items-center justify-center rounded-lg md:p-5">
      {favoriteStories?.length > 0 && showTopics && (
        <ListTopics currentPathName="profile" />
      )}

      {favoriteStories?.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <input
              id="select-all"
              type="checkbox"
              onChange={() => {
                setIsSelectAll(!isSelectAll);
              }}
              className="mt-0.5 h-4 w-4 cursor-pointer border border-solid border-neutral-40"
            />
            {tMyFavorites('choose_all')}
          </div>

          <Button
            className="bg-transparent leading-5 text-[#0442BF] underline hover:bg-transparent"
            variant="fill"
            onClick={() => setIsShowModalRemoveAll(true)}
            disabled={!isSelectAll}
          >
            {tMyFavorites('remove')}
          </Button>
        </div>
      )}

      {favoriteStories?.length > 0 ? (
        <div
          className={mergeClassnames(
            'mt-6 grid grid-cols-1 gap-8 rounded-lg',
            'md:grid-cols-2',
            'xl:grid-cols-3',
          )}
        >
          {favoriteStories?.map((item: StoryType) => (
            <FlipBook
              key={item.id}
              data={item}
              refetch={() => {}}
              renderActions={() => renderActionsRead(item)}
            />
          ))}
        </div>
      ) : (
        <div className="relative flex flex-col items-center justify-center gap-5">
          <Image
            src="/assets/images/no-results-found.png"
            className="object-contain"
            width={482}
            height={378}
            quality={100}
            alt="banner"
            loading="lazy"
          />

          <div className=" text-center">
            <h3 className="text-[24px] font-bold text-[#010D26]">
              {tMyFavorites('no_favorite_story')}
            </h3>
            <p className="text-base leading-6 text-[#010D26]">
              {tMyFavorites('explore_stories')}
            </p>
          </div>
        </div>
      )}

      <RemoveFavoriteModal
        data={currentStoryData}
        open={isShowModal}
        onClose={() => setIsShowModal(false)}
        onOk={() => {
          setIsShowModal(false);
          handleRemoveFavorite();
          // refetchStories();
        }}
      />

      <RemoveAllFavoriteModal
        open={isShowModalRemoveAll}
        onClose={() => setIsShowModalRemoveAll(false)}
        onOk={() => {
          setIsSelectAll(false);
          setIsShowModalRemoveAll(false);
          handleRemoveAllFavorites();
          refetch();
        }}
      />
    </div>
  );
};

export default FavoriteList;
