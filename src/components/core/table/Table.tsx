'use client';

import type { ColumnDef } from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useRef } from 'react';

import Body from '@/components/core/table/private/components/Body';
import Footer from '@/components/core/table/private/components/Footer';
import Header from '@/components/core/table/private/components/Header';
import TableWrapper from '@/components/core/table/private/components/TableWrapper';
import TH from '@/components/core/table/private/components/TH';
import type { TableProps } from '@/components/core/table/private/types';
import '@/components/core/table/private/types';
import useScrollState from '@/components/core/table/private/hooks/useScrollState';
import { getBodyCellClassName } from '@/components/core/table/private/utils';

const Table = <TData extends object>({
  columns,
  data,
  defaultColumn,
  width,
  height,
  maxWidth,
  maxHeight,
  footer,
}: TableProps<TData>) => {
  const tableRef = useRef<HTMLDivElement>(null);

  const { scrollState, handleScroll } = useScrollState(tableRef);

  const table = useReactTable({
    data: data as TData[],
    columns: columns as ColumnDef<TData, any>[],
    defaultColumn,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <TableWrapper
      ref={tableRef}
      onScroll={handleScroll}
      isScrolledToLeft={scrollState.scrolledToLeft}
      isScrolledToRight={scrollState.scrolledToRight}
      style={{ width, height, maxWidth, maxHeight }}
    >
      <table className="w-full border-collapse">
        <colgroup>
          {table.getAllLeafColumns().map(column => (
            <col
              key={column.id}
              className={column.columnDef.meta?.colClassName}
            />
          ))}
        </colgroup>

        <Header>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id} className="border-b border-neutral-80">
              {headerGroup.headers.map(header => (
                <TH
                  key={header.id}
                  className={header.column.columnDef.meta?.headerClassName}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TH>
              ))}
            </tr>
          ))}
        </Header>

        <Body>
          {table.getRowModel().rows.map(row => (
            <tr
              key={row.id}
              className="border-y border-neutral-80"
            >
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className={getBodyCellClassName(cell)}>
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext(),
                  )}
                </td>
              ))}
            </tr>
          ))}
        </Body>
      </table>

      {footer && <Footer>{footer}</Footer>}
    </TableWrapper>
  );
};

export default Table;
