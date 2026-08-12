'use client';

import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { StoriesSkeleton } from '@/components/loadingState/Skeletons';
import IconButton from '@/components/core/iconButton/IconButton';
import Pagination from '@/components/core/pagination/Pagination';
import { StoryCard } from '@/features/stories/components/StoryCard';
import { TopicChip } from '@/layouts/webapp/ChipFilter';
import { useGetAdminStoriesQuery } from '@/libs/services/modules/stories';
import type { Story } from '@/libs/services/modules/stories/storiesType';
import { PublishStatusEnum } from '@/libs/services/modules/stories/storiesType';
import { AWAITING_STORIES_QUERY_ARGS } from '@/app/[locale]/admin/(auth)/(portal)/awaiting-stories/queryArgs';

const STATUS_FILTERS = [
  { status: PublishStatusEnum.DRAFT, label: 'filter_pending' },
  { status: PublishStatusEnum.PUBLISHED, label: 'filter_published' },
  { status: PublishStatusEnum.REJECTED, label: 'filter_rejected' },
  { status: PublishStatusEnum.DELETED, label: 'filter_deleted' },
] as const;

export default function AwaitingStoriesPage() {
  const t = useTranslations('Admin');
  const [currentPage, setCurrentPage] = useState(1);
  const [publishStatus, setPublishStatus] = useState<PublishStatusEnum>(PublishStatusEnum.DRAFT);
  const { data: awaitingStories, isLoading, isFetching } = useGetAdminStoriesQuery({
    ...AWAITING_STORIES_QUERY_ARGS,
    page: currentPage,
    publishStatus,
  });

  const handleStatusChange = (status: PublishStatusEnum) => {
    setPublishStatus(status);
    setCurrentPage(1);
  };

  const list = awaitingStories?.data ?? [];

  const statusFilters = (
    <div className="scrollbar-hide flex w-full flex-nowrap items-center gap-2 overflow-x-auto py-2">
      {STATUS_FILTERS.map(filter => (
        <TopicChip
          key={filter.status}
          isActive={publishStatus === filter.status}
          onClick={() => handleStatusChange(filter.status)}
        >
          {t(`awaiting_stories_page.${filter.label}`)}
        </TopicChip>
      ))}
    </div>
  );

  const header = (
    <div className="flex flex-col gap-2 pt-5">
      <h5 className="text-2xl font-medium leading-8 text-neutral-10">
        {t('awaiting_stories_page.title')}
      </h5>
      <p className="text-sm leading-5 text-neutral-20">
        {t('awaiting_stories_page.subtitle')}
      </p>
    </div>
  );

  if (isLoading || isFetching) {
    return (
      <div className="flex flex-col gap-6 p-8 pt-0">
        {header}
        {statusFilters}
        <StoriesSkeleton />
      </div>
    );
  }

  if (list.length === 0) {
    return (
      <div className="flex h-full flex-col gap-6 p-8 pt-0">
        {header}
        {statusFilters}
        <div className="flex flex-1 flex-col items-center justify-center gap-5">
          <h1 className="text-[2.5rem] font-medium leading-tight">💕</h1>
          <p className="text-sm leading-5 text-neutral-20">{t('awaiting_stories_page.empty_state')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-8 pt-0">
      {header}
      {statusFilters}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {list.map((item: Story) => (
          <StoryCard
            key={item.id}
            data={item}
            showAdminControls={publishStatus === PublishStatusEnum.DRAFT}
          />
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
