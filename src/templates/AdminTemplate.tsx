'use client';

import localFont from 'next/font/local';
import { SessionProvider } from 'next-auth/react';

import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import * as React from 'react';
import CustomToastifyContainer from '@/components/CustomToastifyContainer';
import type { WithChildren } from '@/components/core/private/types';
import { mergeClassnames } from '@/components/core/private/utils';
import Header from '@/layouts/admin/Header';
import { setAvatarUrl, setUserInfo } from '@/libs/store/authentication';
import { useGetPersonalInfoQuery } from '@/libs/services/modules/auth';
import { useAppDispatch } from '@/libs/hooks';

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

const AdminTemplate = (props: WithChildren) => {
  // const pathname = usePathname();

  const { data, error } = useGetPersonalInfoQuery();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (data) {
      dispatch(setUserInfo(data));
      dispatch(setAvatarUrl(data.photo));
    }
  }, [data, dispatch]);

  if (error) {
    return redirect('/auth/login');
  }

  return (
    <SessionProvider>
      <div
        className={mergeClassnames(
          poppins.className,
          'relative antialiased w-full min-h-screen flex flex-col',
        )}
      >
        <div className="flex h-max w-full flex-col gap-8 bg-neutral-98 pb-16">
          <Header />
          <main className="mx-auto flex w-full flex-1 xl:w-5/6 xl:max-w-7xl">
            {props.children}
          </main>
        </div>
        <CustomToastifyContainer />
      </div>
    </SessionProvider>
  );
};

export { AdminTemplate };
