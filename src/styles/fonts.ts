import {
  Bellota_Text as bellotaTextGoogle,
  BenchNine as benchNineGoogle,
  Caesar_Dressing as caesarDressingGoogle,
} from 'next/font/google';
import localFont from 'next/font/local';

export const svnRio = localFont({
  src: './fonts/SVN-Rio-2016.otf',
  weight: '400',
  style: 'normal',
});

/** Figma cover preset Opt@2 (red/purple) — title font */
export const svnApple = localFont({
  src: './fonts/SVN-Apple.ttf',
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
      path: './fonts/SVN-Poppins-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: './fonts/SVN-Poppins-LightItalic.otf',
      weight: '300',
      style: 'italic',
    },
    {
      path: './fonts/SVN-Poppins-Medium.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/SVN-Poppins-MediumItalic.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: './fonts/SVN-Poppins-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/SVN-Poppins-BoldItalic.otf',
      weight: '700',
      style: 'italic',
    },
    {
      path: './fonts/SVN-Poppins-ExtraBold.otf',
      weight: '800',
      style: 'normal',
    },
    {
      path: './fonts/SVN-Poppins-ExtraBoldItalic.otf',
      weight: '800',
      style: 'italic',
    },
    {
      path: './fonts/SVN-Poppins-Black.otf',
      weight: '900',
      style: 'normal',
    },
    {
      path: './fonts/SVN-Poppins-BlackItalic.otf',
      weight: '900',
      style: 'italic',
    },
  ],
});
