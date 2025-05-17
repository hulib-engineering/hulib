'use client';

import { useParams } from 'next/navigation';
import * as React from 'react';

import SimilarStory from '@/components/exploreStory/SimilarStory';
import HumanBookInfo from '@/components/storyDetails/HumanBookInfo';
import RatingOverview from '@/components/storyDetails/RatingOverview';
import ReaderReview from '@/components/storyDetails/ReaderReview';
import Story from '@/components/storyDetails/Story';
import StoryDetailsSkeleton from '@/components/storyDetails/StoryDetailsSkeleton';
import { useGetStoryDetailQuery } from '@/libs/services/modules/stories';

export default function Index() {
  const { id } = useParams();

  const { data, isLoading } = useGetStoryDetailQuery({
    id: Number(id), // id is a string, so we need to convert it to a number
  });

  if (isLoading) {
    return <StoryDetailsSkeleton />;
  }

  return (
    <div className="mx-auto w-full max-w-screen-sm px-4 py-8 lg:max-w-screen-2xl lg:px-28">
      <div className="rounded-[20px] bg-white">
        <div className="p-0 lg:p-5">
          <div className="flex flex-col justify-start gap-5 lg:flex-row">
            <div className="flex-1">
              <Story
                // cover={{
                //   id: data?.cover?.id || '',
                //   path: data?.cover?.path || '/assets/images/user-avatar.jpeg',
                // }}
                cover={{
                  id: data?.cover?.id || '',
                  path: '/assets/images/user-avatar.jpeg',
                }}
                title={data?.title || ''}
                abstract={data?.abstract || ''}
              />
            </div>
            <div className="w-full lg:w-[268px]">
              <HumanBookInfo
                humanBook={data?.humanBook}
                title={data?.title}
                coverPath={data?.cover?.path}
                abstract={data?.abstract || ''}
                storyReview={data?.storyReview}
                storyId={Number(id)}
              />
            </div>
          </div>
          <div className="my-4 flex w-full flex-col justify-between gap-5 md:flex-row">
            <ReaderReview storyId={Number(id)} />
            <RatingOverview id={Number(id)} />
          </div>
        </div>
      </div>
      {data?.humanBook?.id && (
        <SimilarStory
          humanBookId={data.humanBook.id}
          topicIds={
            data?.topics?.length > 0
              ? data?.topics?.map((topic: { id: number }) => topic.id)
              : []
          }
        />
      )}
    </div>
  );
}
