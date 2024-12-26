'use client';

import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { publicRoutes } from '@/libs/constants';

const HumanBookBanner = () => {
  const t = useTranslations('HumanBookBanner');
  return (
    <div className="relative mt-5 flex h-16 bg-primary-40 px-12">
      <div className="mx-auto flex w-full flex-row items-center justify-between px-3 py-8 sm:w-3/4 lg:max-w-7xl">
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
        />
        <div className="flex flex-row gap-4">
          <Link
            href={publicRoutes.LOGIN}
            className="flex cursor-pointer items-center justify-center rounded-full bg-transparent px-4 py-2 text-center text-xs font-medium leading-4 text-white underline hover:opacity-70"
          >
            {t('log_in')}
          </Link>
          <Link
            href={publicRoutes.REGISTER}
            className="flex cursor-pointer items-center justify-center rounded-full bg-white px-4 py-2 text-xs font-medium leading-4 text-primary-60 hover:opacity-70"
          >
            {t('sign_up')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HumanBookBanner;
