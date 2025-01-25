import AxiosBase from "../axios/AxiosBase";

interface PaginationOptions {
    page?: number;
    limit?: number;
    order?: 'ASC' | 'DESC';
}

export class BaseService<T> {
    protected http = AxiosBase;
    
    constructor(protected endpoint: string) { }

    async getFields(): Promise<T[]> {
        const response = await this.http.get<T[]>(`${this.endpoint}/fields`);
        return response.data;
    }

    async list(options?: PaginationOptions): Promise<T[]> {
        const params = new URLSearchParams();
        
        if (options?.page !== undefined) {
            params.append('page', String(options.page + 1)); // +1 because DataGrid uses 0-based indexing
        }
        
        if (options?.limit !== undefined) {
            params.append('limit', String(options.limit));
        }
        
        // if (options?.order) {
        //     params.append('order', options.order);
        // }

        const response = await this.http.get<T[]>(`${this.endpoint}?${params.toString()}`);
        return response.data;
    }

    async getById(id: string | number): Promise<T> {
        const response = await this.http.get<T>(`${this.endpoint}/${id}`);
        return response.data;
    }

    async selectOptions(search?: string): Promise<T[]> {
        const params = new URLSearchParams();
        if (search) {
            params.append('search', search);
        }
        const response = await this.http.get<T[]>(`${this.endpoint}/select-options?${params.toString()}`);
        return response.data;
    }

    async create(data: T): Promise<T> {
        const response = await this.http.post<T>(this.endpoint, data);
        return response.data;
    }

    async update(id: string | number, data: Partial<T>): Promise<T> {
        const response = await this.http.put<T>(`${this.endpoint}/${id}`, data);
        return response.data;
    }

    async delete(id: string | number): Promise<void> {
        await this.http.delete(`${this.endpoint}/${id}`);
    }

    async filter(queryString: string): Promise<any> {
        const response = await this.http.get<T[]>(`${this.endpoint}/filter?${queryString}`);
        return response;
    }
}