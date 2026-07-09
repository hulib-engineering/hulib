'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function Banner() {
  const t = useTranslations('Banner');

  return (
    <div className="relative left-1/2 -mt-4 mb-2 flex w-screen items-center justify-center -translate-x-1/2 sm:-mt-6 sm:mb-3 md:-mt-8 md:mb-4">
      {/* Mobile Banner */}
      <div className="relative aspect-[430/94] w-full overflow-hidden md:hidden">
        <Image
          src="/assets/images/banners/banner-mb.jpg"
          alt={t('mobile_alt')}
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
      </div>

      {/* Desktop Banner */}
      <div className="relative hidden aspect-[1440/176] h-fit w-full overflow-hidden md:block">
        <Image
          src="/assets/images/banners/Banner.svg"
          alt={t('desktop_alt')}
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
      </div>
    </div>
  );
}
