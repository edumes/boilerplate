import Cookies from 'js-cookie';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const ACCESS_TOKEN = 'token';

interface AuthUser {
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

interface AuthState {
  user: AuthUser | null;
  accessToken: string;
  setUser: (user: AuthUser | null) => void;
  setAccessToken: (accessToken: string) => void;
  resetAccessToken: () => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => {
      const cookieState = Cookies.get(ACCESS_TOKEN);
      const initToken = cookieState ? JSON.parse(cookieState) : '';
      return {
        user: null,
        accessToken: initToken,
        setUser: (user) => set({ user }),
        setAccessToken: (accessToken) => {
          Cookies.set(ACCESS_TOKEN, JSON.stringify(accessToken));
          set({ accessToken });
        },
        resetAccessToken: () => {
          Cookies.remove(ACCESS_TOKEN);
          set({ accessToken: '' });
        },
        reset: () => {
          Cookies.remove(ACCESS_TOKEN);
          set({ user: null, accessToken: '' });
        },
      };
    },
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
      }),
    }
  )
);

export const useAuth = () => useAuthStore((state) => state);
