import { BrowserlizeProps } from '@/@types/forms';
import { BaseService } from '@/services/crud/BaseService';
import { Delete as DeleteIcon, Edit as EditIcon, SearchOutlined } from '@mui/icons-material';
import { Card, IconButton } from '@mui/material';
import { Table, Input, Button, Space } from 'antd';
import { useEffect, useMemo, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { TableProps, InputRef } from 'antd';
import type { FilterDropdownProps, TablePaginationConfig } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import qs from 'qs';

interface TableParams {
    pagination?: TablePaginationConfig;
    sortField?: string;
    sortOrder?: string;
    filters?: Record<string, any>;
}

interface ApiResponse<T> {
    success: boolean;
    timestamp: string;
    data: T[];
    meta: {
        page: string;
        limit: string;
        totalItems: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}

export default function BrowseTable({ form }: BrowserlizeProps) {
    const navigate = useNavigate();
    const { fields } = form;
    const [data, setData] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
        },
    });

    const service = new BaseService<any>(form.config.table);

    const getFilterParams = (params: TableParams) => {
        const normalizedFilters = params.filters ?
            Object.entries(params.filters).reduce((acc, [key, value]) => {
                if (value === null || value === undefined || value === '' ||
                    (Array.isArray(value) && value.length === 0)) {
                    return acc;
                }

                acc[key] = Array.isArray(value) && value.length === 1 ? value[0] : value;
                return acc;
            }, {} as Record<string, any>)
            : {};

        const baseParams: Record<string, any> = {};

        if (params.pagination?.current) baseParams.page = params.pagination.current;
        if (params.pagination?.pageSize) baseParams.limit = params.pagination.pageSize;
        if (params.sortOrder) baseParams.order = params.sortOrder;
        if (params.sortField) baseParams.sortBy = params.sortField;

        return {
            ...baseParams,
            ...normalizedFilters,
        };
    };

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const queryString = qs.stringify(getFilterParams(tableParams));
            const response = await service.filter(queryString);
            console.log({ response });
            setData(response);
            setTableParams({
                ...tableParams,
                pagination: {
                    ...tableParams.pagination,

                    total: response.meta.totalItems,
                },
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [
        tableParams.pagination?.current,
        tableParams.pagination?.pageSize,
        tableParams.sortOrder,
        tableParams.sortField,
        JSON.stringify(tableParams.filters),
    ]);

    const handleDeleteClick = async (id: number) => {
        try {
            await service.delete(id);
            fetchData();
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

            if (key.includes('fk_situation_id')) {
                gridField.field = 'situation.situation_name';
                gridField.render = (text: string, record: any) => record.situation?.situation_name;
            }

            fields.push(gridField);
        }

        return fields;
    }

    const handleEditClick = (id: number) => {
        navigate(`${form.config.singularName}/${id}`);
    };

    const handleSearch = (
        selectedKeys: string[],
        confirm: FilterDropdownProps['confirm'],
        dataIndex: string,
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex: string) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }: FilterDropdownProps) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText((selectedKeys as string[])[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        Close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        onFilter: (value: string, record: any) =>
            record[dataIndex]
                ?.toString()
                .toLowerCase()
                .includes((value as string).toLowerCase()),
        filterDropdownProps: {
            onOpenChange(open: boolean) {
                if (open) {
                    setTimeout(() => searchInput.current?.select(), 100);
                }
            },
        },
        render: (text: string) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const columns = useMemo(() => {
        const baseColumns = transformObjectToGridFormat(fields).map(col => ({
            title: col.headerName,
            dataIndex: col.field,
            key: col.field,
            width: col.width,
            sorter: true,
            filters: col.enumOptions ? col.enumOptions.map(opt => ({
                text: opt.label,
                value: opt.value,
            })) : undefined,
            ...getColumnSearchProps(col.field),
        }));

        return [
            ...baseColumns,
            {
                title: 'Ações',
                key: 'actions',
                width: 120,
                align: 'center' as const,
                render: (_: any, record: any) => (
                    <span>
                        <IconButton
                            onClick={() => handleEditClick(record.id)}
                        >
                            <EditIcon />
                        </IconButton>
                        <IconButton
                            onClick={() => handleDeleteClick(record.id)}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </span>
                ),
            },
        ];
    }, [fields, searchText, searchedColumn]);

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection: TableProps<any>['rowSelection'] = {
        selectedRowKeys,
        onChange: onSelectChange,
        selections: [
            Table.SELECTION_ALL,
            Table.SELECTION_INVERT,
            Table.SELECTION_NONE,
            // {
            //     key: 'odd',
            //     text: 'Select Odd Row',
            //     onSelect: (changeableRowKeys) => {
            //         const newSelectedRowKeys = changeableRowKeys.filter((_, index) => index % 2 === 0);
            //         setSelectedRowKeys(newSelectedRowKeys);
            //     },
            // },
            // {
            //     key: 'even',
            //     text: 'Select Even Row',
            //     onSelect: (changeableRowKeys) => {
            //         const newSelectedRowKeys = changeableRowKeys.filter((_, index) => index % 2 !== 0);
            //         setSelectedRowKeys(newSelectedRowKeys);
            //     },
            // },
        ],
    };

    const handleTableChange: TableProps<any>['onChange'] = (
        pagination,
        filters,
        sorter
    ) => {
        const sortInfo = Array.isArray(sorter) ? sorter[0] : sorter;

        setTableParams({
            pagination,
            filters,
            sortField: sortInfo?.field?.toString(),
            sortOrder: sortInfo?.order === 'descend' ? 'DESC' : sortInfo?.order === 'ascend' ? 'ASC' : undefined,
        });
    };

    return (
        <Card>
            <Table
                columns={columns}
                dataSource={data?.data || []}
                loading={isLoading}
                onChange={handleTableChange}
                pagination={{
                    ...tableParams.pagination,
                    total: data?.meta.totalItems,
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                }}
                size='middle'
                rowKey="id"
                scroll={{ x: 'max-content' }}
                rowSelection={rowSelection}
            />
        </Card>
    );
}
