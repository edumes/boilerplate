import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { Card, IconButton } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import { ptBR } from '@mui/x-data-grid/locales';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAPI } from '@/utils/hooks/useAPI';
import { listClients } from '@/services/crud/ClientsService';

export default function BrowseTable({ fields }: any) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(true);
    const [list, setList] = useState<any>([]);
    // const { list: fetchList } = useAPI();
    const { page, perPage } = useParams();

    // const memoizedFetchList = useMemo(() => fetchList, []);

    useEffect(() => {
        const fetchListData = async () => {
            try {
                const { data, meta } = await listClients();
                // console.log(data)
                // const ListData = await memoizedFetchList(data);
                setList(addIdsToListItems(data));
            } catch (error) {
                console.error('Erro ao buscar os menus:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchListData();
    }, []);

    function transformObjectToGridFormat(object: any) {
        const fields = [];

        for (const key in object) {
            if (key === '$GLOBALS') continue;

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
    };

    const handleDeleteClick = (id: number) => {
        console.log('Excluir linha com ID:', id);
    };

    const { data } = useDemoData({
        dataSet: 'Commodity',
        rowLength: 10,
        maxColumns: 10,
    });

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
        <>
            {loading ? (
                <div>Loading...</div>
            ) : list.length > 0 ? (
                <Card>
                    <DataGrid
                        localeText={
                            ptBR.components.MuiDataGrid.defaultProps.localeText
                        }
                        columns={columns}
                        rows={list}
                        loading={loading}
                        initialState={data.initialState}
                        slots={{
                            toolbar: GridToolbar,
                        }}
                    />
                </Card>
            ) : (
                <div>No data available.</div>
            )}
        </>
    );
}
