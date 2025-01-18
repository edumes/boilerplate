import { BrowserlizeProps } from '@/@types/forms';
import { BaseService } from '@/services/crud/BaseService';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { Card, IconButton } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { ptBR } from '@mui/x-data-grid/locales';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BrowseTable({ form }: BrowserlizeProps) {
    const navigate = useNavigate();
    const { fields } = form;
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const service = new BaseService<any>(form.config.table);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await service.list({
                page: paginationModel.page,
                limit: paginationModel.pageSize,
                // order: "DESC"
            });
            console.log(response)
            setData(response);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [paginationModel]);

    const handleDeleteClick = async (id: number) => {
        try {
            await service.delete(id);
            fetchData(); // Refresh the data after deletion
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    function transformObjectToGridFormat(object: any) {
        const fields = [];

        for (const key in object) {
            const field = object[key];
            const gridField: any = {
                field: key,
                headerName: field.label,
                width: field.width * 50,
            };

            fields.push(gridField);
        }

        return fields;
    }

    const handleEditClick = (id: number) => {
        navigate(`${form.config.singularName}/${id}`);
    };

    const columns = useMemo(() => {
        const baseColumns = transformObjectToGridFormat(fields);
        console.log({ baseColumns });
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
                rows={data || []}
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
