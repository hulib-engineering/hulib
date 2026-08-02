import {
  Bellota_Text as bellotaTextGoogle,
  BenchNine as benchNineGoogle,
  Caesar_Dressing as caesarDressingGoogle,
} from 'next/font/google';
import localFont from 'next/font/local';

export const svnRio = localFont({
  src: './fonts/SVN-Rio2016.woff2',
  weight: '400',
  style: 'normal',
});

/** Figma cover preset Opt@2 (red/purple) — title font */
export const svnApple = localFont({
  src: './fonts/SVN-Apple.woff2',
  weight: '400',
  style: 'normal',
});

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

export const poppins = localFont({
  src: [
    {
      path: './fonts/SVN-PoppinsExtraLight.woff2',
      weight: '200',
      style: 'normal',
    },
    {
      path: './fonts/SVN-PoppinsExtraLightItalic.woff2',
      weight: '200',
      style: 'italic',
    },
    {
      path: './fonts/SVN-PoppinsLight.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: './fonts/SVN-PoppinsLightItalic.woff2',
      weight: '300',
      style: 'italic',
    },
    {
      path: './fonts/SVN-PoppinsMedium.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/SVN-PoppinsMediumItalic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: './fonts/SVN-PoppinsMedium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/SVN-PoppinsMediumItalic.woff2',
      weight: '500',
      style: 'italic',
    },
    {
      path: './fonts/SVN-PoppinsBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: './fonts/SVN-PoppinsBoldItalic.woff2',
      weight: '600',
      style: 'italic',
    },
    {
      path: './fonts/SVN-PoppinsBold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/SVN-PoppinsBoldItalic.woff2',
      weight: '700',
      style: 'italic',
    },
    {
      path: './fonts/SVN-PoppinsBold.woff2',
      weight: '800',
      style: 'normal',
    },
    {
      path: './fonts/SVN-PoppinsBoldItalic.woff2',
      weight: '800',
      style: 'italic',
    },
    {
      path: './fonts/SVN-PoppinsBold.woff2',
      weight: '900',
      style: 'normal',
    },
    {
      path: './fonts/SVN-PoppinsBoldItalic.woff2',
      weight: '900',
      style: 'italic',
    },
  ],
});
