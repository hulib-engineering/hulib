'use client';

import Link from 'next/link';
import { getSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { Logo } from '@/components/Logo';
import { mergeClassnames } from '@/components/core/private/utils';

const Header = () => {
  const t = useTranslations('Header');
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const checkSession = async () => {
      const sessionData = await getSession();

      setSession(sessionData);
    };

    checkSession();
  }, []);

  return (
    <header
      className={mergeClassnames(
        'fixed top-0 z-[999] w-full bg-[#f1f4f9bf] backdrop-blur-[50px]',
        'w-screen h-[96px]',
      )}
    >
      <div
        className={mergeClassnames(
          'max-w-xs mx-auto p-4 flex w-full items-center justify-between gap-6',
          'lg:flex-row lg:gap-0 lg:px-[90px] md:max-w-screen-xxl xl:py-0 h-full',
        )}
      >
        <div className="relative hidden flex-1 grow items-start sm:flex">
          <Link href={session ? '/home' : '/'}>
            <Logo />
          </Link>
        </div>
        <div className="relative flex flex-1 grow items-start sm:hidden">
          <Link href={session ? '/home' : '/'}>
            <Logo size="small" />
          </Link>
        </div>
        <div className="relative flex items-center justify-end gap-6">
          <LocaleSwitcher className="shrink" />
          <Link
            href="#newsletter"
            className={mergeClassnames(
              'md:flex items-center justify-center !flex-[0_0_auto] gap-1 rounded-full border-2 border-lp-primary-blue px-8 py-3 hidden',
              'hover:bg-light',
            )}
          >
            <p className="text-base font-medium uppercase leading-normal text-lp-primary-blue">
              {t('contact_us')}
            </p>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
