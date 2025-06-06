import { toast } from '@/hooks/use-toast';
import { useAuthStore } from '@/stores/authStore';
import { handleServerError } from '@/utils/handle-server-error';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './context/theme-context';
import './index.css';
import { router } from './routes';

const queryClientConfig = {
  defaultOptions: {
    queries: {
      retry: (failureCount: number, error: unknown) => {
        if (import.meta.env.DEV) {
          console.log({ failureCount, error });
          return false;
        }
        if (failureCount > 3 && import.meta.env.PROD) return false;
        return !(error instanceof AxiosError && [401, 403].includes(error.response?.status ?? 0));
      },
      refetchOnWindowFocus: import.meta.env.PROD,
      staleTime: 10 * 1000 // 10s
    },
    mutations: {
      onError: handleMutationError
    }
  },
  queryCache: new QueryCache({
    onError: handleQueryError
  })
};

function handleMutationError(error: unknown) {
  handleServerError(error);
  if (error instanceof AxiosError && error.response?.status === 304) {
    toast({
      variant: 'destructive',
      title: 'Content not modified!'
    });
  }
}

function handleQueryError(error: unknown) {
  if (!(error instanceof AxiosError)) return;

  const status = error.response?.status;
  switch (status) {
    case 401:
      toast({
        variant: 'destructive',
        title: 'Session expired!'
      });
      useAuthStore.getState().reset();
      router.navigate('/sign-in?redirect=' + encodeURIComponent(window.location.href));
      break;
    case 500:
      toast({
        variant: 'destructive',
        title: 'Internal Server Error!'
      });
      router.navigate('/500');
      break;
    case 403:
      router.navigate('/403', { replace: true });
      break;
  }
}

const queryClient = new QueryClient(queryClientConfig);

declare module 'react-router-dom' {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme='dark' storageKey='boilerplate-ui-theme'>
          <RouterProvider router={router} />
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>
  );
}
