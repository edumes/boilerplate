import { AppSidebar } from '@/components/layout/app-sidebar';
import SkipToMain from '@/components/skip-to-main';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { SearchProvider } from '@/context/search-context';
import ForgotPassword from '@/features/auth/forgot-password';
import Otp from '@/features/auth/otp';
import SignIn from '@/features/auth/sign-in';
import SignUp from '@/features/auth/sign-up';
import Dashboard from '@/features/dashboard';
import ForbiddenError from '@/features/errors/forbidden';
import GeneralError from '@/features/errors/general-error';
import NotFoundError from '@/features/errors/not-found-error';
import Settings from '@/features/settings';
import SettingsAccount from '@/features/settings/account';
import SettingsAppearance from '@/features/settings/appearance';
import SettingsDisplay from '@/features/settings/display';
import SettingsNotifications from '@/features/settings/notifications';
import Tasks from '@/features/tasks';
import Users from '@/features/users';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Cookies from 'js-cookie';
import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, Outlet, useLocation } from 'react-router-dom';

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { accessToken } = useAuthStore();
  const location = useLocation();

  if (!accessToken) {
    return (
      <Navigate
        to="/sign-in"
        replace
        state={{ redirect: location.pathname + location.search }}
      />
    );
  }

  return <>{children}</>;
}

export default function AuthenticatedLayout() {
  const defaultOpen = Cookies.get('sidebar:state') !== 'false';
  return (
    <SearchProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <SkipToMain />
        <AppSidebar />
        <div
          id='content'
          className={cn(
            'max-w-full w-full ml-auto',
            'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
            'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
            'transition-[width] ease-linear duration-200',
            'h-svh flex flex-col',
            'group-data-[scroll-locked=1]/body:h-full',
            'group-data-[scroll-locked=1]/body:has-[main.fixed-main]:h-svh'
          )}
        >
          <Outlet />
        </div>
      </SidebarProvider>
    </SearchProvider>
  );
}

const LazyComponents = {
  Chats: lazy(() => import('@/features/chats')),
  Crud: lazy(() => import('@/features/crud')),
  CrudEditAdd: lazy(() => import('@/features/crud/crud-edit-add-page')),
  UnauthorizedError: lazy(() => import('@/features/errors/unauthorized-error')),
  MaintenanceError: lazy(() => import('@/features/errors/maintenance-error'))
};

function lazyElement(Component: React.LazyExoticComponent<any>) {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-4">Loading...</div>}>
      <Component />
    </Suspense>
  );
}

const publicRoutes = [
  { path: 'sign-in', element: <SignIn /> },
  { path: 'sign-up', element: <SignUp /> },
  { path: 'forgot-password', element: <ForgotPassword /> },
  { path: 'otp', element: <Otp /> }
];

const settingsRoutes = [
  { path: 'settings', element: <Settings /> },
  { path: 'settings/account', element: <SettingsAccount /> },
  { path: 'settings/appearance', element: <SettingsAppearance /> },
  { path: 'settings/display', element: <SettingsDisplay /> },
  { path: 'settings/notifications', element: <SettingsNotifications /> }
];

const errorRoutes = [
  { path: '403', element: <ForbiddenError /> },
  { path: '401', element: lazyElement(LazyComponents.UnauthorizedError) },
  { path: '404', element: <NotFoundError /> },
  { path: '500', element: <GeneralError /> },
  { path: '503', element: lazyElement(LazyComponents.MaintenanceError) },
  { path: '*', element: <NotFoundError /> }
];

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <GeneralError />,
    children: [
      ...publicRoutes,
      {
        element: (
          <RequireAuth>
            <AuthenticatedLayout />
          </RequireAuth>
        ),
        children: [
          { index: true, element: <Dashboard /> },
          ...settingsRoutes,
          { path: 'users', element: <Users /> },
          { path: 'tasks', element: <Tasks /> },
          { path: 'chats', element: lazyElement(LazyComponents.Chats) },
          {
            path: 'general',
            children: [
              { path: ':crud', element: lazyElement(LazyComponents.Crud) },
              { path: ':crud/add', element: lazyElement(LazyComponents.CrudEditAdd) },
              { path: ':crud/:id', element: lazyElement(LazyComponents.Crud) }
            ]
          }
        ]
      },
      ...errorRoutes
    ]
  }
]);

function RootLayout() {
  return (
    <>
      <Outlet />
      <Toaster />
      {import.meta.env.MODE === 'development' && (
        <ReactQueryDevtools buttonPosition='bottom-left' />
      )}
    </>
  );
}