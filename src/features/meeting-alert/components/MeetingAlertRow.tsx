'use client';

import { CaretDoubleDown, VideoCamera } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';

import type { MeetingAlertItem } from '../types';
import Avatar from '@/components/core/avatar/Avatar';
import { mergeClassnames } from '@/components/core/private/utils';
import { GreenTick } from '@/features/users/components/profile/GreenTick';
import { Link } from '@/libs/i18nNavigation';
import { Role } from '@/types/common';

type MeetingAlertRowProps = {
  item: MeetingAlertItem;
  href: string;
  toggle?: {
    expanded: boolean;
    onClick: () => void;
  };
};

export default function MeetingAlertRow({ item, href, toggle }: MeetingAlertRowProps) {
  const t = useTranslations('MeetingAlert');
  const { countdown, counterpart } = item;
  const isNow = countdown.state === 'now';
  // Compare by id: the API names the role "reader", not "Liber".
  const isCounterpartLiber = counterpart.role?.id === Role.LIBER;

  const timeLabel = (() => {
    if (isNow) {
      return t('now');
    }
    if (countdown.hours > 0) {
      return t('time_left', { hours: countdown.hours, minutes: countdown.minutes });
    }
    return t('time_left_minutes', { minutes: countdown.minutes });
  })();

  return (
    <div
      className={mergeClassnames(
        'flex flex-col gap-1.5 rounded-xl px-2 py-1',
        isNow ? 'bg-primary-98' : 'bg-neutral-98',
      )}
    >
      <Link
        href={href}
        className="flex h-8 items-center gap-1 rounded-lg no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-60"
      >
        <span className="relative flex size-7 shrink-0 items-center justify-center">
          <Avatar
            imageUrl={counterpart.photo?.path}
            name={counterpart.fullName}
            className="size-7 rounded-full"
          />
          {!isCounterpartLiber && (
            <span className="absolute -bottom-0.5 -right-0.5">
              <GreenTick size={8} weight="bold" />
            </span>
          )}
        </span>
        <span className="ml-1 line-clamp-1 flex-1 text-base font-medium leading-5 text-neutral-10">
          {counterpart.fullName}
        </span>
        <span
          aria-live="polite"
          className={mergeClassnames(
            'flex h-5 shrink-0 items-center justify-center rounded-full px-2 text-sm font-medium leading-4 text-white',
            isNow ? 'bg-gradient-to-r from-primary-60 to-lavender-40' : 'bg-primary-60',
          )}
        >
          {timeLabel}
        </span>
      </Link>

      {isNow && (
        <Link
          href={href}
          className="flex h-8 items-center justify-center gap-1.5 rounded-full border border-primary-50 bg-primary-50 text-sm font-medium leading-4 text-primary-98 no-underline ring-2 ring-primary-80 focus-visible:outline-none focus-visible:ring-primary-70"
        >
          <VideoCamera className="size-4 shrink-0" />
          {t('go_to')}
        </Link>
      )}

      {toggle && (
        <button
          type="button"
          onClick={toggle.onClick}
          aria-expanded={toggle.expanded}
          aria-label={toggle.expanded ? t('collapse') : t('expand')}
          className="mx-auto flex h-4 w-full items-center justify-center rounded text-neutral-40 hover:text-neutral-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-60"
        >
          <CaretDoubleDown
            className={mergeClassnames(
              'size-4 transition-transform duration-200',
              toggle.expanded && 'rotate-180',
            )}
          />
        </button>
      )}
    </div>
  );
}
