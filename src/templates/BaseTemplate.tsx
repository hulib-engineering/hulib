import localFont from 'next/font/local';
import type { ReactNode } from 'react';

import CustomToastifyContainer from '@/components/CustomToastifyContainer';
import { mergeClassnames } from '@/components/private/utils';
import Footer from '@/layouts/Footer';
import Header from '@/layouts/Header';

type IBaseTemplateProps = {
  children: ReactNode;
};

export const svnRio = localFont({
  src: '../styles/fonts/SVN-Rio-2016.otf',
  weight: '400',
  style: 'normal',
});

export const poppins = localFont({
  src: [
    {
      path: '../styles/fonts/SVN-Poppins-ExtraLight.otf',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../styles/fonts/SVN-Poppins-ExtraLightItalic.otf',
      weight: '200',
      style: 'italic',
    },
    {
      path: '../styles/fonts/SVN-Poppins-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../styles/fonts/SVN-Poppins-LightItalic.otf',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../styles/fonts/SVN-Poppins-Medium.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../styles/fonts/SVN-Poppins-MediumItalic.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../styles/fonts/SVN-Poppins-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../styles/fonts/SVN-Poppins-BoldItalic.otf',
      weight: '700',
      style: 'italic',
    },
    {
      path: '../styles/fonts/SVN-Poppins-ExtraBold.otf',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../styles/fonts/SVN-Poppins-ExtraBoldItalic.otf',
      weight: '800',
      style: 'italic',
    },
    {
      path: '../styles/fonts/SVN-Poppins-Black.otf',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../styles/fonts/SVN-Poppins-BlackItalic.otf',
      weight: '900',
      style: 'italic',
    },
  ],
});

const BaseTemplate = (props: IBaseTemplateProps) => (
  <div
    className={mergeClassnames(
      poppins.className,
      'relative w-screen bg-fixed bg-main-pattern 2xl:bg-cover bg-no-repeat bg-center px-1 antialiased overflow-hidden',
    )}
  >
    <div className="mx-auto flex max-w-full flex-col items-center justify-center">
      <Header />

      <main>{props.children}</main>

      <Footer />
    </div>
    <CustomToastifyContainer />
  </div>
);

export { BaseTemplate };
