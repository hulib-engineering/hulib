import {
  BACKGROUND_COLORS,
  COVER_COLOR_GRADIENT,
  COVER_PRESET_STYLES,
  PRESET_COVER_ASSET_SEGMENT,
  TEXT_COLORS,
} from '@/features/stories/constants';
import type { CoverCustomization, CoverFontFamily, CoverPresetStyle } from '@/features/stories/types';
import { resolveCoverColorSwatch } from '@/features/stories/utils/coverColorSwatch';
import {
  bellotaText,
  benchNine,
  caesarDressing,
  poppins,
  svnApple,
  svnRio,
} from '@/styles/fonts';

export const isValidCoverColor = (color?: string): color is string =>
  Boolean(color && color !== 'transparent' && color !== COVER_COLOR_GRADIENT);

export const isPresetCoverAsset = (src?: string) =>
  Boolean(src?.includes(PRESET_COVER_ASSET_SEGMENT));

/** Preset PNG already includes spine + outer shadow — do not add `CoverExport` chrome. */
export const hasBakedPresetChrome = (backgroundSrc: string, hasCustomIllustration: boolean) =>
  isPresetCoverAsset(backgroundSrc) && !hasCustomIllustration;

/** Rasterized / uploaded cover from API — final image, no live text overlay. */
export const isRasterizedStoryCover = (src?: string) =>
  Boolean(src?.trim()) && !isPresetCoverAsset(src);

/** Default Figma background swatch per preset (EditingColorBackground). */
const PRESET_EDITING_BACKGROUND_SWATCHES: Record<string, string> = {
  story_background_yellow: BACKGROUND_COLORS[5]!,
  story_background_red: BACKGROUND_COLORS[1]!,
  story_background_blue: BACKGROUND_COLORS[0]!,
};

/** Paper tones for custom covers — aligned with editing swatches above. */
const COVER_PRESET_PLAIN_BACKGROUNDS: Record<string, string> = {
  ...PRESET_EDITING_BACKGROUND_SWATCHES,
};

const resolvePresetKey = (backgroundSrc: string) =>
  Object.keys(COVER_PRESET_PLAIN_BACKGROUNDS).find(key => backgroundSrc.includes(key));

export const getPresetEditingBackgroundSwatch = (backgroundSrc: string): string => {
  const key = resolvePresetKey(backgroundSrc);
  return (key && PRESET_EDITING_BACKGROUND_SWATCHES[key]) ?? BACKGROUND_COLORS[5]!;
};

export const getPresetPlainBackgroundColor = (backgroundSrc: string): string => {
  const match = Object.entries(COVER_PRESET_PLAIN_BACKGROUNDS).find(([key]) =>
    backgroundSrc.includes(key),
  );
  return match?.[1] ?? '#FAF6EB';
};

export const DEFAULT_COVER_FONT_FAMILY: CoverFontFamily = 'svn-rio';

const COVER_FONT_CLASS_NAMES: Record<CoverFontFamily, string> = {
  'svn-rio': svnRio.className,
  'poppins': poppins.className,
  'caesar-dressing': caesarDressing.className,
  'svn-apple': svnApple.className,
  'benchnine': benchNine.className,
  'bellota-text': bellotaText.className,
};

export const getCoverFontClassName = (fontFamily?: CoverFontFamily) =>
  COVER_FONT_CLASS_NAMES[fontFamily ?? DEFAULT_COVER_FONT_FAMILY];

const DEFAULT_PRESET_STYLE = COVER_PRESET_STYLES.story_background_yellow!;

/** Resolve a preset style recipe from any cover URL. Falls back to yellow defaults. */
export const getPresetStyle = (src?: string): CoverPresetStyle => {
  if (src) {
    const match = Object.entries(COVER_PRESET_STYLES).find(([key]) => src.includes(key));
    if (match) {
      return match[1];
    }
  }
  return DEFAULT_PRESET_STYLE;
};

export const getDefaultCustomization = (backgroundSrc: string): CoverCustomization => {
  const preset = getPresetStyle(backgroundSrc);
  const titleColor = resolveCoverColorSwatch(preset.titleColor, TEXT_COLORS) ?? preset.titleColor;
  const authorColor = resolveCoverColorSwatch(preset.authorColor, TEXT_COLORS) ?? preset.authorColor;

  return {
    backgroundSrc,
    backgroundColor: getPresetEditingBackgroundSwatch(backgroundSrc),
    illustrationSrc: null,
    titleColor,
    titleFontFamily: preset.titleFontFamily,
    titleFontSize: preset.titleFontSize,
    authorColor,
  };
};
