import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { api } from '@/lib/api';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useQuery } from '@tanstack/react-query';
import { Table } from '@tanstack/react-table';
import { useState } from 'react';
import { userTypes } from '../data/data';
import { DataTableFacetedFilter } from './data-table-faceted-filter';
import { DataTableViewOptions } from './data-table-view-options';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  crud: string;
  onSearch?: (data: TData[]) => void;
}

export function DataTableToolbar<TData>({
  crud,
  table,
  onSearch,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [searchInput, setSearchInput] = useState('');
  const searchTerm = useDebounce(searchInput, 500);

  const { data: searchResults } = useQuery({
    queryKey: ['search', searchTerm],
    queryFn: async () => {
      if (!searchTerm) {
        const response = await api.get(`/${crud}`);
        const data = response.data.data || {};
        onSearch?.(data);
        return data;
      }
      const response = await api.get(`/${crud}/search?searchTerm=${searchTerm}`);
      const data = response.data.data || {};
      onSearch?.(data);
      return data;
    },
    enabled: searchTerm.length > 2 || searchTerm === '',
  });

  console.log({ searchResults });

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        <Input
          placeholder='Pesquisar...'
          onChange={(event) => setSearchInput(event.target.value)}
          className='h-8 w-[150px] lg:w-[350px]'
        />
        <div className='flex gap-x-2'>
          {table.getColumn('project_fk_situation_id') && (
            <DataTableFacetedFilter
              column={table.getColumn('status')}
              title='Status'
              options={[
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' },
                { label: 'Invited', value: 'invited' },
                { label: 'Suspended', value: 'suspended' },
              ]}
            />
          )}
          {table.getColumn('role') && (
            <DataTableFacetedFilter
              column={table.getColumn('role')}
              title='Role'
              options={userTypes.map((t) => ({ ...t }))}
            />
          )}
        </div>
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => table.resetColumnFilters()}
            className='h-8 px-2 lg:px-3'
          >
            Reset
            <Cross2Icon className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
