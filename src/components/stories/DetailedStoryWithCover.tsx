'use client';

import Image from 'next/image';
import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';

import { Page } from './DetailedStory';

import type { WithChildren } from '@/components/core/private/types';
import { mergeClassnames } from '@/components/core/private/utils';
import { paginateText } from '@/utils/paginateTextUtil';

const PageCoverFront = forwardRef<HTMLDivElement, WithChildren<{}>>((props, ref) => {
  return (
    <div className="size-full rounded bg-default-story-cover bg-cover bg-no-repeat" ref={ref} data-density="hard">
      <div className="flex size-full items-center justify-center">
        <h2>{props.children}</h2>
      </div>
    </div>
  );
});
const PageCoverBack = forwardRef<HTMLDivElement, WithChildren<{}>>((props, ref) => {
  return (
    <div className="size-full rounded bg-[#ffea4e] shadow-[2px_2px_0_0_rgba(0,0,0,0.15)]" ref={ref} data-density="hard">
      <div className="flex size-full items-center justify-center">
        <h2>{props.children}</h2>
      </div>
    </div>
  );
});

// type FlipBookHandle = {
//   flipNext: () => void;
//   flipPrev: () => void;
//   turnToPage: (page: number) => void;
//   getCurrentPage: () => number;
//   getPageCount: () => number;
// };
type PageContentData =
  | {
    first?: false;
    content: string;
  }
  | {
    first: true;
    title: string;
    cover: string;
  };
type IDetailedStoryProps = {
  title: string;
  cover?: string;
  authorName: string;
  abstract: string;
};

export const DetailedStoryWithCover = ({
  title,
  cover = '/assets/images/half-title-illus.png',
  authorName,
  abstract,
}: IDetailedStoryProps) => {
  // const flipBookRef = useRef<{ pageFlip: () => FlipBookHandle } | null>(null);
  const flipSound = useRef<HTMLAudioElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  const [pages, setPages] = useState<{ content: string }[]>([]);
  const [flipBookWidth, setFlipBookWidth] = useState(0);
  const [flipBookHeight, setFlipBookHeight] = useState(0);

  // useEffect(() => {
  //   if (onDynamicHeightChange) {
  //     onDynamicHeightChange(flipBookHeight);
  //   }
  // }, [flipBookHeight, onDynamicHeightChange]);

  // @ts-ignore
  const pagesRender: PageContentData[] = useMemo(() => {
    const newPages = [{ title, cover, first: true }, ...pages];

    if (newPages.length % 2 !== 0) {
      return [...newPages, { content: '' }];
    }
    return newPages;
  }, [title, cover, pages]);

  useEffect(() => {
    const updateDimensions = () => {
      if (contentRef.current) {
        const containerRect = contentRef.current.getBoundingClientRect();
        const containerWidth = containerRect.width;

        // If the container width is >= 768, we should render 2 pages
        if (containerWidth >= 768) {
          const aspectRatio = 656 / 458;
          const dynamicWidth = containerWidth / 2;
          const dynamicHeight = dynamicWidth * aspectRatio;

          setFlipBookWidth(dynamicWidth);
          setFlipBookHeight(dynamicHeight);
        } else {
          const aspectRatio = 440 / 398;
          const dynamicWidth = containerWidth;
          const dynamicHeight = dynamicWidth * aspectRatio;

          setFlipBookWidth(dynamicWidth);
          setFlipBookHeight(dynamicHeight);
        }
      }
    };

    updateDimensions();

    window.addEventListener('resize', updateDimensions);

    flipSound.current = new Audio('/assets/media/flip.mp3');

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);
  useEffect(() => {
    if (flipBookHeight && flipBookWidth && textContainerRef && abstract) {
      const pages = paginateText(
        abstract,
        flipBookWidth,
        flipBookHeight,
        textContainerRef,
      );
      setPages(pages);
    }
  }, [abstract, flipBookHeight, flipBookWidth, textContainerRef]);

  const handleFlip = () => {
    if (flipSound.current) {
      // Rewind and play
      flipSound.current.currentTime = 0;
      flipSound.current.play().catch(() => {
        // Ignore autoplay errors (especially in browsers that restrict it)
      });
    }
  };

  return (
    <div className="w-full" id="demoBlock">
      <div
        className="book-page-padding relative z-50 m-auto flex size-full justify-center overflow-visible"
        ref={contentRef}
      >
        {/* @ts-ignore */}
        <HTMLFlipBook
          width={flipBookWidth}
          height={flipBookHeight}
          minWidth={flipBookWidth}
          maxWidth={flipBookWidth}
          minHeight={flipBookHeight}
          maxHeight={flipBookHeight}
          maxShadowOpacity={0.5}
          drawShadow={false}
          showCover
          mobileScrollSupport
          // className="z-[100] m-auto h-full overflow-visible bg-cover perspective-[1500px]"
          flippingTime={2400}
          // ref={(el) => {
          //   if (el) {
          //     flipBookRef.current = el;
          //   }
          // }}
          style={{ transition: 'all 0s ease' }}
          onFlip={handleFlip}
        >
          <PageCoverFront />
          <PageCoverBack />
          {pagesRender.map((page, i) => (
            <Page key={i} title={title} number={i + 1}>
              {page.first
                ? (
                    <div className="relative w-full overflow-hidden rounded-lg">
                      {/* Top area (keeps space for the circular portrait) */}
                      <div className="h-40 bg-transparent sm:h-48 md:h-64"></div>

                      <div className="relative mt-10 p-6 sm:p-8 md:p-10">
                        {/* Large decorative double-quote (positioned) */}
                        <div
                          className={mergeClassnames(
                            'absolute -top-8 left-6 select-none text-[72px] font-extrabold leading-none text-yellow-40 z-[9999]',
                            'sm:text-[96px] md:text-[6rem]',
                          )}
                        >
                          &ldquo;
                        </div>

                        {/* Quote text */}
                        <h2 className="line-clamp-2 text-2xl font-extrabold leading-none text-primary-60 sm:text-3xl sm:leading-snug md:text-4xl md:leading-snug">
                          {title}
                        </h2>

                        {/* Author */}
                        <p className="mt-6 line-clamp-1 text-sm font-semibold text-yellow-50 sm:text-base md:text-lg">
                          {`– ${authorName}`}
                        </p>
                      </div>

                      {/* Circular author portrait (overlaps both top area and blue block) */}
                      <div
                        className="absolute -left-24 -top-20 size-56 overflow-hidden rounded-full border-4 border-white shadow-xl md:size-96"
                      >
                        <Image
                          src={cover ?? '/assets/images/half-title-illus.png'}
                          alt="Author avatar"
                          width={500}
                          height={500}
                          className="size-full object-cover lg:object-none lg:object-center"
                        />
                      </div>
                    </div>
                  )
                : (
                    <div ref={textContainerRef} className="hyphens-auto whitespace-pre-line break-all leading-6 text-neutral-30">
                      {page?.content ?? ''}
                    </div>
                  )}
            </Page>
          ))}
          <PageCoverBack>THE END</PageCoverBack>
          <PageCoverBack />
        </HTMLFlipBook>
      </div>
    </div>
  );
};
