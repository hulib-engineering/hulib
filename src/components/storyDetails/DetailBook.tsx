'use client';

import clsx from 'clsx';
import Image from 'next/image';
import type { ReactNode } from 'react';
import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';

import IconButton from '@/components/iconButton/IconButton';
import { mergeClassnames } from '@/components/private/utils';

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
        'bg-white pb-0 pl-8 pr-6 pt-8',
        `before:absolute before:inset-y-0 before:${
          number % 2 !== 0 ? 'right' : 'left'
        }-0 before:h-full before:w-8 before:bg-gradient-to-${
          number % 2 === 0 ? 'l' : 'r'
        } before:from-transparent before:to-[#C7C9CB] before:opacity-30 before:content-['']`,
      )}
      ref={ref}
      data-density={density}
    >
      <div className="flex size-full flex-col justify-between gap-4">
        <div className="flex w-full flex-col gap-4">
          {number === 2 && (
            <h6 className="text-xl font-bold leading-7 text-neutral-20">
              Abstract
            </h6>
          )}
          {children}
        </div>
        <div className="flex w-full gap-6 py-5">
          <p className="text-[10px] font-medium leading-3 text-[#73787C]">
            {`Page ${number}`}
          </p>
          <div className="flex-1 border-b-[0.5px] border-[#73787C]" />
          <div className="text-[10px] leading-3 text-neutral-20">{title}</div>
        </div>
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

  console.log('Pagination params:', {
    containerWidth,
    containerHeight,
    availableWidth,
    availableHeight,
    charsPerLine,
    linesPerPage,
    maxCharsPerPage,
    actualFontSize,
    actualLineHeight,
  });

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

  console.log('Generated pages:', pages.length);
  return pages;
};

export function DetailBook({
  title,
  cover,
  abstract,
}: {
  title: string;
  cover: string;
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

        // If container width is >= 768, we should render 2 pages
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

      console.log('Paginated result:', paginatedResult.length, 'pages');
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
    <div className="flex flex-col items-center">
      <div className="w-full overflow-hidden" id="demoBlock">
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
                      <div className="flex flex-col gap-2">
                        <h2
                          className={clsx(
                            'font-bold',
                            'text-xl',
                            'sm:text-2xl',
                            'md:text-[36px]',
                          )}
                        >
                          {page?.title ?? ''}
                        </h2>
                        <Image
                          src={page?.cover ?? '/assets/images/ava-placeholder.png'}
                          height={500}
                          width={355}
                          alt="Book cover"
                          className="w-full object-cover"
                        />
                      </div>
                    )
                  : (
                      <div
                        className={clsx(
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
      <div className="flex w-full items-center justify-between p-4">
        <IconButton
          onClick={goToPrevPage}
          disabled={index === 0}
          className={`flex size-8 items-center justify-center rounded-full border border-blue-500 ${
            index === 0 ? 'cursor-not-allowed opacity-50' : 'hover:bg-blue-100'
          }`}
        >
          &lt;
        </IconButton>
        <IconButton
          onClick={goToNextPage}
          disabled={index + 2 === pagesRender.length}
          className={`flex size-8 items-center justify-center rounded-full border border-blue-500 ${
            index + 2 >= pagesRender.length
              ? 'cursor-not-allowed opacity-50'
              : 'hover:bg-blue-100'
          }`}
        >
          &gt;
        </IconButton>
      </div>
    </div>
  );
}
