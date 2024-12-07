import { ClientSchema } from '@/@types/crud/client';
import ApiService from '../ApiService';

export async function listClients() {
    return ApiService.fetchDataWithAxios<any>({
        url: 'users',
        method: 'get'
    });
}
