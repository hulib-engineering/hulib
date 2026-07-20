'use client';

import { Eye, ShareFat, ThumbsUp } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { useRouter } from '@/libs/i18nNavigation';

import Avatar from '@/components/core/avatar/Avatar';
import { Chip } from '@/components/core/chip/Chip';
import { mergeClassnames } from '@/components/core/private/utils';
import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';
import { getTopicBadgeClasses } from '@/features/admin/utils/getTopicBadgeClasses';
import { Cover } from '@/features/stories/components/Cover';
import {
  DEFAULT_STORY_COVER_ASSET,
} from '@/features/stories/constants';
import type { Story as TStory } from '@/libs/services/modules/stories/storiesType';
import Button from '@/components/core/button/Button';
import IconButton from '@/components/core/iconButton/IconButton';
import { useAppSelector, useMobile, useRequireAuth } from '@/libs/hooks';
import AnimatedCover from '@/features/stories/components/AnimatedCover';
import { useLikeStoryMutation } from '@/libs/services/modules/stories';
import { ChangeCountEnum } from '@/libs/services/modules/stories/updateLikeCountStory';
import { StoryBage } from '@/components/StoryBage';

type IStoryCardProps = {
  data: TStory;
  className?: string;
  outletClassName?: string;
  isShowReadAll?: boolean;
  isShowFavorite?: boolean;
  isShowStoryBage?: boolean;
};

