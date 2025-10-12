'use client';

import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import type { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import React, { useRef } from 'react';
// Import Swiper styles
import 'swiper/css';

import Button from '@/components/core/button/Button';
import IconButton from '@/components/core/iconButton/IconButton';
import { RecommendedHuberCard } from '@/components/hubers/RecommendedHuberCard';
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
    <div className="flex flex-col gap-4 bg-white p-4 lg:gap-8 lg:bg-transparent lg:p-5">
      <h2 className="text-2xl font-medium leading-8 text-primary-10 lg:text-4xl lg:leading-[44px]">
        Recommended Hubers
      </h2>
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
          }}
          loop
          className="w-full"
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
            variant="secondary"
            size="sm"
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <CaretLeft />
          </IconButton>
          <IconButton
            variant="secondary"
            size="sm"
            onClick={() => swiperRef.current?.slideNext()}
          >
            <CaretRight />
          </IconButton>
        </div>
        <div className="absolute left-0 top-1/2 z-10 hidden w-full justify-between px-2 translate-y-1/4 lg:group-hover:flex">
          <IconButton
            variant="secondary"
            size="lg"
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <CaretLeft />
          </IconButton>
          <IconButton
            variant="secondary"
            size="lg"
            onClick={() => swiperRef.current?.slideNext()}
          >
            <CaretRight />
          </IconButton>
        </div>
      </div>
      <Button
        variant="secondary"
        size="sm"
        className="lg:hidden"
        onClick={() => router.push('/explore-hubers')}
      >
        Explore all Hubers
      </Button>
      <Button
        variant="secondary"
        size="lg"
        className="hidden lg:flex"
        onClick={() => router.push('/explore-hubers')}
      >
        Explore all Hubers
      </Button>
    </div>
  );
};
