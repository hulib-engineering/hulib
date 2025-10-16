'use client';

import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import Image from 'next/image';
import type { ReactNode } from 'react';
import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';

import IconButton from '@/components/core/iconButton/IconButton';
import { mergeClassnames } from '@/components/core/private/utils';
import { paginateText } from '@/utils/paginateTextUtil';

type PageProps = {
  number: number;
  title: string;
  children: ReactNode;
  density?: 'soft' | 'hard';
};

const Page = forwardRef<HTMLDivElement, PageProps>(
  ({ number, title, children, density = 'soft' }, ref) => (
    <div
      className={mergeClassnames(
        'rounded-xl shadow-sm bg-white px-8 pb-0 pt-8 overflow-visible lg:rounded-xl',
        'lg:before:content-[""] lg:before:absolute lg:before:inset-y-0 lg:before:h-full lg:before:w-8 lg:before:border-neutral-80',
        'lg:before:from-white lg:before:from-20% lg:before:via-[#C7C9CB]/10 lg:before:via-40% lg:before:to-[#C7C9CB]/40 lg:before:to-100%',
        number % 2 === 0
          ? 'lg:pr-6 lg:shadow-book-right lg:before:left-0 lg:before:border-l-[0.5px] lg:before:bg-gradient-to-l'
          : 'lg:pl-6 lg:shadow-book-left lg:before:right-0 lg:before:border-r-[0.5px] lg:before:bg-gradient-to-r',
      )}
      ref={ref}
      data-density={density}
    >
      <div className={mergeClassnames('flex size-full flex-col justify-between gap-4', number === 1 && 'justify-center')}>
        {/*  {number === 2 && ( */}
        {/*    <h6 className="text-xl font-bold leading-7 text-neutral-20"> */}
        {/*      Abstract */}
        {/*    </h6> */}
        {/*  )} */}
        {children}
        {number !== 1 && (
          <div className="flex w-full gap-6 py-5">
            <p className="text-[10px] font-medium leading-3 text-[#73787C]">
              {`Page ${number}`}
            </p>
            <div className="flex-1 border-b-[0.5px] border-[#73787C]" />
            <div className="text-[10px] leading-3 text-neutral-20">{title}</div>
          </div>
        )}
      </div>
    </div>
  ),
);
Page.displayName = 'Page';

type FlipBookHandle = {
  flipNext: () => void;
  flipPrev: () => void;
  turnToPage: (page: number) => void;
  getCurrentPage: () => number;
  getPageCount: () => number;
};
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
  cover: string;
  authorName: string;
  abstract: string;
  onDynamicHeightChange?: (height: number) => void;
};

export const DetailedStory = ({
  title,
  cover,
  authorName,
  abstract,
  onDynamicHeightChange,
}: IDetailedStoryProps) => {
  const flipBookRef = useRef<{ pageFlip: () => FlipBookHandle } | null>(null);
  const flipSound = useRef<HTMLAudioElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  const [index, setIndex] = useState(0);
  const [pages, setPages] = useState<{ content: string }[]>([]);
  const [flipBookWidth, setFlipBookWidth] = useState(0);
  const [flipBookHeight, setFlipBookHeight] = useState(0);

  useEffect(() => {
    if (onDynamicHeightChange) {
      onDynamicHeightChange(flipBookHeight);
    }
  }, [flipBookHeight, onDynamicHeightChange]);

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

  const goToNextPage = () => {
    flipBookRef.current?.pageFlip().flipNext();
  };

  const goToPrevPage = () => {
    // @ts-ignore
    flipBookRef.current?.pageFlip().flipPrev();
  };

  const handleFlip = (e: any) => {
    if (flipSound.current) {
      // Rewind and play
      flipSound.current.currentTime = 0;
      flipSound.current.play().catch(() => {
        // Ignore autoplay errors (especially in browsers that restrict it)
      });
    }

    setIndex(e.data);
  };

  return (
    <div className="flex flex-col items-center gap-4 lg:gap-5">
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
            showCover={false}
            className="z-[100] m-auto h-full overflow-visible bg-cover perspective-[1500px]"
            flippingTime={2400}
            ref={(el) => {
              if (el) {
                flipBookRef.current = el;
              }
            }}
            style={{ transition: 'all 0s ease' }}
            onFlip={handleFlip}
          >
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
                            src={cover}
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
          </HTMLFlipBook>
        </div>
      </div>
      <div className="flex w-full items-center justify-between">
        <IconButton
          variant="secondary"
          size="lg"
          onClick={goToPrevPage}
          disabled={index === 0}
          className="!h-8 w-8"
        >
          <CaretLeft size={8} weight="bold" className="text-primary-40" />
        </IconButton>
        <IconButton
          variant="secondary"
          size="lg"
          onClick={goToNextPage}
          disabled={index + 2 === pagesRender.length}
          className="!h-8 w-8"
        >
          <CaretRight size={8} weight="bold" className="text-primary-40" />
        </IconButton>
      </div>
    </div>
  );
};
