'use client';

import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import React, { useMemo, useRef, useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { Mousewheel } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import Button from '@/components/core/button/Button';
import IconButton from '@/components/core/iconButton/IconButton';

const contentIndexes = ['index_0', 'index_1', 'index_2', 'index_3'] as const;

export default function OutstandingFeatures() {
  const t = useTranslations('Index');

  const swiperRef = useRef<SwiperType>();

  const translations: { heading: string; content: string }[] = useMemo(() => {
    return contentIndexes.map(k => ({
      heading: t(`outstanding_features.${k}.heading` as const),
      content: t(`outstanding_features.${k}.content` as const),
    }));
  }, [t]);

  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const safeIndex = Math.min(Math.max(0, currentSlideIndex), translations.length - 1);

  return (
    <section className="relative mx-auto flex w-full flex-col items-center justify-center gap-6 px-4 py-3 text-slate-1000 lg:max-w-7xl lg:gap-[90px] lg:px-0 lg:py-[100px]">
      <div className="absolute bottom-[-46px] left-1/2 size-[300px] rounded-full bg-gradient-to-r from-[#6c95ff] to-[#ff9bef] opacity-30 blur-[100px] -translate-x-1/2" />
      <div className="flex w-full flex-col gap-3 text-center">
        <p className="text-xs font-semibold uppercase text-lp-primary-blue sm:text-lg">
          {t('outstanding_features_title')}
        </p>
        <h1 className="text-[1.75rem] font-bold sm:text-[3.5rem]">{t('outstanding_features_description')}</h1>
      </div>
      <div className="mx-auto flex w-full flex-col gap-16 lg:max-w-[800px] lg:gap-12">
        <div className="relative size-full">
          <div className="w-full rounded-2xl border-[10px] border-[#373737]">
            <Swiper
              spaceBetween={8}
              loop
              mousewheel
              modules={[Mousewheel]}
              onSwiper={swiper => (swiperRef.current = swiper)}
              onSlideChange={swiper => setCurrentSlideIndex(swiper.realIndex)}
            >
              {contentIndexes.map((each, index) => (
                <SwiperSlide key={each}>
                  <Image
                    src={`/assets/images/feature-ss-${index + 1}.png`}
                    alt={`Outstanding Feature ${index}`}
                    width={800}
                    height={568.9}
                    className="aspect-[45/32] h-auto w-[50rem] object-cover"
                    priority
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <IconButton
            variant="secondary"
            size="lg"
            className="absolute bottom-0 left-1/2 h-12 bg-white text-2xl text-lp-primary-blue translate-x-[-68px] translate-y-14 hover:bg-[#D9E6FD] lg:-left-20 lg:top-1/2 lg:-translate-y-1/2"
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <ArrowLeft />
          </IconButton>
          <IconButton
            variant="secondary"
            size="lg"
            className="absolute bottom-0 right-1/2 h-12 bg-white text-2xl text-lp-primary-blue translate-x-[68px] translate-y-14 hover:bg-[#D9E6FD] lg:-right-20 lg:top-1/2 lg:-translate-y-1/2"
            onClick={() => swiperRef.current?.slideNext()}
          >
            <ArrowRight />
          </IconButton>
        </div>
        <div className="flex w-full flex-col gap-5 rounded-[2rem] bg-white/50 p-4 outline outline-4 outline-offset-[-4px] outline-white backdrop-blur-[100px]">
          <div className="flex flex-col gap-2 text-center">
            <h6 className="font-bold leading-7 text-primary-50 lg:text-xl lg:leading-tight">{translations[safeIndex]?.heading ?? ''}</h6>
            <p className="text-sm leading-loose text-[#212121] lg:text-lg lg:leading-normal">{translations[safeIndex]?.content ?? ''}</p>
          </div>
          <Button size="lg" className="bg-lp-primary-blue hover:bg-primary-hover">
            {t('outstanding_features_cta_button')}
          </Button>
        </div>
      </div>
    </section>
  );
};
