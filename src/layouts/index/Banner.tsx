'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import React from 'react';

import { mergeClassnames } from '@/components/core/private/utils';

export default function Banner() {
  const t = useTranslations('Home');

  return (
    <div className="relative size-full md:rounded-2xl">
      <Image
        src="/assets/images/banner-mb.svg"
        width={686}
        height={320}
        className="size-full object-cover md:hidden"
        alt="Home Banner"
      />
      {/* Desktop Image */}
      <Image
        src="/assets/images/pc-home-banner.jpg"
        width={686}
        height={320}
        className="hidden h-80 w-full rounded-2xl object-cover md:block"
        alt="Home Banner"
      />

      <div
        className={mergeClassnames(
          'absolute bottom-0 left-0 h-[140px] w-full bg-gradient-to-b from-transparent to-[#F9F9F9]',
          'md:h-52 md:rounded-2xl',
        )}
      />

      <div className="absolute bottom-0 left-0 md:top-1/2 md:-translate-y-1/2">
        <div className="flex flex-col p-4 md:gap-2 md:p-8">
          <h1 className="font-medium leading-[1.6rem] text-primary-30 md:text-[2.5rem] md:leading-[3rem]">
            {t('banner.title')}
          </h1>
          <h5 className="w-64 text-sm font-medium leading-6 text-primary-30 md:w-[27.5rem] md:text-2xl md:leading-8">
            {t('banner.sub_title')}
          </h5>
        </div>
      </div>
    </div>
  );
};
