import type { CSSProperties } from 'react';

/**
 * Figma Book/Right shadow spec (node 8366:40495):
 *   - Outer drop-shadow: offset (4,4), 0 blur, color #87878759 (rgba(135,135,135,0.35))
 *   - Inner box-shadow on the face: offset (2,2), 0 blur, color rgba(0,0,0,0.15)
 *
 * Both are hard-edge offset shadows (no blur). We render them as two DOM plates
 * because `html-to-image` does not capture CSS filter/box-shadow reliably.
 */
export const COVER_OUTER_SHADOW_OFFSET_PX = 4;
export const COVER_OUTER_SHADOW_COLOR = 'rgba(135, 135, 135, 0.35)';
export const COVER_INNER_SHADOW_OFFSET_PX = 2;
export const COVER_INNER_SHADOW_COLOR = 'rgba(0, 0, 0, 0.15)';

/**
 * Opaque export canvas (matches yellow `story_background_yellow.png` paper).
 * Never use blue/red preset plain tones — that painted a blue frame on custom covers.
 */
export const COVER_CHROME_MAT_COLOR = '#FAF6EB';

/**
 * Figma Book/Right node 8366:40454 — spine depth gradient (270deg grey ramp).
 * @see https://www.figma.com/design/2l5ivSRzvyE7ihSwrYrKaI/Hulib-Webapp?node-id=8366-40495
 */
export const COVER_SPINE_GRADIENT = `linear-gradient(270deg, rgb(255, 255, 255) 0%, rgb(244, 244, 244) 88.562%, rgb(234, 234, 234) 91.344%, rgb(224, 224, 224) 91.749%, rgb(238, 238, 238) 93.165%, rgb(244, 244, 244) 96.234%, rgb(239, 239, 239) 96.701%, rgb(217, 217, 217) 100%)`;

/**
 * @deprecated CSS drop-shadow is not captured by `html-to-image`.
 */
export const COVER_OUTER_SHADOW_CLASS
  = 'drop-shadow-[4px_4px_0_rgba(135,135,135,0.35)]';

/** Figma inner card shadow on the 180×255 face. */
export const COVER_INNER_SHADOW_CLASS = 'shadow-[2px_2px_0_0_rgba(0,0,0,0.15)]';

/**
 * Solid paper color used for the face background. The spine darkening is rendered
 * as a separate overlay element (`getCoverSpineOverlayStyle`) because
 * `html-to-image` does not reliably composite `background-color` and
 * `background-image: linear-gradient(rgba...)` together — the gradient drops out
 * on the rasterized PNG.
 */
/** Solid face paper color for custom covers (presets bake this into the PNG). */
export function getCoverBackgroundStyle(paperColor?: string): CSSProperties {
  return {
    backgroundColor: paperColor || '#FDF3CE',
  };
}

/**
 * Standalone spine darkening overlay (left edge). Rasterizer-safe: rendered as a
 * dedicated element on top of the face, so `html-to-image` captures it cleanly.
 */
export function getCoverSpineOverlayStyle(): CSSProperties {
  return {
    backgroundImage: `linear-gradient(270deg,
      rgba(0,0,0,0) 0%,
      rgba(0,0,0,0) 86%,
      rgba(0,0,0,0.06) 89%,
      rgba(0,0,0,0.14) 92%,
      rgba(0,0,0,0.08) 94%,
      rgba(0,0,0,0.04) 96%,
      rgba(0,0,0,0.16) 100%
    )`,
  };
}
