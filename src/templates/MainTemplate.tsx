'use client';

import { SessionProvider } from 'next-auth/react';
import { useEffect } from 'react';

import Header from '@/app/[locale]/(auth)/_components/Header';
import MobileBottomNav from '@/app/[locale]/(auth)/_components/MobileBottomNav';
import FooterWebApp from '@/app/[locale]/(auth)/_components/FooterWebApp';
import CustomToastifyContainer from '@/components/CustomToastifyContainer';
import type { WithChildren } from '@/components/core/private/types';
import { mergeClassnames } from '@/components/core/private/utils';
import { poppins } from '@/styles/fonts';
import MessengerWidget from '@/layouts/webapp/MultipleChatWidget';
import { useAppDispatch } from '@/libs/hooks';
import { usePathname } from '@/libs/i18nNavigation';
import { useGetPersonalInfoQuery } from '@/libs/services/modules/auth';
import { logout, setAvatarUrl, setUserInfo } from '@/libs/store/authentication';

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
          {!pathname.includes('messages') && <MobileBottomNav />}
          {!pathname.includes('messages') && <MessengerWidget />}
        </div>
        <CustomToastifyContainer />
      </div>
    </SessionProvider>
  );
};

export { MainTemplate };
