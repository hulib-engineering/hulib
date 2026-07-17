'use client';

import {
  Books,
  CalendarDots,
  Check,
  Eye,
  FacebookLogo,
  Heart,
  InstagramLogo,
  ShareFat,
  ThreadsLogo,
  ThumbsUp,
} from '@phosphor-icons/react';
import { useSession } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';

import * as React from 'react';

import { usePathname, useRouter } from '@/libs/i18nNavigation';

import Avatar from '@/components/core/avatar/Avatar';
import Button from '@/components/core/button/Button';
import { Chip } from '@/components/core/chip/Chip';
import { mergeClassnames } from '@/components/core/private/utils';
import { Cover } from '@/features/stories/components/Cover';
import { getTopicBadgeClasses } from '@/features/admin/utils/getTopicBadgeClasses';
import type { Topic } from '@/libs/services/modules/topics/topicType';
import { useLikeStoryMutation, useShareStoryMutation } from '@/libs/services/modules/stories';
import { ChangeCountEnum } from '@/libs/services/modules/stories/updateLikeCountStory';
import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';
import { copyToClipboard } from '@/app/[locale]/(unauth)/(landingpage)/_components/home/utils';
import { COPY_STORY_LINK_ERROR_MESSAGE } from '@/features/stories/constants';
import { AppConfig } from '@/utils/AppConfig';
import ShareModal from '@/app/[locale]/(auth)/explore-story/[id]/_components/ShareModal';

type StorySidePanelProps = {
  data: {
    id: number;
    likeCount?: number;
    cover?: { path: string };
    topics?: Topic[];
    viewCount?: number;
    shareCount?: number;
    humanBook?: {
      id: string | number;
      fullName: string;
      photo?: { path: string };
      countTopics?: number;
      rating?: number;
    };
  };
};

