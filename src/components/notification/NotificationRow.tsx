import Image from 'next/image';
import type { ReactNode } from 'react';
import React from 'react';

import { mergeClassnames } from '@/components/core/private/utils';

type NotificationRowProps = {
  avatar: ReactNode;
  seen: boolean;
  unseenIcon?: ReactNode;
  align?: 'start' | 'center';
  className?: string;
  contentClassName?: string;
  onClick: () => void;
  children: ReactNode;
};

const DefaultLeafIcon = () => (
  <Image
    src="/assets/icons/leaf.svg"
    alt="Seen icon"
    width={20}
    height={20}
    className="size-4 object-cover object-center xl:size-5"
  />
);

/**
 * Shared 3-column shell (avatar | content | unseen leaf) used by every notification card
 * so the content column has the same width/padding regardless of type.
 */
export default function NotificationRow({
  avatar,
  seen,
  unseenIcon,
  align = 'start',
  className,
  contentClassName,
  onClick,
  children,
}: NotificationRowProps) {
  const alignClass = align === 'center' ? 'items-center' : 'items-start';

  return (
    <button
      type="button"
      onClick={onClick}
      className={mergeClassnames(
        'flex w-full gap-3 rounded-lg bg-white py-4 px-5 text-left transition-colors delay-300 hover:bg-primary-98',
        alignClass,
        className,
      )}
    >
      <div className="shrink-0">{avatar}</div>
      <div className={mergeClassnames('flex min-w-0 flex-1 gap-3', alignClass)}>
        <div className={mergeClassnames('min-w-0', contentClassName ?? 'flex flex-1 flex-col gap-1')}>
          {children}
        </div>
        <div className="flex size-4 shrink-0 items-center justify-center xl:size-6">
          {!seen && (unseenIcon ?? <DefaultLeafIcon />)}
        </div>
      </div>
    </button>
  );
}
