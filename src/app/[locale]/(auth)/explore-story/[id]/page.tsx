'use client';

import {
  ArrowLeft,
  Books,
  CalendarDots,
  Check,
  Eye,
  Heart,
  ShareFat,
  ThumbsUp,
} from '@phosphor-icons/react';
import { notFound, redirect, useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import * as React from 'react';

import Button from '@/components/core/button/Button';
import { mergeClassnames } from '@/components/core/private/utils';
import { IndexStoryListSectionLayout } from '@/components/home/IndexStoryListCommonLayout';
import { StoryDetailSkeleton } from '@/components/loadingState/Skeletons';
import { Cover } from '@/features/stories/components/Cover';
import { DetailedStory } from '@/features/stories/components/DetailedStory';
import {
  useGetSimilarStoriesQuery,
  useGetStoryDetailQuery,
} from '@/libs/services/modules/stories';
import { PublishStatusEnum } from '@/libs/services/modules/stories/storiesType';
import { Chip } from '@/components/core/chip/Chip';
import { getTopicBadgeClasses } from '@/features/admin/utils/getTopicBadgeClasses';
import type { Topic } from '@/libs/services/modules/topics/topicType';
import StoryReviews from '@/app/[locale]/(auth)/explore-story/[id]/_components/StoryReviews';
import Avatar from '@/components/core/avatar/Avatar';

export default function Index() {
  const { id } = useParams();
  const router = useRouter();
  const storyLayoutRef = React.useRef<HTMLDivElement>(null);
  const sidePanelRef = React.useRef<HTMLDivElement>(null);

  const t = useTranslations('ExploreStory');

  const { data, isLoading } = useGetStoryDetailQuery(Number(id));
  const { data: similarStories } = useGetSimilarStoriesQuery({
    page: 1,
    limit: 6,
    humanBookId: data?.humanBookId,
    topicIds: data?.topics.map((topic: { id: number }) => topic.id) ?? [],
  }, {
    skip: !data || (!data?.humanBookId && !data?.topics.length),
  });
  console.log('book data', data);
  const [bookWidth, setBookWidth] = React.useState<number>();

  React.useEffect(() => {
    const updateBookWidth = () => {
      if (!storyLayoutRef.current || !sidePanelRef.current) {
        return;
      }

      const isDesktop = window.matchMedia('(min-width: 1280px)').matches;
      if (!isDesktop) {
        setBookWidth(undefined);
        return;
      }

      const layoutRect = storyLayoutRef.current.getBoundingClientRect();
      const sidePanelRect = sidePanelRef.current.getBoundingClientRect();
      const computedLayoutStyles = window.getComputedStyle(storyLayoutRef.current);
      const gap = Number.parseFloat(computedLayoutStyles.columnGap || computedLayoutStyles.gap || '0');
      const leftPadding = layoutRect.left;
      const rightPadding = window.innerWidth - layoutRect.right;
      const computedBookWidth = window.innerWidth - leftPadding - rightPadding - sidePanelRect.width - gap;
      const isWideDesktop = window.matchMedia('(min-width: 1440px)').matches;
      const cappedBookWidth = isWideDesktop ? Math.min(computedBookWidth, 888) : computedBookWidth;

      setBookWidth(Math.max(cappedBookWidth, 0));
    };

    updateBookWidth();

    const layoutResizeObserver = new ResizeObserver(updateBookWidth);
    if (storyLayoutRef.current) {
      layoutResizeObserver.observe(storyLayoutRef.current);
    }
    if (sidePanelRef.current) {
      layoutResizeObserver.observe(sidePanelRef.current);
    }
    window.addEventListener('resize', updateBookWidth);

    return () => {
      layoutResizeObserver.disconnect();
      window.removeEventListener('resize', updateBookWidth);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-screen-sm py-6 xl:max-w-screen-2xl xl:px-28 xl:py-8">
        <StoryDetailSkeleton />
      </div>
    );
  }

  if (data && data?.publishStatus !== PublishStatusEnum.PUBLISHED) {
    return redirect(`/explore-story/${data.id}/preview`);
  }

  if (data && data?.publishStatus === PublishStatusEnum.DELETED) {
    return notFound();
  }

  const redirectToAuthorDetail = (authorId?: string | number) => {
    if (!authorId) {
      return;
    }
    router.push(`/users/${authorId}`);
  };

  return (
    <div className="mx-auto w-full py-6 xl:py-8">
      <div className="flex flex-col gap-6 px-4 xl:gap-12 xl:px-0 xxl:mx-auto xxl:w-fit">
        <div className="flex flex-col gap-2">
          <Button
            variant="ghost"
            iconLeft={<ArrowLeft />}
            className="w-fit text-black"
            onClick={() => router.back()}
          />
          <div
            ref={storyLayoutRef}
            className="flex flex-col gap-4 xl:flex-row xl:items-stretch xl:gap-8 xxl:justify-center xxl:gap-6"
          >
            <div className="flex min-w-0 flex-1 flex-col gap-y-8 xxl:w-[888px] xxl:max-w-[888px]">
              <DetailedStory
                abstract={data?.abstract || ''}
                bookWidth={bookWidth}
              />
              <StoryReviews />
            </div>
            <div
              ref={sidePanelRef}
              className="flex w-full flex-col gap-y-5 xl:w-auto xxl:w-[336px] xxl:max-w-[336px] xxl:shrink-0"
            >
              <div
                className={mergeClassnames(
                  'flex w-full flex-col items-center gap-y-4 overflow-hidden rounded-2xl bg-white px-4 py-6 shadow-sm',
                )}
              >
                <div className="flex w-full flex-col gap-y-4">
                  <div className="flex max-h-[340px] w-full items-center justify-center">
                    <Cover src={data?.cover?.path} />
                  </div>
                  <div className="scrollbar-none hidden w-auto gap-2 overflow-x-auto scroll-smooth py-1 xl:flex">
                    {data?.topics.map((topic: Topic) => (
                      <Chip
                        key={topic.id}
                        as="span"
                        className={mergeClassnames(
                          'min-w-0 shrink-0 overflow-visible whitespace-nowrap rounded border py-1 px-2',
                          'text-xs font-medium leading-[14px]',
                          getTopicBadgeClasses(topic.color),
                        )}
                      >
                        {topic.name}
                      </Chip>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-wrap justify-between gap-1">
                    <div className="flex items-center gap-x-1">
                      <Eye className="text-primary-50" size={16} />
                      <p className="text-[14px] font-medium leading-4 text-neutral-10">
                        {data.viewCount ?? 0}
                      </p>
                      <p className="text-[14px] font-normal leading-4 text-neutral-20">lượt xem</p>
                    </div>
                    <div className="flex items-center gap-x-1">
                      <ThumbsUp className="text-pink-40" size={16} weight="fill" />
                      <p className="text-[14px] font-medium leading-4 text-neutral-10">
                        {data?.totalLikes ?? 0}
                      </p>
                      <p className="text-[14px] font-normal leading-4 text-neutral-20">lượt thích</p>
                    </div>
                  </div>
                </div>
                <div className="flex w-[184px] flex-col gap-2">
                  <Button
                    iconLeft={<ShareFat className="text-white" size={20} weight="bold" />}
                    onClick={() => router.push(`${data?.id}/booking`)}
                  >
                    Chia sẻ
                  </Button>
                  <Button variant="outline" iconLeft={<ThumbsUp className="text-primary-50" size={20} weight="bold" />}>
                    Thích
                  </Button>
                </div>
              </div>
              <div
                className={mergeClassnames(
                  'flex w-full flex-col items-center gap-y-5 overflow-hidden rounded-2xl bg-white p-5 shadow-sm border-2 border-primary-70',
                )}
              >
                <p className="text-center text-base leading-6 text-neutral-20">Nếu cảm thấy kết nối với tác giả, bạn hãy nhớ đặt cuộc hẹn với tác giả tại đây nhé</p>
                <Button
                  onClick={() => router.push(`${data?.id}/booking`)}
                  iconLeft={<CalendarDots className="text-white" size={20} weight="bold" />}
                  className="border border-primary-80 bg-gradient-to-b from-blue-40 to-lavender-40 text-white hover:opacity-95"
                >
                  Book a Meeting
                </Button>
                <p className="text-center text-xs leading-[14px] text-neutral-20">Đã có 100 cuộc hẹn từ câu chuyện này</p>
              </div>
              <div
                className={mergeClassnames(
                  'flex w-full flex-col gap-y-3 overflow-hidden rounded-2xl bg-white p-5 shadow-sm',
                )}
              >
                <p className="text-sm font-medium leading-4 text-neutral-50">Tác giả</p>
                <button type="button" className="flex items-center gap-1 lg:gap-2" onClick={() => redirectToAuthorDetail(data?.humanBook?.id)}>
                  <div className="relative">
                    <Avatar
                      imageUrl={data.humanBook.photo?.path}
                      name={data.humanBook.fullName}
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
                    <p className="text-[14px] font-normal leading-4 text-neutral-10">câu chuyện</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="text-pink-40" size={16} weight="fill" />
                    <p className="text-[14px] font-medium leading-4 text-neutral-20">
                      {data?.humanBook?.rating ?? 0}
                    </p>
                    <p className="text-[14px] font-normal leading-4 text-neutral-10">yêu thích</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <IndexStoryListSectionLayout
          title={t('similar_stories')}
          stories={{ ...similarStories, data: similarStories?.data?.slice(0, 5) || [] }}
          onSeeAllClick={() => router.push('/explore-story')}
        />
      </div>
    </div>
  );
}
