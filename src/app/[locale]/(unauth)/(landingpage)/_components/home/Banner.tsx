'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function Banner() {
  const t = useTranslations('Index');

  return (
    <div className="relative left-1/2 -mt-4 w-screen overflow-hidden -translate-x-1/2 sm:-mt-6 md:-mt-8">
      <Image
        src="/assets/images/banners/banner_mb.png"
        alt=""
        fill
        className="h-fit object-cover object-right md:hidden"
        sizes="100vw"
        priority
        aria-hidden="true"
      />
      <Image
        src="/assets/images/banners/banner.png"
        alt=""
        fill
        className="hidden h-fit object-cover object-right md:block"
        sizes="100vw"
        priority
        aria-hidden="true"
      />
      <div className="relative z-10 flex max-w-[62%] flex-col justify-center gap-1.5 py-5 pl-5 sm:max-w-[65%] sm:gap-2 sm:py-6 sm:pl-8 md:max-w-[60%] md:gap-3 md:py-7 md:pl-12 lg:pl-16 xl:max-w-[50%] xl:pl-20">
        <h2 className="text-sm font-bold leading-snug text-white sm:text-base md:text-xl lg:text-2xl xl:text-[1.75rem]">
          {t('banner_title')}
        </h2>
        <p className="text-xs leading-relaxed text-white/90 md:text-sm">
          {t('banner_description')}
        </p>
      </div>
    </div>
  );
}
