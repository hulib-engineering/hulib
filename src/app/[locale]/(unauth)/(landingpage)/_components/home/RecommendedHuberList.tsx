'use client';

import { CaretCircleRight, CaretLeft, CaretRight } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import type { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import React, { useRef } from 'react';
// Import Swiper styles
import 'swiper/css';

import { RecommendedHuberCard } from './RecommendedHuberCard';
import Button from '@/components/core/button/Button';
import IconButton from '@/components/core/iconButton/IconButton';
import { useGetHubersQuery } from '@/libs/services/modules/huber';
import type { Huber } from '@/libs/services/modules/huber/huberType';

export default function RecommendedHuberList() {
  const router = useRouter();

  const { data } = useGetHubersQuery({ type: 'recommended' });

  const swiperRef = useRef<SwiperType>();

  if (!data) {
    return undefined;
  }

  return (
    <div className="relative left-1/2 flex w-screen flex-col gap-4 bg-white p-4 -translate-x-1/2 lg:gap-8 lg:bg-transparent lg:p-5 xxl:px-24">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-medium leading-8 text-primary-10 lg:text-4xl lg:leading-[44px]">
          Recommended Hubers
        </h2>
        <Button
          iconLeft={<CaretCircleRight size={20} />}
          variant="ghost"
          size="sm"
          className="text-base font-medium leading-5 text-primary-50"
          onClick={() => router.push('/explore-hubers')}
        >
          Tất cả
        </Button>
      </div>
      <div className="group relative w-full">
        <Swiper
          slidesPerView={2.5}
          spaceBetween={16}
          breakpoints={{
            640: {
              slidesPerView: 4,
              spaceBetween: 40,
            },
            1280: {
              slidesPerView: 6.5,
              spaceBetween: 16,
            },
            1440: {
              slidesPerView: 4.5,
              spaceBetween: 16,
            },
          }}
          loop
          className="w-full !pb-0"
          onSwiper={swiper => (swiperRef.current = swiper)}
        >
          {data.data.map((huber: Huber) => (
            <SwiperSlide key={huber.id}>
              <div className="flex items-center justify-center">
                <RecommendedHuberCard {...huber} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="absolute left-0 top-1/4 z-10 flex w-full justify-between px-1 lg:hidden">
          <IconButton
            variant="soft"
            size="sm"
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <CaretLeft />
          </IconButton>
          <IconButton
            variant="soft"
            size="sm"
            onClick={() => swiperRef.current?.slideNext()}
          >
            <CaretRight />
          </IconButton>
        </div>
        <div className="absolute left-0 top-1/3 z-10 hidden w-full justify-between px-2 translate-y-1/4 lg:group-hover:flex">
          <IconButton
            variant="soft"
            size="lg"
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <CaretLeft />
          </IconButton>
          <IconButton
            variant="soft"
            size="lg"
            onClick={() => swiperRef.current?.slideNext()}
          >
            <CaretRight />
          </IconButton>
        </div>
      </div>
    </div>
  );
}
