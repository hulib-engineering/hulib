'use client';

import { Plus, VideoCamera } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';

type MeetingAlertMiniProps = {
  count: number;
  isLive: boolean;
  minutesUntilNext: number | null;
  onExpand: () => void;
};

export default function MeetingAlertMini({
  count,
  isLive,
  minutesUntilNext,
  onExpand,
}: MeetingAlertMiniProps) {
  const t = useTranslations('MeetingAlert');

  const badge = (() => {
    if (isLive) {
      return (
        <span
          aria-hidden="true"
          className="size-1.5 animate-pulse rounded-full bg-white"
        />
      );
    }
    if (minutesUntilNext === null) {
      return null;
    }
    return minutesUntilNext > 99 ? '99+' : minutesUntilNext;
  })();

  return (
    <button
      type="button"
      onClick={onExpand}
      aria-label={`${t('show_alert')} (${count})`}
      aria-expanded={false}
      className="fixed bottom-[84px] right-4 z-40 flex h-[52px] w-[132px] items-center gap-2 rounded-2xl border-[3px] border-transparent bg-white p-2 shadow-[0_4px_16px_rgba(1,13,38,0.18)] focus-visible:ring-2 focus-visible:ring-primary-60 focus-visible:outline-none lg:bottom-auto lg:right-[18px] lg:top-[56px]"
      style={{
        backgroundImage: 'linear-gradient(#fff, #fff), linear-gradient(135deg, #4682FB, #84ACFC)',
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
      }}
    >
      <span className="relative flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-90 text-primary-60">
        <VideoCamera className="size-[18px]" weight="fill" />
        {badge !== null && (
          <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-red-50 px-1 text-[10px] font-bold leading-none text-white">
            {badge}
          </span>
        )}
      </span>
      <Plus className="ml-auto size-[18px] shrink-0 text-neutral-10" />
    </button>
  );
}
