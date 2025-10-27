'use client';

import Image from 'next/image';
import React, { useRef } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';
import { Mousewheel } from 'swiper/modules';
import IconButton from '@/components/core/iconButton/IconButton';
import Button from '@/components/core/button/Button';

export default function OutstandingFeatures() {
  // const t = useTranslations('Index');

  const swiperRef = useRef<SwiperType>();

  // const [isDetailStoryShown, setIsDetailStoryShown] = useState(false);

  return (
    <section className="relative mx-auto flex w-full flex-col items-center justify-center gap-[90px] px-4 text-slate-1000 sm:py-[100px] lg:max-w-7xl lg:px-0">
      <div className="absolute bottom-[-46px] left-1/2 size-[300px] rounded-full bg-gradient-to-r from-[#6c95ff] to-[#ff9bef] opacity-30 blur-[100px] -translate-x-1/2" />
      <div className="flex w-full flex-col gap-3 text-center">
        <p className="text-xs font-semibold uppercase text-lp-primary-blue sm:text-lg">
          ngôi nhà của chúng tớ
        </p>
        <h1 className="text-[1.75rem] font-medium sm:text-[3.5rem]">
          HULIB - Nền tảng kết nối trực tuyến
        </h1>
      </div>
      <div className="mx-auto flex w-full flex-col gap-12 lg:max-w-[800px]">
        <div className="relative size-full">
          <div className="w-full rounded-2xl border-[10px] border-[#373737]">
            <Swiper
              spaceBetween={8}
              loop
              mousewheel
              modules={[Mousewheel]}
              onSwiper={swiper => (swiperRef.current = swiper)}
            >
              {Array.from({ length: 4 }, (_, i) => i + 1).map(each => (
                <SwiperSlide key={each}>
                  <Image
                    src={`/assets/images/feature-ss-${each}.png`}
                    alt={`Outstanding Feature ${each}`}
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
            className="absolute -left-20 top-1/2 h-12 bg-white text-2xl text-lp-primary-blue -translate-y-1/2 hover:bg-[#D9E6FD]"
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <ArrowLeft />
          </IconButton>
          <IconButton
            variant="secondary"
            size="lg"
            className="absolute -right-20 top-1/2 h-12 bg-white text-2xl text-lp-primary-blue -translate-y-1/2 hover:bg-[#D9E6FD]"
            onClick={() => swiperRef.current?.slideNext()}
          >
            <ArrowRight />
          </IconButton>
        </div>
        <div className="flex w-full flex-col gap-5 rounded-[2rem] bg-white/50 p-4 outline outline-4 outline-offset-[-4px] outline-white backdrop-blur-[100px]">
          <div className="flex flex-col gap-2 text-center">
            <h6 className="text-xl font-bold leading-tight text-primary-50">Kho tàng sách sống trực tuyến</h6>
            <p className="text-lg text-[#212121]">
              Tại Hulib, chúng mình có hơn 200 quyển sách được viết ra từ chính những trải nghiệm, câu chuyện của những anh chị đi trước, từng trải.
            </p>
          </div>
          <Button size="lg" className="bg-lp-primary-blue hover:bg-primary-hover">
            Trải nghiệm ngay
          </Button>
        </div>
      </div>
    </section>
  );
};