export const StoryCard = ({ data, className, outletClassName, isShowReadAll = true, isShowFavorite = true, isShowStoryBage = false }: IStoryCardProps) => {
  const router = useRouter();
  const { requireAuth } = useRequireAuth();
  const t = useTranslations('ExploreStory');
  const isMobile = useMobile();
  const [handleUpdateLikeCount] = useLikeStoryMutation();

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = React.useState(data?.likeCount ?? 0);

  const userId = useAppSelector(state => state.auth.userInfo?.id);
  const visibleTopics = data?.topics?.slice(0, 1) ?? [];
  const remainingTopicsCount = Math.max((data.topics?.length ?? 0) - visibleTopics.length, 0);

  const isDisplayNewEventTag = visibleTopics.some(topic =>
    topic.name.toLowerCase().includes('khoảnh khắc'),
  ) ?? false;

  const newEventTagText = visibleTopics.find(topic => topic.name.toLowerCase().includes('khoảnh khắc'))?.name ?? '';

  const prevLikeCountRef = React.useRef(data?.likeCount);

  React.useEffect(() => {
    if (prevLikeCountRef.current !== data?.likeCount) {
      prevLikeCountRef.current = data?.likeCount;
      setLikeCount(data?.likeCount ?? 0);
    }
  }, [data?.likeCount]);

  React.useEffect(() => {
    if (userId && data?.likedUserIds) {
      setIsLiked(
        data.likedUserIds.some((id: string) => Number(id) === Number(userId)),
      );
    }
  }, [data?.likedUserIds, userId]);
  const handleClickRead = async () => {
    const isAuth = await requireAuth(() => {
      router.push(`/explore-story/${data.id}`);
    });
    if (!isAuth) {
      router.push('/auth/login');
    }
  };

  const handleClickFavorite = async () => {
    const isAuth = await requireAuth(async () => {
      try {
        const isCurrentlyLiked = isLiked;
        if (isCurrentlyLiked) {
          const res = await handleUpdateLikeCount({
            id: data.id,
            type: ChangeCountEnum.DOWN,
            userId,
          }).unwrap();
          setIsLiked(false);
          setLikeCount(res.likeCount);
          pushSuccess(t('story_removed_from_favorites'));
        } else {
          const res = await handleUpdateLikeCount({
            id: data.id,
            type: ChangeCountEnum.UP,
            userId,
          }).unwrap();
          setIsLiked(true);
          setLikeCount(res.likeCount);
          pushSuccess(t('story_added_to_favorites'));
        }
      } catch {
        pushError(t('like_error'));
      }
    });
    if (!isAuth) {
      router.push('/auth/login');
    }
  };

  return (
    <div className={mergeClassnames('relative max-h-[365px] max-w-[402px] gap-3 rounded-2xl bg-white p-4 shadow-sm', outletClassName)}>
      <div className={mergeClassnames(
        'flex w-full items-stretch gap-2',
        className,
      )}
      >
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 lg:gap-4">
          <div className="flex flex-1 flex-col gap-2 lg:gap-3">
            {isShowStoryBage && <StoryBage status={data.publishStatus} rejectionReason={data.rejectionReason} />}
            <h6 className="line-clamp-2 min-h-14 text-xl font-medium capitalize leading-7 text-primary-10">
              {data?.title}
            </h6>
            {visibleTopics.length > 0 && (
              <div className="flex max-h-[56px] w-full flex-wrap items-start gap-1 overflow-hidden lg:max-h-none lg:flex-nowrap lg:items-center lg:gap-2 lg:overflow-visible">
                {visibleTopics.map(topic => (
                  <Chip
                    key={topic.id}
                    as="span"
                    className={mergeClassnames(
                      'h-auto max-w-full rounded border px-2 py-1 text-left text-xs font-medium leading-[14px]',
                      getTopicBadgeClasses(topic.color),
                    )}
                  >
                    <span className="line-clamp-1">
                      {topic.name}
                    </span>
                  </Chip>
                ))}
                {remainingTopicsCount > 0 && (
                  <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded border border-primary-80 bg-primary-60 px-2 py-1 text-xs font-medium leading-[14px] text-white">
                    +
                    {remainingTopicsCount}
                  </span>
                )}
              </div>
            )}
            <div className="flex items-center gap-1 lg:gap-2">
              <Avatar
                imageUrl={data.humanBook.photo?.path}
                name={data.humanBook.fullName}
                className="size-[14px]"
                size="xs"
              />
              <span className="line-clamp-1 text-xs font-medium leading-[14px] text-neutral-50">
                {data?.humanBook?.fullName}
              </span>
            </div>
            <div className="mt-auto flex items-center justify-between gap-1 pt-2 lg:gap-5 lg:pt-3">
              <div className="flex items-center gap-1">
                <ThumbsUp className="text-pink-40" size={16} weight="fill" />
                <p className="text-[14px] font-medium leading-4 text-neutral-20">
                  {likeCount}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="text-primary-50" size={16} />
                <p className="text-[14px] font-medium leading-4 text-neutral-20">
                  {data?.viewCount ?? 0}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <ShareFat className="text-primary-50" size={16} />
                <p className="text-[14px] font-medium leading-4 text-neutral-20">
                  {data?.shareCount ?? 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="shrink-0">
          {isDisplayNewEventTag && (
            <span
              className="absolute right-0 top-0 z-10 bg-primary-60 py-1 pl-4 pr-2 text-sm font-medium leading-4 text-white"
              style={{ clipPath: 'polygon(12px 0, 100% 0, 100% 100%, 12px 100%, 0 50%)' }}
            >
              {newEventTagText}
            </span>
          )}
          {isMobile ? (<Cover src={data?.cover?.path || DEFAULT_STORY_COVER_ASSET} />) : (
            <div className="h-[262px] w-[185px] overflow-visible rounded-2xl">
              <AnimatedCover
                abstract={data?.abstract ?? ''}
                title={data?.title ?? ''}
                authorName={data?.humanBook?.fullName ?? ''}
                coverUrl={data?.cover?.path || ''}
                highlightTitle={data?.highlightTitle}
                highlightAbstract={data?.highlightAbstract}
                isPublished
                onClick={() => router.push(`/explore-story/${data?.id}`)}
              />
            </div>
          )}

        </div>
      </div>
      <div className="mt-3 flex w-full items-center gap-2">
        {isShowReadAll && (
          <Button
            size="lg"
            className="flex-1 rounded-full py-3 text-base font-medium leading-5"
            onClick={handleClickRead}
          >
            {t('read_all')}
          </Button>
        )}
        {isShowFavorite && (
          <IconButton
            variant="outline"
            size="md"
            className={mergeClassnames(
              'rounded-full p-3',
              isLiked ? 'border-orange-80' : 'border-primary-90',
            )}
            onClick={handleClickFavorite}
            aria-label="Like story"
          >
            <ThumbsUp
              className={isLiked ? 'text-orange-50' : 'text-primary-50'}
              size={20}
              weight={isLiked ? 'fill' : 'bold'}
            />
          </IconButton>
        )}
      </div>
    </div>
  );
};
