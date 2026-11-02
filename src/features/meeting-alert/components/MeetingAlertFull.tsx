'use client';

import { Minus, VideoCamera, XCircle } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';

import type { MeetingAlertItem } from '../types';
import MeetingAlertRow from './MeetingAlertRow';
import Button from '@/components/core/button/Button';
import IconButton from '@/components/core/iconButton/IconButton';
import { mergeClassnames } from '@/components/core/private/utils';
import { Link } from '@/libs/i18nNavigation';

const MAX_VISIBLE_ROWS = 2;

type MeetingAlertFullProps = {
  items: MeetingAlertItem[];
  count: number;
  href: string;
  onCollapse: () => void;
  onDismissAll: () => void;
};

export default function MeetingAlertFull({
  items,
  count,
  href,
  onCollapse,
  onDismissAll,
}: MeetingAlertFullProps) {
  const t = useTranslations('MeetingAlert');

  const visibleItems = items.slice(0, MAX_VISIBLE_ROWS);
  const hiddenCount = Math.max(0, count - visibleItems.length);
  const hasOngoing = visibleItems.some(item => item.countdown.state === 'now');

  return (
    <section
      aria-label={t('title')}
      className={mergeClassnames(
        'fixed left-3 right-3 top-[64px] z-40 flex flex-col rounded-xl border-[1.5px] border-primary-60 bg-white p-2',
        'shadow-[0_4px_16px_rgba(1,13,38,0.12)]',
        'lg:left-auto lg:right-[18px] lg:top-[56px] lg:w-[218px]',
      )}
    >
      {count > 0 && (
        <span
          aria-hidden="true"
          className="absolute -top-3 left-9 flex size-[22px] items-center justify-center rounded-full border-[2.5px] border-white bg-primary-60 text-[11px] font-bold leading-none text-white"
        >
          {count > 99 ? '99+' : count}
        </span>
      )}

      <div className="flex items-center justify-between pb-1 pl-1 pr-0.5">
        <h2 className="text-[13px] font-semibold leading-4 text-primary-10">
          {t('title')}
        </h2>
        <IconButton
          size="sm"
          variant="ghost"
          aria-label={t('show_alert')}
          className="size-6 p-0 text-neutral-30 hover:bg-neutral-90"
          icon={<Minus />}
          onClick={onCollapse}
        />
      </div>

      <div className="flex flex-col divide-y divide-neutral-90 border-y border-neutral-90">
        {visibleItems.map(item => (
          <MeetingAlertRow key={item.id} item={item} href={href} />
        ))}
      </div>

      {hasOngoing && (
        <Button
          as={Link}
          href={href}
          size="sm"
          fullWidth
          className="mt-1 h-[22px] rounded-[5px] bg-primary-60 px-2 text-[10px] font-semibold leading-3 text-white hover:bg-primary-50"
        >
          <VideoCamera className="size-3 shrink-0" />
          <span>{t('go_to')}</span>
        </Button>
      )}

      {hiddenCount > 0 && (
        <Link
          href={href}
          className="mx-auto mt-1 rounded px-2 py-0.5 text-[10px] font-medium leading-4 text-primary-50 no-underline hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-60"
        >
          {t('more', { count: hiddenCount })}
        </Link>
      )}

      <button
        type="button"
        onClick={onDismissAll}
        className="mx-auto mt-1 flex items-center gap-1 rounded px-2 py-1 text-[10.5px] font-medium leading-4 text-neutral-30 hover:text-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-60"
      >
        <XCircle className="size-3 shrink-0" />
        {t('dismiss_all')}
      </button>
    </section>
  );
}
