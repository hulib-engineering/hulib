'use client';

import Image from 'next/image';
import React, { useEffect, useMemo, useRef } from 'react';

import StoryPagination from './StoryPagination';

function paginateText(
  longText: string,
  containerWidth: number,
  containerHeight: number,
) {
  const pages = [];
  const lineHeight = 20; // Approximate line height in pixels
  const fontSize = 16; // Approximate font size in pixels
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

    pages.push({ abstract: finalText });

    // If the text is cut, adjust the pointer "i"
    i += finalText.length - pageText.length;
  }

  return pages;
}
interface StoryProps {
  abstract: string;
  title: string;
  cover: {
    id: string;
    path?: string;
  };
}

const Story: React.FC<StoryProps> = ({ abstract, title, cover }) => {
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
    if (containerHeight && containerWidth) {
      const paginatedResult = paginateText(
        abstract,
        containerWidth,
        containerHeight,
      );
      if (paginatedResult.length > 0) {
        setPages(paginatedResult);
        setTotalPages(
          Math.ceil(paginatedResult.length / numberOfPageDisplayed) + 1,
        );
      } else {
        setPages([]);
        setTotalPages(1);
      }
    }
  }, [abstract, containerHeight, containerWidth, numberOfPageDisplayed]);

  const pagesRender = useMemo(() => {
    const newPages = [{ title, cover }, ...pages].slice(
      currentPage,
      currentPage + numberOfPageDisplayed,
    );

    if (newPages.length % 2 !== 0 && numberOfPageDisplayed === 2) {
      newPages.push({
        abstract: '',
      });
    }
    return newPages;
  }, [pages, title, cover, numberOfPageDisplayed, currentPage]);

  useEffect(() => {
    if (storyRef.current) {
      setContainerWidth(storyRef.current.getBoundingClientRect().width / 2);
      setContainerHeight(storyRef.current.getBoundingClientRect().height);
    }

    // Determines the number of pages to display based on the window width
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768; // Adjust the width as needed for mobile detection
      setNumberOfPageDisplayed(isMobile ? 1 : 2);
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize); // Update on resize

    return () => {
      window.removeEventListener('resize', handleResize); // Cleanup on unmount
    };
  }, []);

  return (
    <div className="flex h-[80vh] flex-col gap-2" ref={storyRef}>
      <div className="flex h-full w-full overflow-hidden rounded-lg bg-white shadow-lg">
        {pagesRender.map((page, index) => {
          return (
            <div
              key={page.title ? page.title : `abstract-${index}`}
              className="relative flex-1 px-7 py-8 before:absolute before:inset-y-0 before:right-0 before:h-full before:w-[36px] before:bg-gradient-to-r before:from-transparent before:to-[#C7C9CB] before:opacity-30 before:content-['']"
            >
              {page?.title ? (
                <div className="flex flex-col gap-2">
                  <h2 className="text-[36px] font-bold">{page?.title}</h2>
                  <Image
                    src={page?.cover?.path ?? '/assets/images/user-avatar.jpeg'}
                    height={532}
                    width={100}
                    alt="Book cover"
                    className="w-full object-cover"
                  />
                </div>
              ) : (
                <>
                  {currentPage === 0 && <h6>Abstract</h6>}
                  <p className="pt-4 text-base text-[#45484A]">
                    {page?.abstract ?? ''}
                  </p>
                </>
              )}
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
