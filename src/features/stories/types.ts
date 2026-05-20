/** Story cover domain types (authoring, layout variants, preset styles). */

export type CoverIllustration = {
  id: string;
  src: string;
};

export type CoverFontFamily =
  | 'svn-rio'
  | 'poppins'
  | 'caesar-dressing'
  | 'svn-apple'
  | 'benchnine'
  | 'bellota-text';

export type CoverCustomization = {
  backgroundSrc: string;
  backgroundColor?: string;
  illustrationSrc: string | null;
  titleColor: string;
  titleFontFamily: CoverFontFamily;
  titleFontSize: number;
  authorColor: string;
};

/** Desktop vs mobile layout / export dimensions (Figma 8386:63604). */
export type CoverSize = 'desktop' | 'mobile';

/** Physical book canvas size per breakpoint (chrome + export). */
export type CoverSizeTokens = {
  width: number;
  height: number;
};

export type CoverTextAlign = 'left' | 'center' | 'right';

/** Blue preset: one word per line (Figma Opt@3). */
export type CoverTitleLineBreak = 'normal' | 'one-word-per-line';

export type CoverPresetVariantOffsets = {
  /** Distance from top of cover to title block in px. */
  titleTopPx: number;
  /** Distance from top of cover to author block in px. */
  authorTopPx: number;
  /** Title block width as a fraction of cover width (Figma). */
  titleWidthRatio: number;
  /** Title block horizontal offset from cover left edge, in px. Left-aligned presets only. */
  titleLeftPx?: number;
  /** Author block horizontal offset from cover left edge, in px. Left-aligned presets only. */
  authorLeftPx?: number;
  /** Per-line height for one-word-per-line titles (e.g. blue preset). */
  titleLineHeightPx?: number;
  authorFontSize: number;
  authorLineWidthPx: number;
  illustrationMaxPx: number;
  illustrationBottomPx: number;
};

/**
 * Per-preset typography & positioning recipe from Figma node 8386:63604.
 * Keyed by the asset filename segment so the preset is resolved from the cover URL.
 */
export type CoverPresetStyle = {
  titleFontFamily: CoverFontFamily;
  titleFontSize: number;
  titleColor: string;
  titleAlign: CoverTextAlign;
  /** Each whitespace-separated word is forced onto its own line. */
  titleLineBreak?: CoverTitleLineBreak;
  /** Max visible title lines. */
  titleLineClamp?: number;
  authorFontFamily: CoverFontFamily;
  authorColor: string;
  authorAlign: CoverTextAlign;
  desktop: CoverPresetVariantOffsets;
  mobile: CoverPresetVariantOffsets;
};
