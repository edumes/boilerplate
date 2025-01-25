import { FormField } from '@/@types/forms';
import { z } from 'zod';

const defaultMessages = {
    required: (label: string) => `O campo ${label} é obrigatório`,
    invalidNumber: (label: string) => `O campo ${label} deve ser um número`,
    min: (label: string, min: number) => `${label} deve ser maior ou igual a ${min}`,
    max: (label: string, max: number) => `${label} deve ser menor ou igual a ${max}`,
    email: (label: string) => `${label} deve ser um email válido`,
    url: (label: string) => `${label} deve ser uma URL válida`
};

export const createValidationSchema = (fields: Record<string, FormField>) => {
    return z.object(
        Object.entries(fields).reduce((acc, [fieldName, field]) => {
            if (field.canAdd || field.canEdit) {
                let fieldSchema: any;

                switch (field.type) {
                    case 'text':
                    case 'richtext':
                        fieldSchema = z.string({
                            required_error: defaultMessages.required(field.label),
                        });

                        if (field.required) {
                            fieldSchema = fieldSchema.min(1, {
                                message: defaultMessages.required(field.label),
                            });
                        } else {
                            fieldSchema = fieldSchema.optional();
                        }
                        break;

                    case 'number':
                        fieldSchema = z
                            .number({
                                required_error: defaultMessages.required(field.label),
                                invalid_type_error: defaultMessages.invalidNumber(field.label),
                            })
                            .nullable()
                            .refine((val) => val !== null, {
                                message: defaultMessages.required(field.label),
                            });

                        if (field.number?.min !== undefined) {
                            fieldSchema = fieldSchema.min(field.number.min, {
                                message: defaultMessages.min(field.label, field.number.min),
                            });
                        }
                        if (field.number?.max !== undefined) {
                            fieldSchema = fieldSchema.max(field.number.max, {
                                message: defaultMessages.max(field.label, field.number.max),
                            });
                        }
                        break;

                    case 'email':
                        fieldSchema = z.string().email({
                            message: defaultMessages.email(field.label),
                        });
                        break;

                    case 'url':
                        fieldSchema = z.string().url({
                            message: defaultMessages.url(field.label),
                        });
                        break;

                    case 'boolean':
                        fieldSchema = z.boolean().refine((val) => typeof val === 'boolean', {
                            message: `${field.label} deve ser verdadeiro ou falso`,
                        });
                        break;

                    case 'date':
                    case 'datetime':
                        fieldSchema = z.any()
                            .refine((val) => val === null || val instanceof Date || (val && val.isValid()), {
                                message: defaultMessages.required(field.label),
                            });

                        if (field.required) {
                            fieldSchema = fieldSchema.refine((val) => val !== null && val !== undefined, {
                                message: defaultMessages.required(field.label),
                            });
                        } else {
                            fieldSchema = fieldSchema.optional();
                        }
                        break;

                    case 'select':
                        fieldSchema = z.number({
                            required_error: defaultMessages.required(field.label),
                        });
                        break;

                    default:
                        fieldSchema = z.string();
                }

                acc[fieldName] = fieldSchema;
            }
            return acc;
        }, {} as Record<string, z.ZodTypeAny>)
    );
};
