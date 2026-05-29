'use client';

import { ArrowLeft, BookmarkSimple, CalendarDots, Heart } from '@phosphor-icons/react';
import { notFound, redirect, useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import * as React from 'react';

import Avatar from '@/components/core/avatar/Avatar';
import Button from '@/components/core/button/Button';
import { mergeClassnames } from '@/components/core/private/utils';
import { IndexStoryListSectionLayout } from '@/components/home/IndexStoryListCommonLayout';
import { StoryDetailSkeleton } from '@/components/loadingState/Skeletons';
import { Cover } from '@/features/stories/components/Cover';
import { DetailedStory } from '@/components/stories/DetailedStory';
import StoryReviewsWithOverview from '@/layouts/stories/StoryReviewsWithOverview';
import {
  useGetReviewsOverviewQuery,
  useGetSimilarStoriesQuery,
  useGetStoryDetailQuery,
} from '@/libs/services/modules/stories';
import { PublishStatusEnum } from '@/libs/services/modules/stories/storiesType';
import { Chip } from '@/components/core/chip/Chip';
import { getTopicBadgeClasses } from '@/features/admin/utils/getTopicBadgeClasses';
import type { Topic } from '@/libs/services/modules/topics/topicType';

export default function Index() {
  const { id } = useParams();
  const router = useRouter();

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
  const { data: storyReviewOverview } = useGetReviewsOverviewQuery(id);

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

  return (
    <div className="mx-auto w-full py-6 xl:max-w-[1216px] xl:py-8">
      <div className="flex flex-col gap-6 xl:gap-12">
        <div className="flex flex-col gap-2">
          <Button
            variant="ghost"
            iconLeft={<ArrowLeft />}
            className="w-fit text-black"
            onClick={() => router.back()}
          >
            Back
          </Button>
          <div className="flex flex-col gap-4 px-4 xl:flex-row xl:items-stretch xl:gap-8 xl:px-0">
            <div className="flex-1">
              <DetailedStory
                title={data?.title || ''}
                cover={data?.humanBook?.photo?.path ?? '/assets/images/landing/half-title-illus.png'}
                authorName={data?.humanBook?.fullName || ''}
                abstract={data?.abstract || ''}
                // onDynamicHeightChange={height => setStoryInfoContainerHeight(height)}
              />
            </div>
            <div
              className={mergeClassnames(
                'flex h-[656px] w-full flex-1 flex-col-reverse items-center gap-6 overflow-hidden rounded-lg bg-white px-4 py-6 shadow-sm',
                'xl:max-w-[268px] xl:flex-col xl:justify-between xl:rounded-2xl xl:px-6',
              )}
            >
              <div className="flex w-full flex-col gap-3">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <h5 className="line-clamp-2 text-2xl font-medium leading-9 text-primary-10">{data?.title}</h5>
                    <div className="flex flex-col gap-1 rounded-2xl border border-neutral-90 p-2 xl:gap-3">
                      <div className="flex items-center gap-2">
                        <Avatar
                          imageUrl={data?.humanBook.photo?.path ?? '/assets/images/avatars/ava-placeholder.png'}
                          size="sm"
                          className="!size-7 shrink-0"
                        />
                        <p className="line-clamp-1 text-lg font-medium leading-7 text-neutral-50">{data?.humanBook.fullName}</p>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-1 text-xs leading-[14px] text-neutral-40">
                          <div className="flex items-center gap-0.5">
                            <Heart weight="fill" className="text-pink-40" />
                            <p className="text-sm font-medium leading-4 text-neutral-20">{storyReviewOverview?.rating}</p>
                          </div>
                          <p className="text-xs leading-[14px] text-neutral-40">
                            {`(${storyReviewOverview?.numberOfReviews} rating)`}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-xs leading-[14px] text-neutral-40">
                          <span className="text-sm leading-4 text-neutral-20">20</span>
                          <p>Stories</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex w-full flex-col gap-4">
                <div className="scrollbar-none hidden w-auto gap-2 overflow-x-auto scroll-smooth py-1 xl:flex">
                  {data?.topics.map((topic: Topic) => (
                    <Chip
                      key={topic.id}
                      as="span"
                      className={mergeClassnames(
                        'h-8 min-w-0 shrink-0 overflow-visible whitespace-nowrap rounded-2xl border py-1 px-2 xl:py-2',
                        'text-xs font-medium leading-[14px] xl:text-sm xl:font-normal xl:leading-4',
                        getTopicBadgeClasses(topic.color),
                      )}
                    >
                      {topic.name}
                    </Chip>
                  ))}
                </div>
                <div className="flex w-full items-center justify-center">
                  <Cover src={data?.cover?.path} />
                </div>
              </div>
              <div className="flex w-[184px] flex-col gap-2">
                <Button onClick={() => router.push(`${data?.id}/booking`)} iconLeft={<CalendarDots />}>
                  Book a Meeting
                </Button>
                <Button variant="outline" iconLeft={<BookmarkSimple />}>
                  Save for later
                </Button>
              </div>
            </div>
          </div>
        </div>

        <StoryReviewsWithOverview />

        <IndexStoryListSectionLayout
          title={t('similar_stories')}
          stories={{ ...similarStories, data: similarStories?.data?.slice(0, 5) || [] }}
          onSeeAllClick={() => router.push('/explore-story')}
        />
      </div>
    </div>
  );
}
