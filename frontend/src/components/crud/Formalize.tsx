import { FormFieldConfig } from '@/@types/forms';
import Button from '@/components/ui/Button';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Grid2 as Grid } from '@mui/material';
import { Form, Input, Switch } from 'antd';
import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import DatePicker from '../ui/DatePicker';
import Select from '../ui/Select';
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
        formState: { errors, isValid }
    } = useForm({
        resolver: zodResolver(validationSchema),
    });

    const watchedValues = useWatch({ control });

    console.log({ watchedValues, errors, isValid });

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
        <Form
            layout="vertical"
            onFinish={handleSubmit(handleFormSubmit)}
        >
            <Grid container spacing={1.5}>
                {Object.entries(fields).map(([fieldName, field]) =>
                    field.canAdd ? (
                        <Grid key={fieldName} size={field.width}>
                            <Form.Item
                                label={field.label}
                                validateStatus={errors[fieldName] ? 'error' : ''}
                                help={errors[fieldName]?.message?.toString()}
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
                                                        checked={value || false}
                                                        onChange={(checked) => onChange(checked)}
                                                    />
                                                );
                                            }
                                            case 'date': {
                                                return (
                                                    <DatePicker
                                                        {...rest}
                                                        name={fieldName}
                                                        value={value}
                                                        placeholder={field.label}
                                                        onChange={(date) => {onChange(date); console.log({date})}}
                                                        format='DD/MM/YYYY'
                                                    />
                                                );
                                            }
                                            case 'datetime': {
                                                return (
                                                    <DatePicker
                                                        {...rest}
                                                        name={fieldName}
                                                        value={value}
                                                        placeholder={field.label}
                                                        onChange={(date) => onChange(date)}
                                                        format='DD/MM/YYYY HH:mm'
                                                        showTime={true}
                                                    />
                                                );
                                            }
                                            case 'select': {
                                                return (
                                                    <Select
                                                        {...rest}
                                                        name={fieldName}
                                                        value={value || null}
                                                        placeholder={field.label}
                                                        onChange={(selected) => onChange(selected)}
                                                    />
                                                );
                                            }
                                            case 'text':
                                            default:
                                                return (
                                                    <Input
                                                        {...rest}
                                                        size='large'
                                                        value={value || ''}
                                                        placeholder={field.label}
                                                        onChange={onChange}
                                                    />
                                                );
                                        }
                                    }}
                                />
                            </Form.Item>
                        </Grid>
                    ) : null
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
