import { FormFieldConfig } from '@/@types/forms';
import { Box, Button, Card, Grid2 as Grid, TextField, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { item } from '../ui/motion/MotionSettings';
import { ArrowBack } from '@mui/icons-material';

interface AddFormProps {
    form: FormFieldConfig;
}

export default function AddForm({ form }: AddFormProps) {
    const { config, fields } = form;
    const navigate = useNavigate();
    const [formData, setFormData] = useState({});

    const handleInputChange = (fieldName: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [fieldName]: value,
        }));
        console.log({ formData });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form data:', formData);
        // TODO: Implementar a chamada API para salvar
    };

    return (
        <motion.div initial="hidden" animate="visible" variants={item}>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={() => navigate(-1)}
                >
                    Voltar para listagem
                </Button>
                <Typography variant="h5" component="h1">
                    {`Adicionar novo ${config.singularName}`}
                </Typography>
            </Box>

            <Card sx={{ p: 2 }}>
                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {Object.entries(fields).map(
                            ([fieldName, field]) =>
                                field.canAdd && (
                                    <Grid key={fieldName} size={field.width}>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            label={field.label}
                                            required={field.required}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    fieldName,
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </Grid>
                                )
                        )}
                    </Grid>

                    <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                        >
                            Salvar
                        </Button>
                        <Button variant="outlined" onClick={() => navigate(-1)}>
                            Cancelar
                        </Button>
                    </Box>
                </Box>
            </Card>
        </motion.div>
    );
}
