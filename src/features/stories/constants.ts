/** Story cover authoring & display literals (sizes, URLs, IDs, swatches). */

import type { CoverIllustration, CoverPresetStyle, CoverSize, CoverSizeTokens } from '@/features/stories/types';

export type { CoverPresetStyle, CoverSize, CoverSizeTokens } from '@/features/stories/types';

export const DEFAULT_TITLE_COLOR = '#0442BF';
export const DEFAULT_AUTHOR_COLOR = '#0442BF';
export const MIN_TITLE_FONT_SIZE = 16;
export const MAX_TITLE_FONT_SIZE = 28;
export const TITLE_FONT_SIZE_STEP = 2;

export const COVER_COLOR_GRADIENT = 'gradient';

export const COVER_RAINBOW_CONIC = `conic-gradient(
  from 90deg,
  #c00000 0%,
  #c90c00 3%,
  #c51801 6%,
  #c82f01 12%,
  #cd4702 18%,
  #d15e02 24%,
  #d98d03 36%,
  #e1bd04 48%,
  #acc105 60%,
  #86c505 72%,
  #61cd06 84%,
  #34bc1f 90%,
  #2dab38 93%,
  #269952 96%,
  #10669a 100%
)`;

/** Figma EditingColorTitle swatches */
export const TEXT_COLORS = [
  '#0442BF',
  '#A978D6',
  '#FF2559',
  '#FF2C94',
  '#FF8F34',
  '#F6CE3C',
  '#66E73F',
] as const;

/** Figma EditingColorBackground swatches */
export const BACKGROUND_COLORS = [
  '#84ACFC',
  '#DDC9EF',
  '#FF92AC',
  '#FFC9E3',
  '#FFC799',
  '#FDF3CE',
  '#B2F39F',
] as const;

export const COVER_PREVIEW_ELEMENT_ID = 'cover-book-preview';
/** Rasterize target: book face + outer shadow (same chrome as preset PNG assets). */
export const COVER_EXPORT_ELEMENT_ID = 'cover-book-export';

/**
 * Book canvas size per breakpoint (face + export chrome).
 * Typography and element positions come from the selected preset — see `COVER_PRESET_STYLES`.
 */
export const COVER_SIZE_TOKENS: Record<CoverSize, CoverSizeTokens> = {
  desktop: { width: 180, height: 255 },
  mobile: { width: 140, height: 198 },
};

/** Canonical rasterization variant — every saved PNG is baked at this size. */
export const COVER_EXPORT_SIZE: CoverSize = 'desktop';

export const PRESET_COVER_ASSET_SEGMENT = 'story_background_';

const COVER_BOOK_DIR = '/assets/images/cover-bg-presets';

/** Preset cover backgrounds for the story form picker (yellow, red, blue). */
export const COVER_PRESET_ASSETS = [
  `${COVER_BOOK_DIR}/story_background_yellow.png`,
  `${COVER_BOOK_DIR}/story_background_red.png`,
  `${COVER_BOOK_DIR}/story_background_blue.png`,
] as const;

export type CoverPresetAsset = (typeof COVER_PRESET_ASSETS)[number];

export const DEFAULT_STORY_COVER_ASSET = COVER_PRESET_ASSETS[0];

// --- Custom cover illustrations (`public/assets/images/covers`)

const COVER_ILLUSTRATIONS_DIR = '/assets/images/illustrations/cover';

const COVER_ILLUSTRATION_FILENAMES = [
  '1 Inner Peace.png',
  '2 Happy with friend.png',
  '3 Lonely.png',
  '4 Burn out.png',
  '5 Freedom.png',
  '6 Strong.png',
  '7 Grateful.png',
  '8 Dreaming.png',
  '9 Get lost.png',
  '10 Keep going.png',
  '11 nostalgic.png',
  '12.png',
  '13 Reflection.png',
  '14 Overthinking.png',
  '15 Proud .png',
  '16 Embrace myself.png',
  '17 To be Okay.png',
  '19 A rainy day.png',
  '20. On the roof.png',
] as const;

