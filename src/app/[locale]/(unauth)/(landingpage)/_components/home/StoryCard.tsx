'use client';

import { Eye, ThumbsUp } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import React, { useState } from 'react';

import Avatar from '@/components/core/avatar/Avatar';
import { Chip } from '@/components/core/chip/Chip';
import { mergeClassnames } from '@/components/core/private/utils';
import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';
import { getTopicBadgeClasses } from '@/features/admin/utils/getTopicBadgeClasses';
import { Cover } from '@/features/stories/components/Cover';
import {
  DEFAULT_STORY_COVER_ASSET,
} from '@/features/stories/constants';
import { useAddStoryToMyFavoritesMutation, useRemoveStoryFromMyFavoritesMutation } from '@/libs/services/modules/user';
import type { Story as TStory } from '@/libs/services/modules/stories/storiesType';
import Button from '@/components/core/button/Button';
import IconButton from '@/components/core/iconButton/IconButton';
import { useRequireAuth } from '@/libs/hooks';

type IStoryCardProps = {
  data: TStory;
  className?: string;
};

export const StoryCard = ({ data, className }: IStoryCardProps) => {
  const router = useRouter();
  const { requireAuth } = useRequireAuth();
  const locale = useLocale();
  const t = useTranslations('ExploreStory');

  const [isFavorite, setIsFavorite] = useState(Boolean(data.isFavorite));

  const [addToMyFavorites] = useAddStoryToMyFavoritesMutation();
  const [removeFromFavorite] = useRemoveStoryFromMyFavoritesMutation();
  const mockTopicHuber = [
    {
      id: '1',
      name: 'Khoảnh khắc gia đình',
      color: 'blue',
    },
    {
      id: '2',
      name: 'Overthinking',
      color: 'blue',
    },
    {
      id: '3',
      name: 'Gia đình',
      color: 'orange',
    },
  ];
  const visibleTopics = data.topics?.length > 0 ? data.topics.slice(0, 1) : mockTopicHuber.slice(0, 1);
  const remainingTopicsCount = Math.max((data.topics?.length > 0 ? data.topics?.length : mockTopicHuber.length) - visibleTopics.length, 0);

  const isDisplayNewEventTag = visibleTopics.some(topic =>
    topic.name.toLowerCase().includes('khoảnh khắc'),
  ) ?? false;

  const handleClickRead = async () => {
    await requireAuth(() => {
      router.push(`/${locale}/explore-story/${data.id}`);
    });
  };

  const handleClickFavorite = async () => {
    await requireAuth(async () => {
      try {
        if (isFavorite) {
          const response = await removeFromFavorite(data.id).unwrap();
          pushSuccess(response?.message || t('story_removed_from_favorites'));
        } else {
          const response = await addToMyFavorites(data.id).unwrap();
          pushSuccess(response?.message || t('story_added_to_favorites'));
        }
        setIsFavorite(prev => !prev);
      } catch (err: any) {
        pushError(err?.data?.message || t('error_contact_admin'));
      }
    });
  };

  return (
    <div className="relative max-h-[365px] max-w-[402px] gap-3 rounded-2xl bg-white p-4 shadow-sm">
      <div className={mergeClassnames(
        'flex w-full items-stretch gap-2',
        className,
      )}
      >
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 lg:gap-4">
          <div className="flex flex-1 flex-col gap-2 lg:gap-3">
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
                    <span className="line-clamp-2 block overflow-hidden break-words">
                      {topic.name}
                    </span>
                  </Chip>
                ))}
                {remainingTopicsCount > 0 && (
                  <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded border border-[#FCB165] bg-[#FFEFD6] px-2 py-1 text-xs font-medium leading-[14px] text-[#FC8513]">
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
            <div className="mt-auto flex flex-col gap-1 pt-2 lg:gap-2 lg:pt-3">
              <div className="flex items-center gap-1 lg:gap-2">
                <ThumbsUp className="text-pink-40" size={16} weight="fill" />
                <p className="text-[14px] font-medium leading-4 text-neutral-20">
                  {data?.storyReview?.rating || 0}
                </p>
                <p className="text-[14px] font-normal leading-4 text-neutral-10">đồng cảm</p>
              </div>
              <div className="flex items-center gap-1 lg:gap-2">
                <Eye className="text-primary-50" size={16} />
                <p className="text-[14px] font-medium leading-4 text-neutral-20">
                  {data.viewCount ?? 0}
                </p>
                <p className="text-[14px] font-normal leading-4 text-neutral-10">lượt xem</p>
              </div>
            </div>
          </div>
        </div>

        <div className="shrink-0 overflow-hidden">
          <Cover src={data?.cover?.path || DEFAULT_STORY_COVER_ASSET} />
          {isDisplayNewEventTag && (
            <span
              className="absolute right-0 top-0 bg-primary-60 py-1 pl-4 pr-2 text-sm font-medium leading-4 text-white"
              style={{ clipPath: 'polygon(12px 0, 100% 0, 100% 100%, 12px 100%, 0 50%)' }}
            >
              Khoảnh khắc Muse
            </span>
          )}
        </div>
      </div>
      <div className="mt-3 flex w-full items-center gap-2">
        <Button
          size="lg"
          className="flex-1 rounded-full py-3 text-base font-medium leading-5"
          onClick={handleClickRead}
        >
          Đọc hết
        </Button>
        <IconButton
          variant="outline"
          size="md"
          className={mergeClassnames(
            'rounded-full p-3',
            isFavorite ? 'border-orange-80' : 'border-primary-90',
          )}
          onClick={handleClickFavorite}
          aria-label="Like story"
        >
          <ThumbsUp
            className={isFavorite ? 'text-orange-50' : 'text-primary-50'}
            size={20}
            weight={isFavorite ? 'fill' : 'bold'}
          />
        </IconButton>
      </div>
    </div>

  );
};
