import { useState } from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  RowData,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import { FormField } from '@/types/forms';
import dayjs from 'dayjs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { User } from '../data/schema';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTablePagination } from './data-table-pagination';
import { DataTableRowActions } from './data-table-row-actions';
import { DataTableToolbar } from './data-table-toolbar';

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    className: string;
  }
}

export interface PaginationProps {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface DataTableProps {
  data: User[];
  meta?: PaginationProps;
  crud: string;
  fields: ColumnDef<any>[] | Record<string, FormField>;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  pagination?: boolean;
}

export function CrudTable({
  data: initialData,
  meta,
  crud,
  fields,
  onPageChange,
  onLimitChange,
  pagination = true
}: DataTableProps) {
  const [data, setData] = useState(initialData);
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = Array.isArray(fields)
    ? [
        ...fields.filter((field: any) => field.canBrowse !== false),
        {
          id: 'actions',
          cell: ({ row }: { row: any }) => <DataTableRowActions row={row} />,
          enableSorting: false,
          enableHiding: false
        }
      ]
    : [
        ...Object.keys(fields || {})
          .filter((fieldKey: any) => fields[fieldKey].canBrowse !== false)
          .map((fieldKey: any) => {
            const field: FormField = fields[fieldKey];

            if (field.type === 'date') {
              return {
                accessorKey: fieldKey,
                header: ({ column }: any) => (
                  <DataTableColumnHeader column={column} title={field.label} />
                ),
                cell: ({ row }: any) => {
                  const date = row.getValue(fieldKey);
                  return <div>{date ? dayjs(date).format('DD/MM/YYYY') : '-'}</div>;
                }
              };
            }

            if (field.type === 'select') {
              const fkMatch = fieldKey.match(/_fk_(.+)_id$/);
              return {
                accessorKey: fkMatch ? fkMatch[1] : fieldKey,
                header: ({ column }: any) => (
                  <DataTableColumnHeader column={column} title={field.label} />
                ),
                cell: ({ row }: any) => {
                  if (fkMatch) {
                    const relationName = fkMatch[1];
                    const relationObject = row.original[relationName];
                    return <div>{relationObject?.[`${relationName}_name`] || '-'}</div>;
                  }
                  const value = row.getValue(fieldKey);
                  return <div>{value || '-'}</div>;
                }
              };
            }

            return {
              accessorKey: fieldKey,
              header: ({ column }) => <DataTableColumnHeader column={column} title={field.label} />,
              cell: ({ row }) => <div>{row.getValue(fieldKey)}</div>
            };
          }),
        {
          id: 'actions',
          cell: ({ row }: { row: any }) => <DataTableRowActions row={row} />,
          enableSorting: false,
          enableHiding: false
        }
      ];

  const table = useReactTable({
    data,
    columns: columns || [],
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      ...(meta && {
        pagination: {
          pageIndex: meta.page - 1,
          pageSize: meta.limit
        }
      })
    },
    pageCount: meta?.totalPages,
    manualPagination: pagination,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues()
  });

  return (
    <div className='space-y-4'>
      {pagination && (
        <DataTableToolbar
          crud={crud}
          table={table}
          onSearch={searchResults => setData(searchResults)}
        />
      )}
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} className='group/row'>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={header.column.columnDef.meta?.className ?? ''}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className='group/row'
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell
                      key={cell.id}
                      className={cell.column.columnDef.meta?.className ?? ''}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length || 1} className='h-24 text-center'>
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {pagination && meta && onPageChange && onLimitChange && (
        <DataTablePagination
          table={table}
          meta={meta}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
        />
      )}
    </div>
  );
}
