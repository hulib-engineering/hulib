import React from 'react';

import { DEFAULT_STORY_COVER_ASSET } from '../constants';
import { getPresetPlainBackgroundColor, isPresetCoverAsset } from '../utils/coverPreset';

import { mergeClassnames } from '@/components/core/private/utils';

type CoverProps = {
  src: string | null;
  className?: string;
  active?: boolean;
  onClick?: () => void;
  id?: string;
};

/** Face + 4px shadow gutter (see `COVER_OUTER_SHADOW_OFFSET_PX`). */
const COVER_CHROME_SIZE_CLASS = 'w-[185px] h-[262px]';

/** Displays a story cover image (preset asset or uploaded PNG). No animation. */
export function Cover({
  src,
  className,
  active = true,
  onClick,
  id,
}: CoverProps) {
  const fillParent = Boolean(className?.includes('size-full'));
  const coverSrc = src || DEFAULT_STORY_COVER_ASSET;
  const bgColor = isPresetCoverAsset(coverSrc) ? getPresetPlainBackgroundColor(coverSrc) : undefined;

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
      style={{
        backgroundColor: bgColor,
        backgroundImage: `url(${coverSrc})`,
      }}
    />
  );
}
