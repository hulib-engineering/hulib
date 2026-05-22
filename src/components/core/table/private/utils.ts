import type { Cell, Header } from '@tanstack/react-table';

import { mergeClassnames } from '@/components/core/private/utils';

export const getHeaderClassName = <TData>(
  header: Header<TData, unknown>,
  className?: string,
) =>
  mergeClassnames(
    'bg-primary-98 pb-4 pt-3 px-4 text-base font-medium leading-6 tracking-wide text-primary-60',
    'text-left',
    header.column.columnDef.meta?.headerClassName,
    className,
  );

export const getBodyCellClassName = <TData>(
  cell: Cell<TData, unknown>,
  className?: string,
) =>
  mergeClassnames(
    'pb-4 pt-3 px-4 align-middle',
    cell.column.columnDef.meta?.cellClassName,
    className,
  );
