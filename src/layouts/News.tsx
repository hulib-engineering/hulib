'use client';

import { ArrowLeft, ArrowRight, CalendarCheck, MapPinLine } from '@phosphor-icons/react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import React, { useRef } from 'react';

import IconButton from '@/components/core/iconButton/IconButton';
import { mergeClassnames } from '@/components/core/private/utils';
import { newLineMessage } from '@/utils/i18NRichTextUtils';

const NewsAndEvents = [
  { index: 'index_0', date: '18/10/2025', link: 'https://www.facebook.com/share/p/17efkGXzfr' },
  {
    index: 'index_1',
    date: '18 - 19/09/2025',
    link: 'https://www.facebook.com/photo.php?fbid=122226102632058653&set=pb.61551759614724.-2207520000&type=3&locale=vi_VN',
  },
  {
    index: 'index_2',
    date: '14/6/2025',
    link: 'https://www.facebook.com/photo/?fbid=122213856482058653&set=pb.61551759614724.-2207520000&locale=vi_VN',
  },
  { index: 'index_3', date: '22/02 - 23/03/2025', link: 'https://www.facebook.com/share/p/182uL1J1jX' },
  {
    index: 'index_4',
    date: '14/12/2024',
    link: 'https://www.facebook.com/photo.php?fbid=122186787512058653&set=pb.61551759614724.-2207520000&type=3&locale=vi_VN',
  },
  {
    index: 'index_5',
    date: '28/09/2024',
    link: 'https://www.facebook.com/photo.php?fbid=122176139972058653&set=pb.61551759614724.-2207520000&type=3&locale=vi_VN',
  },
] as const;

export default function News() {
  const t = useTranslations('Index');
  const tCommon = useTranslations('Common');

  const swiperRef = useRef<SwiperType>();

  return (
    <section className="flex w-full flex-col items-center justify-center gap-3 py-3 text-[#002254] xl:gap-8 xl:py-[100px]">
      <h1 className="text-center text-[1.75rem] font-bold leading-none sm:text-[56px]">
        {t('news_title')}
      </h1>
      <div className="relative size-full max-w-7xl overflow-visible px-4">
        <Swiper
          spaceBetween={32}
          slidesPerView={1}
          breakpoints={{
            1280: {
              spaceBetween: -84,
              slidesPerView: 1.5,
            },
          }}
          centeredSlides
          loop
          className="overflow-visible"
          onSwiper={swiper => (swiperRef.current = swiper)}
        >
          {NewsAndEvents.map((each, index) => (
            <SwiperSlide key={index} className="flex w-full justify-center overflow-visible">
              {({ isActive }) => (
                <>
                  <Link href={each.link} target="_blank" className="hidden size-full xl:block">
                    <div
                      className={mergeClassnames(
                        'relative size-full rounded-[2rem] overflow-hidden transition-transform duration-500 ease-in-out origin-center',
                        !isActive && 'scale-75 opacity-[36%]',
                      )}
                    >
                      <Image
                        src={`/assets/images/news/news_${index}.jpg`}
                        alt={`News ${index + 1}`}
                        width={945}
                        height={630}
                        className="aspect-[3/2] h-auto w-full bg-neutral-90 object-cover object-top"
                        priority
                      />
                      <div className="absolute bottom-6 w-full px-6">
                        <div className="flex flex-col gap-2 rounded-[20px] border-4 border-white bg-white/80 p-4 backdrop-blur-[50px]">
                          <h5 className="text-2xl font-bold leading-8">{t(`news_info.${each.index}.heading`)}</h5>
                          <div className="flex items-center gap-12">
                            <div className="flex items-center gap-2">
                              <CalendarCheck className="text-2xl" />
                              <span className="text-sm leading-4">{each.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPinLine className="text-2xl" />
                              <span className="text-sm leading-4">{`${tCommon('location')}: ${t(`news_info.${each.index}.location`)}`}</span>
                            </div>
                          </div>
                          <p className="line-clamp-1">
                            {t.rich(`news_info.${each.index}.content`, {
                              br: newLineMessage(),
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className="flex size-full flex-col gap-2 xl:hidden">
                    <Link href={each.link} target="_blank" className="size-full">
                      <Image
                        src={`/assets/images/news/news_${index}.jpg`}
                        alt={`News ${index + 1}`}
                        width={945}
                        height={630}
                        className="aspect-[3/2] h-auto w-full rounded-xl bg-neutral-90 object-cover object-top"
                        priority
                      />
                    </Link>
                    <div className="flex flex-col gap-2 rounded-[20px] border-2 border-white bg-white/80 p-2 outline outline-2 -outline-offset-2 outline-white backdrop-blur-[50px]">
                      <h5 className="align-middle font-bold leading-loose">{t(`news_info.${each.index}.heading`)}</h5>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CalendarCheck />
                          <span className="text-xs leading-4">{each.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPinLine />
                          <span className="text-xs leading-4">
                            {`${tCommon('location')}: ${t(`news_info.${each.index}.location`)}`}
                          </span>
                        </div>
                      </div>
                      <p className="line-clamp-4 align-middle text-sm leading-6">
                        {t.rich(`news_info.${each.index}.content`, {
                          br: newLineMessage(),
                        })}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="pointer-events-none absolute left-0 top-1/2 z-[9999] mx-auto hidden w-full items-center justify-between -translate-y-1/2 xl:flex">
          <div className="pointer-events-auto mx-auto flex w-3/4 items-center justify-between">
            <IconButton
              variant="secondary"
              size="lg"
              className="h-12 bg-white text-2xl text-lp-primary-blue  hover:bg-[#D9E6FD]"
              onClick={() => swiperRef.current?.slidePrev()}
            >
              <ArrowLeft />
            </IconButton>
            <IconButton
              variant="secondary"
              size="lg"
              className=" h-12 bg-white text-2xl text-lp-primary-blue hover:bg-[#D9E6FD]"
              onClick={() => swiperRef.current?.slideNext()}
            >
              <ArrowRight />
            </IconButton>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-4 xl:hidden">
        <IconButton
          variant="secondary"
          size="lg"
          className="h-12 bg-transparent text-2xl text-lp-primary-blue hover:bg-[#D9E6FD]"
          onClick={() => swiperRef.current?.slidePrev()}
        >
          <ArrowLeft weight="bold" />
        </IconButton>
        <IconButton
          variant="secondary"
          size="lg"
          className="h-12 bg-transparent text-2xl text-lp-primary-blue hover:bg-[#D9E6FD]"
          onClick={() => swiperRef.current?.slideNext()}
        >
          <ArrowRight weight="bold" />
        </IconButton>
      </div>
    </section>
  );
};
