import { useDebounce } from "@/hooks/use-debounce";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export interface Option {
    value: string;
    label: string;
    disabled?: boolean;
    description?: string;
    icon?: React.ReactNode;
}

export interface AsyncSelectProps<T> {
    /** Async function to fetch options */
    fetcher: string;
    /** Preload all data ahead of time */
    preload?: boolean;
    /** Function to filter options */
    filterFn?: (option: T, query: string) => boolean;
    /** Function to render each option */
    renderOption: (option: T) => React.ReactNode;
    /** Function to get the value from an option */
    getOptionValue: (option: T) => string;
    /** Function to get the display value for the selected option */
    getDisplayValue: (option: T) => React.ReactNode;
    /** Custom not found message */
    notFound?: React.ReactNode;
    /** Custom loading skeleton */
    loadingSkeleton?: React.ReactNode;
    /** Currently selected value */
    value: string;
    /** Callback when selection changes */
    onChange: (value: string) => void;
    /** Label for the select field */
    name: string;
    /** Placeholder text when no selection */
    placeholder?: string;
    /** Disable the entire select */
    disabled?: boolean;
    /** Custom width for the popover */
    width?: string | number;
    /** Custom class names */
    className?: string;
    /** Custom trigger button class names */
    triggerClassName?: string;
    /** Custom no results message */
    noResultsMessage?: string;
    /** Allow clearing the selection */
    clearable?: boolean;
}

export function AsyncSelect<T>({
    fetcher,
    preload,
    filterFn,
    renderOption,
    getOptionValue,
    getDisplayValue,
    notFound,
    loadingSkeleton,
    name,
    placeholder = "Select...",
    value,
    onChange,
    disabled = false,
    width = "200px",
    className,
    triggerClassName,
    noResultsMessage,
    clearable = true,
}: AsyncSelectProps<T>) {
    const [mounted, setMounted] = useState(false);
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedValue, setSelectedValue] = useState(value);
    const [selectedOption, setSelectedOption] = useState<T | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, preload ? 0 : 300);
    const [originalOptions, setOriginalOptions] = useState<T[]>([]);

    const { data: queryData, isLoading: queryLoading } = useQuery({
        queryKey: [`${name}-select-options`, debouncedSearchTerm],
        queryFn: async () => {
            const response = await api.get(`${fetcher}`, {
                params: {
                    search: debouncedSearchTerm
                }
            });
            return response.data.data || [];
        },
        enabled: preload ? !debouncedSearchTerm : true
    });

    useEffect(() => {
        setMounted(true);
        setSelectedValue(value);
    }, [value]);

    useEffect(() => {
        if (value && options.length > 0) {
            const option = options.find(opt => getOptionValue(opt) === value);
            if (option) {
                setSelectedOption(option);
            }
        }
    }, [value, options, getOptionValue]);

    useEffect(() => {
        const initializeOptions = async () => {
            if (!queryData) return;

            try {
                setLoading(true);
                setError(null);
                const data = await fetchData(value);
                setOriginalOptions(data);
                setOptions(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch options');
            } finally {
                setLoading(false);
            }
        };

        if (!mounted && queryData) {
            initializeOptions();
        }
    }, [mounted, fetcher, value, queryData]);

    useEffect(() => {
        if (!queryData) return;

        if (preload) {
            if (debouncedSearchTerm) {
                setOptions(originalOptions.filter((option) =>
                    filterFn ? filterFn(option, debouncedSearchTerm) : true
                ));
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

    const handleSelect = useCallback((currentValue: string) => {
        const newValue = clearable && currentValue === selectedValue ? "" : currentValue;
        setSelectedValue(newValue);
        setSelectedOption(options.find((option) => getOptionValue(option) === newValue) || null);
        onChange(newValue);
        setOpen(false);
    }, [selectedValue, onChange, clearable, options, getOptionValue]);

    async function fetchData(query?: string): Promise<any[]> {
        if (!queryData) return [];

        if (query && query !== "") {
            const lowercaseQuery = query.toLowerCase();
            return queryData
                .filter((option: any) =>
                    option.label.toLowerCase().includes(lowercaseQuery)
                )
                .slice(0, 10);
        }

        return queryData.slice(0, 10);
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "justify-between w-full",
                        disabled && "opacity-50 cursor-not-allowed",
                        triggerClassName
                    )}
                    style={{ width: width }}
                    disabled={disabled}
                >
                    {selectedOption ? (
                        getDisplayValue(selectedOption)
                    ) : (
                        placeholder
                    )}
                    <ChevronsUpDown className="opacity-50" size={10} />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className={cn("p-0 w-[--radix-popover-trigger-width]", className)}
                style={{ minWidth: "max-content" }}
                align="start"
            >
                <Command shouldFilter={false}>
                    <div className="relative border-b w-full">
                        <CommandInput
                            placeholder={`Search options...`}
                            value={searchTerm}
                            onValueChange={(value) => {
                                setSearchTerm(value);
                            }}
                        />
                        {loading && options.length > 0 && (
                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center">
                                <Loader2 className="h-4 w-4 animate-spin" />
                            </div>
                        )}
                    </div>
                    <CommandList>
                        {error && (
                            <div className="p-4 text-destructive text-center">
                                {error}
                            </div>
                        )}
                        {loading && options.length === 0 && (
                            loadingSkeleton || <DefaultLoadingSkeleton />
                        )}
                        {!loading && !error && options.length === 0 && (
                            notFound || <CommandEmpty>{noResultsMessage ?? `No ${name.toLowerCase()} found.`}</CommandEmpty>
                        )}
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={getOptionValue(option)}
                                    value={getOptionValue(option)}
                                    onSelect={handleSelect}
                                >
                                    {renderOption(option)}
                                    <Check
                                        className={cn(
                                            "ml-auto h-3 w-3",
                                            selectedValue === getOptionValue(option) ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
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
            {[1, 2, 3].map((i) => (
                <CommandItem key={i} disabled>
                    <div className="flex items-center gap-2 w-full">
                        {/* <div className="h-6 w-6 rounded-full animate-pulse bg-muted" /> */}
                        <div className="flex flex-col flex-1 gap-1">
                            <div className="h-4 w-24 animate-pulse bg-muted rounded" />
                            <div className="h-3 w-16 animate-pulse bg-muted rounded" />
                        </div>
                    </div>
                </CommandItem>
            ))}
        </CommandGroup>
    );
}