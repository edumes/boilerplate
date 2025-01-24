import { FormField } from '@/@types/forms';
import { z } from 'zod';

export const createValidationSchema = (fields: Record<string, FormField>) => {
    return z.object(
        Object.entries(fields).reduce(
            (acc, [fieldName, field]) => {
                if (field.canAdd) {
                    let fieldSchema: any = z.any();

                    switch (field.type) {
                        case 'text':
                        case 'richtext':
                            fieldSchema = z.string();
                            break;
                        case 'number':
                            fieldSchema = z.number();
                            if (field.number?.min !== undefined) {
                                fieldSchema = fieldSchema.min(field.number.min);
                            }
                            if (field.number?.max !== undefined) {
                                fieldSchema = fieldSchema.max(field.number.max);
                            }
                            break;
                        case 'email':
                            fieldSchema = z.string().email({
                                message: `${field.label} deve ser um email válido`,
                            });
                            break;
                        case 'url':
                            fieldSchema = z.string().url({
                                message: `${field.label} deve ser uma URL válida`,
                            });
                            break;
                        case 'boolean':
                            fieldSchema = z.boolean();
                            break;
                        case 'date':
                            fieldSchema = z.string().datetime({
                                message: `${field.label} deve ser uma data válida`,
                            });
                            break;
                        case 'select':
                            fieldSchema = z.number();
                            break;
                        default:
                            fieldSchema = z.string();
                    }

                    if (field.required) {
                        if (fieldSchema instanceof z.ZodString) {
                            fieldSchema = fieldSchema.min(1, {
                                message: `${field.label} é obrigatório`,
                            });
                        } else if (fieldSchema instanceof z.ZodNumber) {
                            fieldSchema = fieldSchema
                                .nullable()
                                .refine((val) => val !== null, {
                                    message: `${field.label} é obrigatório`,
                                });
                        }
                    }

                    acc[fieldName] = fieldSchema;
                }
                return acc;
            },
            {} as Record<string, z.ZodTypeAny>
        )
    );
};
