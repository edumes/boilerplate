import { Outlet, useParams } from '@tanstack/react-router';
import { Card } from '@/components/ui/card';
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { CrudPrimaryButtons } from './components/crud-primary-buttons';
import { CrudTabs } from './components/crud-tabs';
import CrudProvider, { CrudProviderProps, useCrud } from './context/crud-context';

export default function CrudEditAddPage() {
  const params = useParams({ strict: false });
  const { crud, id } = params as Required<CrudProviderProps>;
  const isEdit = !!id;

  return (
    <CrudProvider crud={crud} id={id}>
      <CrudEditAddPageContent isEdit={isEdit} />
    </CrudProvider>
  );
}

interface CrudEditAddPageContentProps {
  isEdit: boolean;
}

function CrudEditAddPageContent({ isEdit }: CrudEditAddPageContentProps) {
  const { crudConfig, isLoadingConfig, isLoadingEditData } = useCrud();

  if (isLoadingConfig || isLoadingEditData) {
    return <Outlet />;
  }

  console.log({ crudConfig });

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2 flex-wrap'>
          <div>
            <h2 className='text-2xl capitalize font-bold tracking-tight'>
              {isEdit
                ? `Edit ${crudConfig.config.singularName}`
                : `New ${crudConfig.config.singularName}`}
            </h2>
            <p className='text-muted-foreground'>
              {isEdit
                ? `Edit your ${crudConfig.config.singularName.toLowerCase()}`
                : `Create your ${crudConfig.config.singularName.toLowerCase()}`}
            </p>
          </div>
          <CrudPrimaryButtons config={crudConfig.config} />
        </div>
        <Card className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <CrudTabs />
        </Card>
      </Main>
    </>
  );
}
