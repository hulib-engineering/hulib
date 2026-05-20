import React from 'react';

import { mergeClassnames } from '@/components/core/private/utils';
import {
  COVER_INNER_SHADOW_COLOR,
  COVER_OUTER_SHADOW_COLOR,
  getCoverBackgroundStyle,
  getCoverSpineOverlayStyle,
} from '@/features/stories/utils/coverChrome';

/** Book face (140×198 mobile, 180×255 desktop). */
const COVER_FACE_SIZE_CLASS = 'size-[140px_198px] md:size-[180px_255px]';
const COVER_FACE_DESKTOP_CLASS = 'size-[180px_255px]';

/** Face + 4px outer shadow gutter. */
const COVER_CHROME_SIZE_CLASS = 'size-[144px_202px] md:size-[184px_259px]';
const COVER_CHROME_DESKTOP_CLASS = 'size-[184px_259px]';

/** Shadow plates match the face footprint (not chrome wrapper). */
const COVER_SHADOW_FACE_CLASS = COVER_FACE_SIZE_CLASS;
const COVER_SHADOW_FACE_DESKTOP_CLASS = COVER_FACE_DESKTOP_CLASS;

type ICoverFaceProps = {
  /** Lock desktop dimensions for off-screen export (see `COVER_EXPORT_SIZE`). */
  fixedDesktopSize?: boolean;
  /** Solid paper fill for custom covers only; presets use a baked PNG instead. */
  paperColor?: string;
  className?: string;
  id?: string;
  children: React.ReactNode;
};

type ICoverShadowPlateProps = {
  fixedDesktopSize: boolean;
  fillParent: boolean;
};

type ICoverChromeWrapperProps = {
  fixedDesktopSize?: boolean;
  className?: string;
  id?: string;
  children: React.ReactNode;
} & Pick<React.HTMLAttributes<HTMLDivElement>, 'role' | 'tabIndex' | 'onClick' | 'onKeyDown'>;

type ICoverExportProps = ICoverFaceProps & {
  className?: string;
} & Pick<ICoverChromeWrapperProps, 'role' | 'tabIndex' | 'onClick' | 'onKeyDown' | 'fixedDesktopSize'>;

const chromeWrapperSizeClass = (fixedDesktopSize: boolean, fillParent: boolean) => {
  if (fillParent) {
    return '';
  }
  return fixedDesktopSize ? COVER_CHROME_DESKTOP_CLASS : COVER_CHROME_SIZE_CLASS;
};

/** Book face: spine gradient + inner shadow (2px) + 180×255 content area. */
export const CoverFace = ({
  fixedDesktopSize = false,
  paperColor,
  className,
  id,
  children,
}: ICoverFaceProps) => {
  const fillParent = Boolean(className?.includes('size-full'));
  // Skip explicit width/height when caller positions the face via inset utilities
  // (`absolute` + `left`/`right`/`top`/`bottom`). Otherwise CSS prefers `width`
  // over `right` and collapses the inset back to 100%, hiding the shadow strip.
  const useInsetSizing = !fillParent && /(?:^|\s)absolute(?:\s|$)/.test(className ?? '')
    && /(?:right|bottom)-/.test(className ?? '');

  return (
    <div
      id={id}
      className={mergeClassnames(
        'overflow-hidden rounded-[4px]',
        !fillParent && !useInsetSizing && (
          fixedDesktopSize ? COVER_FACE_DESKTOP_CLASS : COVER_FACE_SIZE_CLASS
        ),
        className,
      )}
      style={getCoverBackgroundStyle(paperColor)}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={getCoverSpineOverlayStyle()}
      />
      {children}
    </div>
  );
};

/** Outer drop-shadow plate (Figma node 8366:40495 — drop-shadow 4,4 #87878759). */
const CoverOuterShadowPlate = ({
  fixedDesktopSize,
  fillParent,
}: ICoverShadowPlateProps) => (
  <div
    aria-hidden
    className={mergeClassnames(
      'pointer-events-none absolute z-0 rounded-[4px]',
      fillParent
        ? 'left-1 top-1 right-0 bottom-0'
        : mergeClassnames(
            'left-1 top-1',
            fixedDesktopSize ? COVER_SHADOW_FACE_DESKTOP_CLASS : COVER_SHADOW_FACE_CLASS,
          ),
    )}
    style={{ backgroundColor: COVER_OUTER_SHADOW_COLOR }}
  />
);

/** Inner face box-shadow plate (Figma node 8366:40454 — shadow 2,2 rgba(0,0,0,0.15)). */
const CoverInnerShadowPlate = ({
  fixedDesktopSize,
  fillParent,
}: ICoverShadowPlateProps) => (
  <div
    aria-hidden
    className={mergeClassnames(
      'pointer-events-none absolute z-0 rounded-[4px]',
      fillParent
        ? 'left-0.5 top-0.5 right-0.5 bottom-0.5'
        : mergeClassnames(
            'left-0.5 top-0.5',
            fixedDesktopSize ? COVER_SHADOW_FACE_DESKTOP_CLASS : COVER_SHADOW_FACE_CLASS,
          ),
    )}
    style={{ backgroundColor: COVER_INNER_SHADOW_COLOR }}
  />
);

/** Preset PNG — chrome already baked; no composed shadow layers. */
export const CoverBakedPreset = ({
  fixedDesktopSize = false,
  id,
  className,
  children,
  role,
  tabIndex,
  onClick,
  onKeyDown,
}: ICoverChromeWrapperProps) => {
  const fillParent = Boolean(className?.includes('size-full'));

  return (
    <div
      id={id}
      role={role}
      tabIndex={tabIndex}
      onClick={onClick}
      onKeyDown={onKeyDown}
      className={mergeClassnames(
        'relative outline-none',
        fillParent ? 'block size-full' : 'inline-block',
        chromeWrapperSizeClass(fixedDesktopSize, fillParent),
        className,
      )}
    >
      {children}
    </div>
  );
};

/**
 * Custom cover: inner face chrome + grey outer shadow (html-to-image safe).
 * Gutter mat is always cream paper — never blue/red preset tones.
 */
export const CoverExport = ({
  fixedDesktopSize = false,
  paperColor,
  id,
  className,
  children,
  role,
  tabIndex,
  onClick,
  onKeyDown,
}: ICoverExportProps) => {
  const fillParent = Boolean(className?.includes('size-full'));

  return (
    <div
      id={id}
      role={role}
      tabIndex={tabIndex}
      onClick={onClick}
      onKeyDown={onKeyDown}
      className={mergeClassnames(
        'relative outline-none',
        fillParent ? 'block size-full' : 'inline-block',
        chromeWrapperSizeClass(fixedDesktopSize, fillParent),
        className,
      )}
    >
      <CoverOuterShadowPlate fixedDesktopSize={fixedDesktopSize} fillParent={fillParent} />
      <CoverInnerShadowPlate fixedDesktopSize={fixedDesktopSize} fillParent={fillParent} />
      <CoverFace
        fixedDesktopSize={fixedDesktopSize}
        paperColor={paperColor}
        className={mergeClassnames(
          'absolute left-0 top-0 z-[1]',
          fillParent && 'bottom-1 right-1',
        )}
      >
        {children}
      </CoverFace>
    </div>
  );
};
