'use client';

import {
  CalendarDots,
  FacebookLogo,
  InstagramLogo,
  ThreadsLogo,
} from '@phosphor-icons/react';
import { useSession } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';

import * as React from 'react';

import { usePathname, useRouter } from '@/libs/i18nNavigation';
import { useAppSelector } from '@/libs/hooks';

import Button from '@/components/core/button/Button';

import { mergeClassnames } from '@/components/core/private/utils';

import type { Topic } from '@/libs/services/modules/topics/topicType';
import { useLikeStoryMutation, useShareStoryMutation } from '@/libs/services/modules/stories';
import { ChangeCountEnum } from '@/libs/services/modules/stories/updateLikeCountStory';
import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';
import { copyToClipboard } from '@/app/[locale]/(unauth)/(landingpage)/_components/home/utils';
import { AppConfig } from '@/utils/AppConfig';
import ShareModal from '@/app/[locale]/(auth)/explore-story/[id]/_components/ShareModal';
import AuthorBasicInfo from '@/components/author/AuthorBasicInfo';
import type { User } from '@/features/users/types';
import { useGetHuberBookedSessionsQuery, useGetHuberStoriesQuery } from '@/libs/services/modules/huber';
import BookInfo from '@/components/book/BookInfo';

type StorySidePanelProps = {
  data: {
    id: number;
    likeCount?: number;
    cover?: { path: string };
    topics?: Topic[];
    viewCount?: number;
    shareCount?: number;
    sharedUserIds?: string[];
    likedUserIds?: string[];
    humanBook?: User;
  };
};

function BookMeeting({ handleBookingClick, userId }: { handleBookingClick: () => void; userId: number | undefined }) {
  const t = useTranslations('ExploreStory');
  const { status } = useSession();

  const disabledCondition = status === 'unauthenticated' || userId === undefined;
  const { data: bookedSessionsList, isLoading }
  = useGetHuberBookedSessionsQuery({ id: userId }, { skip: !userId }); // replace with a var of user's number of booked sessions if BE added that

  const max_xl = '';// "max-lg:absolute max-[425px]:bottom-10 max-lg:bottom-20 max-lg:left-0 max-lg:z-0 max-lg:mx-4 p-4";
  const xl = 'lg:p-5';

  return (
    <div
      className={mergeClassnames(
        'w-auto flex flex-col items-center gap-5 overflow-hidden rounded-2xl bg-white shadow-sm border-2 border-primary-70',
        max_xl,
        xl,
      )}
    >
      <p className="text-center text-base leading-6 text-neutral-20">{disabledCondition ? t('booking_cta_unauth') : t('booking_cta')}</p>
      <Button
        onClick={handleBookingClick}
        disabled={disabledCondition}
        iconLeft={<CalendarDots className={mergeClassnames(!disabledCondition && 'text-white')} size={20} weight="bold" />}
        className={mergeClassnames('w-full', !disabledCondition && 'border border-primary-80 bg-gradient-to-b from-blue-40 to-lavender-40 text-white hover:opacity-95')}
      >
        <span className="mt-1">{t('book_a_meeting')}</span>
      </Button>
      <p className="text-center text-xs leading-[14px] text-neutral-20">
        {t('booking_count', { bookingCount: `${(disabledCondition || isLoading) ? 0 : bookedSessionsList?.length}` })}
      </p>
    </div>
  );
}

export default function StorySidePanel({ data }: StorySidePanelProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('ExploreStory');

  const [shareStory] = useShareStoryMutation();
  const [handleUpdateLikeCount] = useLikeStoryMutation();

  // TODO: remove if storyDetailQuery API returns a number of published stories in humanbook
  const { data: storiesList } = useGetHuberStoriesQuery(
    { huberId: data?.humanBook?.id, publishedOnly: true },
    { skip: !data?.humanBook?.id },
  );

  const requireAuth = React.useCallback(() => {
    if (!session) {
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return false;
    }
    return true;
  }, [session, router, pathname]);

  const [isLiked, setIsLiked] = React.useState(false);
  const [isShared, setIsShared] = React.useState(false);
  const [likeCount, setLikeCount] = React.useState(data?.likeCount ?? 0);
  const [shareCount, setShareCount] = React.useState(data?.shareCount ?? 0);
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);

  const userId = useAppSelector(state => state.auth.userInfo?.id);

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

    if (userId && data?.sharedUserIds) {
      setIsShared(
        data.sharedUserIds.some((id: string) => Number(id) === Number(userId)),
      );
    }
  }, [data?.likedUserIds, data?.sharedUserIds, userId]);

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
  }, [requireAuth, isLiked, handleUpdateLikeCount, data.id, userId, t]);

  const handleClickShare = React.useCallback(async () => {
    if (!requireAuth()) {
      return;
    }
    if (!storyUrl) {
      return;
    }

    if (!isShared) {
      const isCopied = await copyToClipboard(storyUrl);
      const rs = await shareStory({ storyId: data.id, userId }).unwrap();
      setIsShared(true);

      if (!isCopied) {
        pushError(t('copy_link_error'));
        return;
      }

      setShareCount(rs.shareCount);
    }
    pushSuccess(t('copy_link_success'));
    setIsShareModalOpen(true);
  }, [t, requireAuth, storyUrl, isShared, shareStory, data.id, userId]);

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
    if (!data?.humanBook?.id) {
      return;
    }
    router.push(`${data?.id}_${data?.humanBook?.id}/booking`);
  }, [requireAuth, router, data?.id, data?.humanBook?.id]);

  return (
    <>
      <ShareModal
        open={isShareModalOpen}
        onClose={handleCloseShareModal}
        shareOptions={shareOptions}
      />

      <div className="flex w-full flex-col gap-y-5 lg:w-[336px] lg:w-auto lg:max-w-[336px] lg:shrink-0">
        <BookInfo
          coverPath={data?.cover?.path}
          topics={data?.topics}
          viewCount={data?.viewCount}
          likeCount={likeCount}
          shareCount={shareCount}
          isLiked={isLiked}
          handleClickShare={handleClickShare}
          clickLikeStory={clickLikeStory}
        />

        <BookMeeting
          handleBookingClick={handleBookingClick}
          userId={data?.humanBook?.id}
        />

        <div className="w-full gap-y-3 overflow-hidden rounded-2xl bg-white p-5 shadow-sm">
          <AuthorBasicInfo
            humanBook={data?.humanBook}
            numStories={storiesList?.data?.length}
            onClickFunction={handleAuthorClick}
          />
        </div>
      </div>
    </>
  );
}
