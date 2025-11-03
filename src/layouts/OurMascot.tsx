import Image from 'next/image';
import { useTranslations } from 'next-intl';
import React from 'react';

import {
  highlightMessage,
  italicMessage,
  newLineMessage,
} from '@/utils/i18NRichTextUtils';

export default function OurMascot() {
  const t = useTranslations('Index');

  return (
    <section className="relative mx-auto flex w-full flex-col items-center justify-center gap-6 px-4 py-3 text-slate-1000 lg:max-w-7xl lg:gap-[90px] lg:px-0 lg:py-[100px]">
      <div className="flex w-full flex-col gap-3 text-center">
        <p className="text-xs font-semibold uppercase text-lp-primary-blue sm:text-lg">
          {t('our_mascots_title')}
        </p>
        <h1 className="text-[1.75rem] font-bold sm:text-[3.5rem]">{t('our_mascots_description')}</h1>
      </div>
      <div className="flex w-full items-center justify-center">
        <div className="relative hidden h-[478px] w-[470px] px-2 py-1 lg:block">
          <Image
            src="/assets/images/our-mascots.png"
            alt="Our Mascot Illustration"
            width={462}
            height={462}
            className="absolute inset-0 aspect-square h-auto w-[462px] object-cover"
          />
          <div className="absolute start-full top-1/2 flex w-[301px] flex-col items-center justify-center gap-2 rounded-[20px] border-4 border-white bg-[#FFF7E3] p-4 shadow-[0_12px_24px_0_#E8F99E] backdrop-blur-[50px] -translate-y-1/2">
            <h2 className="text-4xl font-bold uppercase leading-[44px] text-[#BF9534]">liber</h2>
            <p className="text-center text-base font-medium text-[#002254] text-opacity-80">
              {t.rich('our_mascots_libers', {
                i: italicMessage(),
                br: newLineMessage(),
                highlight: highlightMessage(false, 'primary'),
              })}
            </p>
          </div>
          <div className="absolute end-full top-1/2 flex w-[301px] flex-col items-center justify-center gap-2 rounded-[20px] border-4 border-white bg-[#D9E6FD] p-4 shadow-[0_12px_24px_0_#9EC2F9] backdrop-blur-[50px] -translate-x-4 -translate-y-1/2">
            <h2 className="text-4xl font-bold uppercase leading-[44px] text-lp-primary-blue">huber</h2>
            <p className="text-center text-base font-medium text-[#002254] text-opacity-80">
              {t.rich('our_mascots_hubers', {
                i: italicMessage(),
                br: newLineMessage(),
                highlight: highlightMessage(false, 'primary'),
              })}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 lg:hidden">
          <div className="flex w-full flex-col items-center justify-center rounded-[20px] border-4 border-white bg-[#D9E6FD] p-2 shadow-[0_12px_24px_0_#9EC2F940] backdrop-blur-[50px] lg:gap-2 lg:p-4">
            <h2 className="font-bold uppercase leading-loose text-lp-primary-blue lg:text-4xl lg:leading-[44px]">huber</h2>
            <p className="text-center text-sm leading-6 text-[#002254] text-opacity-80 lg:text-base lg:font-medium lg:leading-normal">
              {t.rich('our_mascots_hubers', {
                i: italicMessage(),
                br: newLineMessage(),
                highlight: highlightMessage(false, 'primary'),
              })}
            </p>
          </div>
          <div className="flex w-full items-center justify-center py-1.5">
            <Image
              src="/assets/images/our-mascots.png"
              alt="Our Mascot Illustration"
              width={462}
              height={462}
              className="aspect-square h-auto w-3/4 object-cover object-center"
            />
          </div>
          <div className="flex w-full flex-col items-center justify-center rounded-[20px] border-4 border-white bg-[#FFF7E3] p-2 shadow-[0_12px_24px_0_#E8F99E40] backdrop-blur-[50px] lg:gap-2 lg:p-4">
            <h2 className="font-bold uppercase leading-loose text-[#BF9534] lg:text-4xl lg:leading-[44px]">liber</h2>
            <p className="text-center text-sm leading-6 text-[#002254] text-opacity-80 lg:text-base lg:font-medium lg:leading-normal">
              {t.rich('our_mascots_libers', {
                i: italicMessage(),
                br: newLineMessage(),
                highlight: highlightMessage(false, 'primary'),
              })}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
