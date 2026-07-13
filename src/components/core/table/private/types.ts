import type { ColumnDef, RowData } from '@tanstack/react-table';
import type { ReactNode } from 'react';

declare module '@tanstack/react-table' {
  // eslint-disable-next-line ts/consistent-type-definitions, ts/no-unused-vars -- module augmentation
  interface ColumnMeta<TData extends RowData, TValue> {
    headerClassName?: string;
    cellClassName?: string;
    colClassName?: string;
  }
}

type TableProps<TData extends RowData> = {
  columns: ReadonlyArray<ColumnDef<TData, any>>;
  data: readonly TData[];
  defaultColumn?: Partial<ColumnDef<TData>>;
  width?: string | number;
  height?: string | number;
  maxWidth?: string | number;
  maxHeight?: string | number;
  /** Slot below the table, rendered inside `Footer` (e.g. pagination). */
  footer?: ReactNode;
};

type TablePagination = {
  totalPages: number;
  currentPage: number;
  hasNextPage?: boolean;
  onPageChange: (page: number) => void;
  footerClassName?: string;
};

export type { TablePagination, TableProps };
