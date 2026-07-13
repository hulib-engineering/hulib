'use client';

import { useLocale } from 'next-intl';
import Image from 'next/image';

export default function Banner() {
  const locale = useLocale();

  return (
    <div className="relative left-1/2 -mt-4 mb-2 flex w-screen items-center justify-center -translate-x-1/2 sm:-mt-6 sm:mb-3 md:-mt-8 md:mb-4">
      <div className="relative aspect-[430/94] w-full overflow-hidden md:hidden">
        <Image
          src={locale === 'vi' ? '/assets/images/banners/banner-mb.jpg' : '/assets/images/banners/banner_mb_en.svg'}
          alt="Home Banner Mobile"
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
      </div>

      <div className="relative hidden aspect-[1440/176] h-fit w-full overflow-hidden md:block">
        <Image
          src={locale === 'vi' ? '/assets/images/banners/Banner.svg' : '/assets/images/banners/banner_en.svg'}
          alt="Home Banner"
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
      </div>
    </div>
  );
}
