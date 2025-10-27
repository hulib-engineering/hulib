'use client';

import Image from 'next/image';
import React, { useRef } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { CalendarCheck, MapPinLine } from '@phosphor-icons/react';
import { mergeClassnames } from '@/components/core/private/utils';

export default function News() {
  // const t = useTranslations('Index');

  const swiperRef = useRef<SwiperType>();

  const handleSwiperInit = (swiper: SwiperType) => {
    setTimeout(() => {
      if (!swiper || swiper.destroyed) {
        return;
      }
      try {
        if (swiper.params.loop && typeof swiper.loopCreate === 'function') {
          swiper.loopDestroy();
          swiper.loopCreate();
        }
        swiper.update();
        swiper.slideToLoop(1, 0); // 👈 Start from 2nd slide
      } catch (err) {
        console.warn('Swiper init sync issue:', err);
      }
    }, 300);
  };

  return (
    <section className="flex w-full flex-col items-center justify-center gap-8 py-[100px] text-[#002254]">
      <h1 className="text-center text-[1.75rem] font-bold leading-none sm:text-[56px]">
        Sự kiện - tin tức
      </h1>
      <div className="size-full overflow-visible">
        <Swiper
          spaceBetween={32}
          slidesPerView={2.5}
          loop
          centeredSlides
          initialSlide={1} // 👈 Add this too
          // autoHeight
          className="overflow-visible"
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            handleSwiperInit(swiper);
          }}
        >
          {Array.from({ length: 3 }, (_, i) => i + 1).map(each => (
            <SwiperSlide key={each}>
              {({ isActive }) => (
                <div className={mergeClassnames(
                  'mx-4 relative size-full transition-transform duration-500 ease-in-out origin-center',
                  isActive ? 'scale-125 z-10' : 'scale-[70%] opacity-[36%]',
                )}
                >
                  <Image
                    src="/assets/images/news.png"
                    alt={`News ${each}`}
                    width={945}
                    height={630}
                    className="size-full object-cover"
                    priority
                  />
                  <div className="absolute bottom-6 left-0 w-full">
                    <div className="mx-auto flex w-[11/12] flex-col gap-2 rounded-[20px] border-4 border-white bg-white/80 p-4 backdrop-blur-[50px]">
                      <h5 className="text-2xl font-bold leading-8">Sự kiện “Hiểu mình, thương mình”</h5>
                      <div className="flex items-center gap-12">
                        <div className="flex items-center gap-2">
                          <CalendarCheck className="text-2xl" />
                          <span className="text-sm leading-4">18/10/2025</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPinLine className="text-2xl" />
                          <span className="text-sm leading-4">Đà Nẵng, Việt Nam</span>
                        </div>
                      </div>
                      <p>
                        Thứ bảy vừa rồi thật đặc biệt. Một ngày đầy cảm xúc, nơi ai cũng đến với câu chuyện riêng - rồi cùng nhau ngồi lại, lắng nghe và được lắng nghe.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};
