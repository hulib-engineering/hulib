'use client';

import { Minus } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import type { MeetingAlertItem } from '../types';
import MeetingAlertRow from './MeetingAlertRow';
import IconButton from '@/components/core/iconButton/IconButton';
import { mergeClassnames } from '@/components/core/private/utils';

const DEFAULT_VISIBLE_ROWS = 2;

type MeetingAlertFullProps = {
  items: MeetingAlertItem[];
  href: string;
  onCollapse: () => void;
};

export default function MeetingAlertFull({ items, href, onCollapse }: MeetingAlertFullProps) {
  const t = useTranslations('MeetingAlert');
  const [isExpanded, setIsExpanded] = useState(false);

  const hasMore = items.length > DEFAULT_VISIBLE_ROWS;
  const visibleItems = isExpanded || !hasMore ? items : items.slice(0, DEFAULT_VISIBLE_ROWS);
  const toggleIndex = hasMore
    ? (isExpanded ? visibleItems.length - 1 : DEFAULT_VISIBLE_ROWS - 1)
    : -1;

  return (
    <section
      aria-label={t('title')}
      className={mergeClassnames(
        'fixed right-3 top-[87px] z-40 flex w-[352px] max-w-[calc(100vw_-_24px)] flex-col gap-4',
        'rounded-xl border-4 border-primary-80 bg-white py-4 shadow-sm',
      )}
    >
      <div className="flex h-9 items-center justify-between border-b border-neutral-90 px-4 pb-1">
        <h2 className="text-xl font-medium leading-7 tracking-[-0.01em] text-neutral-10">
          {t('title')}
        </h2>
        <IconButton
          size="sm"
          variant="ghost"
          aria-label={t('collapse')}
          className="size-8 p-2 text-neutral-10 hover:bg-neutral-90"
          icon={<Minus className="size-4" />}
          onClick={onCollapse}
        />
      </div>

      <div className="flex flex-col gap-2 px-3">
        {visibleItems.map((item, index) => (
          <MeetingAlertRow
            key={item.id}
            item={item}
            href={href}
            toggle={index === toggleIndex
              ? { expanded: isExpanded, onClick: () => setIsExpanded(previous => !previous) }
              : undefined}
          />
        ))}
      </div>
    </section>
  );
}
