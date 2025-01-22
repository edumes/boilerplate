import { FormFieldConfig } from '@/@types/forms';
import Button from '@/components/ui/Button';
import { Form, FormItem } from '@/components/ui/Form';
// import { Input } from '@/components/ui/Input';
import { Input, Switch } from 'antd';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Grid2 as Grid } from '@mui/material';
import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Select from '../ui/Select';
import { createValidationSchema } from './formValidationSchema';
// import { SelectOption } from '../ui/Select/Select';

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

    const watchedValues = useWatch({ control });

    console.log({ watchedValues, errors });

    const handleFormSubmit = (data: any) => {
        setSubmitting(true);
        try {
            onSubmit(data);
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
                                                case 'boolean': {
                                                    return (
                                                        <Switch
                                                            {...rest}
                                                            size='default'
                                                            defaultChecked={value || false}
                                                            checked={value || false}
                                                            onChange={(value) => onChange(value)}
                                                        />
                                                    );
                                                }
                                                case 'select': {
                                                    const selectedValue = value || null;
                                    
                                                    return (
                                                        <Select
                                                            {...rest}
                                                            size='md'
                                                            value={selectedValue}
                                                            placeholder={field.label}
                                                            options={field.options || [
                                                                { label: 'The Shawshank Redemption', value: 1 },
                                                                { label: 'The Godfather', value: 2 }
                                                            ]}
                                                            onChange={(value) => onChange(value)}
                                                        />
                                                    );
                                                }
                                                case 'text':
                                                default:
                                                    return (
                                                        <Input
                                                            {...rest}
                                                            size='middle'
                                                            value={value || ''}
                                                            placeholder={field.label}
                                                            onChange={onChange}
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