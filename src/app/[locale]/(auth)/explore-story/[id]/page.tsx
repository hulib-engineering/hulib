'use client';

import { ArrowLeft, BookmarkSimple, CalendarDots, Heart } from '@phosphor-icons/react';
import { notFound, redirect, useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import * as React from 'react';
import { useState } from 'react';

import Avatar from '@/components/core/avatar/Avatar';
import Button from '@/components/core/button/Button';
import { IndexStoryListSectionLayout } from '@/components/home/IndexStoryListCommonLayout';
import { StoryDetailSkeleton } from '@/components/loadingState/Skeletons';
import { CustomCover } from '@/components/stories/CustomCover';
import { DetailedStory } from '@/components/stories/DetailedStory';
import StoryReviewsWithOverview from '@/layouts/stories/StoryReviewsWithOverview';
import { TopicChip } from '@/layouts/webapp/ChipFilter';
import {
  useGetReviewsOverviewQuery,
  useGetSimilarStoriesQuery,
  useGetStoryDetailQuery,
} from '@/libs/services/modules/stories';
import { PublishStatusEnum } from '@/libs/services/modules/stories/storiesType';
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

  const [storyInfoContainerHeight, setStoryInfoContainerHeight] = useState(0);

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-screen-sm py-6 lg:max-w-screen-2xl lg:px-28 lg:py-8">
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
    <div className="mx-auto w-full max-w-screen-sm py-6 lg:max-w-screen-2xl lg:px-28 lg:py-8">
      <div className="flex flex-col gap-6 lg:gap-12">
        <div className="flex flex-col gap-2">
          <Button
            variant="ghost"
            size="lg"
            iconLeft={<ArrowLeft />}
            className="w-fit text-black"
            onClick={() => router.back()}
          >
            Back
          </Button>
          <div className="flex flex-col gap-4 px-4 lg:flex-row lg:items-stretch lg:gap-8 lg:px-0">
            <div className="flex-1">
              <DetailedStory
                title={data?.title || ''}
                cover={data?.humanBook?.photo?.path ?? '/assets/images/half-title-illus.png'}
                authorName={data?.humanBook?.fullName || ''}
                abstract={data?.abstract || ''}
                onDynamicHeightChange={height => setStoryInfoContainerHeight(height)}
              />
            </div>
            <div
              className="flex w-full flex-1 flex-col-reverse items-center gap-6 overflow-hidden rounded-lg bg-white px-4 py-6 shadow-sm lg:max-w-[268px] lg:flex-col lg:justify-between lg:rounded-2xl lg:px-6"
              style={{ height: storyInfoContainerHeight }}
            >
              <div className="flex w-full flex-col gap-3">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <h5 className="line-clamp-2 text-2xl font-medium leading-9 text-primary-10">{data?.title}</h5>
                    <div className="flex items-center gap-1 lg:gap-3">
                      <Avatar
                        imageUrl={data?.humanBook.photo?.path ?? '/assets/images/ava-placeholder.png'}
                        size="sm"
                        className="size-9"
                      />
                      <div className="flex items-center gap-3 lg:flex-col lg:items-start lg:gap-1">
                        <p className="text-sm font-medium leading-6 text-neutral-50">{data?.humanBook.fullName}</p>
                        <div className="flex items-center gap-1 text-xs leading-[14px] text-neutral-40">
                          <span className="text-sm leading-4 text-neutral-20">20</span>
                          <p>sessions</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="flex min-w-[43px] items-center">
                      <Heart weight="fill" className="text-yellow-50" />
                      <p className="text-sm font-medium leading-4 text-neutral-20">{storyReviewOverview?.rating}</p>
                    </div>
                    <p className="text-xs leading-[14px] text-neutral-40">
                      {`(${storyReviewOverview?.numberOfReviews} rating)`}
                    </p>
                  </div>
                </div>
                <div className="hidden w-auto gap-2 overflow-x-auto scroll-smooth py-1 lg:flex">
                  {data?.topics.map((topic: Topic) => (
                    <TopicChip
                      className="border-none bg-blue-90 text-primary-50"
                      key={topic.id}
                      isActive
                    >
                      {topic.name}
                    </TopicChip>
                  ))}
                </div>
              </div>
              <CustomCover
                titleStory={data?.title}
                authorName={data?.humanBook?.fullName ?? ''}
                srcImage={
                  data?.cover?.path
                  ?? '/assets/images/cover-book/story_background_yellow.png'
                }
              />
              <div className="flex w-full flex-col gap-2">
                <Button
                  size="lg"
                  fullWidth
                  onClick={() => router.push(`${data?.id}/booking`)}
                >
                  <div className="flex items-center gap-2">
                    <CalendarDots className="text-xl" />
                    <span>Book a Meeting</span>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  fullWidth
                >
                  <div className="flex items-center gap-2">
                    <BookmarkSimple className="text-xl" />
                    <span>Save for later</span>
                  </div>
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
