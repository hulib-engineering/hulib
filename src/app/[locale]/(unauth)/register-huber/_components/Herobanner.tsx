'use client';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function Herobanner() {
  const t = useTranslations('RegisterHuber');
  return (
    <div className="relative mb-8 flex min-h-[140px] items-center overflow-hidden rounded-2xl bg-[#EEF2FF] px-8 pt-6">
      {/* Mascot */}
      <div className="relative z-10 mr-8 aspect-[195/130] w-[300px] shrink-0">
        <Image
          src="/assets/images/register-huber/huber.png"
          alt={t('mascot_alt')}
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
      </div>

      {/* Text */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-8">
        <div className="mb-[10px] flex items-center justify-center">
          <h2 className="m-0 mr-[8px] text-center text-[20px] font-[500] leading-[28px] text-black">
            {t('guide_title')}
          </h2>
          <Image src="/assets/images/register-huber/mini_book.png" alt="mini-book" width={20} height={20} />
        </div>
        <p className="w-[460px] text-center text-[16px] leading-[20px] text-[#45484A]">
          {t('guide_description')}
        </p>
      </div>
    </div>
  );
}