function coverIllustrationSrc(filename: string) {
  return `${COVER_ILLUSTRATIONS_DIR}/${encodeURIComponent(filename)}`;
}

function toCoverIllustrationId(filename: string) {
  return filename
    .replace(/\.png$/i, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Illustrations available in Custom cover modal; files live under `public/assets/images/covers`. */
export const COVER_ILLUSTRATIONS: CoverIllustration[] = COVER_ILLUSTRATION_FILENAMES.map(
  filename => ({
    id: toCoverIllustrationId(filename),
    src: coverIllustrationSrc(filename),
  }),
);

/** Per-preset typography & positioning recipe from Figma node 8386:63604. */
export const COVER_PRESET_STYLES: Record<string, CoverPresetStyle> = {
  story_background_yellow: {
    titleFontFamily: 'svn-rio',
    titleFontSize: 22,
    titleColor: '#0442BF',
    titleAlign: 'center',
    authorFontFamily: 'benchnine',
    authorColor: '#0442BF',
    authorAlign: 'center',
    desktop: {
      titleTopPx: 29,
      authorTopPx: 234,
      titleWidthRatio: 122 / 180,
      authorFontSize: 10,
      authorLineWidthPx: 16,
      illustrationMaxPx: 90,
      illustrationBottomPx: 24,
    },
    mobile: {
      titleTopPx: 20,
      authorTopPx: 178,
      titleWidthRatio: 96 / 140,
      authorFontSize: 10,
      authorLineWidthPx: 16,
      illustrationMaxPx: 70,
      illustrationBottomPx: 18,
    },
  },
  story_background_red: {
    titleFontFamily: 'svn-apple',
    titleFontSize: 25,
    titleColor: '#FF77BA',
    titleAlign: 'left',
    titleLineClamp: 2,
    authorFontFamily: 'bellota-text',
    authorColor: '#E0006F',
    authorAlign: 'left',
    desktop: {
      titleTopPx: 18,
      authorTopPx: 234,
      titleWidthRatio: 152 / 180,
      titleLeftPx: 22,
      authorLeftPx: 22,
      authorFontSize: 10,
      authorLineWidthPx: 16,
      illustrationMaxPx: 90,
      illustrationBottomPx: 24,
    },
    mobile: {
      titleTopPx: 12,
      authorTopPx: 178,
      titleWidthRatio: 105 / 140,
      titleLeftPx: 18,
      authorLeftPx: 18,
      authorFontSize: 10,
      authorLineWidthPx: 16,
      illustrationMaxPx: 70,
      illustrationBottomPx: 18,
    },
  },
  story_background_blue: {
    titleFontFamily: 'caesar-dressing',
    titleFontSize: 22,
    titleColor: '#0858FA',
    titleAlign: 'center',
    titleLineBreak: 'one-word-per-line',
    titleLineClamp: 4,
    authorFontFamily: 'caesar-dressing',
    authorColor: '#0858FA',
    authorAlign: 'center',
    desktop: {
      titleTopPx: 24,
      authorTopPx: 234,
      titleWidthRatio: 136 / 180,
      titleLineHeightPx: 27,
      authorFontSize: 10,
      authorLineWidthPx: 16,
      illustrationMaxPx: 90,
      illustrationBottomPx: 24,
    },
    mobile: {
      titleTopPx: 11,
      authorTopPx: 178,
      titleWidthRatio: 97 / 140,
      titleLineHeightPx: 21,
      authorFontSize: 10,
      authorLineWidthPx: 16,
      illustrationMaxPx: 70,
      illustrationBottomPx: 18,
    },
  },
};

export const LOGIN_REQUIRED_MESSAGE = 'Vui lòng đăng nhập để tiếp tục';
export const COPY_STORY_LINK_SUCCESS_MESSAGE = 'Đã sao chép liên kết câu chuyện';
export const COPY_STORY_LINK_ERROR_MESSAGE = 'Không thể sao chép liên kết câu chuyện';
export const MAX_STORY_URL_LENGTH_FOR_TOAST = 60;
export const PRIORITY_TOPIC_KEYWORD = 'khoảnh khắc';
