import React from 'react';

import { mergeClassnames } from '@/components/core/private/utils';

type CoverProps = {
  src: string;
  className?: string;
  active?: boolean;
  onClick?: () => void;
  id?: string;
};

/** Face + 4px shadow gutter (see `COVER_OUTER_SHADOW_OFFSET_PX`). */
const COVER_CHROME_SIZE_CLASS = 'size-[144px_202px] md:size-[184px_259px]';

/** Displays a story cover image (preset asset or uploaded PNG). No animation. */
export function Cover({
  src,
  className,
  active = true,
  onClick,
  id,
}: CoverProps) {
  const fillParent = Boolean(className?.includes('size-full'));

  const interactiveProps = {
    role: onClick ? ('button' as const) : undefined,
    tabIndex: onClick ? 0 : undefined,
    onClick,
    onKeyDown: onClick
      ? (e: React.KeyboardEvent<HTMLDivElement>) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        }
      : undefined,
  };

  return (
    <div
      id={id}
      {...interactiveProps}
      className={mergeClassnames(
        'bg-left-top bg-no-repeat bg-[length:100%_100%]',
        fillParent ? 'size-full' : COVER_CHROME_SIZE_CLASS,
        !active && 'grayscale',
        onClick && 'cursor-pointer',
        className,
      )}
      style={{ backgroundImage: `url(${src})` }}
    />
  );
}