export default function StorySidePanel({ data }: StorySidePanelProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('ExploreStory');

  const [shareStory] = useShareStoryMutation();
  const [handleUpdateLikeCount] = useLikeStoryMutation();

  const requireAuth = React.useCallback(() => {
    if (!session) {
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return false;
    }
    return true;
  }, [session, router, pathname]);

  const [isFavorite, setIsFavorite] = React.useState(false);
  const [likeCount, setLikeCount] = React.useState(data?.likeCount ?? 0);
  const [shareCount, setShareCount] = React.useState(data?.shareCount ?? 0);
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);

  const prevLikeCountRef = React.useRef(data?.likeCount);

  React.useEffect(() => {
    if (prevLikeCountRef.current !== data?.likeCount) {
      prevLikeCountRef.current = data?.likeCount;
      setLikeCount(data?.likeCount ?? 0);
    }
  }, [data?.likeCount]);

  const storyUrl = React.useMemo(() => {
    if (!data?.id) {
      return '';
    }
    const localePrefix = locale === AppConfig.defaultLocale ? '' : `/${locale}`;
    return new URL(
      `${localePrefix}/explore-story/${data.id}`,
      'https://hulib.org',
    ).toString();
  }, [data?.id, locale]);

  const shareOptions = React.useMemo(() => [
    {
      icon: FacebookLogo,
      label: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(storyUrl)}`,
    },
    { icon: InstagramLogo, label: 'Instagram', url: 'https://www.instagram.com/' },
    { icon: ThreadsLogo, label: 'Threads', url: 'https://www.threads.net/' },
  ], [storyUrl]);

  const clickLikeStory = React.useCallback(async () => {
    if (!requireAuth()) {
      return;
    }
    try {
      const newCount = isFavorite ? likeCount - 1 : likeCount + 1;
      if (isFavorite) {
        await handleUpdateLikeCount({
          id: data.id,
          type: ChangeCountEnum.DOWN,
        });
        pushSuccess(t('story_removed_from_favorites'));
      } else {
        await handleUpdateLikeCount({
          id: data.id,
          type: ChangeCountEnum.UP,
        });
        pushSuccess(t('story_added_to_favorites'));
      }
      setIsFavorite(prev => !prev);
      setLikeCount(newCount);
    } catch {
      pushError(t('like_error'));
    }
  }, [requireAuth, isFavorite, likeCount, data?.id, handleUpdateLikeCount, t]);

  const handleClickShare = React.useCallback(async () => {
    if (!requireAuth()) {
      return;
    }
    if (!storyUrl) {
      return;
    }

    const isCopied = await copyToClipboard(storyUrl);
    shareStory(data.id).unwrap();

    if (!isCopied) {
      pushError(COPY_STORY_LINK_ERROR_MESSAGE);
      return;
    }

    setShareCount(prev => prev + 1);
    pushSuccess(t('share_copied'));
    setIsShareModalOpen(true);
  }, [requireAuth, storyUrl, data?.id, shareStory, t]);

  const handleCloseShareModal = React.useCallback(() => {
    setIsShareModalOpen(false);
  }, []);

  const handleAuthorClick = React.useCallback(() => {
    if (!requireAuth()) {
      return;
    }
    if (!data?.humanBook?.id) {
      return;
    }
    router.push(`/users/${data.humanBook.id}`);
  }, [requireAuth, router, data?.humanBook?.id]);

  const handleBookingClick = React.useCallback(() => {
    if (!requireAuth()) {
      return;
    }
    router.push(`${data?.id}/booking`);
  }, [requireAuth, router, data?.id]);

  return (
    <>
      <ShareModal
        open={isShareModalOpen}
        onClose={handleCloseShareModal}
        shareOptions={shareOptions}
      />

      <div className="flex w-full flex-col gap-y-5 xl:w-auto xxl:w-[336px] xxl:max-w-[336px] xxl:shrink-0">
        <div
          className={mergeClassnames(
            'flex w-full flex-col items-center gap-y-4 overflow-hidden rounded-2xl bg-white px-4 py-6 shadow-sm',
          )}
        >
          <div className="flex w-full flex-col gap-y-4">
            <div className="flex max-h-[340px] w-full items-center justify-center">
              <Cover src={data?.cover?.path ?? null} size="w-[226px] h-[340px]" />
            </div>
            {data?.topics?.length ? (
              <div className="scrollbar-none hidden w-auto gap-2 overflow-x-auto scroll-smooth py-1 xl:flex">
                {data.topics.map((topic: Topic) => (
                  <Chip
                    key={topic.id}
                    as="span"
                    className={mergeClassnames(
                      'min-w-0 shrink-0 overflow-visible whitespace-nowrap rounded border h-[22px] py-1 px-2',
                      'text-xs font-medium leading-[14px] ',
                      getTopicBadgeClasses(topic.color),
                    )}
                  >
                    {topic.name}
                  </Chip>
                ))}
              </div>
            ) : null}

            <div className="mt-4 flex flex-wrap items-center gap-2 xxl:gap-x-8">
              <div className="flex items-center gap-x-1">
                <Eye className="text-primary-50" size={16} />
                <p className="text-[14px] font-medium leading-4 text-neutral-10">
                  {data?.viewCount ?? 0}
                </p>
              </div>
              <div className="flex items-center gap-x-1">
                <ThumbsUp className="text-pink-40" size={16} weight="fill" />
                <p className="text-[14px] font-medium leading-4 text-neutral-10">
                  {likeCount}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <ShareFat className="text-primary-50" size={16} />
                <p className="text-[14px] font-medium leading-4 text-neutral-20">
                  {shareCount}
                </p>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col gap-2">
            <Button
              iconLeft={<ShareFat className="text-white" size={20} weight="bold" />}
              onClick={handleClickShare}
            >
              {t('share')}
            </Button>

            <Button
              variant="outline"
              iconLeft={(
                <ThumbsUp
                  className={isFavorite ? 'text-pink-40' : 'text-primary-50'}
                  size={20}
                  weight={isFavorite ? 'fill' : 'bold'}
                />
              )}
              onClick={clickLikeStory}
            >
              {t('like_button')}
            </Button>
          </div>
        </div>

        <div
          className={mergeClassnames(
            'flex w-full flex-col items-center gap-y-5 overflow-hidden rounded-2xl bg-white p-5 shadow-sm border-2 border-primary-70',
          )}
        >
          <p className="text-center text-base leading-6 text-neutral-20">{t('booking_cta')}</p>
          <Button
            onClick={handleBookingClick}
            iconLeft={<CalendarDots className="text-white" size={20} weight="bold" />}
            className="w-full border border-primary-80 bg-gradient-to-b from-blue-40 to-lavender-40 text-white hover:opacity-95"
          >
            {t('book_a_meeting')}
          </Button>
          <p className="text-center text-xs leading-[14px] text-neutral-20">{t('booking_count')}</p>
        </div>

        <div
          className={mergeClassnames(
            'flex w-full flex-col gap-y-3 overflow-hidden rounded-2xl bg-white p-5 shadow-sm',
          )}
        >
          <p className="text-sm font-medium leading-4 text-neutral-50">{t('author')}</p>
          <button
            type="button"
            className="flex items-center gap-1 lg:gap-2"
            onClick={handleAuthorClick}
          >
            <div className="relative">
              <Avatar
                imageUrl={data?.humanBook?.photo?.path}
                name={data?.humanBook?.fullName}
                className="size-9"
              />
              <div className="absolute left-6 top-5 flex items-center justify-center rounded-full bg-lavender-80 p-0.5">
                <div className="flex items-center justify-center rounded-full bg-gradient-to-b from-blue-50 to-lavender-40 p-0.5">
                  <Check size={8} weight="bold" className="text-lavender-80" />
                </div>
              </div>
            </div>

            <span className="line-clamp-1 text-[18px] font-medium leading-7 text-primary-50 hover:cursor-pointer hover:underline">
              {data?.humanBook?.fullName}
            </span>
          </button>
          <div className="flex flex-wrap justify-between gap-2">
            <div className="flex items-center gap-1">
              <Books className="text-neutral-20" size={16} weight="fill" />
              <p className="text-[14px] font-medium leading-4 text-neutral-20">
                {data?.humanBook?.countTopics ?? 0}
              </p>
              <p className="text-[14px] font-normal leading-4 text-neutral-10">{t('stories')}</p>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="text-pink-40" size={16} weight="fill" />
              <p className="text-[14px] font-medium leading-4 text-neutral-20">
                {data?.humanBook?.rating ?? 0}
              </p>
              <p className="text-[14px] font-normal leading-4 text-neutral-10">{t('favorites')}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
