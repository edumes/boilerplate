'use client';

import { AsyncSelect } from '@/components/ui/async-select';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField as IFormField } from '@/types/forms';
import { CircleXIcon } from 'lucide-react';
import { Control } from 'react-hook-form';

const widthClasses: { [key: number]: string } = {
    1: 'col-span-1',
    2: 'col-span-2',
    3: 'col-span-3',
    4: 'col-span-4',
    6: 'col-span-6',
    8: 'col-span-8',
    12: 'col-span-12',
};

interface Config {
    fields: IFormField;
}

interface CrudFormalizeProps {
    control: Control;
    config: Config;
}

export function CrudFormalize({ control, config }: CrudFormalizeProps) {
    const sortedFields = Object.entries(config.fields)
        .sort(([, a], [, b]) => a.order - b.order)
        .map(([name, fieldConfig]) => ({ name, ...fieldConfig }));

    return (
        <div className="grid grid-cols-12 gap-4">
            {sortedFields.map((field) => (
                <div
                    key={field.name}
                    className={widthClasses[field.width] || 'col-span-12'}
                >
                    <FormField
                        control={control}
                        name={field.name}
                        render={({ field: renderField }) => {
                            const renderInputComponent = () => {
                                switch (field.type) {
                                    case 'select':
                                        return (
                                            <AsyncSelect<any>
                                                fetcher={field.select.url}
                                                renderOption={(option) => (
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex flex-col">
                                                            <div className="font-medium">{option.label}</div>
                                                            {/* <div className="text-xs text-muted-foreground">{option.value}</div> */}
                                                        </div>
                                                    </div>
                                                )}
                                                getOptionValue={(option) => String(option.value)}
                                                getDisplayValue={(option) => (
                                                    <div className="flex items-center gap-2 text-left">
                                                        <div className="flex flex-col">
                                                            <div className="font-medium">{option.label}</div>
                                                            {/* <div className="text-xs text-muted-foreground">{option.value}</div> */}
                                                        </div>
                                                    </div>
                                                )}
                                                notFound={<div className="py-6 text-center text-sm">No {field.label} found</div>}
                                                name={field.name}
                                                placeholder={`Search options...`}
                                                value={String(renderField.value)}
                                                onChange={(value) => renderField.onChange(Number(value))}
                                                width="auto"
                                            />
                                        );
                                    case 'date':
                                        return (
                                            <Input
                                                type="date"
                                                autoComplete="off"
                                                {...renderField}
                                            />
                                        );
                                    case 'richtext':
                                        return (
                                            <Textarea
                                                className="min-h-[100px]"
                                                autoComplete="off"
                                                {...renderField}
                                            />
                                        );
                                    default:
                                        return (
                                            <div className="relative">
                                                <Input
                                                    type={field.type}
                                                    autoComplete="off"
                                                    placeholder={field.label}
                                                    {...renderField}
                                                />
                                                {renderField.value && (
                                                    <button
                                                        className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                                        aria-label="Clear input"
                                                        type='button'
                                                        onClick={() => renderField.onChange('')}
                                                    >
                                                        <CircleXIcon size={16} strokeWidth={2} aria-hidden="true" />
                                                    </button>
                                                )}
                                            </div>
                                        );
                                }
                            };

                            return (
                                <FormItem className="flex flex-col space-y-1.5">
                                    <FormLabel>
                                        {field.label}
                                        {field.required && (
                                            <span className="text-destructive ml-1">*</span>
                                        )}
                                    </FormLabel>
                                    <FormControl>{renderInputComponent()}</FormControl>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />
                </div>
            ))}
        </div>
    );
}
