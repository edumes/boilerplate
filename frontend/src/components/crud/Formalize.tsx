import { FormFieldConfig } from '@/@types/forms';
import Button from '@/components/ui/Button';
import { Form, FormItem } from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Grid2 as Grid } from '@mui/material';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Select from '../ui/Select/Select';
import { createValidationSchema } from './formValidationSchema';

interface FormalizeProps {
    fields: FormFieldConfig['fields'];
    onSubmit: (data: any) => void;
    onError?: (error: any) => void;
}

export default function Formalize({ fields, onSubmit, onError }: FormalizeProps) {
    const [isSubmitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const validationSchema = createValidationSchema(fields);

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(validationSchema)
    });

    console.log({ errors });

    const handleFormSubmit = async (data: any) => {
        setSubmitting(true);
        try {
            await onSubmit(data);
        } catch (error) {
            onError?.(error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Form onSubmit={handleSubmit(handleFormSubmit)}>
            <Grid container spacing={1.5}>
                {Object.entries(fields).map(
                    ([fieldName, field]) =>
                        field.canAdd && (
                            <Grid key={fieldName} size={field.width}>
                                <FormItem
                                    label={field.label}
                                    invalid={Boolean(errors[fieldName])}
                                    errorMessage={errors[fieldName]?.message?.toString()}
                                >
                                    <Controller
                                        name={fieldName}
                                        control={control}
                                        render={({ field: { onChange, value, ...rest } }) => {
                                            switch (field.type) {
                                                case 'select':
                                                    return (
                                                        <Select
                                                            {...rest}
                                                            size='md'
                                                            value={value || ''}
                                                            onChange={onChange}
                                                            placeholder={field.label}
                                                            options={field.options || []}
                                                        />
                                                    );
                                                case 'text':
                                                default:
                                                    return (
                                                        <Input
                                                            {...rest}
                                                            size='md'
                                                            value={value || ''}
                                                            onChange={onChange}
                                                            placeholder={field.label}
                                                        />
                                                    );
                                            }
                                        }}
                                    />
                                </FormItem>
                            </Grid>
                        )
                )}
            </Grid>
            <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button
                    variant="default"
                    onClick={() => navigate(-1)}
                >
                    Cancelar
                </Button>
                <Button
                    loading={isSubmitting}
                    variant="solid"
                    type="submit"
                >
                    Salvar
                </Button>
            </Box>
        </Form>
    );
} 