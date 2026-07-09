'use client';

import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import type { ReactNode } from 'react';
import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';

import IconButton from '@/components/core/iconButton/IconButton';
import { mergeClassnames } from '@/components/core/private/utils';
import { paginateText } from '@/utils/paginateTextUtil';

type PageProps = {
  page: number;
  totalPages?: number;
  title?: string;
  children: ReactNode;
  density?: 'soft' | 'hard';
  showPageNumber?: boolean;
  mobileFooter?: ReactNode;
};

export const Page = forwardRef<HTMLDivElement, PageProps>(
  ({
    page,
    totalPages,
    children,
    density = 'soft',
    showPageNumber = true,
    mobileFooter,
  }, ref) => (
    <div
      className={mergeClassnames(
        'relative isolate size-full overflow-hidden rounded-xl bg-white px-8 pb-0 pt-8 shadow-sm lg:rounded-xl',
        'lg:before:content-[""] lg:before:absolute lg:before:inset-y-0 lg:before:h-full lg:before:w-8 lg:before:border-neutral-80',
        'lg:before:from-white lg:before:from-20% lg:before:via-[#C7C9CB]/10 lg:before:via-40% lg:before:to-[#C7C9CB]/40 lg:before:to-100%',
        page % 2 === 0
          ? 'lg:pr-6 lg:shadow-book-right lg:before:left-0 lg:before:border-l-[0.5px] lg:before:bg-gradient-to-l'
          : 'lg:pl-6 lg:shadow-book-left lg:before:right-0 lg:before:border-r-[0.5px] lg:before:bg-gradient-to-r',
      )}
      ref={ref}
      data-density={density}
    >
      <div className={mergeClassnames('flex size-full flex-col justify-between gap-4')}>
        {children}
        {showPageNumber && (
          <p className="py-3 pr-3 text-center text-xs font-medium leading-[14px] text-neutral-50">
            <span className="text-neutral-10">{page}</span>
            {`/${totalPages}`}
          </p>
        )}
        {!showPageNumber && mobileFooter}
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
type PageContentData = {
  content: string;
};
type IDetailedStoryProps = {
  title?: string;
  cover?: string;
  authorName?: string;
  abstract: string;
  bookWidth?: number;
};

export const DetailedStory = (props: IDetailedStoryProps) => {
  const flipBookRef = useRef<{ pageFlip: () => FlipBookHandle } | null>(null);
  const flipSound = useRef<HTMLAudioElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  const [index, setIndex] = useState(0);
  const [pages, setPages] = useState<{ content: string }[]>([]);
  const [flipBookWidth, setFlipBookWidth] = useState(0);
  const [flipBookHeight, setFlipBookHeight] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  const pagesRender: PageContentData[] = useMemo(() => {
    const newPages = [...pages];

    if (isDesktop && newPages.length % 2 !== 0) {
      return [...newPages, { content: '' }];
    }
    return newPages;
  }, [isDesktop, pages]);

  useEffect(() => {
    const updateDimensions = () => {
      if (contentRef.current) {
        const containerRect = contentRef.current.getBoundingClientRect();
        const isDesktopViewport = window.matchMedia('(min-width: 1280px)').matches;
        const resolvedBookWidth = Math.max(props.bookWidth ?? containerRect.width, 0);
        const pageWidth = isDesktopViewport ? resolvedBookWidth / 2 : resolvedBookWidth;
        const dynamicHeight = isDesktopViewport ? 600 : 440;

        setIsDesktop(isDesktopViewport);
        setFlipBookWidth(pageWidth);
        setFlipBookHeight(dynamicHeight);
      }
    };

    updateDimensions();

    window.addEventListener('resize', updateDimensions);

    flipSound.current = new Audio('/assets/media/flip.mp3');

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [props.bookWidth]);

  useEffect(() => {
    if (flipBookHeight && flipBookWidth && textContainerRef.current && props.abstract) {
      const pages = paginateText(
        props.abstract,
        flipBookWidth,
        flipBookHeight,
        textContainerRef,
      );
      setPages(pages);
    }
  }, [props.abstract, flipBookHeight, flipBookWidth, textContainerRef]);

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
  const pageStep = isDesktop ? 2 : 1;
  const flippingTime = isDesktop ? 2400 : 1;
  const totalPages = pagesRender.length;
  const currentPage = totalPages === 0 ? 0 : Math.min(index + 1, totalPages);
  const hasEnoughPagesForDesktopNav = totalPages >= 3;
  const showDesktopPrevButton = hasEnoughPagesForDesktopNav && currentPage >= 3;
  const showDesktopNextButton = hasEnoughPagesForDesktopNav && index + pageStep < totalPages;
  const hasEnoughPagesForMobileNav = totalPages >= 2;
  const showMobilePrevButton = hasEnoughPagesForMobileNav && currentPage >= 2;
  const showMobileNextButton = hasEnoughPagesForMobileNav && currentPage < totalPages;
  const mobileFooter = (
    <div className="flex w-full items-center justify-between pb-3 pr-3 xl:hidden">
      <div className="flex size-8 items-center justify-center">
        {showMobilePrevButton && (
          <IconButton
            variant="soft"
            size="lg"
            onClick={goToPrevPage}
            disabled={index === 0}
            className="!h-8 w-8"
          >
            <CaretLeft size={8} weight="bold" className="text-primary-40" />
          </IconButton>
        )}
      </div>
      <p className="text-xs font-medium leading-[14px] text-neutral-50">
        <span className="text-neutral-10">{currentPage}</span>
        {`/${totalPages}`}
      </p>
      <div className="flex size-8 items-center justify-center">
        {showMobileNextButton && (
          <IconButton
            variant="soft"
            size="lg"
            onClick={goToNextPage}
            disabled={index + pageStep >= pagesRender.length}
            className="!h-8 w-8"
          >
            <CaretRight size={8} weight="bold" className="text-primary-40" />
          </IconButton>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-4 lg:gap-5">
      <div className="w-full" id="demoBlock">
        <div
          className="book-page-padding relative z-50 flex size-full overflow-visible"
          ref={contentRef}
        >
          <div
            ref={textContainerRef}
            aria-hidden
            className="pointer-events-none absolute -z-10 hyphens-auto whitespace-pre-line break-words leading-6 text-neutral-30 opacity-0"
          />
          <div className="relative">
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
              usePortrait={!isDesktop}
              className="z-[100] m-auto h-full overflow-visible bg-cover"
              flippingTime={flippingTime}
              ref={(el) => {
                if (el) {
                  flipBookRef.current = el;
                }
              }}
              style={{ transition: 'all 0s ease' }}
              onFlip={handleFlip}
            >
              {pagesRender.map((page, i) => (
                <Page
                  key={i}
                  page={i + 1}
                  totalPages={pagesRender.length}
                  showPageNumber={isDesktop}
                  mobileFooter={mobileFooter}
                >
                  <div className="hyphens-auto whitespace-pre-line break-words leading-6 text-neutral-30">
                    {page?.content ?? ''}
                  </div>
                </Page>
              ))}
            </HTMLFlipBook>
            <div className="pointer-events-none absolute inset-0 z-[120] hidden xl:block">
              {showDesktopPrevButton && (
                <IconButton
                  variant="soft"
                  size="lg"
                  onClick={goToPrevPage}
                  disabled={index === 0}
                  className="pointer-events-auto absolute left-0 top-1/2 size-11 rounded-full bg-primary-90 -translate-x-1/2 -translate-y-1/2"
                >
                  <CaretLeft size={14} weight="bold" className="text-primary-40" />
                </IconButton>
              )}
              {showDesktopNextButton && (
                <IconButton
                  variant="soft"
                  size="lg"
                  onClick={goToNextPage}
                  disabled={index + pageStep >= pagesRender.length}
                  className="pointer-events-auto absolute right-0 top-1/2 size-11 rounded-full bg-primary-90 -translate-y-1/2 translate-x-1/2"
                >
                  <CaretRight size={14} weight="bold" className="text-primary-40" />
                </IconButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
