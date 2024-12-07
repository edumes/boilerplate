import { ControlPoint } from '@mui/icons-material';
import ViewListIcon from '@mui/icons-material/ViewList';
import {
    Box,
    Button,
    Divider,
    Grid,
    IconButton,
    Paper,
    Stack,
    Typography,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import BrowseTable from './BrowseTable';
import SearchBar from './SearchBar';
// import { item } from '../motion/MotionSettings';

export default function Formalize({ onRead, onEdit, form, name }: any) {
    const navigate = useNavigate();

    const Header = () => {
        // console.log(form.fields);
        const { plural_name, table } = form.fields.$GLOBALS;

        return (
            // <motion.div initial="hidden" animate="visible" variants={item}>
            <Grid container spacing={3} sx={{ mb: 1 }}>
                <Grid item xs={12}>
                    <Paper
                        sx={{ p: 1, display: 'flex', flexDirection: 'column' }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton
                                size="large"
                                aria-label="list"
                                sx={{ marginBottom: 1 }}
                            >
                                <ViewListIcon fontSize="large" />
                            </IconButton>
                            <Typography
                                gutterBottom
                                noWrap
                                variant="h5"
                                sx={{ flexGrow: 1 }}
                            >
                                Listando {plural_name}
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
                                    startIcon={<ControlPoint />}
                                    onClick={() => navigate(`/${table}/add`)}
                                >
                                    Adicionar
                                </Button>
                                {/* <IconButton aria-label="delete" size="large">
                                        <SettingsIcon fontSize="inherit" />
                                    </IconButton> */}
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
                    </Paper>
                </Grid>
            </Grid>
            // </motion.div>
        );
    };

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

    const Table = () => {
        // console.log(form);

        return (
            // <motion.div initial="hidden" animate="visible" variants={item}>
            <BrowseTable fields={form.fields} />
            // </motion.div>
        );
    };

    return (
        <>
            {Header()}
            {Table()}
        </>
    );
}
