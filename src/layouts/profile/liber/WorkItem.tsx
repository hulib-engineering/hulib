'use client';

import { PencilSimple } from '@phosphor-icons/react';
import { useLocale, useTranslations } from 'next-intl';
import React, { memo } from 'react';

import type { WorkEntry } from './type';
import IconButton from '@/components/core/iconButton/IconButton';

type WorkItemProps = {
  entry: WorkEntry;
  editable?: boolean;
  onEdit: (id?: number) => void;
};

const WorkItem = memo(({ entry, editable, onEdit }: WorkItemProps) => {
  const locale = useLocale();
  const t = useTranslations('MyProfile');

  const startDate = new Date(entry.startedAt).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'numeric',
  });
  const endDate = entry.endedAt
    ? new Date(entry.endedAt).toLocaleDateString(locale, { year: 'numeric', month: 'numeric' })
    : t('liber_about.present');

  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-1 flex-col gap-0.5">
        <span className="text-base font-medium leading-6 tracking-[0.005em] text-neutral-20">
          {entry.position}
        </span>
        <span className="text-sm leading-[22px] tracking-[0.015em] text-neutral-40">
          {entry.company}
        </span>
        <span className="text-sm leading-[22px] tracking-[0.015em] text-neutral-40">
          {`${startDate} - ${endDate}`}
        </span>
      </div>
      {editable && (
        <IconButton
          variant="outline"
          size="sm"
          type="button"
          onClick={() => onEdit(entry.id)}
        >
          <PencilSimple weight="bold" />
        </IconButton>
      )}
    </div>
  );
});

WorkItem.displayName = 'WorkItem';

export type { WorkItemProps };
export default WorkItem;
