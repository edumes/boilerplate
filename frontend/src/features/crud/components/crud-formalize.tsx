'use client';

import { AsyncMultiSelect } from '@/components/ui/async-multiselect';
import { AsyncSelect } from '@/components/ui/async-select';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { FormField as IFormField, UpdateFieldConfig } from '@/types/forms';
import { CircleXIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Control } from 'react-hook-form';
import { eventsRegistry } from '../events/eventsRegistry';
import { CrudGrid } from './crud-grid';

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
    setValue: (name: string, value: any) => void;
}

export function CrudFormalize({ control, config, setValue }: CrudFormalizeProps) {
    const [fieldsConfig, setFieldsConfig] = useState(config.fields);

    const updateFieldConfig: UpdateFieldConfig = (fieldName, newProps) => {
        setFieldsConfig((prev: any) => ({
            ...prev,
            [fieldName]: { ...prev[fieldName], ...newProps },
        }));
        console.log({ fieldsConfig });
    };

    const setFieldValue = (fieldName: string, value: any) => {
        setValue(fieldName, value);
    };

    const sortedFields = useMemo(() => {
        return Object.entries(fieldsConfig)
            .sort(([, a], [, b]) => a.order - b.order)
            .map(([name, fieldConfig]) => ({ name, ...fieldConfig }));
    }, [fieldsConfig]);

    return (
        <div className="grid grid-cols-12 gap-4">
            {sortedFields.map((field) => {
                const fieldEvents = eventsRegistry[field.name];

                return (
                    <div key={field.name} className={`${widthClasses[field.width] || "col-span-12"} ${field.hidden ? "hidden" : ""}`}>
                        <FormField
                            control={control}
                            name={field.name}
                            render={({ field: renderField }) => {
                                const handleChange = (value: any) => {
                                    if (fieldEvents && typeof fieldEvents.onChange === "function") {
                                        fieldEvents.onChange(value, renderField, updateFieldConfig, setFieldValue);
                                    } else {
                                        renderField.onChange(value);
                                    }
                                };

                                const handleBlur = (e: any) => {
                                    if (fieldEvents && typeof fieldEvents.onBlur === "function") {
                                        fieldEvents.onBlur(e.target.value, renderField, updateFieldConfig, setFieldValue);
                                    } else {
                                        renderField.onBlur();
                                    }
                                };

                                const renderInputComponent = () => {
                                    switch (field.type) {
                                        case "text":
                                            return (
                                                <div className="relative">
                                                    <Input
                                                        type={field.type}
                                                        autoComplete="off"
                                                        placeholder={field.label}
                                                        value={renderField.value}
                                                        onChange={(e) => handleChange(e.target.value)}
                                                        onBlur={handleBlur}
                                                        disabled={field.disabled}
                                                        readOnly={field.readonly}
                                                    />
                                                    {renderField.value && (
                                                        <button
                                                            className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center text-muted-foreground/80 transition-colors hover:text-foreground"
                                                            aria-label="Clear input"
                                                            type="button"
                                                            onClick={() => handleChange("")}
                                                        >
                                                            <CircleXIcon size={16} strokeWidth={2} />
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        case "select":
                                            return (
                                                <AsyncSelect<any>
                                                    fetcher={field.select.url}
                                                    defaultOptions={field.select.options}
                                                    renderOption={(option) => (
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex flex-col">
                                                                <div className="font-medium">{option.label}</div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    getOptionValue={(option) => {
                                                        return option.value?.toString() || option.id?.toString();
                                                    }}
                                                    getDisplayValue={(option) => (
                                                        <div className="flex items-center gap-2 text-left">
                                                            <div className="flex flex-col">
                                                                <div className="font-medium">{option.label}</div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    notFound={<div className="py-6 text-center text-sm">No {field.label} found</div>}
                                                    name={field.name}
                                                    placeholder={`Search options...`}
                                                    value={renderField.value ? String(renderField.value) : ""}
                                                    disabled={field.disabled}
                                                    width="auto"
                                                    onChange={(value) => {
                                                        const finalValue = field.select.url ? Number(value) : value;
                                                        handleChange(finalValue);
                                                    }}
                                                />
                                            );
                                        case "multiselect":
                                            return (
                                                <AsyncMultiSelect<any>
                                                    fetcher={field.select.url}
                                                    defaultOptions={field.select.options}
                                                    renderOption={(option) => (
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex flex-col">
                                                                <div className="font-medium">{option.label}</div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    getOptionValue={(option) => {
                                                        return Number(option.value || option.id);
                                                    }}
                                                    getDisplayValue={(option) => (
                                                        <div className="flex items-center gap-2 text-left">
                                                            <div className="flex flex-col">
                                                                <div className="font-medium">{option.label}</div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    notFound={<div className="py-6 text-center text-sm">No {field.label} found</div>}
                                                    name={field.name}
                                                    placeholder={`Search options...`}
                                                    value={Array.isArray(renderField.value) ? renderField.value : []}
                                                    disabled={field.disabled}
                                                    width="auto"
                                                    onChange={(value) => {
                                                        handleChange(value);
                                                    }}
                                                />
                                            );
                                        case "date":
                                            return (
                                                <Input
                                                    type="date"
                                                    autoComplete="off"
                                                    value={renderField.value}
                                                    onChange={(e) => handleChange(e.target.value)}
                                                    disabled={field.disabled}
                                                    readOnly={field.readonly}
                                                />
                                            );
                                        case "textarea":
                                            return (
                                                <Textarea
                                                    className="min-h-[100px]"
                                                    autoComplete="off"
                                                    value={renderField.value}
                                                    onChange={(e) => handleChange(e.target.value)}
                                                    disabled={field.disabled}
                                                    readOnly={field.readonly}
                                                />
                                            );
                                        case "checkbox":
                                            return (
                                                <Switch
                                                    checked={renderField.value}
                                                    onCheckedChange={handleChange}
                                                    disabled={field.disabled}
                                                />
                                            );
                                        case "grid":
                                            return (
                                                <CrudGrid
                                                    crud={field.name}
                                                    data={renderField.value || []}
                                                    onChange={(newData) => handleChange(newData)}
                                                />
                                            );
                                        default:
                                            return (
                                                <Skeleton className="h-10 w-100" />
                                            );
                                    }
                                };

                                return (
                                    <FormItem className="flex flex-col space-y-1.5">
                                        <FormLabel>
                                            {field.label}
                                            {field.required && <span className="text-destructive ml-1">*</span>}
                                        </FormLabel>
                                        <FormControl>{renderInputComponent()}</FormControl>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />
                    </div>
                );
            })}
        </div>
    );
}
