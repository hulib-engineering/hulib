import { bellotaText, benchNine, caesarDressing } from '@/styles/coverFonts';
import { poppins, svnApple, svnRio } from '@/styles/fonts';
import type { CoverFontFamily } from '@/features/stories/types';

const COVER_FONT_CLASS_NAMES: Record<CoverFontFamily, string> = {
  'svn-rio': svnRio.className,
  'poppins': poppins.className,
  'caesar-dressing': caesarDressing.className,
  'svn-apple': svnApple.className,
  'benchnine': benchNine.className,
  'bellota-text': bellotaText.className,
};

export const getCoverFontClassName = (fontFamily?: CoverFontFamily) =>
  COVER_FONT_CLASS_NAMES[fontFamily ?? 'svn-rio'];
