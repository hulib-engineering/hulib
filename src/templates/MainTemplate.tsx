'use client';

import { SessionProvider } from 'next-auth/react';
import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { poppins } from '@/styles/fonts';

import Header from '@/app/[locale]/(auth)/_components/Header';
import AuthSessionSync from '@/components/AuthSessionSync';
import MobileBottomNav from '@/app/[locale]/(auth)/_components/MobileBottomNav';
import FooterWebApp from '@/app/[locale]/(auth)/_components/FooterWebApp';
import CustomToastifyContainer from '@/components/CustomToastifyContainer';
import type { WithChildren } from '@/components/core/private/types';
import { mergeClassnames } from '@/components/core/private/utils';
import MessengerWidget from '@/layouts/webapp/MultipleChatWidget';
import { useAppDispatch } from '@/libs/hooks';
import { usePathname } from '@/libs/i18nNavigation';
import { useGetPersonalInfoQuery } from '@/libs/services/modules/auth';
import { logout, setAvatarUrl, setUserInfo } from '@/libs/store/authentication';

const MainTemplate = (props: WithChildren) => {
  const pathname = usePathname();
  const t = useTranslations('Common');

  const { data, error, refetch } = useGetPersonalInfoQuery();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (error && 'status' in error && error.status === 401) {
      dispatch(logout());
      return;
    }

    if (data) {
      dispatch(setUserInfo(data));
      dispatch(setAvatarUrl(data.photo));
    }
  }, [data, error, dispatch]);

  if (error && (!('status' in error) || error.status !== 401)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p>{t('profile_load_error')}</p>
        <button type="button" onClick={() => refetch()}>{t('try_again')}</button>
      </div>
    );
  }

  return (
    <SessionProvider>
      <AuthSessionSync />
      <div
        style={pathname.includes('messages') ? { height: '100dvh' } : undefined}
        className={mergeClassnames(
          poppins.className,
          'relative antialiased h-screen flex flex-col',
        )}
      >
        <div className="flex size-full flex-col">
          {!pathname.includes('/register-huber/create-book') && <Header />}
          <main className={mergeClassnames('min-h-0 flex-1', !pathname.includes('messages') && 'overflow-y-auto')}>
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
