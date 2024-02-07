'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import React from 'react';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

const SponsorList = [
  { name: 'Momo', logoUrl: '/assets/images/sponsors/sponsor-0.png' },
  { name: 'MOMO', logoUrl: '/assets/images/sponsors/sponsor-1.png' },
  { name: 'Momo', logoUrl: '/assets/images/sponsors/sponsor-2.png' },
  { name: 'Momo', logoUrl: '/assets/images/sponsors/sponsor-3.png' },
  { name: 'Momo', logoUrl: '/assets/images/sponsors/sponsor-4.png' },
  { name: 'Momo', logoUrl: '/assets/images/sponsors/sponsor-5.png' },
  { name: 'Momo', logoUrl: '/assets/images/sponsors/sponsor-6.png' },
  { name: 'Momo', logoUrl: '/assets/images/sponsors/sponsor-7.png' },
];
const Sponsors = () => {
  const t = useTranslations('Index');
  return (
    <section className="flex w-full flex-col items-center gap-12 overflow-hidden py-3 text-slate-1000 md:py-[5.625rem]">
      {/* <div className="flex flex-col items-center self-stretch"> */}
      <h1 className="text-center text-[1.75rem] font-semibold uppercase md:text-5xl md:font-bold">
        {t('sponsors_title')}
      </h1>
      <div className="flex w-screen items-center justify-center">
        <Swiper
          // spaceBetween={120}
          // slidesPerView={8}
          loop
          centeredSlides
          modules={[Autoplay]}
          autoplay={{
            delay: 2500,
            disableOnInteraction: true,
          }}
        >
          {SponsorList.map((each, index) => (
            <SwiperSlide key={index}>
              <div className="relative h-20 w-[9.375rem] rounded-full bg-white">
                <Image
                  src={each.logoUrl}
                  alt={each.name}
                  fill
                  className="object-contain object-center"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      {/* </div> */}
      {/* <div className="group overflow-hidden whitespace-nowrap"> */}
      {/*  <div className="inline-block min-w-fit max-w-screen-lg animate-slide overflow-hidden py-4 group-hover:[animation-play-state:paused]"> */}
      {/*    {SponsorsLogo.map((each, index) => ( */}
      {/*      <div key={index} className="mx-4 inline-block lg:mx-16"> */}
      {/*        <Image */}
      {/*          alt={each.name} */}
      {/*          width={145} */}
      {/*          height={145} */}
      {/*          src={each.logoUrl} */}
      {/*        /> */}
      {/*      </div> */}
      {/*    ))} */}
      {/*  </div> */}
      {/*  <div className="inline-block min-w-fit animate-slide overflow-hidden py-4 group-hover:[animation-play-state:paused]"> */}
      {/*    {SponsorsLogo.map((each, index) => ( */}
      {/*      <div key={index} className="mx-4 inline-block lg:mx-16"> */}
      {/*        <Image */}
      {/*          alt={each.name} */}
      {/*          width={145} */}
      {/*          height={145} */}
      {/*          src={each.logoUrl} */}
      {/*        /> */}
      {/*      </div> */}
      {/*    ))} */}
      {/*  </div> */}
      {/* </div> */}
    </section>
  );
};

export default Sponsors;
