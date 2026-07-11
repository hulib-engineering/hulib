'use client';

import type { ColumnDef } from '@tanstack/react-table';
import {
  ArrowLeft,
  ArrowRight,
  FolderOpen,
  PencilSimple,
  Trash,
} from '@phosphor-icons/react';
import { useCallback, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';

import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';
import IconButton from '@/components/core/iconButton/IconButton';
import Pagination from '@/components/core/pagination/Pagination';
import Switch from '@/components/core/switch';
import Table from '@/components/core/table/Table';
import type { TablePagination } from '@/components/core/table/private/types';
import TopicBadge from '@/app/[locale]/admin/(auth)/_components/TopicBadge';
import TopicFormModal from '@/app/[locale]/admin/(auth)/_components/TopicFormModal';
import type { Topic } from '@/libs/services/modules/topics/topicType';
import { isTopicActive } from '@/libs/services/modules/topics/topicType';
import {
  useDeleteTopicMutation,
  useUpdateTopicMutation,
} from '@/libs/services/modules/topics';

type TagsTableProps = {
  topics: Topic[];
  isLoading?: boolean;
  pagination?: TablePagination;
};

const TagsTable = ({ topics, isLoading, pagination }: TagsTableProps) => {
  const t = useTranslations('Admin');
  const [deleteTopic, { isLoading: isDeleting }] = useDeleteTopicMutation();
  const [updateTopic] = useUpdateTopicMutation();

  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);

  const handleDelete = useCallback(async (topic: Topic) => {
    try {
      await deleteTopic(topic.id).unwrap();
      pushSuccess(t('table.topic_deleted_success'));
    } catch {
      pushError(t('table.topic_delete_failed'));
    }
  }, [deleteTopic, t]);

  const handleStatusChange = useCallback(
    async (topic: Topic, nextChecked: boolean) => {
      const nextStatus = nextChecked ? 'active' : 'inactive';
      try {
        await updateTopic({ id: topic.id, status: nextStatus }).unwrap();
        pushSuccess(t('table.topic_status_updated', { status: nextStatus }));
      } catch {
        pushError(t('table.topic_status_update_failed'));
      }
    },
    [updateTopic, t],
  );

  const columns = useMemo(
    () =>
      [
        {
          accessorKey: 'id',
          header: 'ID',
          meta: {
            colClassName: 'w-[10%]',
            headerClassName: 'border-r border-neutral-80',
            cellClassName: 'border-r border-neutral-80',
          },
          cell: ({ getValue }) => (
            <span className="font-medium tracking-wide text-neutral-10">
              {getValue<number>()}
            </span>
          ),
        },
        {
          accessorKey: 'name',
          header: t('table.topic_name'),
          cell: ({ row }) => <TopicBadge topic={row.original} />,
        },
        {
          id: 'actions',
          header: t('table.action'),
          meta: {
            headerClassName: 'w-0 whitespace-nowrap border-l border-neutral-80',
            cellClassName: 'w-0 whitespace-nowrap border-l border-neutral-80',
          },
          cell: ({ row }) => {
            const topic = row.original;
            const checked = isTopicActive(topic.status);

            return (
              <div className="flex w-max items-center gap-4">
                <Switch
                  checked={checked}
                  onChange={next => handleStatusChange(topic, next)}
                  aria-label={
                    checked
                      ? t('table.set_topic_inactive', { topic: topic.name })
                      : t('table.set_topic_active', { topic: topic.name })
                  }
                  srLabel={checked ? t('table.set_inactive') : t('table.set_active')}
                />
                <IconButton
                  type="button"
                  icon={<PencilSimple />}
                  variant="outline"
                  aria-label={t('table.edit_topic', { topic: topic.name })}
                  onClick={() => setEditingTopic(topic)}
                  disabled={isDeleting}
                  className="shrink-0"
                />
                <IconButton
                  type="button"
                  icon={<Trash />}
                  aria-label={t('table.delete_topic', { topic: topic.name })}
                  onClick={() => handleDelete(topic)}
                  disabled={isDeleting}
                  className="shrink-0 border-red-60 bg-red-50 hover:border-red-40 hover:bg-red-40"
                />
              </div>
            );
          },
        },
      ] as ColumnDef<Topic>[],
    [handleDelete, handleStatusChange, isDeleting, t],
  );

  const tablePaginationFooter = useMemo(() => {
    if (!pagination || pagination.totalPages <= 0) {
      return undefined;
    }

    return (
      <Pagination
        totalPages={pagination.totalPages}
        currentPage={pagination.currentPage}
        setCurrentPage={pagination.onPageChange}
        className="gap-2 px-4 py-2"
      >
        <Pagination.PrevButton as="div">
          {({ disabled }) => (
            <IconButton
              icon={<ArrowLeft />}
              variant="ghost"
              size="lg"
              disabled={disabled}
              className="!h-8 p-1.5"
              aria-label="Previous page"
            />
          )}
        </Pagination.PrevButton>
        <Pagination.Pages
          as="button"
          type="button"
          className="min-w-8 px-3 py-2 text-sm leading-4"
        />
        <Pagination.NextButton as="div">
          {({ disabled }) => (
            <IconButton
              icon={<ArrowRight />}
              variant="ghost"
              size="lg"
              disabled={disabled}
              className="!h-8 p-1.5"
              aria-label={t('table.pagination.next_page')}
            />
          )}
        </Pagination.NextButton>
      </Pagination>
    );
  }, [pagination]);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center rounded border border-neutral-80 p-8">
        <p className="text-sm text-neutral-40">{t('table.loading_topics')}</p>
      </div>
    );
  }

  if (topics.length === 0) {
    return (
      <>
        <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded border border-neutral-80 p-8">
          <FolderOpen className="text-6xl text-primary-90" weight="duotone" />
          <p className="text-base font-extrabold leading-6 text-neutral-40">
            {t('table.no_data_yet')}
          </p>
        </div>
        <TopicFormModal
          open={Boolean(editingTopic)}
          onClose={() => setEditingTopic(null)}
          topic={editingTopic}
        />
      </>
    );
  }

  return (
    <>
      <Table columns={columns} data={topics} footer={tablePaginationFooter} />
      <TopicFormModal
        open={Boolean(editingTopic)}
        onClose={() => setEditingTopic(null)}
        topic={editingTopic}
      />
    </>
  );
};

export default TagsTable;
