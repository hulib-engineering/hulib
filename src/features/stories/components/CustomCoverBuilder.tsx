'use client';

import Image from 'next/image';
import React from 'react';

import { mergeClassnames } from '@/components/core/private/utils';
import type { CoverCustomization, CoverTextAlign } from '@/features/stories/types';
import {
  COVER_EXPORT_ELEMENT_ID,
  COVER_EXPORT_SIZE,
  COVER_SIZE_TOKENS,
  DEFAULT_AUTHOR_COLOR,
  DEFAULT_STORY_COVER_ASSET,
  DEFAULT_TITLE_COLOR,
} from '@/features/stories/constants';
import { useMobile } from '@/libs/hooks';
import { CoverBakedPreset, CoverExport } from '@/features/stories/components/CoverChrome';
import {
  getCoverFontClassName,
  getPresetPlainBackgroundColor,
  getPresetStyle,
  hasBakedPresetChrome,
  isValidCoverColor,
} from '@/features/stories/utils';

/** Builds cover HTML for live preview and rasterize-to-PNG export. Use `Cover` to display saved images. */
export type ICustomCoverBuilderProps = {
  storyTitle: string;
  authorName?: string;
  active?: boolean;
  coverImgSrc?: string;
  onClick?: () => void;
  previewId?: string;
  customization?: CoverCustomization;
  className?: string;
};

const alignToTextClass = (align: CoverTextAlign) => {
  switch (align) {
    case 'left':
      return 'text-left';
    case 'right':
      return 'text-right';
    default:
      return 'text-center';
  }
};

const titleLineClampClass = (lineClamp: number) => {
  switch (lineClamp) {
    case 2:
      return 'line-clamp-2';
    case 4:
      return 'line-clamp-4';
    default:
      return 'line-clamp-3';
  }
};

