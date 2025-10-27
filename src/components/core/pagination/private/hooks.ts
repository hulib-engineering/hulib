import { createContext, useCallback, useContext, useMemo } from 'react';

import type { UsePagination } from './types';

type UsePaginationProps = {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  hrefsArray?: string[];
  edgePageCount?: number;
  middlePagesSiblingCount?: number;
};

const usePagination = ({
  currentPage,
  setCurrentPage,
  totalPages,
  hrefsArray,
  edgePageCount = 1,
  middlePagesSiblingCount = 1,
}: UsePaginationProps): UsePagination => {
  const pages = Array(totalPages)
    .fill(0)
    .map((_, i) => i + 1);
  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;
  const isReachedToFirst = currentPage <= middlePagesSiblingCount;
  const isReachedToLast = currentPage + middlePagesSiblingCount >= totalPages;

  const middlePages = useMemo(() => {
    const middlePageCount = middlePagesSiblingCount * 2 + 1;
    if (isReachedToFirst) {
      return pages.slice(0, middlePageCount);
    }
    if (isReachedToLast) {
      return pages.slice(-middlePageCount);
    }
    return pages.slice(
      currentPage - middlePagesSiblingCount,
      currentPage + middlePagesSiblingCount + 1,
    );
  }, [currentPage, isReachedToFirst, isReachedToLast, middlePagesSiblingCount, pages]);

  const getAllPreviousPages = useCallback(() => {
    if (!middlePages.length) {
      return [];
    }
    return pages.slice(0, middlePages[0]! - 1);
  }, [pages, middlePages]);

  const previousPages = useMemo(() => {
    if (isReachedToFirst || getAllPreviousPages().length < 1) {
      return [];
    }
    return pages
      .slice(0, edgePageCount)
      .filter(p => !middlePages.includes(p));
  }, [edgePageCount, getAllPreviousPages, isReachedToFirst, middlePages, pages]);
  const getAllNextPages = useMemo(() => {
    return pages.slice(
      middlePages[middlePages.length - 1],
      pages[pages.length],
    );
  }, [pages, middlePages]);
  const nextPages = useMemo(() => {
    if (isReachedToLast) {
      return [];
    }
    if (getAllNextPages.length < 1) {
      return [];
    }
    return pages
      .slice(pages.length - edgePageCount, pages.length)
      .filter(p => !middlePages.includes(p));
  }, [edgePageCount, getAllNextPages.length, isReachedToLast, middlePages, pages]);
  const isPreviousTruncable = useMemo(() => {
    if (!middlePages.length || !previousPages.length) {
      return false;
    }
    // Is truncable if first value of middlePage is larger than the last value of previousPages
    return middlePages[0]! > previousPages[previousPages.length - 1]! + 1;
  }, [previousPages, middlePages]);
  const isNextTruncable = useMemo(() => {
    if (!middlePages.length || !nextPages.length) {
      return false;
    }
    // Is truncable if last value of middlePage is larger than the first value of previousPages
    return middlePages[middlePages.length - 1]! + 1 < nextPages[0]!;
  }, [nextPages, middlePages]);

  return {
    currentPage,
    setCurrentPage,
    pages,
    hrefsArray,
    hasPreviousPage,
    hasNextPage,
    previousPages,
    isPreviousTruncable,
    middlePages,
    isNextTruncable,
    nextPages,
  };
};

const defaultState: UsePagination = {
  currentPage: 0,
  setCurrentPage: () => {},
  pages: [],
  hrefsArray: [],
  hasPreviousPage: false,
  hasNextPage: false,
  previousPages: [],
  isPreviousTruncable: false,
  middlePages: [],
  isNextTruncable: false,
  nextPages: [],
};

const PaginationContext = createContext(defaultState);
PaginationContext.displayName = 'PaginationContext';

const usePaginationContext = (component: string) => {
  const context = useContext(PaginationContext);
  if (context === null) {
    // if (Error.captureStackTrace) Error.captureStackTrace(err, usePaginationContext);
    throw new Error(
      `<${component}> is missing a parent <Pagination /> component.`,
    );
  }
  return context;
};

export { PaginationContext };
export { usePagination, usePaginationContext };
