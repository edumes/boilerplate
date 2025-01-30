import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { Outlet, useParams } from '@tanstack/react-router';
import { CrudDialogs } from './components/crud-dialogs';
import { CrudPrimaryButtons } from './components/crud-primary-buttons';
import { CrudTable } from './components/crud-table';
import CrudProvider from './context/crud-context';

export default function Crud() {
  const params = useParams({ strict: false });
  const { crud } = params;
  console.log({ crud });

  const { data: crudConfig, isLoading: isLoadingFields } = useQuery({
    queryKey: [`${crud}-fields`],
    queryFn: async () => {
      const response = await api.get(`/${crud}/fields`);
      return response.data.data || {};
    },
  });
  console.log({ crudConfig });

  const { data, isLoading: isLoadingData } = useQuery({
    queryKey: [crud],
    queryFn: async () => {
      const response = await api.get(`/${crud}`);
      return response.data.data || [];
    },
  });
  console.log({ data });

  if (isLoadingFields || isLoadingData) {
    return <Outlet />;
  }

  return (
    <CrudProvider>
      <Header fixed>
        <Search />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className="mb-2 flex items-center justify-between space-y-2 flex-wrap">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{crudConfig.config.pluralName} List</h2>
            <p className="text-muted-foreground">
              Manage your {crudConfig.config.pluralName} here.
            </p>
          </div>
          <CrudPrimaryButtons />
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          <CrudTable data={data} fields={crudConfig.fields} />
        </div>
      </Main>

      <CrudDialogs fields={crudConfig.fields} />
    </CrudProvider>
  );
}
