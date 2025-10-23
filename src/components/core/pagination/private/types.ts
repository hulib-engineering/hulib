import type { ComponentPropsWithoutRef, ElementType, PropsWithChildren, ReactNode } from 'react';

type UsePagination = {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pages: number[];
  hrefsArray?: string[];
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  previousPages: number[];
  isPreviousTruncable: boolean;
  middlePages: number[];
  isNextTruncable: boolean;
  nextPages: number[];
};

type PaginationProps = {
  className?: string;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  hrefsArray?: string[];
  edgePageCount?: number;
  middlePagesSiblingCount?: number;
};

type ChildrenFunc = {
  (data: { disabled?: boolean }): ReactNode;
};

type PropsWithChildrenFunc<P = unknown> = P & {
  children?: ReactNode | ChildrenFunc | undefined;
};

type NextPrevButtonProps<C extends ElementType> = {
  as?: C;
  className?: string;
  children?: ReactNode | ChildrenFunc;
};

type PolymorphicNextPrevButtonProps<C extends ElementType> =
  PropsWithChildrenFunc<NextPrevButtonProps<C>> &
  Omit<ComponentPropsWithoutRef<C>, keyof NextPrevButtonProps<C>>;

type PagesProps<C extends ElementType> = {
  as?: C;
  className?: string;
  truncableText?: ReactNode;
};

type PolymorphicPagesProps<C extends ElementType> =
  PropsWithChildren<PagesProps<C>> &
  Omit<ComponentPropsWithoutRef<C>, keyof PagesProps<C>>;

type TruncableElementProps = {
  prev?: boolean;
};

export type { PaginationProps, PolymorphicNextPrevButtonProps, PolymorphicPagesProps, TruncableElementProps, UsePagination };
