'use client';

import localFont from 'next/font/local';
import { type ReactNode, useEffect, useState } from 'react';

import CustomToastifyContainer from '@/components/CustomToastifyContainer';
import { mergeClassnames } from '@/components/private/utils';
import Footer from '@/layouts/Footer';
import Header from '@/layouts/Header';
import SpecialSection from '@/layouts/SpecialSection';

type IBaseTemplateProps = {
  children: ReactNode;
};

// const poppins = Poppins({
//   subsets: ['latin'],
//   weight: ['300', '400', '500', '600', '700', '800'],
// });

const poppins = localFont({
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

const BaseTemplate = (props: IBaseTemplateProps) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const preLoad = () => {
      setTimeout(() => {
        setLoading(false);
      }, 7200);
    };
    preLoad();
  }, []);

  if (loading) return <SpecialSection />;

  return (
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
};

export { BaseTemplate };
