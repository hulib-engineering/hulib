'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import React from 'react';

const Banner = () => {
  const t = useTranslations('Home');
  return (
    <div className="relative h-full w-full rounded-lg">
      <div className="absolute inset-0 rounded-lg bg-gradient-to-b" />
      <Image
        src="/assets/images/home-banner.png"
        width={0}
        height={0}
        sizes="100vw"
        className="h-[8rem] w-full rounded-lg object-cover md:h-full"
        alt="Home Banner"
      />
      <div className="absolute left-8 top-1/2 -translate-y-1/2">
        <div className="flex flex-col gap-0 md:gap-2">
          <h3 className="text-base font-medium leading-[1.6rem] text-primary-30 md:text-[2.5rem] md:leading-[3rem]">
            {t('banner.title')}
          </h3>
          <p className="w-[16rem] text-sm font-medium leading-6 text-primary-30 md:w-[27.5rem] md:text-2xl md:leading-8">
            {t('banner.sub_title')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Banner;
