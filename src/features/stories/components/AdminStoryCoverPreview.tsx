'use client';

import { mergeClassnames } from '@/components/core/private/utils';
import { CustomCoverBuilder } from '@/features/stories/components/CustomCoverBuilder';
import { COVER_PREVIEW_ELEMENT_ID, COVER_SIZE_TOKENS } from '@/features/stories/constants';
import type { CoverCustomization } from '@/features/stories/types';

const EXPORT = COVER_SIZE_TOKENS.desktop;

type AdminStoryCoverPreviewProps = {
  storyTitle: string;
  authorName: string;
  coverImgSrc: string;
  customization: CoverCustomization;
};

/**
 * Admin backfill: fixed 184×259 shell + builder (preset once, title/author on top).
 * Do not stack a second img under the builder — that doubled the preset and looked blurry.
 */
export const AdminStoryCoverPreview = ({
  storyTitle,
  authorName,
  coverImgSrc,
  customization,
}: AdminStoryCoverPreviewProps) => (
  <div
    id={COVER_PREVIEW_ELEMENT_ID}
    className="relative shrink-0 overflow-hidden rounded-[4px]"
    style={{ width: EXPORT.width, height: EXPORT.height }}
  >
    <CustomCoverBuilder
      useExportDimensions
      storyTitle={storyTitle}
      authorName={authorName}
      coverImgSrc={coverImgSrc}
      customization={customization}
      active
      className="size-full"
    />
  </div>
);

type AdminStoryCoverThumbnailProps = AdminStoryCoverPreviewProps & {
  selected: boolean;
  onSelect: () => void;
};

export const AdminStoryCoverThumbnail = ({
  selected,
  onSelect,
  ...coverProps
}: AdminStoryCoverThumbnailProps) => (
  <button
    type="button"
    onClick={onSelect}
    className={mergeClassnames(
      'relative shrink-0 overflow-hidden rounded-[4px] outline-none ring-2 ring-offset-2 transition-shadow',
      selected ? 'ring-primary-50' : 'ring-transparent',
      'focus-visible:ring-primary-50',
    )}
    style={{ width: EXPORT.width, height: EXPORT.height }}
    aria-pressed={selected}
  >
    <CustomCoverBuilder
      useExportDimensions
      storyTitle={coverProps.storyTitle}
      authorName={coverProps.authorName}
      coverImgSrc={coverProps.coverImgSrc}
      customization={coverProps.customization}
      active
      className="size-full"
    />
  </button>
);
