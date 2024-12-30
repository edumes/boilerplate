import { BrowserlizeProps } from '@/@types/forms';
import { useCrud } from '@/utils/hooks/useCrud';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { Card, IconButton } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { ptBR } from '@mui/x-data-grid/locales';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BrowseTable({ form }: BrowserlizeProps) {
    const navigate = useNavigate();
    const { fields } = form;
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });

    const { useList, useDelete } = useCrud({
        entity: form.config.pluralName.toLowerCase()
    });

    const { data, isLoading } = useList({
        page: paginationModel.page,
        limit: paginationModel.pageSize,
    });

    const deleteMutation = useDelete();

    const handleDeleteClick = (id: number) => {
        deleteMutation.mutate(id);
    };

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
                rows={data?.data || []}
                loading={isLoading}
                slots={{
                    toolbar: GridToolbar,
                }}
                paginationModel={paginationModel}
                pageSizeOptions={[10, 25, 50]}
                paginationMode="server"
                rowCount={data?.meta?.totalItems || 0}
                onPaginationModelChange={setPaginationModel}
            />
        </Card>
    );
}
