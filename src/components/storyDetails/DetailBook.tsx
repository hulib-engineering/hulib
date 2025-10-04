'use client';

import Image from 'next/image';
import type { ReactNode } from 'react';
import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { Playfair_Display } from 'next/font/google';

import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import IconButton from '@/components/core/iconButton/IconButton';
import { mergeClassnames } from '@/components/core/private/utils';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
});

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
        'rounded-xl bg-white pb-0 pt-8 overflow-visible',
        'before:content-[""] before:absolute before:inset-y-0 before:h-full before:w-8 before:border-neutral-80',
        'before:from-white before:from-20% before:via-[#C7C9CB]/10 before:via-40% before:to-[#C7C9CB]/40 before:to-100%',
        number % 2 === 0
          ? 'pl-8 pr-6 shadow-book-right before:left-0 before:border-l-[0.5px] before:bg-gradient-to-l'
          : 'pr-8 pl-6 shadow-book-left before:right-0 before:border-r-[0.5px] before:bg-gradient-to-r',
      )}
      ref={ref}
      data-density={density}
    >
      <div className={mergeClassnames('flex size-full flex-col justify-between gap-4', number === 1 && 'justify-center')}>
        <div className="flex w-full flex-col gap-4">
          {number === 2 && (
            <h6 className="text-xl font-bold leading-7 text-neutral-20">
              Abstract
            </h6>
          )}
          {children}
        </div>
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

const paginateText = (
  longText: string,
  containerWidth: number,
  containerHeight: number,
) => {
  const pages = [];

  // Tính toán chính xác hơn cho mobile và desktop
  const pagePadding = {
    left: 32, // pl-8 = 32px
    right: 24, // pr-6 = 24px
    top: 32, // pt-8 = 32px
    bottom: 0, // pb-0
  };

  const footerHeight = 60; // Chiều cao footer (Page number + title)
  const headerHeight = containerWidth < 768 ? 40 : 0; // Space cho "Abstract" title
  const gapHeight = 16; // gap-4 = 16px

  // Tính available space thực tế
  const availableWidth = containerWidth - pagePadding.left - pagePadding.right;
  const availableHeight = containerHeight - pagePadding.top - pagePadding.bottom - footerHeight - headerHeight - gapHeight;

  // Điều chỉnh fontSize dựa trên breakpoint
  const actualFontSize = containerWidth < 768 ? 14 : 16; // text-sm vs text-base
  const actualLineHeight = containerWidth < 768 ? 20 : 24; // leading-5 vs leading-6

  // Tính số ký tự và dòng chính xác hơn
  const avgCharWidth = actualFontSize * 0.55; // Điều chỉnh để chính xác hơn
  const charsPerLine = Math.floor(availableWidth / avgCharWidth);
  const linesPerPage = Math.floor(availableHeight / actualLineHeight);
  const maxCharsPerPage = Math.max(charsPerLine * linesPerPage, 150); // Minimum 150 chars

  let currentIndex = 0;

  while (currentIndex < longText.length) {
    let endIndex = Math.min(currentIndex + maxCharsPerPage, longText.length);
    let pageText = longText.slice(currentIndex, endIndex);

    // Tránh cắt giữa từ - tìm space gần nhất
    if (endIndex < longText.length) {
      const lastSpaceIndex = pageText.lastIndexOf(' ');
      const lastNewlineIndex = pageText.lastIndexOf('\n');
      const lastPeriodIndex = pageText.lastIndexOf('.');
      const lastBreakIndex = Math.max(lastSpaceIndex, lastNewlineIndex, lastPeriodIndex);

      // Chỉ break nếu không quá ngắn (ít nhất 70% của maxChars)
      if (lastBreakIndex > maxCharsPerPage * 0.7) {
        pageText = pageText.slice(0, lastBreakIndex + (lastPeriodIndex === lastBreakIndex ? 1 : 0));
        endIndex = currentIndex + lastBreakIndex + (lastPeriodIndex === lastBreakIndex ? 1 : 0);
      }
    }

    const trimmedText = pageText.trim();
    if (trimmedText.length > 0) {
      pages.push({ content: trimmedText });
    }

    currentIndex = endIndex + 1; // +1 để skip space/newline

    // Tránh infinite loop
    if (currentIndex >= longText.length || pages.length > 50) {
      break;
    }
  }
  return pages;
};

export function DetailBook({
  title,
  cover,
  authorName,
  abstract,
}: {
  title: string;
  cover: string;
  authorName: string;
  abstract: string;
}) {
  const flipBookRef = useRef<{ pageFlip: () => FlipBookHandle } | null>(null);
  const flipSound = useRef<HTMLAudioElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const [index, setIndex] = useState(0);
  const [pages, setPages] = useState<{ content: string }[]>([]);

  const [flipBookWidth, setFlipBookWidth] = useState(0);
  const [flipBookHeight, setFlipBookHeight] = useState(0);

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
        const aspectRatio = 4 / 3;

        // If the container width is >= 768, we should render 2 pages
        if (containerWidth >= 768) {
          const dynamicWidth = containerWidth / 2;
          const dynamicHeight = dynamicWidth * aspectRatio;

          setFlipBookWidth(dynamicWidth);
          setFlipBookHeight(dynamicHeight);
        } else {
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
    if (flipBookHeight && flipBookWidth && abstract) {
      const paginatedResult = paginateText(
        abstract,
        flipBookWidth,
        flipBookHeight,
      );

      if (paginatedResult.length > 0) {
        setPages(paginatedResult);
      } else {
        setPages([]);
      }
    }
  }, [abstract, flipBookHeight, flipBookWidth]);

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
    <div className="flex flex-col items-center gap-5">
      <div className="w-full" id="demoBlock">
        <div
          className="relative z-50 m-auto flex size-full justify-center overflow-visible"
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
                              playfair.className,
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
                          className="absolute -left-24 -top-20 size-36 overflow-hidden rounded-full border-4 border-white shadow-xl sm:size-44 md:size-96"
                        >
                          <Image
                            src={cover}
                            alt="Author avatar"
                            width={500}
                            height={500}
                            className="size-full object-cover object-right-bottom"
                          />
                        </div>
                      </div>
                    )
                  : (
                      <div
                        className={mergeClassnames(
                          'whitespace-pre-line tracking-wider text-[#45484A]',
                          'text-sm leading-5', // Mobile: 14px, line-height: 20px
                          'md:text-base md:leading-6', // Desktop: 16px, line-height: 24px
                          'break-words', // Đảm bảo long words được break
                          'hyphens-auto', // Auto hyphenation
                        )}
                      >
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
}
