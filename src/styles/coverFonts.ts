import {
  Bellota_Text as bellotaTextGoogle,
  BenchNine as benchNineGoogle,
  Caesar_Dressing as caesarDressingGoogle,
} from 'next/font/google';

/** Figma cover preset Opt@3 (blue) — title + author font */
export const caesarDressing = caesarDressingGoogle({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
});

/** Figma cover preset Opt@1 (yellow) — author font */
export const benchNine = benchNineGoogle({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

/** Figma cover preset Opt@2 (red/purple) — author font */
export const bellotaText = bellotaTextGoogle({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});
