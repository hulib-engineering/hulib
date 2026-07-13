'use client';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function Herobanner() {
  const t = useTranslations('Huber');

  return (
    <div className="relative flex
      min-h-[160px] items-center
      overflow-hidden bg-[#EEF2FF]
      max-[370px]:min-h-[200px] sm:rounded-2xl "
    >
      {/* 1. Mascot */}
      <div className="relative z-10 mr-8 aspect-[195/130] w-[300px] shrink-0 max-md:right-20
        max-sm:hidden"
      >
        <Image
          src="/assets/images/register-huber/huber.png"
          alt="Mascot"
          fill
          sizes="100vw"
          className="mt-7 object-cover object-center"
          priority
        />
      </div>

      <div className="pointer-events-none absolute inset-0
        flex items-center justify-center
        gap-3 sm:justify-end min-[1200px]:justify-center "
      >
        {/* 2. Text Content */}
        <div className="flex flex-col gap-3 text-center sm:w-80 min-[950px]:w-[460px]">
          {/* 2.1 Upper text + Icon */}
          <h2 className=" text-xl font-medium leading-7 text-black">
            {/* 2.1.1 Upper text */}
            {t('hero_title')}

            {/* 2.1.2 Mini book icon */}
            <Image
              src="/assets/images/register-huber/mini_book.png"
              alt="mini-book"
              width={20}
              height={20}
              className="ml-1 inline-block"
            />
          </h2>

          {/* 2.2 Lower text */}
          <p className="text-base leading-5 text-[#45484A]">
            {t('hero_description')}
          </p>
        </div>
      </div>
    </div>
  );
}
