import ApiService from '@/services/ApiService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface CrudHookProps {
    entity: string;
}

export function useCrud({ entity }: CrudHookProps) {
    const queryClient = useQueryClient();

    // List (Read)
    const useList = (params?: any) => {
        return useQuery({
            queryKey: [entity, params],
            queryFn: () =>
                ApiService.fetchDataWithAxios({
                    url: `/${entity}`,
                    method: 'get',
                    params,
                }),
        });
    };

    // Get One (Read)
    const useGet = (id: string | number) => {
        return useQuery({
            queryKey: [entity, id],
            queryFn: () =>
                ApiService.fetchDataWithAxios({
                    url: `/${entity}/${id}`,
                    method: 'get',
                }),
        });
    };

    // Create
    const useCreate = () => {
        return useMutation({
            mutationFn: (data: any) =>
                ApiService.fetchDataWithAxios({
                    url: `/${entity}`,
                    method: 'post',
                    data,
                }),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [entity] });
            },
        });
    };

    // Update
    const useUpdate = () => {
        return useMutation({
            mutationFn: ({ id, data }: { id: string | number; data: any }) =>
                ApiService.fetchDataWithAxios({
                    url: `/${entity}/${id}`,
                    method: 'put',
                    data,
                }),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [entity] });
            },
        });
    };

    // Delete
    const useDelete = () => {
        return useMutation({
            mutationFn: (id: string | number) =>
                ApiService.fetchDataWithAxios({
                    url: `/${entity}/${id}`,
                    method: 'delete',
                }),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [entity] });
            },
        });
    };

    return {
        useList,
        useGet,
        useCreate,
        useUpdate,
        useDelete,
    };
}
