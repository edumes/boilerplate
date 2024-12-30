import AxiosBase from "../axios/AxiosBase";

export abstract class BaseService<T> {
    protected http = AxiosBase;
    
    constructor(protected endpoint: string) { }

    async getFields(): Promise<T[]> {
        const response = await this.http.get<T[]>(`${this.endpoint}/fields`);
        return response.data;
    }

    async getAll(): Promise<T[]> {
        const response = await this.http.get<T[]>(this.endpoint);
        return response.data;
    }

    async getById(id: string | number): Promise<T> {
        const response = await this.http.get<T>(`${this.endpoint}/${id}`);
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
}