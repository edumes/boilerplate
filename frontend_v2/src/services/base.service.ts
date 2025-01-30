import { api } from '@/lib/api';

interface PaginationOptions {
  page?: number;
  limit?: number;
  order?: 'ASC' | 'DESC';
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

class BaseService<T> {
  constructor(protected endpoint: string) {}

  async getFields(): Promise<T[]> {
    try {
      const response = await api.get<ApiResponse<T[]>>(`${this.endpoint}/fields`);
      
      if (response.data.success) {
        return response.data.data;
      }
      
      throw new Error('Falha ao buscar campos.');
    } catch (error) {
      console.error('Erro ao buscar campos:', error);
      throw new Error('Ocorreu um erro ao buscar os campos.');
    }
  }

  async list(options?: PaginationOptions): Promise<T[]> {
    try {
      const params = new URLSearchParams();
      
      if (options?.page !== undefined) {
        params.append('page', String(options.page + 1));
      }
      
      if (options?.limit !== undefined) {
        params.append('limit', String(options.limit));
      }

      const response = await api.get<ApiResponse<T[]>>(`${this.endpoint}?${params.toString()}`);
      
      if (response.data.success) {
        return response.data.data;
      }

      throw new Error('Falha ao listar registros.');
    } catch (error) {
      console.error('Erro ao listar:', error);
      throw new Error('Ocorreu um erro ao listar os registros.');
    }
  }

  async getById(id: string | number): Promise<T> {
    try {
      const response = await api.get<ApiResponse<T>>(`${this.endpoint}/${id}`);
      
      if (response.data.success) {
        return response.data.data;
      }

      throw new Error('Falha ao buscar registro.');
    } catch (error) {
      console.error('Erro ao buscar registro:', error);
      throw new Error('Ocorreu um erro ao buscar o registro.');
    }
  }

  async selectOptions(search?: string): Promise<T[]> {
    try {
      const params = new URLSearchParams();
      if (search) {
        params.append('search', search);
      }

      const response = await api.get<ApiResponse<T[]>>(`${this.endpoint}/select-options?${params.toString()}`);
      
      if (response.data.success) {
        return response.data.data;
      }

      throw new Error('Falha ao buscar opções.');
    } catch (error) {
      console.error('Erro ao buscar opções:', error);
      throw new Error('Ocorreu um erro ao buscar as opções.');
    }
  }

  async create(data: T): Promise<T> {
    try {
      const response = await api.post<ApiResponse<T>>(this.endpoint, data);
      
      if (response.data.success) {
        return response.data.data;
      }

      throw new Error('Falha ao criar registro.');
    } catch (error) {
      console.error('Erro ao criar:', error);
      throw new Error('Ocorreu um erro ao criar o registro.');
    }
  }

  async update(id: string | number, data: Partial<T>): Promise<T> {
    try {
      const response = await api.put<ApiResponse<T>>(`${this.endpoint}/${id}`, data);
      
      if (response.data.success) {
        return response.data.data;
      }

      throw new Error('Falha ao atualizar registro.');
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      throw new Error('Ocorreu um erro ao atualizar o registro.');
    }
  }

  async delete(id: string | number): Promise<void> {
    try {
      await api.delete(`${this.endpoint}/${id}`);
    } catch (error) {
      console.error('Erro ao excluir:', error);
      throw new Error('Ocorreu um erro ao excluir o registro.');
    }
  }

  async filter(queryString: string): Promise<T[]> {
    try {
      const response = await api.get<ApiResponse<T[]>>(`${this.endpoint}/filter?${queryString}`);
      
      if (response.data.success) {
        return response.data.data;
      }

      throw new Error('Falha ao filtrar registros.');
    } catch (error) {
      console.error('Erro ao filtrar:', error);
      throw new Error('Ocorreu um erro ao filtrar os registros.');
    }
  }
}

export const createBaseService = <T>(endpoint: string) => new BaseService<T>(endpoint); 