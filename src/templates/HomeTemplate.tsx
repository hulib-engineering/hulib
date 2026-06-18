'use client';

import { List, X } from '@phosphor-icons/react';
import Link from 'next/link';
import localFont from 'next/font/local';
import { usePathname } from 'next/navigation';
import { SessionProvider, useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { type ReactNode, useEffect, useState } from 'react';

import Header from '@/app/[locale]/(auth)/_components/Header';
import FooterWebApp from '@/app/[locale]/(auth)/_components/FooterWebApp';
import CustomToastifyContainer from '@/components/CustomToastifyContainer';
import { Logo } from '@/components/Logo';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { mergeClassnames } from '@/components/core/private/utils';
import Button from '@/components/core/button/Button';
import MessengerWidget from '@/layouts/webapp/MultipleChatWidget';
import { useAppDispatch } from '@/libs/hooks';
import { useGetPersonalInfoQuery } from '@/libs/services/modules/auth';
import { setAvatarUrl, setUserInfo } from '@/libs/store/authentication';

const poppins = localFont({
  src: [
    { path: '../styles/fonts/SVN-Poppins-ExtraLight.otf', weight: '200', style: 'normal' },
    { path: '../styles/fonts/SVN-Poppins-ExtraLightItalic.otf', weight: '200', style: 'italic' },
    { path: '../styles/fonts/SVN-Poppins-Light.otf', weight: '300', style: 'normal' },
    { path: '../styles/fonts/SVN-Poppins-LightItalic.otf', weight: '300', style: 'italic' },
    { path: '../styles/fonts/SVN-Poppins-Medium.otf', weight: '400', style: 'normal' },
    { path: '../styles/fonts/SVN-Poppins-MediumItalic.otf', weight: '400', style: 'italic' },
    { path: '../styles/fonts/SVN-Poppins-Bold.otf', weight: '700', style: 'normal' },
    { path: '../styles/fonts/SVN-Poppins-BoldItalic.otf', weight: '700', style: 'italic' },
    { path: '../styles/fonts/SVN-Poppins-ExtraBold.otf', weight: '800', style: 'normal' },
    { path: '../styles/fonts/SVN-Poppins-ExtraBoldItalic.otf', weight: '800', style: 'italic' },
    { path: '../styles/fonts/SVN-Poppins-Black.otf', weight: '900', style: 'normal' },
    { path: '../styles/fonts/SVN-Poppins-BlackItalic.otf', weight: '900', style: 'italic' },
  ],
});

function PublicHeader() {
  const t = useTranslations('SignIn');
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className="fixed top-0 z-[999] flex h-14 w-screen items-center bg-white shadow-sm lg:h-16">
        <div className="mx-auto flex w-full items-center justify-between px-4">
          <div className="flex items-center gap-x-6">
            <Link href="/" aria-label="Go to homepage">
              <span className="hidden lg:block">
                <Logo />
              </span>
              <span className="lg:hidden">
                <Logo size="small" />
              </span>
            </Link>
            <div className="hidden lg:block">
              <Link href="/explore-story" className="p-3">
                Những câu chuyện
              </Link>
              <Link href="/explore-story" className="p-3">
                Góc hỏi-đáp
              </Link>
              <Link href="/explore-story" className="p-3">
                Về Hulib
              </Link>
            </div>
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.href = '/auth/login'}
            >
              {t('log_in')}
            </Button>
            <Button
              variant="fill"
              size="sm"
              onClick={() => window.location.href = '/auth/register'}
            >
              {t('register')}
            </Button>
            <LocaleSwitcher />
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <LocaleSwitcher />
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full p-2 text-neutral-20"
              aria-label="Open menu"
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen(true)}
            >
              <List size={24} weight="bold" />
            </button>
          </div>
        </div>
      </header>

      <div
        className={mergeClassnames(
          'fixed inset-0 z-[1000] bg-black/40 transition-opacity duration-200 lg:hidden',
          isMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      />

      <aside
        className={mergeClassnames(
          'fixed right-0 top-0 z-[1001] h-screen w-[82%] max-w-[320px] bg-white shadow-xl transition-transform duration-300 lg:hidden',
          isMenuOpen ? 'translate-x-0' : 'translate-x-full',
        )}
        aria-label="Mobile menu"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-neutral-90 p-4">
            <Logo size="small" />
            <button
              type="button"
              className="rounded-full p-2 text-neutral-20"
              aria-label="Close menu"
              onClick={() => setIsMenuOpen(false)}
            >
              <X size={20} weight="bold" />
            </button>
          </div>

          <div className="flex flex-1 flex-col gap-2 p-4">
            <Link href="/explore-story" className="rounded-lg px-2 py-3 text-base font-medium leading-5 text-neutral-20" onClick={() => setIsMenuOpen(false)}>
              Những câu chuyện
            </Link>
            <Link href="/explore-story" className="rounded-lg px-2 py-3 text-base font-medium leading-5 text-neutral-20" onClick={() => setIsMenuOpen(false)}>
              Góc hỏi-đáp
            </Link>
            <Link href="/explore-story" className="rounded-lg px-2 py-3 text-base font-medium leading-5 text-neutral-20" onClick={() => setIsMenuOpen(false)}>
              Về Hulib
            </Link>

            <div className="flex flex-col gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => window.location.href = '/auth/login'}
              >
                {t('log_in')}
              </Button>
              <Button
                variant="fill"
                size="sm"
                className="w-full"
                onClick={() => window.location.href = '/auth/register'}
              >
                {t('register')}
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function HomeTemplateInner({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const isAuthenticated = !!session;

  const { data: personalInfo } = useGetPersonalInfoQuery(undefined, {
    skip: !isAuthenticated,
  });

  useEffect(() => {
    if (personalInfo) {
      dispatch(setUserInfo(personalInfo));
      dispatch(setAvatarUrl(personalInfo.photo));
    }
  }, [personalInfo, dispatch]);

  if (isAuthenticated) {
    return (
      <div className={mergeClassnames(poppins.className, 'relative antialiased h-screen flex flex-col')}>
        <div className="flex size-full flex-col">
          <Header />
          <main className={mergeClassnames('flex-1 bg-neutral-98', !pathname.includes('messages') && 'overflow-y-auto')}>
            <div className={mergeClassnames('bg-neutral-98', pathname.includes('messages') ? 'h-full' : 'min-h-[calc(100vh-410px)]')}>
              {children}
            </div>
            {!pathname.includes('messages') && <FooterWebApp />}
          </main>
          {!pathname.includes('messages') && <MessengerWidget />}
        </div>
        <CustomToastifyContainer />
      </div>
    );
  }

  return (
    <div className={mergeClassnames(poppins.className, 'relative antialiased min-h-screen flex flex-col')}>
      <PublicHeader />
      <main className="flex-1 bg-neutral-98 pt-14 lg:pt-16">
        <div className="min-h-[calc(100vh-410px)]">
          {children}
        </div>
        <FooterWebApp />
      </main>
      <CustomToastifyContainer />
    </div>
  );
}

export default function HomeTemplate({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <HomeTemplateInner>
        {children}
      </HomeTemplateInner>
    </SessionProvider>
  );
}
