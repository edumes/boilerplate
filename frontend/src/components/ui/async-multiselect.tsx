import { useCallback, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Check, ChevronsUpDown, Loader2, X } from 'lucide-react';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/use-debounce';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export interface Option {
  value: string;
  label: string;
  disabled?: boolean;
  description?: string;
  icon?: React.ReactNode;
}

export interface AsyncMultiSelectProps<T> {
  fetcher: string;
  defaultOptions: Array<any>;
  preload?: boolean;
  filterFn?: (option: T, query: string) => boolean;
  renderOption: (option: T) => React.ReactNode;
  getOptionValue: (option: T) => number;
  getDisplayValue: (option: T) => React.ReactNode;
  notFound?: React.ReactNode;
  loadingSkeleton?: React.ReactNode;
  value: number[];
  onChange: (value: number[]) => void;
  name: string;
  placeholder?: string;
  disabled?: boolean;
  width?: string | number;
  className?: string;
  triggerClassName?: string;
  noResultsMessage?: string;
  clearable?: boolean;
  maxDisplayedItems?: number;
}

export function AsyncMultiSelect<T>({
  fetcher,
  defaultOptions,
  preload,
  filterFn,
  renderOption,
  getOptionValue,
  getDisplayValue,
  notFound,
  loadingSkeleton,
  name,
  placeholder = 'Select...',
  value,
  onChange,
  disabled = false,
  width = '200px',
  className,
  triggerClassName,
  noResultsMessage,
  maxDisplayedItems = 3
}: AsyncMultiSelectProps<T>) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedValues, setSelectedValues] = useState<number[]>(value);
  const [selectedOptions, setSelectedOptions] = useState<T[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, preload ? 0 : 300);
  const [originalOptions, setOriginalOptions] = useState<T[]>([]);

  const { data: queryData, isLoading: queryLoading } = useQuery({
    queryKey: [`${name}-select-options`, debouncedSearchTerm],
    queryFn: async () => {
      if (!fetcher) return [];
      const response = await api.get(`${fetcher}`, {
        params: {
          search: debouncedSearchTerm
        }
      });
      return response.data.data || [];
    },
    enabled: fetcher ? (preload ? !debouncedSearchTerm : true) : false
  });

  useEffect(() => {
    setSelectedValues(value);
  }, [value]);

  useEffect(() => {
    if (value.length > 0 && options.length > 0) {
      const selected = options.filter(opt => {
        const optValue = getOptionValue(opt);
        return value.includes(optValue);
      });
      setSelectedOptions(selected);
    } else {
      setSelectedOptions([]);
    }
  }, [value, options, getOptionValue]);

  useEffect(() => {
    const initializeOptions = async () => {
      if (!fetcher && defaultOptions) {
        const mappedOptions = Object.entries(defaultOptions).map(([value, label]) => ({
          value: Number(value),
          label
        })) as T[];
        setOriginalOptions(mappedOptions);
        setOptions(mappedOptions);
        return;
      }

      if (!queryData) return;

      try {
        setLoading(true);
        setError(null);
        const data = await fetchData();
        setOriginalOptions(data);
        setOptions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch options');
      } finally {
        setLoading(false);
      }
    };

    if (!mounted && (queryData || (!fetcher && defaultOptions))) {
      initializeOptions();
    }
  }, [mounted, fetcher, queryData, defaultOptions]);

  useEffect(() => {
    if (!queryData) return;

    if (preload) {
      if (debouncedSearchTerm) {
        setOptions(
          originalOptions.filter(option =>
            filterFn ? filterFn(option, debouncedSearchTerm) : true
          )
        );
      } else {
        setOptions(originalOptions);
      }
    } else {
      setOptions(queryData);
    }
  }, [queryData, debouncedSearchTerm, preload, filterFn, originalOptions]);

  useEffect(() => {
    setLoading(queryLoading);
  }, [queryLoading]);

  const handleSelect = useCallback(
    (currentValue: number) => {
      const newValues = selectedValues.includes(currentValue)
        ? selectedValues.filter(v => v !== currentValue)
        : [...selectedValues, currentValue];

      setSelectedValues(newValues);
      onChange(newValues);
    },
    [selectedValues, onChange]
  );

  const removeValue = (valueToRemove: number) => {
    const newValues = selectedValues.filter(v => v !== valueToRemove);
    setSelectedValues(newValues);
    onChange(newValues);
  };

  async function fetchData(): Promise<any[]> {
    return queryData || [];
  }

  const displayedItems = selectedOptions.slice(0, maxDisplayedItems);
  const hiddenItemsCount = selectedOptions.length - maxDisplayedItems;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className={cn(
            'justify-between w-full gap-2 min-h-10 h-auto',
            disabled && 'opacity-50 cursor-not-allowed',
            triggerClassName
          )}
          style={{ width: width }}
          disabled={disabled}
        >
          <div className='flex flex-wrap gap-1 flex-1'>
            {displayedItems.map(option => (
              <Badge
                key={getOptionValue(option)}
                variant='secondary'
                className='flex items-center gap-1'
              >
                {getDisplayValue(option)}
                <button
                  type='button'
                  className='hover:opacity-70'
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeValue(getOptionValue(option));
                  }}
                >
                  <X size={12} />
                </button>
              </Badge>
            ))}
            {hiddenItemsCount > 0 && (
              <Badge variant='outline' className='shrink-0'>
                +{hiddenItemsCount}
              </Badge>
            )}
            {selectedOptions.length === 0 && (
              <p className='text-muted-foreground/70'>{placeholder}</p>
            )}
          </div>
          <div className='flex items-center gap-2'>
            {selectedOptions.length > 0 && (
              <button
                type='button'
                className='hover:opacity-70 text-muted-foreground'
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedValues([]);
                  onChange([]);
                }}
              >
                <X size={16} />
              </button>
            )}
            <ChevronsUpDown className='opacity-50' size={16} />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn('p-0 w-[--radix-popover-trigger-width]', className)}
        style={{ minWidth: 'max-content' }}
        align='start'
      >
        <Command shouldFilter={false}>
          <div className='relative border-b w-full'>
            <CommandInput
              placeholder='Search options...'
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            {loading && options.length > 0 && (
              <div className='absolute right-2 top-1/2 -translate-y-1/2'>
                <Loader2 className='h-4 w-4 animate-spin' />
              </div>
            )}
          </div>
          <CommandList>
            {error && <div className='p-4 text-destructive text-center'>{error}</div>}
            {loading && options.length === 0 && (loadingSkeleton || <DefaultLoadingSkeleton />)}
            {!loading &&
              !error &&
              options.length === 0 &&
              (notFound || (
                <CommandEmpty>{noResultsMessage ?? `No ${name.toLowerCase()} found.`}</CommandEmpty>
              ))}
            <CommandGroup>
              {options.map(option => {
                const optionValue = getOptionValue(option);
                const isSelected = selectedValues.includes(optionValue);

                return (
                  <CommandItem
                    key={optionValue}
                    value={String(optionValue)}
                    onSelect={() => handleSelect(optionValue)}
                  >
                    <div className='flex items-center gap-2 w-full'>
                      <div
                        className={cn(
                          'flex items-center justify-center h-4 w-4 rounded-sm border',
                          isSelected ? 'bg-primary border-primary' : 'border-muted-foreground/50'
                        )}
                      >
                        {isSelected && <Check className='h-3 w-3 text-primary-foreground' />}
                      </div>
                      {renderOption(option)}
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function DefaultLoadingSkeleton() {
  return (
    <CommandGroup>
      {[1, 2, 3].map(i => (
        <CommandItem key={i} disabled>
          <div className='flex items-center gap-2 w-full'>
            <div className='flex flex-col flex-1 gap-1'>
              <div className='h-4 w-24 animate-pulse bg-muted rounded' />
              <div className='h-3 w-16 animate-pulse bg-muted rounded' />
            </div>
          </div>
        </CommandItem>
      ))}
    </CommandGroup>
  );
}
