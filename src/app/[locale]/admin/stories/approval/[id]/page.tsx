'use client';

import { ArrowLeft, Check, X } from '@phosphor-icons/react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import * as React from 'react';

import Button from '@/components/button/Button';
import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';
import Story from '@/components/storyDetails/Story';
import StoryDetailsSkeleton from '@/components/storyDetails/StoryDetailsSkeleton';
import {
  useGetStoryDetailQuery,
  useUpdateStoryMutation,
} from '@/libs/services/modules/stories';
import { StoryPublishStatus } from '@/libs/services/modules/stories/storiesType';
import type { Topic } from '@/libs/services/modules/user/userType';

export default function Index() {
  const { id } = useParams();
  const router = useRouter();

  const { data, isLoading } = useGetStoryDetailQuery({
    id: Number(id), // id is a string, so we need to convert it to a number
  });

  const [updateStory] = useUpdateStoryMutation();

  const approveStory = async (
    status: StoryPublishStatus.PUBLISHED | StoryPublishStatus.DELETED,
  ) => {
    try {
      await updateStory({
        id: Number(id),
        publishStatus: status,
      }).unwrap();
      pushSuccess(
        status === StoryPublishStatus.PUBLISHED
          ? 'Story approved successfully'
          : 'Story rejected successfully',
      );
      router.push('/admin/stories/approval');
    } catch (error) {
      pushError('Failed to approve story');
    }
  };

  if (isLoading) {
    return <StoryDetailsSkeleton />;
  }

  return (
    <div className="mx-auto w-full max-w-screen-lg px-4 py-8">
      {/* Back navigation */}
      <div
        className="mb-4 flex cursor-pointer items-center gap-2"
        role="button"
        tabIndex={0}
        onClick={() => router.push('/admin/stories/approval')}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            router.push('/admin/stories/approval');
          }
        }}
      >
        <ArrowLeft size={16} />
        <span>Back to Awaiting approval - Stories</span>
      </div>
      <div className="mb-5 flex h-[210px] w-full gap-3 rounded-2xl bg-white p-2">
        <Image
          src={
            data?.cover?.path ??
            '/assets/images/cover-book/story_background_yellow.png'
          }
          alt={`${data?.title} - ${data?.humanBook?.fullName}`}
          width={120}
          height={170}
        />
        <div className="flex flex-col">
          <h5 className="font-medium text-primary-10">{data?.title}</h5>
          <div className="mt-2 flex gap-1">
            <Image
              src="/assets/images/Avatar.png"
              alt="Avatar"
              width={36}
              height={36}
            />
            <div className="flex flex-col">
              <span className="text-sm text-neutral-40">
                {data?.humanBook?.fullName}
              </span>
              <span className="text-sm text-neutral-40">
                {`${data.topics?.length} sessions`}
              </span>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {data?.topics?.map((topic: Topic) => (
              <span
                key={topic.id}
                className="rounded-lg bg-blue-50 p-2 text-sm text-primary-50"
              >
                {topic.name}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div>
        <Story abstract={data?.abstract || ''} />
      </div>
      {/* Approve/Declined buttons at the bottom */}
      <div className="mt-6 flex gap-4">
        <Button
          iconLeft={<Check size={16} />}
          variant="primary"
          className="h-[44px] w-[240px] px-8 py-2"
          onClick={() => approveStory(StoryPublishStatus.PUBLISHED)}
        >
          Approve
        </Button>
        <Button
          iconLeft={<X size={16} />}
          className="h-[44px] w-[240px] bg-red-90 px-8 py-2 text-red-50 hover:bg-white hover:text-red-90"
          onClick={() => approveStory(StoryPublishStatus.DELETED)}
        >
          Declined
        </Button>
      </div>
    </div>
  );
}
