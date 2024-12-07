import axios from 'axios';

interface IAuth {
    token: string;
}

const api = axios.create({
    baseURL: import.meta.env.VITE_URL,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const useAPI = () => ({
    validateToken: async (token: string) => {
        try {
            const response = await api.post('/api/v1/validate', { token });
            return response.data;
        } catch (error) {
            throw new Error('Erro ao validar token');
        }
    },
    signin: async (email: string, password: string): Promise<IAuth | Error> => {
        try {
            const response = await api.post('/api/v1/auth', {
                user_email: email,
                user_password: password,
            });
            localStorage.setItem('authToken', response.data.token);
            return response.data;
        } catch (error) {
            throw new Error('Erro ao fazer login');
        }
    },
    logout: async () => {
        try {
            const response = await api.post('api/v1/logout');
            return response.data;
        } catch (error) {
            throw new Error('Erro ao fazer logout');
        }
    },
    menus: async () => {
        try {
            const response = await api.get('/api/v1/menus/list');
            return response.data;
        } catch (error) {
            throw new Error('Erro ao buscar menus');
        }
    },
    fields: async (crud: string | undefined) => {
        try {
            const response = await api.get(`/api/v1/${crud}/fields`);
            return response.data;
        } catch (error) {
            throw new Error('Erro ao buscar campos');
        }
    },
    list: async (crud: string | undefined) => {
        try {
            const response = await api.get(`/api/v1/${crud}/list`);
            return response.data;
        } catch (error) {
            throw new Error('Erro ao buscar lista');
        }
    },
});
