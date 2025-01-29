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
  auth: {
    user: AuthUser | null;
    setUser: (user: AuthUser | null) => void;
    accessToken: string;
    setAccessToken: (accessToken: string) => void;
    resetAccessToken: () => void;
    reset: () => void;
  };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => {
      const cookieState = Cookies.get(ACCESS_TOKEN);
      const initToken = cookieState ? JSON.parse(cookieState) : '';
      return {
        auth: {
          user: null,
          setUser: (user) =>
            set((state) => ({ ...state, auth: { ...state.auth, user } })),
          accessToken: initToken,
          setAccessToken: (accessToken) =>
            set((state) => {
              Cookies.set(ACCESS_TOKEN, JSON.stringify(accessToken));
              return { ...state, auth: { ...state.auth, accessToken } };
            }),
          resetAccessToken: () =>
            set((state) => {
              Cookies.remove(ACCESS_TOKEN);
              return { ...state, auth: { ...state.auth, accessToken: '' } };
            }),
          reset: () =>
            set((state) => {
              Cookies.remove(ACCESS_TOKEN);
              return {
                ...state,
                auth: { ...state.auth, user: null, accessToken: '' },
              };
            }),
        },
      };
    },
    {
      name: 'auth-storage',
    }
  )
);

export const useAuth = () => useAuthStore((state) => state.auth);