export function CustomCoverBuilder({
  storyTitle = '',
  authorName = '',
  active = true,
  coverImgSrc = '',
  onClick,
  previewId,
  customization,
  className,
}: ICustomCoverBuilderProps) {
  const isMobile = useMobile();

  const isExportTarget = previewId === COVER_EXPORT_ELEMENT_ID;
  const size = isExportTarget ? COVER_EXPORT_SIZE : (isMobile ? 'mobile' : 'desktop');

  const tokens = COVER_SIZE_TOKENS[size];
  const desktopTokens = COVER_SIZE_TOKENS.desktop;
  const widthRatio = tokens.width / desktopTokens.width;

  const backgroundSrc = customization?.backgroundSrc || coverImgSrc || DEFAULT_STORY_COVER_ASSET;
  // Typography + layout recipe for the selected style (yellow / red / blue), including custom covers.
  const coverStyle = getPresetStyle(backgroundSrc);
  const layoutOffsets = coverStyle[size];

  const titleColor = isValidCoverColor(customization?.titleColor)
    ? customization.titleColor
    : coverStyle.titleColor || DEFAULT_TITLE_COLOR;
  const authorNameColor = isValidCoverColor(customization?.authorColor)
    ? customization.authorColor
    : coverStyle.authorColor || DEFAULT_AUTHOR_COLOR;

  const titleFontClassName = getCoverFontClassName(
    customization?.titleFontFamily ?? coverStyle.titleFontFamily,
  );
  const authorFontClassName = getCoverFontClassName(coverStyle.authorFontFamily);

  const desktopTitleFontSize = customization?.titleFontSize ?? coverStyle.titleFontSize;
  const titleFontSize = size === 'desktop'
    ? desktopTitleFontSize
    : Math.max(1, Math.round(desktopTitleFontSize * widthRatio));

  const illustrationSrc = customization?.illustrationSrc;
  const backgroundColor = customization?.backgroundColor;
  const hasCustomIllustration = Boolean(illustrationSrc);

  const resolvedBackgroundColor = hasCustomIllustration
    ? (isValidCoverColor(backgroundColor)
        ? backgroundColor
        : getPresetPlainBackgroundColor(backgroundSrc))
    : undefined;

  const displayTitle = storyTitle.trim().toLocaleUpperCase();
  const titleOneWordPerLine = coverStyle.titleLineBreak === 'one-word-per-line';
  const titleLineClamp = coverStyle.titleLineClamp ?? 3;
  const titleWords = displayTitle.split(/\s+/).filter(Boolean);
  const isTitleTruncated = titleWords.length > titleLineClamp;
  const titleLines = titleOneWordPerLine
    ? titleWords.slice(0, titleLineClamp).map((word, index, lines) => (
        isTitleTruncated && index === lines.length - 1 ? `${word}…` : word
      ))
    : null;
  const useBakedPresetChrome = hasBakedPresetChrome(backgroundSrc, hasCustomIllustration);

  // Custom export: solid paper + spine overlay + shadows (preset PNGs already include all three).
  const paperColor = isValidCoverColor(backgroundColor)
    ? backgroundColor
    : getPresetPlainBackgroundColor(backgroundSrc);

  const interactiveProps = {
    role: onClick ? 'button' : undefined,
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

  const titleBlockWidthPx = Math.round(tokens.width * layoutOffsets.titleWidthRatio);
  const titleHorizontalStyle: React.CSSProperties = layoutOffsets.titleLeftPx !== undefined
    ? {
        left: Math.round(layoutOffsets.titleLeftPx * widthRatio),
        width: titleBlockWidthPx,
      }
    : {
        left: '50%',
        width: titleBlockWidthPx,
        transform: 'translateX(-50%)',
      };

  const authorHorizontalStyle: React.CSSProperties = layoutOffsets.authorLeftPx !== undefined
    ? { left: Math.round(layoutOffsets.authorLeftPx * widthRatio) }
    : { left: '50%', transform: 'translateX(-50%)' };

  const titleLineHeightPx = layoutOffsets.titleLineHeightPx
    ?? (titleOneWordPerLine ? titleFontSize : undefined);

  const coverContent = (
    <div
      className={mergeClassnames(
        'relative size-full overflow-hidden bg-no-repeat',
        useBakedPresetChrome ? 'bg-[length:100%_100%]' : 'bg-cover bg-center',
      )}
      style={{
        backgroundImage: hasCustomIllustration ? undefined : `url(${backgroundSrc})`,
        backgroundPosition: useBakedPresetChrome ? 'left top' : undefined,
        backgroundColor: hasCustomIllustration ? undefined : resolvedBackgroundColor,
      }}
    >
      {!hasCustomIllustration && isValidCoverColor(backgroundColor) && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{ backgroundColor, opacity: 0.35 }}
          aria-hidden
        />
      )}
      {illustrationSrc && (
        <div
          className="pointer-events-none absolute inset-x-0 flex justify-center"
          style={{ bottom: layoutOffsets.illustrationBottomPx }}
        >
          {isExportTarget ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={illustrationSrc}
              alt=""
              width={layoutOffsets.illustrationMaxPx}
              height={layoutOffsets.illustrationMaxPx}
              loading="eager"
              decoding="sync"
              className="w-auto object-contain"
              style={{ maxHeight: layoutOffsets.illustrationMaxPx }}
            />
          ) : (
            <Image
              src={illustrationSrc}
              alt=""
              width={layoutOffsets.illustrationMaxPx}
              height={layoutOffsets.illustrationMaxPx}
              unoptimized
              className="w-auto object-contain"
              style={{ maxHeight: layoutOffsets.illustrationMaxPx }}
            />
          )}
        </div>
      )}
      <div
        className={mergeClassnames(
          'absolute text-wrap',
          !titleOneWordPerLine && titleLineClampClass(titleLineClamp),
          !titleOneWordPerLine && 'whitespace-pre-line',
          alignToTextClass(coverStyle.titleAlign),
          'uppercase',
          titleFontClassName,
        )}
        style={{
          ...titleHorizontalStyle,
          top: layoutOffsets.titleTopPx,
          color: titleColor,
          fontSize: titleFontSize,
          lineHeight: titleLineHeightPx ? `${titleLineHeightPx}px` : 1.1,
        }}
      >
        {titleLines
          ? titleLines.map((word, index) => (
              <span
                key={index}
                className="flex w-full items-center justify-center"
                style={{
                  height: titleLineHeightPx ? `${titleLineHeightPx}px` : undefined,
                  lineHeight: titleLineHeightPx ? `${titleLineHeightPx}px` : undefined,
                }}
              >
                {word}
              </span>
            ))
          : displayTitle}
      </div>
      {authorName && (
        <div
          className="pointer-events-none absolute flex items-center gap-1 whitespace-nowrap"
          style={{
            ...authorHorizontalStyle,
            top: layoutOffsets.authorTopPx,
            color: authorNameColor,
          }}
        >
          <span
            className="block h-px"
            style={{ width: layoutOffsets.authorLineWidthPx, backgroundColor: authorNameColor }}
            aria-hidden
          />
          <span
            className={mergeClassnames('whitespace-nowrap font-medium', authorFontClassName)}
            style={{ fontSize: layoutOffsets.authorFontSize, lineHeight: 1 }}
          >
            {authorName}
          </span>
          <span
            className="block h-px"
            style={{ width: layoutOffsets.authorLineWidthPx, backgroundColor: authorNameColor }}
            aria-hidden
          />
        </div>
      )}
    </div>
  );

  const ChromeWrapper = useBakedPresetChrome ? CoverBakedPreset : CoverExport;
  const chromeProps = useBakedPresetChrome
    ? { fixedDesktopSize: isExportTarget, id: isExportTarget ? previewId : undefined }
    : { fixedDesktopSize: isExportTarget, paperColor, id: isExportTarget ? previewId : undefined };

  return (
    <ChromeWrapper
      {...chromeProps}
      {...(isExportTarget ? {} : interactiveProps)}
      className={
        isExportTarget
          ? undefined
          : mergeClassnames(
              'outline-none focus:outline-none',
              !active && 'grayscale',
              onClick && 'cursor-pointer',
              className,
            )
      }
    >
      {coverContent}
    </ChromeWrapper>
  );
}
