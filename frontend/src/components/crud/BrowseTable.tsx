import { BrowserlizeProps } from '@/@types/forms';
import { listClients } from '@/services/crud/ClientsService';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { Card, IconButton } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { ptBR } from '@mui/x-data-grid/locales';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BrowseTable({ form }: BrowserlizeProps) {
    const navigate = useNavigate();
    const { fields } = form;
    const [loading, setLoading] = useState<boolean>(true);
    const [list, setList] = useState<any>([]);
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });
    const [rowCount, setRowCount] = useState(0);

    useEffect(() => {
        const fetchListData = async () => {
            try {
                const { data, meta } = await listClients();
                setList(addIdsToListItems(data));
                setRowCount(meta.totalItems);
            } catch (error) {
                console.error('Erro ao buscar os menus:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchListData();
    }, [paginationModel]);

    function transformObjectToGridFormat(object: any) {
        const fields = [];

        for (const key in object) {
            const field = object[key];
            const gridField: any = {
                field: field.name,
                headerName: field.label,
                width: field.width * 50,
            };

            fields.push(gridField);
        }

        return fields;
    }

    const addIdsToListItems = (items: any[]) => {
        return items.map((item, index) => {
            return { id: index + 1, ...item };
        });
    };

    const handleEditClick = (id: number) => {
        console.log('Editar linha com ID:', id);
        navigate(`${form.config.singularName}/add`)
    };

    const handleDeleteClick = (id: number) => {
        console.log('Excluir linha com ID:', id);
    };

    const columns = useMemo(() => {
        const baseColumns = transformObjectToGridFormat(fields);
        return [
            ...baseColumns,
            {
                field: 'actions',
                headerName: 'Ações',
                width: 120,
                align: 'center',
                headerAlign: 'center',
                sortable: false,
                filterable: false,
                disableColumnMenu: true,
                renderCell: (params: any) => (
                    <div>
                        <IconButton
                            onClick={() => handleEditClick(params.row.id)}
                        >
                            <EditIcon />
                        </IconButton>
                        <IconButton
                            onClick={() => handleDeleteClick(params.row.id)}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </div>
                ),
                position: 'right',
            },
        ];
    }, [fields]);

    return (
        <Card>
            <DataGrid
                sx={{ border: 'none', borderWidth: 0 }}
                localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
                columns={columns}
                rows={list}
                loading={loading}
                slots={{
                    toolbar: GridToolbar,
                }}
                paginationModel={paginationModel}
                pageSizeOptions={[10, 25, 50]}
                paginationMode="server"
                rowCount={rowCount}
                onPaginationModelChange={setPaginationModel}
            />
        </Card>
    );
}
