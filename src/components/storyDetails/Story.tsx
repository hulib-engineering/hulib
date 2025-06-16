'use client';

import React, { useEffect, useMemo, useRef } from 'react';

import StoryPagination from './StoryPagination';

function paginateText(
  longText: string,
  containerWidth: number,
  containerHeight: number,
  _numberOfPageDisplayed: number,
) {
  if (!longText || longText.length === 0) return [];
  if (containerWidth <= 0 || containerHeight <= 0) return [];

  const pages = [];
  const lineHeight = 24;
  const charWidth = 8.5;
  const padding = 56;
  const verticalPadding = 64;

  const effectiveWidth = Math.max(containerWidth - padding, 100);
  const effectiveHeight = Math.max(containerHeight - verticalPadding, 100);

  const charsPerLine = Math.max(Math.floor(effectiveWidth / charWidth), 10);
  const linesPerPage = Math.max(Math.floor(effectiveHeight / lineHeight), 3);

  const headerHeight = 80;
  const firstPageEffectiveHeight = Math.max(effectiveHeight - headerHeight, 50);
  const firstPageLines = Math.max(
    Math.floor(firstPageEffectiveHeight / lineHeight),
    2,
  );

  const firstPageMaxChars = Math.max(
    Math.floor(charsPerLine * firstPageLines * 0.9),
    50,
  );
  const normalPageMaxChars = Math.max(
    Math.floor(charsPerLine * linesPerPage * 0.9),
    100,
  );

  let currentIndex = 0;

  if (longText.length > 0) {
    const maxChars = Math.min(firstPageMaxChars, longText.length);
    const firstPageText = longText.slice(0, maxChars);
    let finalFirstPageText = firstPageText;

    if (maxChars < longText.length) {
      const lastSpaceIndex = firstPageText.lastIndexOf(' ');
      if (lastSpaceIndex > 0) {
        finalFirstPageText = firstPageText.slice(0, lastSpaceIndex);
      }
    }

    if (finalFirstPageText.trim().length > 0) {
      pages.push({ abstract: finalFirstPageText.trim(), isFirstPage: true });
      currentIndex = finalFirstPageText.length;

      while (currentIndex < longText.length && longText[currentIndex] === ' ') {
        currentIndex += 1;
      }
    }
  }

  let iterationCount = 0;
  const maxIterations = Math.ceil(longText.length / 50);

  while (currentIndex < longText.length && iterationCount < maxIterations) {
    iterationCount += 1;

    const remainingText = longText.slice(currentIndex);
    if (remainingText.length === 0) break;

    const maxChars = Math.min(normalPageMaxChars, remainingText.length);
    const pageText = remainingText.slice(0, maxChars);
    let finalText = pageText;

    // Ensure not to split words
    if (maxChars < remainingText.length) {
      const lastSpaceIndex = pageText.lastIndexOf(' ');
      if (lastSpaceIndex > 0) {
        finalText = pageText.slice(0, lastSpaceIndex);
      }
    }

    const trimmedText = finalText.trim();
    if (trimmedText.length > 0) {
      pages.push({ abstract: trimmedText });
      currentIndex += finalText.length;

      // Skip whitespace
      while (currentIndex < longText.length && longText[currentIndex] === ' ') {
        currentIndex += 1;
      }
    } else {
      break;
    }
  }

  return pages.length > 0
    ? pages
    : [{ abstract: longText.slice(0, 300), isFirstPage: true }];
}

interface StoryProps {
  abstract: string;
}

const Story: React.FC<StoryProps> = ({ abstract }) => {
  const storyRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = React.useState(0);
  const [containerHeight, setContainerHeight] = React.useState(0);
  const [pages, setPages] = React.useState<any[]>([]);
  const [currentPage, setCurrentPage] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(0);
  const [numberOfPageDisplayed, setNumberOfPageDisplayed] = React.useState(2);

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (containerHeight > 0 && containerWidth > 0) {
      try {
        const paginatedResult = paginateText(
          abstract,
          containerWidth,
          containerHeight,
          numberOfPageDisplayed,
        );

        if (paginatedResult && paginatedResult.length > 0) {
          setPages(paginatedResult);
          const calculatedTotalPages = Math.max(
            1,
            Math.ceil(paginatedResult.length / numberOfPageDisplayed),
          );
          setTotalPages(calculatedTotalPages);
        } else {
          setPages([{ abstract: abstract.slice(0, 500), isFirstPage: true }]);
          setTotalPages(1);
        }
      } catch (error) {
        setPages([{ abstract: abstract.slice(0, 500), isFirstPage: true }]);
        setTotalPages(1);
      }
    }
  }, [abstract, containerHeight, containerWidth, numberOfPageDisplayed]);

  const pagesRender = useMemo(() => {
    if (!pages || pages.length === 0) {
      return [{ abstract: '', isFirstPage: true }];
    }

    const startIndex = Math.max(0, currentPage * numberOfPageDisplayed);
    const endIndex = Math.min(pages.length, startIndex + numberOfPageDisplayed);
    const newPages = pages.slice(startIndex, endIndex);

    if (
      newPages.length === 1 &&
      numberOfPageDisplayed === 2 &&
      newPages.length < numberOfPageDisplayed
    ) {
      newPages.push({
        abstract: '',
      });
    }

    return newPages.length > 0
      ? newPages
      : [{ abstract: '', isFirstPage: true }];
  }, [pages, numberOfPageDisplayed, currentPage]);

  useEffect(() => {
    const updateDimensions = () => {
      if (storyRef.current) {
        const rect = storyRef.current.getBoundingClientRect();
        const isMobile = window.innerWidth <= 768;
        const pageWidth = isMobile ? rect.width : rect.width / 2;

        setContainerWidth(pageWidth);
        setContainerHeight(rect.height);
        setNumberOfPageDisplayed(isMobile ? 1 : 2);
      }
    };

    updateDimensions();

    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateDimensions, 150);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="flex h-[80vh] flex-col gap-2" ref={storyRef}>
      <div className="flex h-full w-full overflow-hidden rounded-lg bg-white shadow-lg">
        {pagesRender.map((page, index) => {
          return (
            <div
              key={`page-${currentPage * numberOfPageDisplayed + index}`}
              className="relative flex-1 overflow-hidden px-7 py-8 before:absolute before:inset-y-0 before:right-0 before:h-full before:w-[36px] before:bg-gradient-to-r before:from-transparent before:to-[#C7C9CB] before:opacity-30 before:content-['']"
            >
              {page?.isFirstPage && (
                <h6 className="mb-6 text-lg font-semibold text-gray-800">
                  Abstract
                </h6>
              )}
              <div className="h-full overflow-hidden">
                <p className="whitespace-pre-wrap break-words text-base leading-6 text-[#45484A]">
                  {page?.abstract ?? ''}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <StoryPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default Story;
