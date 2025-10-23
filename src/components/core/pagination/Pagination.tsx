import React from 'react';

import { PaginationContext, usePagination, usePaginationContext } from './private/hooks';
import type {
  PaginationProps,
  PolymorphicNextPrevButtonProps,
  PolymorphicPagesProps,
  TruncableElementProps,
  UsePagination,
} from './private/types';

import { mergeClassnames } from '@/components/core/private/utils';
import type { WithChildren } from '@/components/core/private/types';

const PaginationRoot = ({
  children,
  className,
  currentPage = 0,
  setCurrentPage = () => {},
  totalPages,
  hrefsArray,
  edgePageCount = 1,
  middlePagesSiblingCount,
}: WithChildren<PaginationProps>) => {
  const pagination = usePagination({
    currentPage,
    setCurrentPage,
    totalPages,
    hrefsArray,
    edgePageCount,
    middlePagesSiblingCount,
  });
  return (
    <PaginationContext.Provider value={pagination}>
      <div
        className={mergeClassnames(
          'flex justify-end items-center gap-2 w-full select-none',
          className,
        )}
      >
        {children}
      </div>
    </PaginationContext.Provider>
  );
};

export const PrevButton = <C extends React.ElementType = 'button'>({
  className,
  children,
  as,
  ...rest
}: PolymorphicNextPrevButtonProps<C>) => {
  const Component = as || 'button';
  const { currentPage, setCurrentPage }: UsePagination
    = usePaginationContext('PrevButton');
  const previous = () => {
    if (currentPage + 1 > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const disabled = currentPage === 0;
  const childArray
    = typeof children !== 'function' ? React.Children.toArray(children) : [];

  if (typeof children === 'function') {
    return (
      <Component
        {...rest}
        className={mergeClassnames(className)}
        onClick={() => previous()}
        aria-disabled={disabled}
        disabled={disabled}
        type={as === 'button' || as === undefined ? 'button' : undefined}
      >
        {children({ disabled })}
      </Component>
    );
  }

  return (
    <Component
      {...rest}
      className={mergeClassnames(
        'moon-disabled:cursor-not-allowed moon-disabled:opacity-60',
        className,
      )}
      onClick={() => previous()}
      aria-disabled={disabled}
      disabled={disabled}
      type={as === 'button' || as === undefined ? 'button' : undefined}
    >
      {childArray?.map(ch => ch)}
    </Component>
  );
};

export const NextButton = <C extends React.ElementType = 'button'>({
  className,
  children,
  as,
  ...rest
}: PolymorphicNextPrevButtonProps<C>) => {
  const Component = as || 'button';
  const pagination: UsePagination = usePaginationContext('NextButton');
  const next = () => {
    if (pagination.currentPage + 1 < pagination.pages.length) {
      pagination.setCurrentPage(pagination.currentPage + 1);
    }
  };
  const childArray
    = typeof children !== 'function' ? React.Children.toArray(children) : [];
  const disabled = pagination.currentPage === pagination.pages.length - 1;

  if (typeof children === 'function') {
    return (
      <Component
        {...rest}
        className={mergeClassnames(className)}
        onClick={() => next()}
        aria-disabled={disabled}
        disabled={disabled}
        type={as === 'button' || as === undefined ? 'button' : undefined}
      >
        {children({ disabled })}
      </Component>
    );
  }
  return (
    <Component
      {...rest}
      className={mergeClassnames(
        'moon-disabled:cursor-not-allowed moon-disabled:opacity-60',
        className,
      )}
      onClick={() => next()}
      aria-disabled={disabled}
      disabled={disabled}
      type={as === 'button' || as === undefined ? 'button' : undefined}
    >
      {childArray?.map(ch => ch)}
    </Component>
  );
};

const TruncableElement = ({
  prev,
  children,
}: WithChildren<TruncableElementProps>) => {
  const pagination: UsePagination = usePaginationContext('TruncableElement');

  const { isPreviousTruncable, isNextTruncable } = pagination;

  return (isPreviousTruncable && prev === true)
    || (isNextTruncable && !prev) ? (
        <span className="truncable flex min-w-8 justify-center">
          {children}
        </span>
      ) : null;
};

const Pages = <C extends React.ElementType = 'a'>({
  as,
  className,
  truncableText = '...',
  ...rest
}: PolymorphicPagesProps<C>) => {
  const Component = as || 'a';
  const pagination: UsePagination = usePaginationContext('Pagination.Pages');

  const renderPage = (page: number) => (
    <Component
      key={page}
      aria-label={`page ${page}`}
      tabIndex={0}
      onClick={() => pagination.setCurrentPage(page - 1)}
      href={pagination.hrefsArray && pagination.hrefsArray[page - 1]}
      type={as === 'button' ? 'button' : undefined}
      className={mergeClassnames(
        'flex items-center justify-center cursor-pointer w-8 h-8 rounded-lg focus:outline-none transition-colors',
        className,
        pagination.currentPage + 1 === page
          ? 'text-white bg-primary-60'
          : 'text-[#1E1E1E]',
      )}
      {...rest}
    >
      {page}
    </Component>
  );

  return (
    <nav
      className={mergeClassnames(
        'flex gap-2 items-center justify-center h-10 text-sm leading-4',
        className,
      )}
      aria-label="pagination"
    >
      {pagination.previousPages.map(renderPage)}
      <TruncableElement prev>{truncableText}</TruncableElement>
      {pagination.middlePages.map(renderPage)}
      <TruncableElement>{truncableText}</TruncableElement>
      {pagination.nextPages.map(renderPage)}
    </nav>
  );
};

const Pagination = Object.assign(PaginationRoot, {
  Pages,
  PrevButton,
  NextButton,
});

export default Pagination;
