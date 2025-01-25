import { api } from "@/lib/api";

interface LoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role?: {
      name: string;
      permissions: Record<string, Record<string, boolean>>;
    };
  };
  token: string;
}

class AuthService {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', {
      user_email: email,
      user_password: password,
    });
    return response.data;
  }

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  }

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  }
}

export const authService = new AuthService(); 