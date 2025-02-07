import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { Outlet, useParams } from '@tanstack/react-router';
import { CrudPrimaryButtons } from './components/crud-primary-buttons';
import { CrudTabs } from './components/crud-tabs';
import CrudProvider, { CrudProviderProps, useCrud } from './context/crud-context';

export default function CrudEditAddPage() {
  const params = useParams({ strict: false });
  const { crud, id } = params as Required<CrudProviderProps>;
  const { crudConfig, isLoadingConfig, crudEditData, isLoadingEditData } = useCrud();

  console.log({ params });
  console.log({ crudConfig });
  console.log({ crudEditData });

  if (isLoadingConfig || isLoadingEditData) {
    return <Outlet />;
  }

  return (
    <>
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
          <CrudTabs />
        </div>
      </Main>
    </>
  );
}
