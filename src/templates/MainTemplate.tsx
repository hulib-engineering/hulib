'use client';

import localFont from 'next/font/local';
import { redirect, usePathname } from 'next/navigation';
import { useEffect } from 'react';

import CustomToastifyContainer from '@/components/CustomToastifyContainer';
import type { WithChildren } from '@/components/private/types';
import { mergeClassnames } from '@/components/private/utils';
import FooterWebApp from '@/layouts/FooterWebApp';
import Header from '@/layouts/webapp/Header';
import MessengerWidget from '@/layouts/webapp/MultipleChatWidget';
import { useAppDispatch } from '@/libs/hooks';
import { useGetPersonalInfoQuery } from '@/libs/services/modules/auth';
import { setUserInfo } from '@/libs/store/authentication';

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
const MainTemplate = (props: WithChildren) => {
  const pathname = usePathname();

  const { data, error } = useGetPersonalInfoQuery();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (data) {
      dispatch(setUserInfo(data));
    }
  }, [data]);

  if (error) {
    return redirect('/auth/login');
  }

  return (
    <div
      className={mergeClassnames(
        poppins.className,
        'relative antialiased h-screen flex flex-col',
      )}
    >
      <div className="flex size-full flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto bg-neutral-98">
          <div className="min-h-[calc(100vh-410px)] bg-neutral-98">
            {props.children}
          </div>

          <FooterWebApp />
        </main>
        {!pathname.includes('messages') && <MessengerWidget />}
      </div>
      <CustomToastifyContainer />
    </div>
  );
};

export { MainTemplate };
