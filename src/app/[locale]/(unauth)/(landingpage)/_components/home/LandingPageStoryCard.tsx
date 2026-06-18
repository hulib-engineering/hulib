'use client';

import { Eye, Heart, ShareFatIcon, ThumbsUp } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';
import React, { useState } from 'react';

import Avatar from '@/components/core/avatar/Avatar';
import { Chip } from '@/components/core/chip/Chip';
import { mergeClassnames } from '@/components/core/private/utils';
import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';
import { getTopicBadgeClasses } from '@/features/admin/utils/getTopicBadgeClasses';
import { Cover } from '@/features/stories/components/Cover';
import { DEFAULT_STORY_COVER_ASSET } from '@/features/stories/constants';
import { useAddStoryToMyFavoritesMutation, useRemoveStoryFromMyFavoritesMutation } from '@/libs/services/modules/user';
import type { Story as TStory } from '@/libs/services/modules/stories/storiesType';
import Button from '@/components/core/button/Button';
import IconButton from '@/components/core/iconButton/IconButton';
import { Env } from '@/libs/Env.mjs';
import { AppConfig } from '@/utils/AppConfig';

type ILandingPageStoryCardProps = {
  data: TStory;
  className?: string;
};

const LOGIN_REQUIRED_MESSAGE = 'Vui lòng đăng nhập để tiếp tục';
const COPY_STORY_LINK_SUCCESS_MESSAGE = 'Đã sao chép liên kết câu chuyện';
const COPY_STORY_LINK_ERROR_MESSAGE = 'Không thể sao chép liên kết câu chuyện';
const MAX_STORY_URL_LENGTH_FOR_TOAST = 60;
const SHARE_OPEN_DELAY_MS = 1500;

const truncateMiddleText = (value: string, maxLength: number) => {
  if (value.length <= maxLength || maxLength < 5) {
    return value;
  }

  const visibleChars = maxLength - 3;
  const startLength = Math.ceil(visibleChars / 2);
  const endLength = Math.floor(visibleChars / 2);

  return `${value.slice(0, startLength)}...${value.slice(-endLength)}`;
};

const fallbackCopyText = (value: string) => {
  const textArea = document.createElement('textarea');
  textArea.value = value;
  textArea.setAttribute('readonly', '');
  textArea.style.position = 'fixed';
  textArea.style.left = '-9999px';

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  const isCopied = document.execCommand('copy');
  document.body.removeChild(textArea);

  return isCopied;
};

const wait = (ms: number) => new Promise(resolve => window.setTimeout(resolve, ms));

const LandingPageStoryCard = ({ data, className }: ILandingPageStoryCardProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const locale = useLocale();
  const t = useTranslations('ExploreStory');

  const [isFavorite, setIsFavorite] = useState(Boolean(data.isFavorite));
  const [isSharePending, setIsSharePending] = useState(false);

  const [addToMyFavorites] = useAddStoryToMyFavoritesMutation();
  const [removeFromFavorite] = useRemoveStoryFromMyFavoritesMutation();
  const visibleTopics = data.topics?.slice(0, 1) ?? [];
  const remainingTopicsCount = Math.max((data.topics?.length ?? 0) - visibleTopics.length, 0);

  const handleManageFavoriteList = async () => {
    if (!session) {
      pushError(LOGIN_REQUIRED_MESSAGE);
      return;
    }

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
  };

  const handleShareToFacebook = async () => {
    if (!session) {
      pushError(LOGIN_REQUIRED_MESSAGE);
      return;
    }

    if (isSharePending) {
      return;
    }

    setIsSharePending(true);

    try {
      const localePrefix = locale === AppConfig.defaultLocale ? '' : `/${locale}`;
      const storyPath = `${localePrefix}/explore-story/${data.id}`;
      const storyUrl = new URL(storyPath, Env.NEXT_PUBLIC_APP_URL).toString();
      const shortStoryUrl = truncateMiddleText(storyUrl, MAX_STORY_URL_LENGTH_FOR_TOAST);
      const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(storyUrl)}`;

      let isCopied = false;

      if (window.isSecureContext && navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(storyUrl);
          isCopied = true;
        } catch {
          isCopied = false;
        }
      }

      if (!isCopied) {
        try {
          isCopied = fallbackCopyText(storyUrl);
        } catch {
          isCopied = false;
        }
      }

      if (!isCopied) {
        pushError(COPY_STORY_LINK_ERROR_MESSAGE);
        return;
      }

      pushSuccess(`${COPY_STORY_LINK_SUCCESS_MESSAGE}: ${shortStoryUrl}`);
      await wait(SHARE_OPEN_DELAY_MS);
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    } finally {
      setIsSharePending(false);
    }
  };

  return (
    <div className="rounded-2xl border border-neutral-90 bg-white p-3 shadow-sm lg:gap-5 lg:rounded-[24px] lg:p-4">
      <div className={mergeClassnames(
        'flex w-full items-stretch gap-3',
        className,
      )}
      >
        <div className="relative flex min-w-0 flex-1 flex-col justify-between gap-3 lg:gap-4">
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
                <Heart className="text-yellow-50" size={16} weight="fill" />
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

        <div className="relative h-[212px] w-[120px] shrink-0 overflow-hidden rounded-xl border border-neutral-90 lg:h-[422px] lg:w-[236px] lg:rounded-2xl">
          <Cover src={data?.cover?.path || DEFAULT_STORY_COVER_ASSET} className="size-full" />
        </div>
      </div>
      <div className="mt-3 flex w-full items-center gap-2">
        <Button
          size="lg"
          className="flex-1 rounded-full py-3 text-base font-medium leading-5"
          onClick={() => router.push(`/explore-story/${data.id}`)}
        >
          Đọc nhật ký
        </Button>
        <IconButton
          variant="outline"
          size="md"
          className={mergeClassnames(
            'rounded-full p-3',
            isFavorite ? 'border-orange-80' : 'border-primary-90',
          )}
          onClick={handleManageFavoriteList}
          aria-label="Like story"
        >
          <ThumbsUp
            className={isFavorite ? 'text-orange-50' : 'text-primary-50'}
            size={20}
            weight={isFavorite ? 'fill' : 'bold'}
          />
        </IconButton>
        <IconButton
          variant="outline"
          size="md"
          animation={isSharePending ? 'progress' : undefined}
          className={mergeClassnames('rounded-full border-primary-90 p-3', isSharePending && 'opacity-50')}
          onClick={handleShareToFacebook}
          disabled={isSharePending}
          aria-label="Share story"
        >
          <ShareFatIcon className="text-primary-50" size={20} weight="bold" />
        </IconButton>
      </div>
    </div>

  );
};

export { LandingPageStoryCard };
