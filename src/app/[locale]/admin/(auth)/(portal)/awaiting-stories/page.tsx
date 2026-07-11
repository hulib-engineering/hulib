'use client';

import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { StoriesSkeleton } from '@/components/loadingState/Skeletons';
import IconButton from '@/components/core/iconButton/IconButton';
import Pagination from '@/components/core/pagination/Pagination';
import { StoryCard } from '@/features/stories/components/StoryCard';
import { useGetStoriesQuery } from '@/libs/services/modules/stories';
import type { Story } from '@/libs/services/modules/stories/storiesType';
import { PublishStatusEnum } from '@/libs/services/modules/stories/storiesType';

export default function AwaitingStoriesPage() {
  const t = useTranslations('Admin');
  const [currentPage, setCurrentPage] = useState(1);
  const { data: awaitingStories, isLoading } = useGetStoriesQuery({
    page: currentPage,
    limit: 6,
    publishStatus: PublishStatusEnum.DRAFT, // Awaiting approval
  });

  const list = awaitingStories?.data ?? [];

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-8 pt-0">
        <StoriesSkeleton />
      </div>
    );
  }

  if (list.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-5 p-8">
        <h1 className="text-[2.5rem] font-medium leading-tight">💕</h1>
        <p className="text-sm leading-5 text-neutral-20">{t('awaiting_stories_page.empty_state')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-8 pt-0">
      <div className="flex flex-col gap-2 pt-5">
        <h5 className="text-2xl font-medium leading-8 text-neutral-10">
          {t('awaiting_stories_page.title')}
        </h5>
        <p className="text-sm leading-5 text-neutral-20">
          {t('awaiting_stories_page.subtitle')}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {list.map((item: Story) => (
          <StoryCard key={item.id} data={item} showAdminControls />
        ))}
      </div>
      {awaitingStories?.meta && (
        <Pagination
          totalPages={awaitingStories.meta.totalPages || 0}
          currentPage={awaitingStories.meta.currentPage - 1 || 0}
          setCurrentPage={page => setCurrentPage(page + 1)}
        >
          <Pagination.PrevButton as="div">
            {({ disabled }) => (
              <IconButton
                icon={<ArrowLeft />}
                variant="ghost"
                size="lg"
                disabled={disabled}
                aria-label="Previous"
              />
            )}
          </Pagination.PrevButton>
          <Pagination.Pages as="button" type="button" />
          <Pagination.NextButton as="div">
            {({ disabled }) => (
              <IconButton
                icon={<ArrowRight />}
                variant="ghost"
                size="lg"
                disabled={disabled}
                aria-label="Next"
              />
            )}
          </Pagination.NextButton>
        </Pagination>
      )}
    </div>
  );
}
