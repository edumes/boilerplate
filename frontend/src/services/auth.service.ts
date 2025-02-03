import { api } from '@/lib/api';

interface User {
  id: number;
  uuid: string;
  user_name: string;
  user_email: string;
  user_telephone: string | null;
  user_is_active: boolean;
  company: {
    id: number;
    company_name: string;
    company_email: string;
  };
  role: {
    role_name: string;
    role_permissions: {
      [key: string]: {
        read: boolean;
        create: boolean;
        delete: boolean;
        update: boolean;
      };
    };
  };
}

interface LoginResponse {
  user: User;
  token: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

class AuthService {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await api.post<ApiResponse<LoginResponse>>(
        '/auth/login',
        {
          user_email: email,
          user_password: password,
        }
      );

      if (response.data.success) {
        return response.data.data;
      }

      throw new Error('Login failed: Invalid credentials or response format.');
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('An error occurred during login.');
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('An error occurred during logout.');
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get<{ user: User }>('/auth/me');
      return response.data.user;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw new Error('An error occurred while fetching the current user.');
    }
  }
}

export const authService = new AuthService();
