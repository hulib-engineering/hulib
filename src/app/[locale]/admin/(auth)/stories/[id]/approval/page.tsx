'use client';

import { ArrowLeft, Check, X } from '@phosphor-icons/react';
import { useParams } from 'next/navigation';
import * as React from 'react';
import { useState } from 'react';

import { useTranslations } from 'next-intl';
import StoryConfirmationModal from '@/app/[locale]/admin/(auth)/_components/StoryConfirmationModal';
import Button from '@/components/core/button/Button';
import { useRouter } from '@/libs/i18nNavigation';
import { StoryDetailSkeleton } from '@/components/loadingState/Skeletons';
import { DetailedStory } from '@/features/stories/components/DetailedStory';
import {
  useGetStoryDetailQuery,
} from '@/libs/services/modules/stories';
import type { Topic } from '@/libs/services/modules/user/userType';
import Avatar from '@/components/core/avatar/Avatar';
import { Chip } from '@/components/core/chip/Chip';
import { mergeClassnames } from '@/components/core/private/utils';
import { Cover } from '@/features/stories/components/Cover';
import { getTopicBadgeClasses } from '@/features/admin/utils/getTopicBadgeClasses';
import { DEFAULT_STORY_COVER_ASSET } from '@/features/stories/constants';

export default function Index() {
  const { id } = useParams();
  const router = useRouter();
  const t = useTranslations('Admin');

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
        onClick={() => router.push('/admin/awaiting-stories')}
      >
        {t('stories.back_to_awaiting_approval')}
      </Button>

      {/* Story information */}
      <div className="h-[210px] p-2">
        <div className="flex w-full gap-4 rounded-2xl bg-white p-3">
          <div className="lg:h-[170px] lg:w-[120px]">
            <Cover src={data?.cover?.path ?? DEFAULT_STORY_COVER_ASSET} />
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <h5 className="text-2xl font-medium leading-8 text-primary-10">{data?.title}</h5>
              <div className="flex items-center gap-1">
                <Avatar
                  imageUrl={data?.humanBook?.photo?.path}
                  name={data?.humanBook?.fullName}
                  size="sm"
                  className="size-9"
                />
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
                <Chip
                  key={topic.id}
                  as="span"
                  className={mergeClassnames(
                    'h-8 min-w-0 shrink-0 overflow-visible whitespace-nowrap rounded-2xl py-1 px-2 lg:py-2',
                    'text-xs font-medium leading-[14px] lg:text-sm lg:font-normal lg:leading-4',
                    'border',
                    getTopicBadgeClasses(topic.color),
                  )}
                >
                  {topic.name}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      </div>
      <DetailedStory
        title={data?.title || ''}
        cover={data?.humanBook?.photo?.path ?? '/assets/images/landing/half-title-illus.png'}
        authorName={data?.humanBook?.fullName || ''}
        abstract={data?.abstract || ''}
      />

      <div className="flex items-center justify-end gap-3">
        <Button
          variant="outline"
          size="lg"
          className="w-60"
          onClick={() => router.push(`/admin/stories/${id}/cover`)}
        >
          {t('stories.regenerate_cover')}
        </Button>
      </div>

      {/* Approve/Decline buttons at the bottom */}
      <div className="flex items-center justify-end gap-3">
        <Button
          iconLeft={<Check />}
          className="w-60"
          onClick={() => setIsApprovalConfirmationModalOpen(true)}
        >
          {t('stories.approve')}
        </Button>
        <Button
          variant="soft"
          iconLeft={<X />}
          className="w-60 bg-red-90 text-red-50 hover:bg-white hover:text-red-90"
          onClick={() => setIsRejectionConfirmationModalOpen(true)}
        >
          {t('stories.decline')}
        </Button>
      </div>
    </div>
  );
}
