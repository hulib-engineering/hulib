'use client';

import { ArrowLeft, Check, X } from '@phosphor-icons/react';
import { useParams, useRouter } from 'next/navigation';
import * as React from 'react';

import { useState } from 'react';
import Button from '@/components/core/button/Button';
import { StoryDetailSkeleton } from '@/components/loadingState/Skeletons';
import { DetailedStory } from '@/components/stories/DetailedStory';
import StoryConfirmationModal from '@/layouts/admin/StoryConfirmationModal';
import {
  useGetStoryDetailQuery,
} from '@/libs/services/modules/stories';
import type { Topic } from '@/libs/services/modules/user/userType';
import Avatar from '@/components/core/avatar/Avatar';
import { TopicChip } from '@/layouts/webapp/ChipFilter';
import { Cover } from '@/components/Cover';

export default function Index() {
  const { id } = useParams();
  const router = useRouter();

  const { data, isLoading } = useGetStoryDetailQuery(Number(id));

  const [isApprovalConfirmationModalOpen, setIsApprovalConfirmationModalOpen] = useState(false);
  const [isRejectionConfirmationModalOpen, setIsRejectionConfirmationModalOpen] = useState(false);

  if (isLoading) {
    return <StoryDetailSkeleton />;
  }

  return (
    <div className="flex w-full flex-col gap-6 pb-8 pt-6">
      <StoryConfirmationModal
        story={data}
        type="approve"
        open={isApprovalConfirmationModalOpen}
        onClose={() => setIsApprovalConfirmationModalOpen(false)}
      />
      <StoryConfirmationModal
        story={data}
        type="reject"
        open={isRejectionConfirmationModalOpen}
        onClose={() => setIsRejectionConfirmationModalOpen(false)}
      />
      {/* Back navigation */}
      <Button
        variant="ghost"
        size="lg"
        iconLeft={<ArrowLeft />}
        className="w-fit text-black"
        onClick={() => router.push('/admin/home')}
      >
        Back to Awaiting approval - Stories
      </Button>

      {/* Story information */}
      <div className="h-[210px] p-2">
        <div className="flex w-full gap-4 rounded-2xl bg-white p-3">
          {/* TO - DO: update when installing custom cover feature */}
          {/* <CustomCover */}
          {/*  titleStory={data?.title} */}
          {/*  authorName={data?.humanBook?.fullName} */}
          {/*  srcImage={data?.cover?.path ?? '/assets/images/cover-book/story_background_yellow.png'} */}
          {/*  className="lg:h-[170px] lg:w-[120px]" */}
          {/* /> */}
          <Cover
            coverUrl={data?.cover?.path ?? '/assets/images/cover-book/story_background_yellow.png'}
            title={data?.title ?? ''}
            authorName={data?.humanBook?.fullName ?? ''}
            className="lg:h-[170px] lg:w-[120px]"
          />
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <h5 className="text-2xl font-medium leading-8 text-primary-10">{data?.title}</h5>
              <div className="flex items-center gap-1">
                <Avatar imageUrl={data?.humanBook?.photo?.path} size="sm" className="size-9" />
                <div className="flex flex-col gap-1 text-sm font-medium leading-4">
                  <p className=" text-neutral-50">
                    {data?.humanBook?.fullName}
                  </p>
                  <p className="inline-flex items-center gap-1 text-neutral-20">
                    {data?.humanBook?.countTopics}
                    <span className="text-xs font-normal leading-[14px] text-neutral-40">topics</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto scroll-smooth py-1">
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
        </div>
      </div>
      <DetailedStory
        title={data?.title || ''}
        cover={data?.humanBook?.photo?.path ?? '/assets/images/half-title-illus.png'}
        authorName={data?.humanBook?.fullName || ''}
        abstract={data?.abstract || ''}
      />

      {/* Approve/Decline buttons at the bottom */}
      <div className="flex items-center justify-end gap-3">
        <Button
          size="lg"
          iconLeft={<Check />}
          className="w-60"
          onClick={() => setIsApprovalConfirmationModalOpen(true)}
        >
          Approve
        </Button>
        <Button
          variant="secondary"
          size="lg"
          iconLeft={<X />}
          className="w-60 bg-red-90 text-red-50 hover:bg-white hover:text-red-90"
          onClick={() => setIsRejectionConfirmationModalOpen(true)}
        >
          Decline
        </Button>
      </div>
    </div>
  );
}
