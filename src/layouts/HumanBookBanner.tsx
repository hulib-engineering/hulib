'use client';

import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';
import Link from 'next/link';
import type { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { mergeClassnames } from '@/components/private/utils';
import { publicRoutes } from '@/libs/constants';

const HumanBookBanner = () => {
  const t = useTranslations('HumanBookBanner');

  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    const checkSession = async () => {
      const sessionData = await getSession();

      setSession(sessionData);
    };

    checkSession();
  }, []);

  return (
    // eslint-disable-next-line tailwindcss/no-contradicting-classname
    <div className="relative animate-flashing bg-[linear-gradient(120deg,_#0442bf_30%,_#0858fa80_38%,_#0858fa80_40%,_#0442bf_48%)] bg-[length:200%_100%] bg-right-top">
      <div
        className={mergeClassnames(
          'max-w-xs mx-auto flex w-full flex-col items-center justify-between gap-6 py-2',
          'lg:flex-row lg:gap-0 lg:px-[90px] lg:max-w-screen-xxl lg:py-0',
        )}
      >
        <div className="flex flex-row items-center gap-3">
          <div className="cursor-pointer text-xl font-medium text-white hover:opacity-70">
            {t('explore_now')}
          </div>

          <Link href={session?.user?.name ? '/home' : publicRoutes.LOGIN}>
            <ArrowRight size={20} color="#fff" />
          </Link>
        </div>
        <div className="hidden shrink-0 lg:block">
          <Image
            src="/assets/images/banner.png"
            alt="banner"
            width={404}
            height={64}
          />
        </div>

        {!session?.user?.name && (
          <div className="flex w-full max-w-[288px] flex-row-reverse gap-4 md:flex-row">
            <Link
              href={publicRoutes.LOGIN}
              className="flex cursor-pointer items-center justify-center whitespace-nowrap rounded-full bg-transparent px-4 py-2 text-center text-xs font-medium leading-4 text-white underline hover:opacity-70"
            >
              {t('log_in')}
            </Link>
            <Link
              href={publicRoutes.REGISTER}
              className="flex-1 cursor-pointer items-center justify-center whitespace-nowrap rounded-full bg-white px-4 py-2 text-center text-xs font-medium leading-4 text-primary-60 hover:opacity-70"
            >
              {t('sign_up')}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default HumanBookBanner;
