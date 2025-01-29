import { AppSidebar } from '@/components/layout/app-sidebar';
import SkipToMain from '@/components/skip-to-main';
import { SidebarProvider } from '@/components/ui/sidebar';
import { SearchProvider } from '@/context/search-context';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import Cookies from 'js-cookie';

export const Route = createFileRoute('/_authenticated')({
  component: RouteComponent,
  beforeLoad: ({ location }) => {
    const { auth } = useAuthStore.getState();

    if (!auth.accessToken) {
      throw redirect({
        to: '/sign-in',
        search: {
          redirect: location.href,
        },
      });
    }
  },
});

function RouteComponent() {
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
