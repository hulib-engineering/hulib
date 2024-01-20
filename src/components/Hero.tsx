'use client';

import Image from 'next/image';
import React from 'react';

const Hero = () => {
  return (
    <section className="flex flex-col items-center justify-center gap-[2rem] self-stretch p-[2rem_5.625rem_12rem_5.625rem]">
      <div className="flex w-[48rem] flex-col items-center gap-6 pb-3">
        <div className="flex flex-col items-center gap-4 self-stretch">
          <p className="!my-0 self-stretch text-center text-lg font-medium uppercase leading-[1.6875rem] text-[#0061EF]">
            a Social project
          </p>
          <h1 className="w-[41.3125rem] text-center text-[5rem] font-semibold leading-normal text-[#002254]">
            We Are Here To Support You
          </h1>
          <p className="!my-0 self-stretch text-center text-2xl font-light leading-9 text-[#002254] opacity-50">
            There is a story and experience within each of us, so we are born to
            be somebody.
          </p>
        </div>
        <div className="flex flex-col items-center gap-[0.625rem]">
          <button
            type="button"
            className="flex h-12 items-center justify-center gap-1 rounded-[2rem] bg-[#0061EF] px-8 py-3"
          >
            <p className="!my-0 text-base font-medium leading-6 text-white">
              LEARN MORE
            </p>
            <Image
              width={24}
              height={24}
              src="/assets/icons/Download-icon.svg"
              alt="Download-icon"
            />
          </button>
        </div>
      </div>
      <div className="relative h-[27.75rem] w-[78.75rem]">
        <div className="relative flex h-[31.9375rem] w-[77.9375rem] shrink-0 justify-center ">
          <Image
            width={800}
            height={500}
            alt="Hero Artwork"
            src="/assets/images/Hero-artwork.png"
            className=" shrink-0"
            loading="lazy"
          />
          <Image
            width={70}
            height={70}
            alt="Hero Star 1"
            src="/assets/icons/hero/Hero-star.svg"
            className="absolute right-28 top-60 shrink-0"
          />
          <Image
            width={35}
            height={35}
            alt="Hero Star 2"
            src="/assets/icons/hero/Hero-star.svg"
            className="absolute right-16 top-[26rem] shrink-0"
          />
          <Image
            width={35}
            height={35}
            alt="Hero Star 3"
            src="/assets/icons/hero/Hero-star.svg"
            className="absolute left-60 top-24 shrink-0"
          />
          <Image
            width={57}
            height={75}
            alt="Hero Vector 1"
            src="/assets/icons/hero/Hero-vector1.svg"
            className="absolute left-0 top-[22rem] shrink-0"
          />
          <Image
            width={49}
            height={65}
            alt="Hero Vector 2"
            src="/assets/icons/hero/Hero-vector2.svg"
            className="absolute right-0 top-20 shrink-0"
          />
          <Image
            width={36}
            height={53}
            alt="Hero Vector 3"
            src="/assets/icons/hero/Hero-vector3.svg"
            className="absolute left-32 top-40 shrink-0"
          />
        </div>
        <p className="absolute right-0 !my-0 w-[13.5rem] text-right text-base font-normal leading-normal text-[#002254]">
          “You are <span className="font-bold">not alone</span> in your
          <span className="font-bold"> struggles</span>.”
        </p>
        <p className=" !my-0 w-[17rem] text-base font-normal leading-normal text-[#002254]">
          “There is <span className="font-bold">a crack</span> in everything,
          that’s how <span className="font-bold">the light</span> gets in.”
        </p>
        <div className="absolute right-[4rem] top-44 flex w-[16.75rem] flex-col items-start justify-center gap-3 rounded-2xl bg-[#eaeaea4d] px-5 py-3 shadow-[0_8px_24px_0_rgba(0,0,0,0.08)] backdrop-blur-[25px]">
          <div className=" flex items-center gap-2 self-stretch">
            <Image
              onClick={() => console.log('clicked')}
              width={56}
              height={56}
              alt="Play-icon"
              src="/assets/icons/Play-circle.svg"
              className="cursor-pointer"
            />
            <Image
              width={164}
              height={46}
              src="/assets/icons/Play-timeline.svg"
              alt="Play-timeline"
            />
          </div>
        </div>
        <div
          id="shining"
          className="absolute left-6 top-24 inline-flex h-20 w-[15.5rem] flex-col gap-3 overflow-hidden rounded-lg bg-[#ffffff4d] p-4 shadow-[0_8px_24px_0_rgba(0,0,0,0.08)] backdrop-blur-[20px]"
        >
          <div className="relative flex flex-col items-start gap-1">
            <Image
              width={72}
              height={24}
              src="/assets/icons/hero/Hero-mentors.svg"
              alt="Hero-mentors"
            />
            <p className="!my-0 text-base font-black leading-normal text-[#24272C]">
              200+ <span className="font-normal">Experienced Mentors</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
