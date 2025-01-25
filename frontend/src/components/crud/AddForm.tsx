import { FormFieldConfig } from '@/@types/forms';
import { BaseService } from '@/services/crud/BaseService';
import { ArrowBack } from '@mui/icons-material';
import { Alert, Box, Button, Card, Snackbar, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiPlusCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { item } from '../ui/motion/MotionSettings';
import Formalize from './Formalize';

interface AddFormProps {
    form: FormFieldConfig;
}

export default function AddForm({ form }: AddFormProps) {
    const { config, fields } = form;
    const navigate = useNavigate();
    const [formData, setFormData] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const service = new BaseService<any>(config.table);

    const handleFormSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            await service.create(data);
            setSuccess(true);
            setTimeout(() => {
                navigate(-1);
            }, 2000);
        } catch (error: any) {
            console.log({ error })
            const errorMessage = error.response?.data?.error.details;
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleErrorClose = () => {
        setError(null);
    };

    const handleSuccessClose = () => {
        setSuccess(false);
    };

    console.log({ fields });

    return (
        <motion.div initial="hidden" animate="visible" variants={item}>
            <Box
                sx={{
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                    backgroundColor: 'background.paper',
                    borderRadius: 1,
                    p: 2,
                    boxShadow: 1
                }}
            >
                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={() => navigate(-1)}
                >
                    Voltar para listagem
                </Button>

                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: 'primary.main'
                }}>
                    <FiPlusCircle size={24} />
                    <Typography
                        variant="h5"
                        component="h1"
                        sx={{
                            fontWeight: 'medium',
                        }}
                    >
                        {`Adicionar novo ${config.singularName}`}
                    </Typography>
                </Box>

                <Box sx={{ width: '140px' }} />
            </Box>

            <Card sx={{ p: 2 }}>
                <Formalize
                    fields={fields}
                    onSubmit={handleFormSubmit}
                    onError={(error) => {
                        const errorMessage = error.response?.data?.message || error.message || 'Erro ao salvar os dados';
                        setError(errorMessage);
                    }}
                />
            </Card>

            <Snackbar
                open={!!error}
                autoHideDuration={4000}
                onClose={handleErrorClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleErrorClose} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>

            <Snackbar
                open={success}
                autoHideDuration={2000}
                onClose={handleSuccessClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSuccessClose} severity="success" sx={{ width: '100%' }}>
                    registro salvo com sucesso!
                </Alert>
            </Snackbar>
        </motion.div>
    );
}
