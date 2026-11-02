'use client';

import { useTranslations } from 'next-intl';

import type { MeetingAlertItem } from '../types';
import Avatar from '@/components/core/avatar/Avatar';
import { mergeClassnames } from '@/components/core/private/utils';
import { Link } from '@/libs/i18nNavigation';

type MeetingAlertRowProps = {
  item: MeetingAlertItem;
  href: string;
};

export default function MeetingAlertRow({ item, href }: MeetingAlertRowProps) {
  const t = useTranslations('MeetingAlert');
  const { countdown } = item;

  const badgeLabel = (() => {
    if (countdown.state === 'now') {
      return t('now');
    }
    if (countdown.hours > 0) {
      return t('time_left', { hours: countdown.hours, minutes: countdown.minutes });
    }
    return t('time_left_minutes', { minutes: countdown.minutes });
  })();

  return (
    <Link
      href={href}
      className={mergeClassnames(
        'flex items-center gap-2 rounded-md px-1 py-2 no-underline',
        'hover:bg-primary-98 focus-visible:ring-2 focus-visible:ring-primary-60 focus-visible:outline-none',
      )}
    >
      <Avatar
        imageUrl={item.counterpart.photo?.path}
        name={item.counterpart.fullName}
        size="sm"
        className="size-5 shrink-0 rounded-full"
      />
      <span className="line-clamp-1 flex-1 text-[11px] font-medium leading-4 text-neutral-10">
        {item.counterpart.fullName}
      </span>
      <span
        aria-live="polite"
        className={mergeClassnames(
          'flex h-[18px] shrink-0 items-center justify-center rounded-full px-2 text-[10px] font-semibold leading-3',
          countdown.state === 'now'
            ? 'bg-primary-60 text-white'
            : 'bg-primary-90 text-primary-50',
        )}
      >
        {badgeLabel}
      </span>
    </Link>
  );
}
