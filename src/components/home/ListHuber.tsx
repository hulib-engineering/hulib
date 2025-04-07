/* eslint-disable @typescript-eslint/no-shadow */

'use client';

import { CaretLeft, CaretRight } from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React from 'react';

import Button from '../button/Button';

const baseHubers = [
  {
    name: 'Tran Thanh Thao',
    role: 'Professor',
    topics: 20,
    rating: 4.2,
    image: '/assets/images/recommended-huber.jfif',
    id: 0,
  },
  {
    name: 'Tran Huynh Manh',
    role: 'CEO of Company',
    topics: 20,
    rating: 4.2,
    image: '/assets/images/recommended-huber.jfif',
    id: 1,
  },
  {
    name: 'Huynh Ngoc',
    role: 'Marketer',
    topics: 20,
    rating: 4.2,
    image: '/assets/images/recommended-huber.jfif',
    id: 2,
  },
];
const hubers = [...baseHubers, ...baseHubers, ...baseHubers];

const ListHubers = () => {
  const t = useTranslations('Home');
  const router = useRouter();
  const scrollContainerRef = React.useRef<any>(null);

  const smoothScroll = (
    element: HTMLElement,
    distance: number,
    duration: number,
  ) => {
    const start = element.scrollLeft;
    let startTime: number | null = null;

    const easeOutQuad = (t: number) => t * (2 - t);

    const animation = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const easedProgress = easeOutQuad(progress);

      element.scrollLeft = start + distance * easedProgress;

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  };

  const scroll = (direction: string) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      smoothScroll(
        scrollContainerRef.current,
        direction === 'left' ? -scrollAmount : scrollAmount,
        500,
      );
    }
  };

  return (
    <div className="relative mt-4 w-full">
      <div className="absolute left-0 top-1/2 z-10 -translate-y-1/2">
        <Button
          variant="secondary"
          onClick={() => scroll('left')}
          iconOnly
          className="size-11 hover:!bg-primary-90"
          shouldHover={false}
        >
          <CaretLeft />
        </Button>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-hidden px-8 pb-4"
      >
        {hubers.map((huber, index) => (
          <div key={index} className="w-48 flex-none">
            <div className="overflow-hidden rounded-lg">
              <Image
                src={huber.image}
                alt={huber.name}
                width={160}
                height={160}
                className="size-[10rem] rounded-lg"
              />
            </div>
            <div className="mt-2">
              <h3 className="text-base font-bold leading-6 text-primary-10">
                {huber.name}
              </h3>
              <p className="my-1 text-sm font-normal text-neutral-30">
                {huber.role}
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <span className="text-xs leading-[0.875rem] text-neutral-20">
                  {`${huber.topics}`}{' '}
                  <span className="text-[0.625rem] leading-3 text-neutral-40">
                    Topics
                  </span>
                </span>
                <span className="ml-3 flex flex-row items-center justify-center gap-1">
                  <Image
                    width={16}
                    height={16}
                    src="/assets/images/yellow-heart.svg"
                    alt="Yellow Heart"
                  />
                  <span className="text-xs leading-[0.875rem] text-neutral-20">
                    {huber.rating}
                  </span>
                  <span className="text-[0.625rem] leading-3 text-neutral-40">
                    Ratings
                  </span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute right-0 top-1/2 z-10 -translate-y-1/2">
        <Button
          variant="secondary"
          onClick={() => scroll('right')}
          iconOnly
          className="size-11 hover:!bg-primary-90"
          shouldHover={false}
        >
          <CaretRight />
        </Button>
      </div>

      <div className="mt-5 w-full">
        <Button
          variant="secondary"
          onClick={() => router.push('/explore-huber')}
          className="w-full"
          shouldHover={false}
        >
          {t('explore_stories.btn3')}
        </Button>
      </div>
    </div>
  );
};

export default ListHubers;
