'use client';

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
      <div className="flex h-full w-full flex-col justify-between gap-4">
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
  const lineHeight = 24; // Approximate line height in pixels
  const fontSize = 16.8; // Approximate font size in pixels
  const charsPerLine = Math.floor(containerWidth / fontSize); // Calculate characters per line based on container width
  const linesPerPage = Math.floor(containerHeight / lineHeight); // Calculate lines per page based on height
  const maxCharsPerPage = charsPerLine * linesPerPage; // Total characters per page

  // Dive into the long text by dividing it into pages based on the maximum number of characters per page
  for (let i = 0; i < longText.length; i += maxCharsPerPage) {
    const pageText = longText.slice(i, i + maxCharsPerPage).trim();

    // Ensure not to split words
    const lastSpaceIndex = pageText.lastIndexOf(' ');
    const finalText =
      i + maxCharsPerPage < longText.length && lastSpaceIndex !== -1
        ? pageText.slice(0, lastSpaceIndex)
        : pageText;

    pages.push({ content: finalText });

    // If the text is cut, adjust the pointer "i"
    i += finalText.length - pageText.length;
  }
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
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  // @ts-ignore
  const pagesRender: PageContentData[] = useMemo(() => {
    const newPages = [{ title, cover, first: true }, ...pages];

    if (newPages.length % 2 !== 0) {
      return [...newPages, { content: '' }];
    }
    return newPages;
  }, [title, cover, pages]);

  useEffect(() => {
    if (contentRef.current) {
      setContainerWidth(
        contentRef.current.getBoundingClientRect().width / 2 - 56,
      );
      setContainerHeight(
        contentRef.current.getBoundingClientRect().height + 200,
      );
    }

    flipSound.current = new Audio('/assets/media/flip.mp3');
  }, []);

  useEffect(() => {
    if (containerHeight && containerWidth) {
      const paginatedResult = paginateText(
        abstract ?? '',
        containerWidth,
        containerHeight,
      );
      if (paginatedResult.length > 0) {
        setPages(paginatedResult);
      } else {
        setPages([]);
      }
    }
  }, [abstract, containerHeight, containerWidth]);

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
      <div className="h-[616px] w-full overflow-hidden" id="demoBlock">
        <div
          className="relative z-50 m-auto h-full max-h-[616px] w-full max-w-[916px] overflow-visible"
          ref={contentRef}
        >
          {/* @ts-ignore */}
          <HTMLFlipBook
            width={458}
            height={616}
            size="stretch"
            minWidth={458}
            maxWidth={1000}
            minHeight={616}
            maxHeight={1533}
            maxShadowOpacity={0.5}
            drawShadow={false}
            showCover={false}
            className="z-[100] m-auto overflow-visible bg-cover perspective-[1500px]"
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
                {page.first ? (
                  <div className="flex flex-col gap-2">
                    <h2 className="text-[36px] font-bold">
                      {page?.title ?? ''}
                    </h2>
                    <Image
                      src={page?.cover ?? '/assets/images/user-avatar.jpeg'}
                      height={500}
                      width={355}
                      alt="Book cover"
                      className="w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="whitespace-pre-line text-base leading-6 tracking-wider text-[#45484A]">
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
          className={`flex h-8 w-8 items-center justify-center rounded-full border border-blue-500 ${
            index === 0 ? 'cursor-not-allowed opacity-50' : 'hover:bg-blue-100'
          }`}
        >
          &lt;
        </IconButton>
        <IconButton
          onClick={goToNextPage}
          disabled={index + 2 === pagesRender.length}
          className={`flex h-8 w-8 items-center justify-center rounded-full border border-blue-500 ${
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
