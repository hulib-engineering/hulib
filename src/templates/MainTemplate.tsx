'use client';

import localFont from 'next/font/local';
import { SessionProvider } from 'next-auth/react';
import { useEffect } from 'react';

import Header from '@/app/[locale]/(auth)/_components/Header';
import FooterWebApp from '@/app/[locale]/(auth)/_components/FooterWebApp';
import CustomToastifyContainer from '@/components/CustomToastifyContainer';
import type { WithChildren } from '@/components/core/private/types';
import { mergeClassnames } from '@/components/core/private/utils';
import MessengerWidget from '@/layouts/webapp/MultipleChatWidget';
import { useAppDispatch } from '@/libs/hooks';
import { usePathname } from '@/libs/i18nNavigation';
import { useGetPersonalInfoQuery } from '@/libs/services/modules/auth';
import { logout, setAvatarUrl, setUserInfo } from '@/libs/store/authentication';

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
    if (error) {
      dispatch(logout());
      return;
    }

    if (data) {
      dispatch(setUserInfo(data));
      dispatch(setAvatarUrl(data.photo));
    }
  }, [data, error, dispatch]);

  if (error) {
    return null;
  }

  return (
    <SessionProvider>
      <div
        className={mergeClassnames(
          poppins.className,
          'relative antialiased h-screen flex flex-col',
        )}
      >
        <div className="flex size-full flex-col">
          <Header />
          <main className={mergeClassnames('flex-1', !pathname.includes('messages') && 'overflow-y-auto')}>
            <div className={mergeClassnames(pathname.includes('messages') ? 'h-full' : 'min-h-[calc(100vh-410px)]')}>
              {props.children}
            </div>

            {!pathname.includes('messages') && <FooterWebApp />}
          </main>
          {!pathname.includes('messages') && <MessengerWidget />}
        </div>
        <CustomToastifyContainer />
      </div>
    </SessionProvider>
  );
};

export { MainTemplate };
