'use client';

import { Plus } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import Button from '@/components/core/button/Button';
import TagsTable from '@/app/[locale]/admin/(auth)/_components/TagsTable';
import TopicFormModal from '@/app/[locale]/admin/(auth)/_components/TopicFormModal';
import { useGetTopicsQuery } from '@/libs/services/modules/topics';
import type { Topic } from '@/libs/services/modules/topics/topicType';

type TopicsListMeta = {
  totalPages?: number;
  currentPage?: number;
};

export default function AdminTagsPage() {
  const t = useTranslations('Admin');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data, isLoading } = useGetTopicsQuery({
    page: currentPage,
    limit: 10,
  });

  const topics = data?.data ?? [];
  const meta = (data as { meta?: TopicsListMeta } | undefined)?.meta;
  const totalPages = meta?.totalPages ?? 1;

  return (
    <>
      <div className="flex flex-col gap-6 p-8 pt-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-medium leading-8 tracking-tight text-neutral-10">
            {t('tags_page.title')}
          </h1>
          <Button
            type="button"
            variant="fill"
            iconRight={<Plus weight="bold" className="text-xl" />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            {t('tags_page.new_topic')}
          </Button>
        </div>

        <div className="flex min-h-[480px] flex-1 flex-col">
          <TagsTable
            topics={topics as Topic[]}
            isLoading={isLoading}
            pagination={{
              totalPages,
              currentPage: (meta?.currentPage ?? currentPage) - 1,
              onPageChange: page => setCurrentPage(page + 1),
            }}
          />
        </div>
      </div>

      <TopicFormModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  );
}
