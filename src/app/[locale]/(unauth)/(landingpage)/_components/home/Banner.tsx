'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function Banner() {
  const t = useTranslations('Index');

  return (
    <div
      className="relative left-1/2 -mt-4 flex w-screen items-stretch justify-between overflow-hidden -translate-x-1/2 sm:-mt-6 md:-mt-8 lg:max-h-44"
      style={{ background: 'linear-gradient(90.01deg, #0442BF 0.63%, #0442BF 50.64%, #0F2E6C 99.99%)' }}
    >
      <div className="flex flex-1 flex-col justify-center gap-1.5 py-4 pl-4 sm:gap-2 sm:pl-8 md:gap-3 md:py-6 md:pl-12 lg:pl-16 xl:max-w-[60%] xl:pl-20">
        <h2 className="text-sm font-medium leading-snug text-white sm:text-base md:text-2xl">
          {t('banner_title')}
        </h2>
        <p className="max-w-[90%] leading-relaxed text-white/90 max-md:text-xs">
          {t('banner_description')}
        </p>
      </div>

      <Image
        src="/assets/images/banners/mascot.png"
        alt=""
        width={300}
        height={340}
        className="mr-4 h-28 w-auto self-end sm:mr-6 md:mr-10 md:mt-8 md:h-[175px] md:self-center lg:mr-14 lg:h-[195px] xl:mr-20 xl:h-[280px]"
        priority
        aria-hidden="true"
      />
    </div>
  );
}
