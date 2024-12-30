import {
    Box,
    Button,
    Card,
    Divider,
    IconButton,
    Stack,
    Typography,
} from '@mui/material';
import { HiOutlineMenu, HiOutlinePlus } from 'react-icons/hi';
import BrowseTable from './BrowseTable';
import SearchBar from './SearchBar';
import { motion } from 'framer-motion';
import { item } from '../ui/motion/MotionSettings';
import { useNavigate } from 'react-router-dom';
import { BrowserlizeProps } from '@/@types/forms';

export default function Browserlize({ form }: BrowserlizeProps) {
    const navigate = useNavigate();

    const generateFieldLabels = (fieldsObject: any) => {
        const labels: string[] = [];
        let count = 0;

        for (const fieldName in fieldsObject) {
            if (Object.prototype.hasOwnProperty.call(fieldsObject, fieldName)) {
                count++;
                if (count >= 2 && count <= 4) {
                    labels.push(fieldsObject[fieldName].label);
                }
            }
        }

        const firstTwoLabels = labels.slice(0, 2).join(', ');
        const lastLabel = labels.length > 2 ? ` ou ${labels[2]}` : '';

        return `${firstTwoLabels}${lastLabel}`;
    };

    return (
        <>
            <motion.div initial="hidden" animate="visible" variants={item}>
                <Card>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: 1,
                        }}
                    >
                        <IconButton
                            size="large"
                            aria-label="list"
                            sx={{ marginBottom: 1 }}
                        >
                            <HiOutlineMenu fontSize="large" />
                        </IconButton>
                        <Typography
                            gutterBottom
                            noWrap
                            variant="h5"
                            sx={{ flexGrow: 1 }}
                        >
                            {/* Listando {config.pluralName} */}
                        </Typography>
                        <Stack
                            direction="row"
                            divider={
                                <Divider flexItem orientation="vertical" />
                            }
                            spacing={2}
                        >
                            <Button
                                variant="contained"
                                startIcon={<HiOutlinePlus />}
                                onClick={() =>
                                    navigate(`${window.location.pathname}/add`)
                                }
                            >
                                {/* Adicionar {config.singularName} */}
                            </Button>
                        </Stack>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mb: 2,
                        }}
                    >
                        <SearchBar
                            placeholder={generateFieldLabels(form.fields)}
                        />
                    </Box>
                </Card>
            </motion.div>

            <motion.div
                initial="hidden"
                animate="visible"
                variants={item}
                style={{ marginTop: 15 }}
            >
                {/* <BrowseTable form={form} /> */}
            </motion.div>
        </>
    );
}
