'use client';

/* eslint-disable no-unsafe-optional-chaining */

import {
  Bookmarks,
  CaretCircleDown,
  CaretCircleUp,
} from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React, { useEffect } from 'react';

import Button from '@/components/button/Button';
import { mergeClassnames } from '@/components/private/utils';
import ListTopics from '@/components/stories/ListTopics';
import StoriesSkeleton from '@/components/stories/StoriesSkeleton';
import useAppSelector from '@/libs/hooks/useAppSelector';
import {
  useAddStoryToFavoritesMutation,
  useDeleteFavoriteStoryMutation,
  useGetFavoritesStoryQuery,
} from '@/libs/services/modules/fav-stories';
import { useGetStoriesQuery } from '@/libs/services/modules/stories';
import type { Story as StoryType } from '@/libs/services/modules/stories/storiesType';

import { pushError, pushSuccess } from '../CustomToastifyContainer';
import { FlipBook } from '../flipBook/FlipBook';

type ExporeStoryProps = {
  topicIds: string | null;
};

const ExploreStory = ({ topicIds }: ExporeStoryProps) => {
  const userInfo = useAppSelector((state) => state.auth.userInfo);
  const [favoriteStoriesIds, setFavoriteStoriesIds] = React.useState<number[]>(
    [],
  );
  const router = useRouter();
  const t = useTranslations('ExporeStory');

  const [isExpandList, setIsExpandList] = React.useState(false);
  const [limit, setLimit] = React.useState(6);

  const {
    data: storiesPages,
    isLoading,
    isFetching,
  } = useGetStoriesQuery({
    page: 1,
    limit,
    topicIds: topicIds ? topicIds.split(',').map(Number) : undefined,
  });
  const userId: number = +userInfo?.id;
  const { data: favoriteStories } = useGetFavoritesStoryQuery(userId, {
    skip: !userId,
  });

  useEffect(() => {
    if (favoriteStories) {
      favoriteStories?.forEach((story: StoryType) => {
        setFavoriteStoriesIds((prev) => [...prev, story.id]);
      });
    }
  }, [favoriteStories]);
  const onClickSeeAll = () => {
    setIsExpandList((prev) => !prev);
  };

  const [addStoryToFavorites] = useAddStoryToFavoritesMutation();
  const [deleteFavoriteStory] = useDeleteFavoriteStoryMutation();

  const handleAddToFavorites = async (storyId: number) => {
    if (!userInfo) {
      router.push('/login');
      return;
    }

    try {
      if (favoriteStoriesIds.includes(storyId)) {
        const response = await deleteFavoriteStory({
          storyId,
          userId,
        }).unwrap();
        pushSuccess(t(response?.message || 'story_removed_from_favorites'));
        setFavoriteStoriesIds((prev) => prev.filter((id) => id !== storyId));
      } else {
        const response = await addStoryToFavorites({
          storyId,
          userId,
        }).unwrap();
        pushSuccess(t(response?.message || 'story_added_to_favorites'));
        setFavoriteStoriesIds((prev) => [...prev, storyId]);
      }
    } catch (err: any) {
      pushError(t(err?.data?.message || 'error_contact_admin'));
    }
  };

  const renderActions = (storyId: number) => {
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
          onClick={() => router.push(`/explore-story/${storyId}`)}
        >
          {t('read_story')}
        </Button>
        <Button
          variant="outline"
          className={mergeClassnames(
            'w-full h-8',
            'md:size-10 md:min-h-10 md:min-w-10 bg-primary-hover text-white',
            favoriteStoriesIds.includes(storyId)
              ? 'bg-primary-hover text-white'
              : 'bg-white text-neutral-20',
          )}
          iconOnly
          onClick={() => handleAddToFavorites(storyId)}
        >
          <Bookmarks size={20} />
        </Button>
      </div>
    );
  };

  React.useEffect(() => {
    if (isExpandList) {
      setLimit(0);
    } else {
      setLimit(6);
    }
  }, [isExpandList]);

  if (isLoading || isFetching) return <StoriesSkeleton />;

  return (
    <div className="mx-auto h-full w-full max-w-[1216px] rounded-lg">
      <div>
        <h3 className="text-[2.5rem] font-bold leading-[3rem] text-neutral-20">
          {t('title')}
        </h3>
        <p className="text-lg font-normal text-[#2E3032]">{t('description')}</p>
      </div>
      <ListTopics />
      <div
        className={mergeClassnames(
          'mt-6 grid grid-cols-1 gap-8',
          'md:grid-cols-2',
          'xl:grid-cols-3',
        )}
      >
        {storiesPages?.data?.map((story: StoryType) => (
          <FlipBook
            key={story?.id}
            data={story}
            renderActions={() => renderActions(story?.id)}
          />
        ))}
      </div>

      {(limit === 6 && storiesPages?.hasNextPage) ||
      (limit === 0 && !storiesPages?.hasNextPage) ? (
        <div className="mt-6 flex w-full items-center justify-center">
          <Button
            variant="outline"
            iconLeft={
              limit === 0 ? (
                <CaretCircleUp size={16} color="#0442BF" />
              ) : (
                <CaretCircleDown size={16} color="#0442BF" />
              )
            }
            onClick={onClickSeeAll}
          >
            {limit === 0 ? t('hide_all') : t('view_more')}
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default ExploreStory;
