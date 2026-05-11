'use client';

import Image from 'next/image';
import React from 'react';

export default function Banner() {
  return (
    <div className="relative left-1/2 -mt-4 mb-2 flex w-screen items-center justify-center -translate-x-1/2 sm:-mt-6 sm:mb-3 md:-mt-8 md:mb-4">
      {/* Mobile Banner */}
      <div className="relative h-20 w-full sm:hidden">
        <Image
          src="/assets/images/banner-mb.jpg"
          alt="Home Banner Mobile"
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
      </div>

      {/* Desktop Banner */}
      <div className="relative hidden h-[94px] w-full sm:block">
        <Image
          src="/assets/images/banner-new.png"
          alt="Home Banner"
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
      </div>
    </div>
  );
}
