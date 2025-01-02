'use client';

import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { mergeClassnames } from '@/components/private/utils';
import { publicRoutes } from '@/libs/constants';

const HumanBookBanner = () => {
  const t = useTranslations('HumanBookBanner');

  return (
    // eslint-disable-next-line tailwindcss/no-contradicting-classname
    <div className="relative mt-[18px] flex animate-flashing items-center justify-center bg-[linear-gradient(120deg,_#0442bf_30%,_#0858fa80_38%,_#0858fa80_40%,_#0442bf_48%)] bg-[length:200%_100%] bg-right-top px-12 sm:px-[1.875rem] lg:px-12 2xl:px-28">
      <div
        className={mergeClassnames(
          'mx-auto flex w-full flex-col items-center justify-between px-3 sm:w-3/4 lg:max-w-7xl gap-6',
          'lg:flex-row lg:gap-0',
        )}
      >
        <div className="flex flex-row items-center gap-3">
          <Link
            href={publicRoutes.LOGIN}
            className="cursor-pointer text-xl font-medium text-white hover:opacity-70"
          >
            {t('explore_now')}
          </Link>
          <ArrowRight size={20} color="#fff" />
        </div>
        <Image
          src="/assets/images/banner.png"
          alt="banner"
          width={404}
          height={64}
          className="shrink-0"
        />
        <div className="flex flex-row gap-4">
          <Link
            href={publicRoutes.LOGIN}
            className="flex cursor-pointer items-center justify-center whitespace-nowrap rounded-full bg-transparent px-4 py-2 text-center text-xs font-medium leading-4 text-white underline hover:opacity-70"
          >
            {t('log_in')}
          </Link>
          <Link
            href={publicRoutes.REGISTER}
            className="flex cursor-pointer items-center justify-center whitespace-nowrap rounded-full bg-white px-4 py-2 text-xs font-medium leading-4 text-primary-60 hover:opacity-70"
          >
            {t('sign_up')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HumanBookBanner;
